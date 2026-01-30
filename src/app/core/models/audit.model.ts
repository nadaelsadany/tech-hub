export type ReasonCode =
    | 'Reschedule-CustomerRequest'
    | 'Reschedule-TechnicianDelay'
    | 'Reschedule-PartsUnavailable'
    | 'Reassign-Capacity'
    | 'Reassign-SkillMismatch'
    | 'NoShow-Customer'
    | 'Warranty-NotCovered'
    | 'Other';

export interface Actor {
    id: string;
    name: string;
    role: string;
}

export interface StatusEvent {
    id: string;
    workOrderId: string;
    fromStatus?: string | null;
    toStatus: string;
    at: string;
    by: Actor;
    reason?: ReasonCode;
    note?: string;
}

export interface ChangeEntry {
    id: string;
    workOrderId: string;
    field: string;
    from?: any;
    to?: any;
    at: string;
    by: Actor;
    reason?: ReasonCode;
    note?: string;
}

export type ResolutionCode = 'Fixed' | 'TemporaryFix' | 'NotResolved' | 'InspectionOnly' | 'Cancelled';

export interface PartUsed {
    partNo: string;
    name: string;
    qty: number;
}

export interface WorkResult {
    summary: string;
    resolutionCode: ResolutionCode;
    durationMin?: number;
    partsUsed?: PartUsed[];
    photos?: { name: string; url: string }[];
    customerSignature?: { name: string; ts: string; imageUrl?: string };
    technicianNote?: string;
    charges?: {
        warrantyCovered?: number;
        customerCharge?: number;
        total?: number;
        currency?: string;
    };
}

export const REASON_CODE_LABELS: Record<ReasonCode, string> = {
    'Reschedule-CustomerRequest': 'Reschedule - Customer Request',
    'Reschedule-TechnicianDelay': 'Reschedule - Technician Delay',
    'Reschedule-PartsUnavailable': 'Reschedule - Parts Unavailable',
    'Reassign-Capacity': 'Reassign - Capacity Issue',
    'Reassign-SkillMismatch': 'Reassign - Skill Mismatch',
    'NoShow-Customer': 'No-Show - Customer',
    'Warranty-NotCovered': 'Warranty - Not Covered',
    'Other': 'Other'
};

export const RESOLUTION_CODE_LABELS: Record<ResolutionCode, string> = {
    'Fixed': 'Fixed',
    'TemporaryFix': 'Temporary Fix',
    'NotResolved': 'Not Resolved',
    'InspectionOnly': 'Inspection Only',
    'Cancelled': 'Cancelled'
};
