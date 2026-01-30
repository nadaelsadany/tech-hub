export type DateRangePeriod =
    | 'Today'
    | 'Yesterday'
    | 'ThisWeek'
    | 'Last7Days'
    | 'LastWeek'
    | 'ThisMonth'
    | 'Last30Days'
    | 'Custom';

export type ExportFormat = 'CSV' | 'XLSX' | 'PDF';

export type ScheduleFrequency = 'Daily' | 'Weekly' | 'Monthly' | 'Custom';

export interface DateRange {
    start: string; // ISO date
    end: string;   // ISO date
}

export interface ReportFilter {
    dateRange: DateRange;
    period?: DateRangePeriod;
    siteId?: string;
    technicianIds?: string[];
    supervisorIds?: string[];
    categoryIds?: string[];
    warranty?: boolean | 'all';
    outcomes?: string[];
    statuses?: string[];
}

export interface KpiTotals {
    ordersCompleted: number;
    reviewed: number;
    reviewCoveragePct: number;          // reviewed / completed
    avgReviewScore: number;             // 0–100
    firstTimeFixRatePct: number;        // no follow-up within 7 days
    onTimeArrivalRatePct: number;       // if SLA/ETA tracked
    avgResolutionTimeMin: number;
    reassignmentRatePct: number;
    partsVarianceRatePct: number;       // review found mismatch
    reviewSlaCompliancePct: number;     // reviews completed within SLA
}

export interface TechnicianKpi {
    technicianId: string;
    name: string;
    completed: number;
    reviewed: number;
    reviewScoreAvg: number;
    travelVsWorkPct: number;
    lateArrivalsPct: number;
    followUpsNeeded: number;
    reassignmentRate: number;
    onTimeArrivalPct: number;
}

export interface KpiSnapshot {
    period: DateRange;
    siteId?: string;
    totals: KpiTotals;
    byTechnician?: TechnicianKpi[];
}

export interface ReportConfig {
    id: string;
    name: string;
    description?: string;
    reportType: 'orders-quality' | 'technician-performance' | 'review-sla';
    filters: ReportFilter;
    schedule?: {
        enabled: boolean;
        frequency: ScheduleFrequency;
        time: string;           // HH:mm format
        dayOfWeek?: number;     // 0-6 for weekly
        dayOfMonth?: number;    // 1-31 for monthly
        recipients: string[];   // email addresses
    };
    createdAt: string;
    updatedAt: string;
    createdBy: string;
}

export interface ExportMetadata {
    reportType: string;
    filters: ReportFilter;
    generatedAt: string;
    generatedBy: string;
    timezone: string;
    totalRecords: number;
}

// Date Range Helper Functions
export function getDateRangeForPeriod(period: DateRangePeriod, timezone: string = 'UTC'): DateRange {
    const now = new Date();
    let start: Date;
    let end: Date = new Date(now);

    switch (period) {
        case 'Today':
            start = new Date(now.setHours(0, 0, 0, 0));
            end = new Date(now.setHours(23, 59, 59, 999));
            break;

        case 'Yesterday':
            start = new Date(now.setDate(now.getDate() - 1));
            start.setHours(0, 0, 0, 0);
            end = new Date(start);
            end.setHours(23, 59, 59, 999);
            break;

        case 'ThisWeek':
            const dayOfWeek = now.getDay();
            start = new Date(now.setDate(now.getDate() - dayOfWeek));
            start.setHours(0, 0, 0, 0);
            end = new Date();
            break;

        case 'Last7Days':
            start = new Date(now.setDate(now.getDate() - 7));
            start.setHours(0, 0, 0, 0);
            end = new Date();
            break;

        case 'LastWeek':
            const lastWeekStart = new Date(now.setDate(now.getDate() - now.getDay() - 7));
            lastWeekStart.setHours(0, 0, 0, 0);
            start = lastWeekStart;
            end = new Date(lastWeekStart.setDate(lastWeekStart.getDate() + 6));
            end.setHours(23, 59, 59, 999);
            break;

        case 'ThisMonth':
            start = new Date(now.getFullYear(), now.getMonth(), 1);
            start.setHours(0, 0, 0, 0);
            end = new Date();
            break;

        case 'Last30Days':
            start = new Date(now.setDate(now.getDate() - 30));
            start.setHours(0, 0, 0, 0);
            end = new Date();
            break;

        default:
            start = new Date(now.setDate(now.getDate() - 7));
            end = new Date();
    }

    return {
        start: start.toISOString(),
        end: end.toISOString()
    };
}

export const DATE_RANGE_PERIOD_LABELS: Record<DateRangePeriod, string> = {
    Today: 'Today',
    Yesterday: 'Yesterday',
    ThisWeek: 'This Week',
    Last7Days: 'Last 7 Days',
    LastWeek: 'Last Week',
    ThisMonth: 'This Month',
    Last30Days: 'Last 30 Days',
    Custom: 'Custom Range'
};
