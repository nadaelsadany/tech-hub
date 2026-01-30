import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Technician } from '../models/technician.model';
import { WorkOrder, WorkOrderStatus } from '../models/work-order.model';
import { Assignment } from '../models/assignment.model';
import { SeedDataService } from './seed-data.service';
import { StatusEvent, ChangeEntry, WorkResult, Actor, ReasonCode } from '../models/audit.model';
import { ReviewTaskService } from './review-task.service';
import { NotificationService } from './notification.service';

// Mock current user
const CURRENT_USER: Actor = { id: 'USER-001', name: 'Admin', role: 'Dispatcher' };

@Injectable({
    providedIn: 'root'
})
export class StateService {
    private reviewTaskService = inject(ReviewTaskService);
    private notificationService = inject(NotificationService);

    private techniciansSubject = new BehaviorSubject<Technician[]>([]);
    technicians$ = this.techniciansSubject.asObservable();

    private workOrdersSubject = new BehaviorSubject<WorkOrder[]>([]);
    workOrders$ = this.workOrdersSubject.asObservable();

    private assignmentsSubject = new BehaviorSubject<Assignment[]>([]);
    assignments$ = this.assignmentsSubject.asObservable();

    // Expose review tasks from ReviewTaskService
    get reviewTasks$() {
        return this.reviewTaskService.inReviewTasks$;
    }

    constructor(private seedData: SeedDataService) {
        this.initializeData();
    }

    private initializeData() {
        this.techniciansSubject.next(this.seedData.getTechnicians());
        const orders = this.seedData.getWorkOrders().map(wo => ({
            ...wo,
            statusHistory: [],
            changeLog: []
        }));
        this.workOrdersSubject.next(orders);
    }

    // Technicians
    getTechnicians(): Technician[] {
        return this.techniciansSubject.value;
    }

    updateTechnician(tech: Technician) {
        const current = this.techniciansSubject.value;
        const index = current.findIndex(t => t.id === tech.id);
        if (index > -1) {
            current[index] = tech;
            this.techniciansSubject.next([...current]);
        }
    }

    getTechnician(id: string): Technician | undefined {
        return this.techniciansSubject.value.find(t => t.id === id);
    }

    // Work Orders
    addWorkOrder(wo: WorkOrder) {
        const newWo = {
            ...wo,
            statusHistory: wo.statusHistory || [],
            changeLog: wo.changeLog || []
        };
        // Add initial status event
        this.appendStatusInternal(newWo, {
            id: this.generateId(),
            workOrderId: wo.id,
            fromStatus: null,
            toStatus: wo.status,
            at: new Date().toISOString(),
            by: CURRENT_USER
        });
        const current = this.workOrdersSubject.value;
        this.workOrdersSubject.next([...current, newWo]);
    }

    updateWorkOrder(wo: WorkOrder) {
        const current = this.workOrdersSubject.value;
        const index = current.findIndex(w => w.id === wo.id);
        if (index > -1) {
            current[index] = wo;
            this.workOrdersSubject.next([...current]);
        }
    }

    getWorkOrders(): WorkOrder[] {
        return this.workOrdersSubject.value;
    }

    getWorkOrder(id: string): WorkOrder | undefined {
        return this.workOrdersSubject.value.find(w => w.id === id);
    }

    // Tracked update with change logging
    updateWorkOrderTracked(
        id: string,
        updates: Partial<WorkOrder>,
        reason?: ReasonCode,
        note?: string
    ): WorkOrder | undefined {
        const current = this.workOrdersSubject.value;
        const index = current.findIndex(w => w.id === id);
        if (index === -1) return undefined;

        const wo = { ...current[index] };
        const now = new Date().toISOString();

        // Track changes
        for (const key of Object.keys(updates) as (keyof WorkOrder)[]) {
            if (key === 'statusHistory' || key === 'changeLog' || key === 'result') continue;

            const oldVal = wo[key];
            const newVal = updates[key];

            if (oldVal !== newVal) {
                const entry: ChangeEntry = {
                    id: this.generateId(),
                    workOrderId: id,
                    field: key,
                    from: this.serializeValue(key, oldVal),
                    to: this.serializeValue(key, newVal),
                    at: now,
                    by: CURRENT_USER,
                    reason,
                    note
                };
                wo.changeLog = [...(wo.changeLog || []), entry];
            }
        }

        // Track status change
        if (updates.status && updates.status !== wo.status) {
            const statusEvent: StatusEvent = {
                id: this.generateId(),
                workOrderId: id,
                fromStatus: wo.status,
                toStatus: updates.status,
                at: now,
                by: CURRENT_USER,
                reason,
                note
            };
            wo.statusHistory = [...(wo.statusHistory || []), statusEvent];
        }

        // Apply updates
        Object.assign(wo, updates);
        current[index] = wo;
        this.workOrdersSubject.next([...current]);
        return wo;
    }

    // Status event
    appendStatus(
        workOrderId: string,
        fromStatus: WorkOrderStatus | null,
        toStatus: WorkOrderStatus,
        reason?: ReasonCode,
        note?: string
    ) {
        const wo = this.getWorkOrder(workOrderId);
        if (!wo) return;

        const event: StatusEvent = {
            id: this.generateId(),
            workOrderId,
            fromStatus,
            toStatus,
            at: new Date().toISOString(),
            by: CURRENT_USER,
            reason,
            note
        };

        const updated = {
            ...wo,
            status: toStatus,
            statusHistory: [...(wo.statusHistory || []), event]
        };

        // Trigger review task creation if status changed to Completed
        if (toStatus === 'Completed' && fromStatus !== 'Completed') {
            updated.completedAt = event.at;
            this.triggerReviewWorkflow(updated);
        }

        this.updateWorkOrder(updated);
    }

    private appendStatusInternal(wo: WorkOrder, event: StatusEvent) {
        wo.statusHistory = [...(wo.statusHistory || []), event];
    }

    // Change entry
    appendChange(
        workOrderId: string,
        field: string,
        from: any,
        to: any,
        reason?: ReasonCode,
        note?: string
    ) {
        const wo = this.getWorkOrder(workOrderId);
        if (!wo) return;

        const entry: ChangeEntry = {
            id: this.generateId(),
            workOrderId,
            field,
            from,
            to,
            at: new Date().toISOString(),
            by: CURRENT_USER,
            reason,
            note
        };

        const updated = {
            ...wo,
            changeLog: [...(wo.changeLog || []), entry]
        };
        this.updateWorkOrder(updated);
    }

    // Result
    updateResult(workOrderId: string, result: WorkResult) {
        const wo = this.getWorkOrder(workOrderId);
        if (!wo) return;

        const updated = { ...wo, result };
        this.appendChange(
            workOrderId,
            'result',
            wo.result ? 'Previous result' : null,
            `Resolution: ${result.resolutionCode}`
        );
        this.updateWorkOrder(updated);
    }

    // Get last update time
    getLastUpdate(workOrderId: string): Date | null {
        const wo = this.getWorkOrder(workOrderId);
        if (!wo) return null;

        const times: string[] = [];
        if (wo.statusHistory) {
            wo.statusHistory.forEach(e => times.push(e.at));
        }
        if (wo.changeLog) {
            wo.changeLog.forEach(e => times.push(e.at));
        }

        if (times.length === 0) return null;
        times.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        return new Date(times[0]);
    }

    // Assignments
    addAssignment(assignment: Assignment) {
        const current = this.assignmentsSubject.value;
        this.assignmentsSubject.next([...current, assignment]);
    }

    // Helpers
    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    private serializeValue(field: string, value: any): string {
        if (value === null || value === undefined) return '-';
        if (field === 'assignedTechnicianId' && value) {
            const tech = this.getTechnician(value);
            return tech ? tech.name : value;
        }
        if (field === 'scheduledStartAt' && value) {
            return new Date(value).toLocaleString();
        }
        if (typeof value === 'object') {
            return JSON.stringify(value);
        }
        return String(value);
    }

    /**
     * Trigger review workflow when work order is completed
     */
    private triggerReviewWorkflow(workOrder: WorkOrder): void {
        if (!workOrder.assignedTechnicianId) return;

        // Create review task
        const reviewTask = this.reviewTaskService.createForWorkOrder(
            workOrder.id,
            workOrder.assignedTechnicianId
            // supervisorId can be assigned later
        );

        // Send notification to supervisor (for now, to dispatcher)
        this.notificationService.notifyReviewTaskCreated(
            workOrder.number,
            'Supervisor' // TODO: Get actual supervisor name
        );

        console.log(`Review task created for work order ${workOrder.number}`);
    }
}
