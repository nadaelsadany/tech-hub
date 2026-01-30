import { Address } from './work-order.model';

export type CustomerId = string;

export interface Customer {
    id: CustomerId;
    name: string;
    phone: string;               // normalized (e.g., +201001234567)
    email?: string;
    unit?: string;               // Apt/Unit
    defaultAddress?: Address;    // preferred address
    addresses?: Address[];       // past addresses
    tags?: string[];             // VIP, Warranty, etc.
    notes?: string;              // free text
    createdAt: string;           // ISO
    updatedAt: string;           // ISO
    lastOrderAt?: string;        // ISO (computed)
}

export interface CustomerSearchParams {
    phone?: string;
    name?: string;
    email?: string;
}
