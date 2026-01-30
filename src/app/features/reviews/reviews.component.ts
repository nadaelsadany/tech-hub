import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// NG-ZORRO imports
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';

import { ReviewTaskService } from '../../core/services/review-task.service';
import { SupervisorReviewService } from '../../core/services/supervisor-review.service';
import { StateService } from '../../core/services/state.service';
import { ReviewTask, ReviewTaskStatus, REVIEW_TASK_STATUS_LABELS, REVIEW_TASK_STATUS_COLORS, REVIEW_OUTCOME_LABELS, REVIEW_OUTCOME_COLORS } from '../../core/models/review.model';
import { WorkOrder } from '../../core/models/work-order.model';

interface ReviewTaskTableRow extends ReviewTask {
    workOrder?: WorkOrder;
    technicianName?: string;
    supervisorName?: string;
    reviewOutcome?: string;
    reviewScore?: number;
    isOverdue?: boolean;
    timeRemainingMs?: number;
}

@Component({
    selector: 'app-reviews',
    standalone: true,
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        NzTableModule,
        NzButtonModule,
        NzTagModule,
        NzBadgeModule,
        NzSelectModule,
        NzDatePickerModule,
        NzDrawerModule,
        NzRateModule,
        NzCardModule,
        NzSpaceModule,
        NzStatisticModule
    ],
    templateUrl: './reviews.component.html',
    styleUrls: ['./reviews.component.css']
})
export class ReviewsComponent {
    private reviewTaskService = inject(ReviewTaskService);
    private reviewService = inject(SupervisorReviewService);
    private stateService = inject(StateService);

    // Filter state
    selectedStatus: ReviewTaskStatus | 'ALL' | 'OVERDUE' = 'ALL';
    selectedOutcome: string | null = null;
    dateRange: Date[] | null = null;

    // Table data
    tableData$: Observable<ReviewTaskTableRow[]> = this.buildTableData();

    // Summary stats
    pendingCount$: Observable<number> = this.reviewTaskService.pendingTasks$.pipe(
        map(tasks => tasks.length)
    );

    overdueCount$: Observable<number> = this.reviewTaskService.overdueTasks$.pipe(
        map(tasks => tasks.length)
    );

    inReviewCount$: Observable<number> = this.reviewTaskService.inReviewTasks$.pipe(
        map(tasks => tasks.length)
    );

    // Drawer state
    drawerVisible = false;
    selectedTask: ReviewTask | null = null;

    // Constants for template
    statusLabels = REVIEW_TASK_STATUS_LABELS;
    statusColors = REVIEW_TASK_STATUS_COLORS;
    outcomeLabels = REVIEW_OUTCOME_LABELS;
    outcomeColors = REVIEW_OUTCOME_COLORS;

    statusOptions: Array<{ label: string; value: ReviewTaskStatus | 'ALL' | 'OVERDUE' }> = [
        { label: 'All', value: 'ALL' },
        { label: 'Pending', value: 'PENDING' },
        { label: 'In Review', value: 'IN_REVIEW' },
        { label: 'Overdue', value: 'OVERDUE' },
        { label: 'Completed', value: 'COMPLETED' },
        { label: 'Expired', value: 'EXPIRED' }
    ];

    /**
     * Build table data with enriched information
     */
    private buildTableData(): Observable<ReviewTaskTableRow[]> {
        return this.reviewTaskService.tasks$.pipe(
            map(tasks => {
                const now = new Date().getTime();

                return tasks.map(task => {
                    const workOrder = this.stateService.getWorkOrder(task.workOrderId);
                    const isOverdue = this.reviewTaskService.isOverdue(task);
                    const timeRemaining = this.reviewTaskService.getTimeRemaining(task);

                    const row: ReviewTaskTableRow = {
                        ...task,
                        workOrder,
                        technicianName: workOrder?.assignedTechnicianId ? `Tech ${workOrder.assignedTechnicianId.slice(-4)}` : '-',
                        supervisorName: task.supervisorId ? `Supervisor ${task.supervisorId.slice(-4)}` : 'Unassigned',
                        reviewOutcome: workOrder?.supervisorReviewOutcome || undefined,
                        reviewScore: undefined, // Will be populated if reviewed
                        isOverdue,
                        timeRemainingMs: timeRemaining
                    };

                    return row;
                });
            }),
            map(rows => this.applyFilters(rows))
        );
    }

    /**
     * Apply client-side filters
     */
    private applyFilters(rows: ReviewTaskTableRow[]): ReviewTaskTableRow[] {
        let filtered = [...rows];

        // Status filter
        if (this.selectedStatus === 'OVERDUE') {
            filtered = filtered.filter(r => r.isOverdue);
        } else if (this.selectedStatus !== 'ALL') {
            filtered = filtered.filter(r => r.status === this.selectedStatus);
        }

        // Outcome filter
        if (this.selectedOutcome) {
            filtered = filtered.filter(r => r.reviewOutcome === this.selectedOutcome);
        }

        // Date range filter
        if (this.dateRange && this.dateRange.length === 2) {
            const [start, end] = this.dateRange;
            filtered = filtered.filter(r => {
                if (!r.workOrder?.completedAt) return false;
                const completedDate = new Date(r.workOrder.completedAt);
                return completedDate >= start && completedDate <= end;
            });
        }

        return filtered;
    }

    /**
     * Filter change handlers
     */
    onStatusFilterChange(): void {
        this.tableData$ = this.buildTableData();
    }

    onOutcomeFilterChange(): void {
        this.tableData$ = this.buildTableData();
    }

    onDateRangeChange(): void {
        this.tableData$ = this.buildTableData();
    }

    /**
     * Clear all filters
     */
    clearFilters(): void {
        this.selectedStatus = 'ALL';
        this.selectedOutcome = null;
        this.dateRange = null;
        this.tableData$ = this.buildTableData();
    }

    /**
     * Open review form drawer
     */
    openReviewForm(task: ReviewTask): void {
        this.selectedTask = task;
        this.drawerVisible = true;
    }

    /**
     * Close review form drawer
     */
    closeReviewForm(): void {
        this.drawerVisible = false;
        this.selectedTask = null;
    }

    /**
     * Handle review submission from drawer
     */
    onReviewSubmitted(): void {
        this.closeReviewForm();
        // Refresh table data
        this.tableData$ = this.buildTableData();
    }

    /**
     * Format time remaining display
     */
    formatTimeRemaining(ms: number | undefined): string {
        if (ms === undefined || ms < 0) return 'Overdue';

        const hours = Math.floor(ms / (1000 * 60 * 60));
        const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));

        if (hours > 24) {
            const days = Math.floor(hours / 24);
            return `${days}d ${hours % 24}h`;
        }

        return `${hours}h ${minutes}m`;
    }

    /**
     * Get badge status for time remaining
     */
    getTimeBadgeStatus(ms: number | undefined): "success" | "processing" | "error" | "default" | "warning" {
        if (ms === undefined || ms < 0) return 'error';

        const hours = ms / (1000 * 60 * 60);
        if (hours < 2) return 'error';
        if (hours < 6) return 'warning';
        return 'processing';
    }

    /**
     * Helper to get outcome color from string value
     */
    getOutcomeColor(outcome: string | undefined): string {
        if (!outcome) return 'default';
        return (this.outcomeColors as any)[outcome] || 'default';
    }

    /**
     * Helper to get outcome label from string value
     */
    getOutcomeLabel(outcome: string | undefined): string {
        if (!outcome) return '-';
        return (this.outcomeLabels as any)[outcome] || outcome;
    }
}
