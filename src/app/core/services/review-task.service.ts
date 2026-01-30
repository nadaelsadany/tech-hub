import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import { ReviewTask, ReviewTaskStatus } from '../models/review.model';
import { ConfigService } from './config.service';

@Injectable({
    providedIn: 'root'
})
export class ReviewTaskService {
    private configService = inject(ConfigService);

    private tasksSubject = new BehaviorSubject<ReviewTask[]>([]);
    public readonly tasks$ = this.tasksSubject.asObservable();

    // Computed observables
    public readonly pendingTasks$ = this.tasks$.pipe(
        map(tasks => tasks.filter(t => t.status === 'PENDING'))
    );

    public readonly inReviewTasks$ = this.tasks$.pipe(
        map(tasks => tasks.filter(t => t.status === 'IN_REVIEW'))
    );

    public readonly overdueTasks$ = this.tasks$.pipe(
        map(tasks => {
            const now = new Date().toISOString();
            return tasks.filter(
                t => (t.status === 'PENDING' || t.status === 'IN_REVIEW') && t.dueAt < now
            );
        })
    );

    public readonly completedTasks$ = this.tasks$.pipe(
        map(tasks => tasks.filter(t => t.status === 'COMPLETED'))
    );

    constructor() {
        // Run overdue sweep every minute
        setInterval(() => this.overdueSweep(), 60000);
    }

    /**
     * Create a new review task for a completed work order
     */
    createForWorkOrder(
        workOrderId: string,
        technicianId: string,
        supervisorId?: string
    ): ReviewTask {
        const config = this.configService.getConfig();
        const slaHours = config.reviewSlaHours ?? 24;

        const now = new Date();
        const dueAt = new Date(now.getTime() + slaHours * 60 * 60 * 1000);

        const task: ReviewTask = {
            id: this.generateId(),
            workOrderId,
            technicianId,
            supervisorId,
            status: 'PENDING',
            dueAt: dueAt.toISOString(),
            createdAt: now.toISOString(),
            updatedAt: now.toISOString()
        };

        const tasks = this.tasksSubject.value;
        this.tasksSubject.next([...tasks, task]);

        return task;
    }

    /**
     * Assign a supervisor to a pending task
     */
    assignSupervisor(taskId: string, supervisorId: string): ReviewTask | null {
        const tasks = this.tasksSubject.value;
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) return null;

        const updatedTask = {
            ...tasks[taskIndex],
            supervisorId,
            updatedAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;
        this.tasksSubject.next(updatedTasks);

        return updatedTask;
    }

    /**
     * Start reviewing a task (update status to IN_REVIEW)
     */
    startReview(taskId: string): ReviewTask | null {
        return this.updateTaskStatus(taskId, 'IN_REVIEW');
    }

    /**
     * Complete a review task
     */
    completeReview(taskId: string): ReviewTask | null {
        return this.updateTaskStatus(taskId, 'COMPLETED');
    }

    /**
     * Get task by work order ID
     */
    getByWorkOrder(workOrderId: string): Observable<ReviewTask | undefined> {
        return this.tasks$.pipe(
            map(tasks => tasks.find(t => t.workOrderId === workOrderId))
        );
    }

    /**
     * Get tasks for a specific supervisor with optional filters
     */
    getTasksForSupervisor(
        supervisorId: string,
        filters?: {
            status?: ReviewTaskStatus;
            overdue?: boolean;
        }
    ): Observable<ReviewTask[]> {
        return this.tasks$.pipe(
            map(tasks => {
                let filtered = tasks.filter(t => t.supervisorId === supervisorId);

                if (filters?.status) {
                    filtered = filtered.filter(t => t.status === filters.status);
                }

                if (filters?.overdue) {
                    const now = new Date().toISOString();
                    filtered = filtered.filter(
                        t => (t.status === 'PENDING' || t.status === 'IN_REVIEW') && t.dueAt < now
                    );
                }

                return filtered;
            })
        );
    }

    /**
     * Mark overdue tasks as EXPIRED
     */
    overdueSweep(): void {
        const tasks = this.tasksSubject.value;
        const now = new Date().toISOString();
        let hasChanges = false;

        const updatedTasks = tasks.map(task => {
            if (
                (task.status === 'PENDING' || task.status === 'IN_REVIEW') &&
                task.dueAt < now
            ) {
                hasChanges = true;
                return {
                    ...task,
                    status: 'EXPIRED' as ReviewTaskStatus,
                    updatedAt: now
                };
            }
            return task;
        });

        if (hasChanges) {
            this.tasksSubject.next(updatedTasks);
        }
    }

    /**
     * Get time remaining for a task (in milliseconds)
     */
    getTimeRemaining(task: ReviewTask): number {
        const now = new Date().getTime();
        const due = new Date(task.dueAt).getTime();
        return due - now;
    }

    /**
     * Check if task is overdue
     */
    isOverdue(task: ReviewTask): boolean {
        if (task.status === 'COMPLETED' || task.status === 'EXPIRED') {
            return false;
        }
        return new Date(task.dueAt) < new Date();
    }

    // Private helpers
    private updateTaskStatus(taskId: string, status: ReviewTaskStatus): ReviewTask | null {
        const tasks = this.tasksSubject.value;
        const taskIndex = tasks.findIndex(t => t.id === taskId);

        if (taskIndex === -1) return null;

        const updatedTask = {
            ...tasks[taskIndex],
            status,
            updatedAt: new Date().toISOString()
        };

        const updatedTasks = [...tasks];
        updatedTasks[taskIndex] = updatedTask;
        this.tasksSubject.next(updatedTasks);

        return updatedTask;
    }

    private generateId(): string {
        return `RT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
