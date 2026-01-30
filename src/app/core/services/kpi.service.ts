import { Injectable, inject } from '@angular/core';
import { Observable, combineLatest, map } from 'rxjs';
import {
    KpiSnapshot,
    TechnicianKpi,
    ReportFilter,
    DateRange,
    ExportMetadata,
    KpiTotals
} from '../models/kpi.model';
import { StateService } from './state.service';
import { SupervisorReviewService } from './supervisor-review.service';
import { WorkOrder } from '../models/work-order.model';
import { SupervisorReview, ReviewOutcome } from '../models/review.model';
import * as XLSX from 'xlsx';

@Injectable({
    providedIn: 'root'
})
export class KpiService {
    private stateService = inject(StateService);
    private reviewService = inject(SupervisorReviewService);

    /**
     * Build comprehensive KPI snapshot for a given period and filters
     */
    buildKpiSnapshot(filter: ReportFilter): Observable<KpiSnapshot> {
        const workOrders$ = this.getFilteredWorkOrders(filter);
        const reviews$ = this.reviewService.getReviewsInPeriod(filter.dateRange, {
            technicianIds: filter.technicianIds,
            supervisorIds: filter.supervisorIds,
            outcomes: (filter.outcomes as ReviewOutcome[])
        });

        return combineLatest([workOrders$, reviews$]).pipe(
            map(([orders, reviews]) => {
                const totals = this.calculateTotals(orders, reviews, filter.dateRange);
                const byTechnician = this.buildTechnicianKpis(orders, reviews);

                return {
                    period: filter.dateRange,
                    siteId: filter.siteId,
                    totals,
                    byTechnician
                };
            })
        );
    }

    /**
     * Calculate aggregate KPI totals
     */
    private calculateTotals(
        orders: WorkOrder[],
        reviews: SupervisorReview[],
        period: DateRange
    ): KpiTotals {
        const completedOrders = orders.filter(o => o.status === 'Completed');
        const reviewedOrders = completedOrders.filter(o => o.supervisorReviewId);

        return {
            ordersCompleted: completedOrders.length,
            reviewed: reviewedOrders.length,
            reviewCoveragePct: this.calculateReviewCoverage(completedOrders.length, reviewedOrders.length),
            avgReviewScore: this.calculateAvgReviewScore(reviews),
            firstTimeFixRatePct: this.calculateFirstTimeFixRate(orders),
            onTimeArrivalRatePct: this.calculateOnTimeArrivalRate(orders),
            avgResolutionTimeMin: this.calculateAvgResolutionTime(completedOrders),
            reassignmentRatePct: this.calculateReassignmentRate(orders),
            partsVarianceRatePct: this.calculatePartsVarianceRate(reviews),
            reviewSlaCompliancePct: this.calculateReviewSlaCompliance(reviews, orders)
        };
    }

    /**
     * Build per-technician KPI array
     */
    buildTechnicianKpis(
        orders: WorkOrder[],
        reviews: SupervisorReview[]
    ): TechnicianKpi[] {
        // Group orders by technician
        const technicianMap = new Map<string, { orders: WorkOrder[]; reviews: SupervisorReview[] }>();

        orders.forEach(order => {
            if (!order.assignedTechnicianId) return;

            if (!technicianMap.has(order.assignedTechnicianId)) {
                technicianMap.set(order.assignedTechnicianId, { orders: [], reviews: [] });
            }
            technicianMap.get(order.assignedTechnicianId)!.orders.push(order);
        });

        reviews.forEach(review => {
            if (!technicianMap.has(review.technicianId)) {
                technicianMap.set(review.technicianId, { orders: [], reviews: [] });
            }
            technicianMap.get(review.technicianId)!.reviews.push(review);
        });

        // Calculate KPIs for each technician
        const kpis: TechnicianKpi[] = [];

        technicianMap.forEach((data, technicianId) => {
            const completed = data.orders.filter(o => o.status === 'Completed');
            const reviewed = data.reviews.length;
            const scoreSum = data.reviews.reduce((sum, r) => sum + r.score, 0);
            const avgScore = reviewed > 0 ? scoreSum / reviewed : 0;

            // Calculate follow-ups needed
            const followUps = this.countFollowUps(data.orders);

            // Calculate on-time arrivals
            const onTimeCount = data.orders.filter(o => {
                // TODO: Implement actual arrival time vs scheduled time check
                return true; // Placeholder
            }).length;
            const onTimeArrivalPct = data.orders.length > 0
                ? (onTimeCount / data.orders.length) * 100
                : 0;

            // Calculate reassignment rate for this technician
            const reassigned = data.orders.filter(o =>
                o.changeLog?.some(c => c.field === 'assignedTechnicianId')
            ).length;
            const reassignmentRate = data.orders.length > 0
                ? (reassigned / data.orders.length) * 100
                : 0;

            kpis.push({
                technicianId,
                name: this.getTechnicianName(technicianId),
                completed: completed.length,
                reviewed,
                reviewScoreAvg: avgScore,
                travelVsWorkPct: 0, // TODO: Calculate from time logs
                lateArrivalsPct: 100 - onTimeArrivalPct,
                followUpsNeeded: followUps,
                reassignmentRate,
                onTimeArrivalPct
            });
        });

        return kpis.sort((a, b) => b.reviewScoreAvg - a.reviewScoreAvg);
    }

    // Individual KPI Calculations

    calculateReviewCoverage(completed: number, reviewed: number): number {
        return completed > 0 ? (reviewed / completed) * 100 : 0;
    }

    calculateAvgReviewScore(reviews: SupervisorReview[]): number {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, r) => acc + r.score, 0);
        return sum / reviews.length;
    }

    calculateFirstTimeFixRate(orders: WorkOrder[]): number {
        const completed = orders.filter(o => o.status === 'Completed');
        if (completed.length === 0) return 0;

        // Count orders that have follow-ups (indicated by notes referencing original)
        const withFollowUps = this.countFollowUps(orders);
        return ((completed.length - withFollowUps) / completed.length) * 100;
    }

    calculateOnTimeArrivalRate(orders: WorkOrder[]): number {
        const ordersWithWindow = orders.filter(o => o.timeWindow);
        if (ordersWithWindow.length === 0) return 100; // No windows to check

        // TODO: Implement actual arrival time checking from status history
        // For now, return placeholder
        return 85; // Placeholder
    }

    calculateAvgResolutionTime(completedOrders: WorkOrder[]): number {
        if (completedOrders.length === 0) return 0;

        const times = completedOrders
            .filter(o => o.completedAt && o.result?.durationMin)
            .map(o => o.result!.durationMin!);

        if (times.length === 0) return 0;
        const sum = times.reduce((acc, t) => acc + t, 0);
        return sum / times.length;
    }

    calculateReassignmentRate(orders: WorkOrder[]): number {
        if (orders.length === 0) return 0;

        const reassigned = orders.filter(o =>
            o.changeLog?.some(c => c.field === 'assignedTechnicianId' && c.from !== null)
        );

        return (reassigned.length / orders.length) * 100;
    }

    calculatePartsVarianceRate(reviews: SupervisorReview[]): number {
        if (reviews.length === 0) return 0;

        const withVariance = reviews.filter(r => !r.compliance.partsMatchedReservation);
        return (withVariance.length / reviews.length) * 100;
    }

    calculateReviewSlaCompliance(reviews: SupervisorReview[], orders: WorkOrder[]): number {
        if (reviews.length === 0) return 100;

        const withinSla = reviews.filter(review => {
            const order = orders.find(o => o.id === review.workOrderId);
            if (!order || !order.completedAt) return false;

            const completed = new Date(order.completedAt).getTime();
            const reviewed = new Date(review.reviewedAt).getTime();
            const hoursDiff = (reviewed - completed) / (1000 * 60 * 60);

            return hoursDiff <= 24; // Default SLA 24 hours
        });

        return (withinSla.length / reviews.length) * 100;
    }

    // Export Functions

    exportToCsv(data: any[], metadata: ExportMetadata): Blob {
        const headers = Object.keys(data[0] || {});

        // Metadata header
        const metaLines = [
            `Report: ${metadata.reportType}`,
            `Generated: ${metadata.generatedAt}`,
            `By: ${metadata.generatedBy}`,
            `Period: ${metadata.filters.dateRange.start} to ${metadata.filters.dateRange.end}`,
            `Timezone: ${metadata.timezone}`,
            `Total Records: ${metadata.totalRecords}`,
            '', // Empty line separator
            headers.join(',') // Column headers
        ];

        // Data rows
        const dataLines = data.map(row =>
            headers.map(header => {
                const value = row[header];
                const escaped = String(value || '').replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',')
        );

        const csv = [...metaLines, ...dataLines].join('\n');
        return new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    }

    exportToXlsx(data: any[], metadata: ExportMetadata): Blob {
        const workbook = XLSX.utils.book_new();

        // Metadata sheet
        const metaData = [
            ['Report', metadata.reportType],
            ['Generated', metadata.generatedAt],
            ['By', metadata.generatedBy],
            ['Period Start', metadata.filters.dateRange.start],
            ['Period End', metadata.filters.dateRange.end],
            ['Timezone', metadata.timezone],
            ['Total Records', metadata.totalRecords]
        ];
        const metaSheet = XLSX.utils.aoa_to_sheet(metaData);
        XLSX.utils.book_append_sheet(workbook, metaSheet, 'Metadata');

        // Data sheet
        const dataSheet = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(workbook, dataSheet, 'Data');

        // Write workbook
        const xlsxData = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        return new Blob([xlsxData], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    }

    exportToPdf(data: any[], metadata: ExportMetadata, kpiSummary?: any): Blob {
        // Placeholder for PDF export using jsPDF
        // This will be implemented with jsPDF + autotable
        const pdfContent = `
      ${metadata.reportType}
      Generated: ${metadata.generatedAt}
      Period: ${metadata.filters.dateRange.start} to ${metadata.filters.dateRange.end}
      
      KPI Summary:
      ${JSON.stringify(kpiSummary, null, 2)}
      
      Data Records: ${metadata.totalRecords}
    `;

        return new Blob([pdfContent], { type: 'application/pdf' });
    }

    downloadFile(blob: Blob, filename: string): void {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        link.click();
        window.URL.revokeObjectURL(url);
    }

    // Helper methods

    private getFilteredWorkOrders(filter: ReportFilter): Observable<WorkOrder[]> {
        return this.stateService.workOrders$.pipe(
            map(orders => {
                let filtered = orders;

                // Filter by completion date within range
                filtered = filtered.filter(o => {
                    if (!o.completedAt) return false;
                    const completedDate = new Date(o.completedAt);
                    return completedDate >= new Date(filter.dateRange.start) &&
                        completedDate <= new Date(filter.dateRange.end);
                });

                // Filter by site
                if (filter.siteId) {
                    filtered = filtered.filter(o => o.siteId === filter.siteId);
                }

                // Filter by technician
                if (filter.technicianIds && filter.technicianIds.length > 0) {
                    filtered = filtered.filter(o =>
                        o.assignedTechnicianId && filter.technicianIds!.includes(o.assignedTechnicianId)
                    );
                }

                // Filter by category
                if (filter.categoryIds && filter.categoryIds.length > 0) {
                    filtered = filtered.filter(o => filter.categoryIds!.includes(o.category));
                }

                // Filter by warranty
                if (filter.warranty !== 'all' && filter.warranty !== undefined) {
                    filtered = filtered.filter(o => o.warranty === filter.warranty);
                }

                // Filter by status
                if (filter.statuses && filter.statuses.length > 0) {
                    filtered = filtered.filter(o => filter.statuses!.includes(o.status));
                }

                return filtered;
            })
        );
    }

    private getTechnicianName(technicianId: string): string {
        // TODO: Get from technician service
        return `Technician ${technicianId.slice(-4)}`;
    }

    private countFollowUps(orders: WorkOrder[]): number {
        return orders.filter(o =>
            o.notes?.toLowerCase().includes('follow-up for')
        ).length;
    }
}
