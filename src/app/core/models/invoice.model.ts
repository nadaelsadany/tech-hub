// Financial Data Models for Accountant Partition

export type CurrencyCode = 'EGP' | 'USD' | 'EUR';

export type FeeLineType = 'VISIT' | 'LABOR' | 'PART' | 'TOOL' | 'SURCHARGE' | 'DISCOUNT' | 'TAX';

export type FeeLineSource = 'SYSTEM' | 'TECH' | 'ACCOUNTANT';

export type SplitParty = 'CUSTOMER' | 'WARRANTY' | 'COMPANY' | 'OTHER';

export type PaymentMethod = 'Cash' | 'Card' | 'ExternalPOS' | 'Warranty' | 'Transfer' | 'Other';

export type InvoiceStatus = 'DRAFT' | 'APPROVED' | 'ISSUED' | 'PAID' | 'PARTIAL' | 'VOID';

export type FinancialStatus = 'Unbilled' | 'Draft' | 'Approved' | 'Issued' | 'Paid' | 'Partial' | 'Void';

export interface FeeLine {
    id: string;
    type: FeeLineType;
    refId?: string;                 // e.g., itemId for PART/TOOL
    description: string;
    qty: number;                    // 1 for fixed fees; >=1 for parts/labor units
    unitPrice: number;              // pre-tax unit price
    currency: CurrencyCode;
    taxable: boolean;               // whether taxed
    technicianId?: string;          // attribution (esp. labor)
    source?: FeeLineSource;
}

export interface SplitEntry {
    party: SplitParty;
    percentage?: number;            // either percentage or flat
    flatAmount?: number;
    accountId?: string;             // e.g., warranty provider id
}

export interface SplitAllocation {
    party: SplitParty;
    amount: number;
    accountId?: string;
}

export interface PaymentRecord {
    id: string;
    method: PaymentMethod;
    amount: number;
    currency: CurrencyCode;
    reference?: string;
    receivedAt: string;             // ISO timestamp
    receivedBy: { id: string; name: string };
    party: SplitParty;
}

export interface Invoice {
    id: string;
    workOrderId: string;
    number: string;                 // INV-YYYYMM-#### (generate)
    status: InvoiceStatus;
    issueDate: string;              // ISO
    dueDate?: string;               // ISO
    currency: CurrencyCode;
    feeLines: FeeLine[];
    subtotal: number;               // sum of non-tax lines (minus discounts)
    taxTotal: number;               // sum of TAX lines or computed (%)
    grandTotal: number;             // subtotal + taxTotal + surcharges - discounts
    splits: SplitEntry[];           // allocation rules
    allocations?: SplitAllocation[];
    payments?: PaymentRecord[];
    balanceDue: number;             // grandTotal - sum(payments)
    notes?: string;
    createdAt: string;
    updatedAt: string;
    createdBy: { id: string; name: string };
    approvedBy?: { id: string; name: string };
    approvedAt?: string;
    issuedAt?: string;
    voidedAt?: string;
    voidReason?: string;
}

export interface FeeCatalogItem {
    id: string;
    code: string;                   // e.g., VISIT_STD, LABOR_HOUR, AC_DIAG
    label: string;
    description?: string;
    defaultUnitPrice: number;
    currency: CurrencyCode;
    unit: 'unit' | 'hour' | 'pcs';
    taxable: boolean;
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface TaxProfile {
    id: string;
    name: string;                   // e.g., VAT 14%
    code: string;                   // e.g., VAT_14
    ratePct: number;                // 14 = 14%
    inclusive: boolean;             // tax inclusive pricing?
    active: boolean;
    createdAt: string;
    updatedAt: string;
}

// Helper type for invoice totals calculation
export interface InvoiceTotals {
    subtotal: number;
    taxTotal: number;
    grandTotal: number;
    balanceDue: number;
    totalPaid: number;
}
