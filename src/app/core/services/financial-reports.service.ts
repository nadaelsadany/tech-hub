import { Injectable, inject } from '@angular/core';
import { Observable, map, combineLatest } from 'rxjs';
import { Invoice, SplitEntry, FeeLine, PaymentRecord, SplitAllocation } from '../models/invoice.model';
import { WorkOrder } from '../models/work-order.model';
import { AccountingService } from './accounting.service';
import { StateService } from './state.service';

export interface BillingReportRow {
    workOrderNumber: string;
    workOrderId: string;
    customer: string;
    technician: string;
    completedAt: string;
    visitFee: number;
    laborFee: number;
    partsFee: number;
    discounts: number;
    tax: number;
    total: number;
    paid: number;
    balance: number;
    financialStatus: string;
}

export interface TechnicianEarningsRow {
    technicianId: string;
    technicianName: string;
    ordersCount: number;
    laborHours: number;
    laborAmount: number;
    totalEarnings: number;
}

export interface WarrantyStatementRow {
    workOrderNumber: string;
    date: string;
    customer: string;
    serviceDescription: string;
    total: number;
    warrantyShare: number;
    customerShare: number;
}

export interface ReportFilters {
    dateRange?: { start: Date; end: Date };
    siteIds?: string[];
    technicianIds?: string[];
    categories?: string[];
    warranty?: boolean;
    customerIds?: string[];
    providerId?: string;
}

@Injectable({
    providedIn: 'root'
})
export class FinancialReportsService {
    private accountingService = inject(AccountingService);
    private stateService = inject(StateService);

    constructor() { }

    // Generate Billing Report
    generateBillingReport(filters: ReportFilters = {}): BillingReportRow[] {
        const invoices = this.accountingService.getInvoices();
        const workOrders = this.stateService.getWorkOrders();
        const rows: BillingReportRow[] = [];

        invoices.forEach((invoice: any) => {
            const wo = workOrders.find((w: any) => w.id === invoice.workOrderId);
            if (!wo) return;

            // Apply filters
            if (filters.dateRange) {
                const completedDate = wo.completedAt ? new Date(wo.completedAt) : null;
                if (!completedDate ||
                    completedDate < filters.dateRange.start ||
                    completedDate > filters.dateRange.end) {
                    return;
                }
            }

            if (filters.siteIds && filters.siteIds.length > 0 && !filters.siteIds.includes(wo.siteId)) return;
            if (filters.technicianIds && filters.technicianIds.length > 0 && !filters.technicianIds.includes(wo.assignedTechnicianId || '')) return;
            if (filters.categories && filters.categories.length > 0 && !filters.categories.includes(wo.category)) return;
            if (filters.warranty !== undefined && wo.warranty !== filters.warranty) return;

            // Calculate fee breakdown
            const visitFee = invoice.feeLines.filter((l: FeeLine) => l.type === 'VISIT').reduce((sum: number, l: FeeLine) => sum + (l.qty * l.unitPrice), 0);
            const laborFee = invoice.feeLines.filter((l: FeeLine) => l.type === 'LABOR').reduce((sum: number, l: FeeLine) => sum + (l.qty * l.unitPrice), 0);
            const partsFee = invoice.feeLines.filter((l: FeeLine) => l.type === 'PART' || l.type === 'TOOL').reduce((sum: number, l: FeeLine) => sum + (l.qty * l.unitPrice), 0);
            const discounts = Math.abs(invoice.feeLines.filter((l: FeeLine) => l.type === 'DISCOUNT').reduce((sum: number, l: FeeLine) => sum + (l.qty * l.unitPrice), 0));
            const tax = invoice.feeLines.filter((l: FeeLine) => l.type === 'TAX').reduce((sum: number, l: FeeLine) => sum + (l.qty * l.unitPrice), 0);
            const paid = (invoice.payments || []).reduce((sum: number, p: PaymentRecord) => sum + p.amount, 0);

            const techName = this.getTechnicianName(wo.assignedTechnicianId);

            rows.push({
                workOrderNumber: wo.number,
                workOrderId: wo.id,
                customer: wo.customer.name,
                technician: techName,
                completedAt: wo.completedAt || '',
                visitFee,
                laborFee,
                partsFee,
                discounts,
                tax,
                total: invoice.grandTotal,
                paid,
                balance: invoice.balanceDue,
                financialStatus: invoice.status
            });
        });

        return rows;
    }

    // Generate Technician Earnings Report
    generateTechnicianEarningsReport(filters: ReportFilters = {}): TechnicianEarningsRow[] {
        const invoices = this.accountingService.getInvoices();
        const workOrders = this.stateService.getWorkOrders();
        const technicians = this.stateService.getTechnicians();

        const earningsMap = new Map<string, TechnicianEarningsRow>();

        invoices.forEach(invoice => {
            const wo = workOrders.find(w => w.id === invoice.workOrderId);
            if (!wo || !wo.assignedTechnicianId) return;

            // Apply filters
            if (filters.dateRange) {
                const completedDate = wo.completedAt ? new Date(wo.completedAt) : null;
                if (!completedDate ||
                    completedDate < filters.dateRange.start ||
                    completedDate > filters.dateRange.end) {
                    return;
                }
            }

            if (filters.technicianIds && filters.technicianIds.length > 0 && !filters.technicianIds.includes(wo.assignedTechnicianId)) return;
            if (filters.siteIds && filters.siteIds.length > 0 && !filters.siteIds.includes(wo.siteId)) return;

            // Calculate labor attributed to this technician
            const laborLines = invoice.feeLines.filter(l =>
                l.type === 'LABOR' &&
                (!l.technicianId || l.technicianId === wo.assignedTechnicianId)
            );

            const laborHours = laborLines.reduce((sum, l) => sum + l.qty, 0);
            const laborAmount = laborLines.reduce((sum, l) => sum + (l.qty * l.unitPrice), 0);

            if (!earningsMap.has(wo.assignedTechnicianId)) {
                earningsMap.set(wo.assignedTechnicianId, {
                    technicianId: wo.assignedTechnicianId,
                    technicianName: this.getTechnicianName(wo.assignedTechnicianId),
                    ordersCount: 0,
                    laborHours: 0,
                    laborAmount: 0,
                    totalEarnings: 0
                });
            }

            const row = earningsMap.get(wo.assignedTechnicianId)!;
            row.ordersCount++;
            row.laborHours += laborHours;
            row.laborAmount += laborAmount;
            row.totalEarnings += laborAmount; // For now, just labor; can add commission logic
        });

        return Array.from(earningsMap.values()).sort((a, b) => b.totalEarnings - a.totalEarnings);
    }

    // Generate Warranty Provider Statement
    generateWarrantyStatement(filters: ReportFilters = {}): WarrantyStatementRow[] {
        const invoices = this.accountingService.getInvoices();
        const workOrders = this.stateService.getWorkOrders();
        const rows: WarrantyStatementRow[] = [];

        invoices.forEach((invoice: any) => {
            const wo = workOrders.find((w: any) => w.id === invoice.workOrderId);
            if (!wo || !wo.warranty) return; // Only warranty orders

            // Apply filters
            if (filters.dateRange) {
                const issueDate = invoice.issueDate ? new Date(invoice.issueDate) : null;
                if (!issueDate ||
                    issueDate < filters.dateRange.start ||
                    issueDate > filters.dateRange.end) {
                    return;
                }
            }

            if (filters.siteIds && filters.siteIds.length > 0 && !filters.siteIds.includes(wo.siteId)) return;
            if (filters.providerId) {
                // Check if this warranty allocation matches the provider
                const warrantyAllocation = (invoice.allocations || []).find((a: SplitAllocation) =>
                    a.party === 'WARRANTY' && a.accountId === filters.providerId
                );
                if (!warrantyAllocation) return;
            }

            // Calculate warranty and customer shares
            const warrantyAllocation = (invoice.allocations || []).find((a: SplitAllocation) => a.party === 'WARRANTY');
            const customerAllocation = (invoice.allocations || []).find((a: SplitAllocation) => a.party === 'CUSTOMER');

            rows.push({
                workOrderNumber: wo.number,
                date: invoice.issueDate,
                customer: wo.customer.name,
                serviceDescription: `${wo.category} - ${wo.notes || 'Service'}`,
                total: invoice.grandTotal,
                warrantyShare: warrantyAllocation?.amount || 0,
                customerShare: customerAllocation?.amount || 0
            });
        });

        return rows;
    }

    // Export helpers (CSV/XLSX/PDF)
    exportBillingReportCsv(rows: BillingReportRow[]): string {
        const headers = ['WO#', 'Customer', 'Technician', 'Completed', 'Visit', 'Labor', 'Parts', 'Discounts', 'Tax', 'Total', 'Paid', 'Balance', 'Status'];
        const data = rows.map(r => [
            r.workOrderNumber,
            r.customer,
            r.technician,
            this.formatDate(r.completedAt),
            r.visitFee.toFixed(2),
            r.laborFee.toFixed(2),
            r.partsFee.toFixed(2),
            r.discounts.toFixed(2),
            r.tax.toFixed(2),
            r.total.toFixed(2),
            r.paid.toFixed(2),
            r.balance.toFixed(2),
            r.financialStatus
        ]);

        return this.arrayToCsv([headers, ...data]);
    }

    exportTechnicianEarningsCsv(rows: TechnicianEarningsRow[]): string {
        const headers = ['Technician', 'Orders', 'Labor Hours', 'Labor Amount', 'Total Earnings'];
        const data = rows.map(r => [
            r.technicianName,
            r.ordersCount.toString(),
            r.laborHours.toFixed(2),
            r.laborAmount.toFixed(2),
            r.totalEarnings.toFixed(2)
        ]);

        return this.arrayToCsv([headers, ...data]);
    }

    exportWarrantyStatementCsv(rows: WarrantyStatementRow[]): string {
        const headers = ['WO#', 'Date', 'Customer', 'Service', 'Total', 'Warranty Share', 'Customer Share'];
        const data = rows.map(r => [
            r.workOrderNumber,
            this.formatDate(r.date),
            r.customer,
            r.serviceDescription,
            r.total.toFixed(2),
            r.warrantyShare.toFixed(2),
            r.customerShare.toFixed(2)
        ]);

        return this.arrayToCsv([headers, ...data]);
    }

    private arrayToCsv(data: string[][]): string {
        return data.map(row =>
            row.map(cell => {
                const escaped = cell.replace(/"/g, '""');
                return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
            }).join(',')
        ).join('\n');
    }

    private formatDate(iso?: string): string {
        if (!iso) return '';
        const date = new Date(iso);
        return date.toLocaleDateString('en-GB');
    }

    private getTechnicianName(techId?: string | null): string {
        if (!techId) return 'Unassigned';
        const tech = this.stateService.getTechnicians().find(t => t.id === techId);
        return tech?.name || techId;
    }
}
