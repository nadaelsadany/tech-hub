import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { SupervisorReview, ReviewOutcome } from '../models/review.model';
import { DateRange } from '../models/kpi.model';
import { ReviewTaskService } from './review-task.service';
import { StateService } from './state.service';

@Injectable({
    providedIn: 'root'
})
export class SupervisorReviewService {
    private reviewTaskService = inject(ReviewTaskService);
    private stateService = inject(StateService);

    private reviewsSubject = new BehaviorSubject<SupervisorReview[]>([]);
    public readonly reviews$ = this.reviewsSubject.asObservable();

    // Computed: Map of workOrderId -> review for quick lookup
    public readonly reviewsByWorkOrder$ = this.reviews$.pipe(
        map(reviews => {
            const map = new Map<string, SupervisorReview>();
            reviews.forEach(r => map.set(r.workOrderId, r));
            return map;
        })
    );

    /**
     * Submit a new supervisor review
     * Side effects:
     * - Updates associated WorkOrder
     * - Completes ReviewTask
     * - Creates follow-up order if needed
     */
    submitReview(review: SupervisorReview): SupervisorReview {
        // Add to reviews list
        const reviews = this.reviewsSubject.value;
        this.reviewsSubject.next([...reviews, review]);

        // Update WorkOrder with review linkage
        const workOrder = this.stateService.getWorkOrder(review.workOrderId);
        if (workOrder) {
            const updated = {
                ...workOrder,
                supervisorReviewId: review.id,
                supervisorReviewOutcome: review.outcome,
                supervisorReviewedAt: review.reviewedAt
            };
            this.stateService.updateWorkOrder(updated);
        }

        // Complete the review task
        this.reviewTaskService.completeReview(review.id);

        // Handle follow-up logic
        if (review.outcome === 'NeedsRework' || review.outcome === 'FollowUpRequired') {
            this.createFollowUpOrder(review);
        }

        return review;
    }

    /**
     * Update an existing review (supervisor override/edit)
     */
    updateReview(reviewId: string, updates: Partial<SupervisorReview>): SupervisorReview | null {
        const reviews = this.reviewsSubject.value;
        const reviewIndex = reviews.findIndex(r => r.id === reviewId);

        if (reviewIndex === -1) return null;

        const updatedReview = {
            ...reviews[reviewIndex],
            ...updates,
            reviewedAt: new Date().toISOString() // Update timestamp on edit
        };

        const updatedReviews = [...reviews];
        updatedReviews[reviewIndex] = updatedReview;
        this.reviewsSubject.next(updatedReviews);

        // Sync with WorkOrder
        const workOrder = this.stateService.getWorkOrder(updatedReview.workOrderId);
        if (workOrder) {
            const updated = {
                ...workOrder,
                supervisorReviewOutcome: updatedReview.outcome,
                supervisorReviewedAt: updatedReview.reviewedAt
            };
            this.stateService.updateWorkOrder(updated);
        }

        return updatedReview;
    }

    /**
     * Get review for a specific work order
     */
    getByWorkOrder(workOrderId: string): Observable<SupervisorReview | undefined> {
        return this.reviews$.pipe(
            map(reviews => reviews.find(r => r.workOrderId === workOrderId))
        );
    }

    /**
     * Get reviews within a date range with optional filters
     */
    getReviewsInPeriod(
        range: DateRange,
        filters?: {
            siteId?: string;
            technicianIds?: string[];
            supervisorIds?: string[];
            outcomes?: ReviewOutcome[];
        }
    ): Observable<SupervisorReview[]> {
        return this.reviews$.pipe(
            map(reviews => {
                let filtered = reviews.filter(r => {
                    const reviewDate = new Date(r.reviewedAt);
                    const startDate = new Date(range.start);
                    const endDate = new Date(range.end);
                    return reviewDate >= startDate && reviewDate <= endDate;
                });

                if (filters?.technicianIds && filters.technicianIds.length > 0) {
                    filtered = filtered.filter(r =>
                        filters.technicianIds!.includes(r.technicianId)
                    );
                }

                if (filters?.supervisorIds && filters.supervisorIds.length > 0) {
                    filtered = filtered.filter(r =>
                        filters.supervisorIds!.includes(r.supervisorId)
                    );
                }

                if (filters?.outcomes && filters.outcomes.length > 0) {
                    filtered = filtered.filter(r =>
                        filters.outcomes!.includes(r.outcome)
                    );
                }

                return filtered;
            })
        );
    }

    /**
     * Get average review score for a technician in a period
     */
    getAvgScoreForTechnician(
        technicianId: string,
        range: DateRange
    ): Observable<number> {
        return this.getReviewsInPeriod(range, { technicianIds: [technicianId] }).pipe(
            map(reviews => {
                if (reviews.length === 0) return 0;
                const sum = reviews.reduce((acc, r) => acc + r.score, 0);
                return sum / reviews.length;
            })
        );
    }

    /**
     * Get review coverage percentage (reviews / completed orders)
     */
    getReviewCoverage(range: DateRange): Observable<number> {
        const completedOrders$ = this.stateService.workOrders$.pipe(
            map(orders =>
                orders.filter(o => {
                    if (o.status !== 'Completed' || !o.completedAt) return false;
                    const completedDate = new Date(o.completedAt);
                    return completedDate >= new Date(range.start) &&
                        completedDate <= new Date(range.end);
                })
            )
        );

        const reviewsInPeriod$ = this.getReviewsInPeriod(range);

        return new Observable(observer => {
            let completedCount = 0;
            let reviewCount = 0;

            completedOrders$.subscribe(orders => {
                completedCount = orders.length;
                const coverage = completedCount > 0 ? (reviewCount / completedCount) * 100 : 0;
                observer.next(coverage);
            });

            reviewsInPeriod$.subscribe(reviews => {
                reviewCount = reviews.length;
                const coverage = completedCount > 0 ? (reviewCount / completedCount) * 100 : 0;
                observer.next(coverage);
            });
        });
    }

    /**
     * Create a follow-up work order for rework/follow-up scenarios
     */
    private createFollowUpOrder(review: SupervisorReview): void {
        // Get original work order
        const originalOrder = this.stateService.getWorkOrder(review.workOrderId);
        if (!originalOrder) return;

        // Create follow-up order (clone with modifications)
        const followUpOrder = {
            ...originalOrder,
            id: this.generateId(),
            number: this.generateOrderNumber(),
            status: 'New' as const,
            assignedTechnicianId: null,
            scheduledStartAt: null,
            etaMin: null,
            distanceKm: null,
            notes: `Follow-up for WO ${originalOrder.number}. Original review: ${review.outcome}. ${review.notes || ''}`,
            createdAt: new Date().toISOString(),
            result: null,
            statusHistory: [],
            changeLog: [],
            supervisorReviewId: null,
            supervisorReviewOutcome: null,
            supervisorReviewedAt: null,
            completedAt: undefined
        };

        // Add to state
        this.stateService.addWorkOrder(followUpOrder);

        // TODO: Send notification to dispatcher
        console.log(`Follow-up order ${followUpOrder.number} created for ${originalOrder.number}`);
    }

    private generateId(): string {
        return `SR-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    private generateOrderNumber(): string {
        return `WO-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    }
}
