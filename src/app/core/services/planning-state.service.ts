import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { DayPlan } from '../models/planning.model';
import { WorkOrder } from '../models/work-order.model';
import { StateService } from './state.service';

@Injectable({
    providedIn: 'root'
})
export class PlanningStateService {
    private selectedDateSubject = new BehaviorSubject<string>(this.getTodayDate());
    day$ = this.selectedDateSubject.asObservable();

    private plansSubject = new BehaviorSubject<Map<string, DayPlan>>(new Map());
    plans$ = this.plansSubject.asObservable();

    private previousPlansSnapshot: Map<string, DayPlan> | null = null;

    unplannedOrders$: Observable<WorkOrder[]>;

    constructor(private stateService: StateService) {
        // Unplanned = New or Ready orders for the selected date
        this.unplannedOrders$ = combineLatest([
            this.stateService.workOrders$,
            this.day$,
            this.plans$
        ]).pipe(
            map(([orders, date, plans]) => {
                // Get all order IDs that are already in plans
                const plannedOrderIds = new Set<string>();
                plans.forEach(plan => {
                    plan.stops.forEach(stop => plannedOrderIds.add(stop.workOrderId));
                });

                // Filter orders: New/Ready, not already in a plan
                return orders.filter(o =>
                    (o.status === 'New' || o.status === 'Ready') &&
                    !plannedOrderIds.has(o.id)
                );
            })
        );
    }

    private getTodayDate(): string {
        const now = new Date();
        return now.toISOString().split('T')[0];
    }

    setDate(date: string) {
        this.selectedDateSubject.next(date);
        // Clear plans when date changes
        this.plansSubject.next(new Map());
    }

    getDate(): string {
        return this.selectedDateSubject.value;
    }

    getPlans(): Map<string, DayPlan> {
        return this.plansSubject.value;
    }

    setPlans(plans: Map<string, DayPlan>) {
        this.plansSubject.next(plans);
    }

    updatePlan(technicianId: string, plan: DayPlan) {
        const current = new Map(this.plansSubject.value);
        current.set(technicianId, plan);
        this.plansSubject.next(current);
    }

    // Snapshot for undo
    saveSnapshot() {
        this.previousPlansSnapshot = new Map(this.plansSubject.value);
    }

    restoreSnapshot(): boolean {
        if (this.previousPlansSnapshot) {
            this.plansSubject.next(this.previousPlansSnapshot);
            this.previousPlansSnapshot = null;
            return true;
        }
        return false;
    }
}
