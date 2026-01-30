import { StatusEvent, ChangeEntry, WorkResult } from './audit.model';
import { FinancialStatus } from './invoice.model';

export type WorkOrderStatus =
  | 'New'
  | 'Ready'
  | 'Assigned'
  | 'EnRoute'
  | 'OnSite'
  | 'Completed'
  | 'OnHold'
  | 'Cancelled';

export type WorkOrderPriority = 'Low' | 'Normal' | 'High' | 'Urgent';

export interface TimeWindow {
  start: string;
  end: string;
}

export interface Customer {
  name: string;
  phone?: string;
  email?: string;
  unit?: string;
}

export interface Address {
  line1: string;
  city?: string;
  lat: number;
  lng: number;
}

export interface WorkOrderPart {
  itemId: string;
  qtyRequested: number;
  qtyReserved?: number;
  qtyConsumed?: number;
  fromLocationId?: string;
  notes?: string;
}

export interface WorkOrder {
  id: string;
  number: string;
  siteId: string;
  customerId?: string;  // Link to CRM
  category: string;
  priority: WorkOrderPriority;
  warranty: boolean;
  status: WorkOrderStatus;
  customer: Customer;  // Denormalized snapshot
  address: Address;
  notes?: string;
  attachments?: { name: string; url: string }[];
  assignedTechnicianId?: string | null;
  scheduledStartAt?: string | null;
  etaMin?: number | null;
  distanceKm?: number | null;
  createdAt: string;
  finance?: {
    paymentSplitSchemeId?: string | null;
    readOnly?: boolean;
  };
  // Planning extensions
  serviceTimeMin?: number;
  timeWindow?: TimeWindow | null;
  lockedInPlan?: boolean;
  // Result & Audit
  result?: WorkResult | null;
  statusHistory?: StatusEvent[];
  changeLog?: ChangeEntry[];
  // Parts / Inventory
  parts?: WorkOrderPart[];
  // Supervisor Review (linked after completion)
  completedAt?: string;                     // ISO timestamp when status→Completed
  supervisorReviewId?: string | null;       // Link to SupervisorReview
  supervisorReviewOutcome?: string | null;  // ReviewOutcome type
  supervisorReviewedAt?: string | null;     // ISO timestamp

  // Financial (Accounting integration)
  invoiceId?: string | null;
  financialStatus?: FinancialStatus;
}

