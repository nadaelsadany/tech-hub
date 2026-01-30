import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import {
    Invoice,
    FeeLine,
    PaymentRecord,
    SplitEntry,
    SplitAllocation,
    InvoiceStatus,
    InvoiceTotals,
    CurrencyCode,
    FeeLineType
} from '../models/invoice.model';
import { WorkOrder } from '../models/work-order.model';
import { StateService } from './state.service';

@Injectable({
    providedIn: 'root'
})
export class AccountingService {
    private stateService = inject(StateService);

    // In-memory invoice store
    private invoicesSubject = new BehaviorSubject<Invoice[]>([]);
    public invoices$ = this.invoicesSubject.asObservable();

    // Default currency
    private defaultCurrency: CurrencyCode = 'EGP';

    // Default user for MVP (simulate logged-in user)
    private currentUser = { id: 'USER-001', name: 'System Admin' };

    constructor() { }

    // Get all invoices
    getInvoices(): Invoice[] {
        return this.invoicesSubject.value;
    }

    // Get invoice by ID
    getInvoiceById(id: string): Invoice | undefined {
        return this.invoicesSubject.value.find(inv => inv.id === id);
    }

    // Get invoice by work order ID
    getInvoiceByWorkOrderId(workOrderId: string): Invoice | undefined {
        return this.invoicesSubject.value.find(inv => inv.workOrderId === workOrderId);
    }

    // Create new invoice for work order
    createInvoiceForWorkOrder(workOrder: WorkOrder): Invoice {
        const now = new Date().toISOString();
        const invoiceNumber = this.generateInvoiceNumber();

        const invoice: Invoice = {
            id: `INV-${Date.now()}`,
            workOrderId: workOrder.id,
            number: invoiceNumber,
            status: 'DRAFT',
            issueDate: now,
            currency: this.defaultCurrency,
            feeLines: [],
            subtotal: 0,
            taxTotal: 0,
            grandTotal: 0,
            splits: [],
            allocations: [],
            payments: [],
            balanceDue: 0,
            createdAt: now,
            updatedAt: now,
            createdBy: this.currentUser
        };

        const invoices = [...this.invoicesSubject.value, invoice];
        this.invoicesSubject.next(invoices);

        return invoice;
    }

    // Generate invoice number (INV-YYYYMM-####)
    private generateInvoiceNumber(): string {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const prefix = `INV-${year}${month}-`;

        const existing = this.invoicesSubject.value
            .filter(inv => inv.number.startsWith(prefix))
            .length;

        const sequence = String(existing + 1).padStart(4, '0');
        return `${prefix}${sequence}`;
    }

    // Suggest fee lines from work order (parts, labor, visit)
    suggestFeeLines(workOrderId: string): FeeLine[] {
        const workOrders = this.stateService.getWorkOrders();
        const workOrder = workOrders.find((wo: any) => wo.id === workOrderId);
        if (!workOrder) return [];

        const suggestedLines: FeeLine[] = [];

        // Add VISIT fee
        suggestedLines.push({
            id: `FEE-${Date.now()}-VISIT`,
            type: 'VISIT',
            description: 'Visit Fee',
            qty: 1,
            unitPrice: 150, // Default from catalog
            currency: this.defaultCurrency,
            taxable: true,
            source: 'SYSTEM'
        });

        // Add LABOR based on duration (if result available)
        if (workOrder.result?.durationMin) {
            const hours = Math.ceil(workOrder.result.durationMin / 30) * 0.5; // Round to 0.5h
            suggestedLines.push({
                id: `FEE-${Date.now()}-LABOR`,
                type: 'LABOR',
                description: `Labor (${hours}h)`,
                qty: hours,
                unitPrice: 250, // Default hourly rate
                currency: this.defaultCurrency,
                taxable: true,
                technicianId: workOrder.assignedTechnicianId || undefined,
                source: 'SYSTEM'
            });
        }

        // Add PART lines from consumption
        if (workOrder.parts) {
            workOrder.parts.forEach((part: any, idx: number) => {
                if (part.qtyConsumed && part.qtyConsumed > 0) {
                    // Get item details from inventory (simplified)
                    suggestedLines.push({
                        id: `FEE-${Date.now()}-PART-${idx}`,
                        type: 'PART',
                        refId: part.itemId,
                        description: `Part: ${part.itemId}`,
                        qty: part.qtyConsumed,
                        unitPrice: 100, // Default price (should come from inventory)
                        currency: this.defaultCurrency,
                        taxable: true,
                        source: 'SYSTEM'
                    });
                }
            });
        }

        return suggestedLines;
    }

    // Add fee line to invoice
    addFeeLine(invoiceId: string, line: FeeLine): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        invoice.feeLines.push(line);
        invoice.updatedAt = new Date().toISOString();

        this.recalculateTotals(invoice);
        this.invoicesSubject.next([...invoices]);
    }

    // Update fee line
    updateFeeLine(invoiceId: string, lineId: string, updates: Partial<FeeLine>): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        const lineIndex = invoice.feeLines.findIndex(l => l.id === lineId);
        if (lineIndex === -1) return;

        invoice.feeLines[lineIndex] = { ...invoice.feeLines[lineIndex], ...updates };
        invoice.updatedAt = new Date().toISOString();

        this.recalculateTotals(invoice);
        this.invoicesSubject.next([...invoices]);
    }

    // Remove fee line
    removeFeeLine(invoiceId: string, lineId: string): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        invoice.feeLines = invoice.feeLines.filter(l => l.id !== lineId);
        invoice.updatedAt = new Date().toISOString();

        this.recalculateTotals(invoice);
        this.invoicesSubject.next([...invoices]);
    }

    // Apply tax to invoice (create TAX line based on profile)
    applyTax(invoiceId: string, taxRatePct: number = 14): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        // Remove existing TAX lines
        invoice.feeLines = invoice.feeLines.filter(l => l.type !== 'TAX');

        // Calculate taxable subtotal
        const taxableSubtotal = invoice.feeLines
            .filter(l => l.taxable && l.type !== 'DISCOUNT' && l.type !== 'TAX')
            .reduce((sum, l) => sum + (l.qty * l.unitPrice), 0);

        // Add TAX line
        if (taxableSubtotal > 0) {
            const taxAmount = taxableSubtotal * (taxRatePct / 100);
            invoice.feeLines.push({
                id: `FEE-${Date.now()}-TAX`,
                type: 'TAX',
                description: `VAT ${taxRatePct}%`,
                qty: 1,
                unitPrice: taxAmount,
                currency: this.defaultCurrency,
                taxable: false,
                source: 'SYSTEM'
            });
        }

        invoice.updatedAt = new Date().toISOString();
        this.recalculateTotals(invoice);
        this.invoicesSubject.next([...invoices]);
    }

    // Calculate totals
    private recalculateTotals(invoice: Invoice): void {
        // Subtotal = all non-tax lines minus discounts
        invoice.subtotal = invoice.feeLines
            .filter(l => l.type !== 'TAX')
            .reduce((sum, l) => {
                const lineTotal = l.qty * l.unitPrice;
                return l.type === 'DISCOUNT' ? sum - Math.abs(lineTotal) : sum + lineTotal;
            }, 0);

        // Tax total
        invoice.taxTotal = invoice.feeLines
            .filter(l => l.type === 'TAX')
            .reduce((sum, l) => sum + (l.qty * l.unitPrice), 0);

        // Grand total
        invoice.grandTotal = invoice.subtotal + invoice.taxTotal;

        // Balance due
        const totalPaid = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);
        invoice.balanceDue = invoice.grandTotal - totalPaid;
    }

    // Compute split allocations
    computeSplits(invoiceId: string, splits: SplitEntry[]): SplitAllocation[] {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) return [];

        const allocations: SplitAllocation[] = [];
        let remaining = invoice.grandTotal;

        // Process flat amounts first
        splits.filter(s => s.flatAmount).forEach(split => {
            const amount = Math.min(split.flatAmount!, remaining);
            allocations.push({
                party: split.party,
                amount,
                accountId: split.accountId
            });
            remaining -= amount;
        });

        // Process percentages from remaining
        splits.filter(s => s.percentage).forEach(split => {
            const amount = remaining * (split.percentage! / 100);
            allocations.push({
                party: split.party,
                amount,
                accountId: split.accountId
            });
        });

        return allocations;
    }

    // Update splits
    updateSplits(invoiceId: string, splits: SplitEntry[]): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        invoice.splits = splits;
        invoice.allocations = this.computeSplits(invoiceId, splits);
        invoice.updatedAt = new Date().toISOString();

        this.invoicesSubject.next([...invoices]);
    }

    // Add payment
    addPayment(invoiceId: string, payment: PaymentRecord): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        if (!invoice.payments) {
            invoice.payments = [];
        }

        invoice.payments.push(payment);
        invoice.updatedAt = new Date().toISOString();

        this.recalculateTotals(invoice);

        // Auto-update status based on balance
        if (invoice.balanceDue <= 0) {
            invoice.status = 'PAID';
        } else if (invoice.payments.length > 0 && invoice.balanceDue > 0) {
            invoice.status = 'PARTIAL';
        }

        this.invoicesSubject.next([...invoices]);
    }

    // Update invoice status
    updateStatus(invoiceId: string, status: InvoiceStatus, reason?: string): void {
        const invoices = this.invoicesSubject.value;
        const invoice = invoices.find(inv => inv.id === invoiceId);

        if (!invoice) return;

        const now = new Date().toISOString();
        invoice.status = status;
        invoice.updatedAt = now;

        if (status === 'APPROVED' && !invoice.approvedAt) {
            invoice.approvedBy = this.currentUser;
            invoice.approvedAt = now;
        }

        if (status === 'ISSUED' && !invoice.issuedAt) {
            invoice.issuedAt = now;
        }

        if (status === 'VOID') {
            invoice.voidedAt = now;
            invoice.voidReason = reason;
        }

        this.invoicesSubject.next([...invoices]);
    }

    // Get invoice totals
    getInvoiceTotals(invoiceId: string): InvoiceTotals | null {
        const invoice = this.getInvoiceById(invoiceId);
        if (!invoice) return null;

        const totalPaid = (invoice.payments || []).reduce((sum, p) => sum + p.amount, 0);

        return {
            subtotal: invoice.subtotal,
            taxTotal: invoice.taxTotal,
            grandTotal: invoice.grandTotal,
            balanceDue: invoice.balanceDue,
            totalPaid
        };
    }

    // Seed initial invoices (will be called from seed-data.service)
    seedInvoices(invoices: Invoice[]): void {
        this.invoicesSubject.next(invoices);
    }
}
