export type ReviewOutcome = 'Approved' | 'NeedsRework' | 'FollowUpRequired' | 'Rejected';

export type ReviewTaskStatus = 'PENDING' | 'IN_REVIEW' | 'COMPLETED' | 'EXPIRED';

export interface ReviewCompliance {
    safety: boolean;
    partsMatchedReservation: boolean;
    paymentCapturedIfRequired: boolean;
    photosSufficient: boolean;
    customerCommunicated: boolean;
}

export interface SupervisorReview {
    id: string;
    workOrderId: string;
    technicianId: string;
    supervisorId: string;
    reviewedAt: string;                 // ISO
    outcome: ReviewOutcome;
    score: number;                      // 0–100 composite or 1–5 star mapping
    compliance: ReviewCompliance;
    notes?: string;
    attachments?: { name: string; url: string }[];
    geo?: { lat: number; lng: number }; // optional if in-person
    linkedTimeLogs?: string[];          // optional references
    linkedInventoryTxnIds?: string[];   // optional references
}

export interface ReviewTask {
    id: string;
    workOrderId: string;
    technicianId: string;
    supervisorId?: string;              // optional until assigned
    status: ReviewTaskStatus;
    dueAt: string;                      // SLA for review (e.g., 24h after completion)
    createdAt: string;
    updatedAt: string;
}

// UI Helper Labels
export const REVIEW_OUTCOME_LABELS: Record<ReviewOutcome, string> = {
    Approved: 'Approved',
    NeedsRework: 'Needs Rework',
    FollowUpRequired: 'Follow-Up Required',
    Rejected: 'Rejected'
};

export const REVIEW_OUTCOME_COLORS: Record<ReviewOutcome, string> = {
    Approved: 'success',
    NeedsRework: 'warning',
    FollowUpRequired: 'processing',
    Rejected: 'error'
};

export const REVIEW_OUTCOME_ICONS: Record<ReviewOutcome, string> = {
    Approved: 'check-circle',
    NeedsRework: 'exclamation-circle',
    FollowUpRequired: 'clock-circle',
    Rejected: 'close-circle'
};

export const REVIEW_TASK_STATUS_LABELS: Record<ReviewTaskStatus, string> = {
    PENDING: 'Pending',
    IN_REVIEW: 'In Review',
    COMPLETED: 'Completed',
    EXPIRED: 'Expired'
};

export const REVIEW_TASK_STATUS_COLORS: Record<ReviewTaskStatus, string> = {
    PENDING: 'default',
    IN_REVIEW: 'processing',
    COMPLETED: 'success',
    EXPIRED: 'error'
};

// Helper function to convert 1-5 stars to 0-100 scale
export function starsToScore(stars: number): number {
    return stars * 20;
}

// Helper function to convert 0-100 score to 1-5 stars
export function scoreToStars(score: number): number {
    return Math.round(score / 20);
}
