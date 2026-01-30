import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Customer, CustomerId, CustomerSearchParams } from '../models/customer.model';
import { Address } from '../models/work-order.model';
import { normalizePhone, phoneMatch, nameMatch } from '../utils/phone.utils';

@Injectable({
    providedIn: 'root'
})
export class CustomerService {
    private customersSubject = new BehaviorSubject<Customer[]>([]);
    customers$ = this.customersSubject.asObservable();

    constructor() {
        this.initSeedData();
    }

    private initSeedData() {
        const now = new Date().toISOString();
        const seedCustomers: Customer[] = [
            {
                id: 'CUST-001',
                name: 'John Doe',
                phone: '+201001234567',
                email: 'john.doe@example.com',
                unit: 'Apt 4B',
                defaultAddress: { line1: '123 Broadway', city: 'New York', lat: 40.7130, lng: -74.0050 },
                addresses: [
                    { line1: '123 Broadway', city: 'New York', lat: 40.7130, lng: -74.0050 },
                    { line1: '456 Park Ave', city: 'New York', lat: 40.7620, lng: -73.9730 }
                ],
                tags: ['VIP', 'Warranty'],
                notes: 'Preferred morning appointments',
                createdAt: '2025-06-15T10:00:00Z',
                updatedAt: now,
                lastOrderAt: '2026-01-24T10:00:00Z'
            },
            {
                id: 'CUST-002',
                name: 'Jane Smith',
                phone: '+15551234567',
                email: 'jane.smith@example.com',
                defaultAddress: { line1: '456 5th Ave', city: 'New York', lat: 40.7484, lng: -73.9857 },
                addresses: [
                    { line1: '456 5th Ave', city: 'New York', lat: 40.7484, lng: -73.9857 }
                ],
                createdAt: '2025-08-20T14:30:00Z',
                updatedAt: now
            },
            {
                id: 'CUST-003',
                name: 'Mike Wilson',
                phone: '+201009876543',
                email: 'mike.w@example.com',
                unit: 'Suite 102',
                defaultAddress: { line1: '789 Park Ave', city: 'New York', lat: 40.7614, lng: -73.9776 },
                addresses: [
                    { line1: '789 Park Ave', city: 'New York', lat: 40.7614, lng: -73.9776 },
                    { line1: '111 Madison Ave', city: 'New York', lat: 40.7450, lng: -73.9840 }
                ],
                tags: ['Warranty'],
                createdAt: '2025-09-10T09:00:00Z',
                updatedAt: now,
                lastOrderAt: '2026-01-20T14:00:00Z'
            },
            {
                id: 'CUST-004',
                name: 'Sarah Brown',
                phone: '+201001234567', // Same phone as John Doe - for testing multiple matches
                email: 'sarah.b@example.com',
                defaultAddress: { line1: '321 Wall St', city: 'New York', lat: 40.7074, lng: -74.0113 },
                addresses: [
                    { line1: '321 Wall St', city: 'New York', lat: 40.7074, lng: -74.0113 }
                ],
                createdAt: '2025-11-05T11:00:00Z',
                updatedAt: now
            },
            {
                id: 'CUST-005',
                name: 'David Lee',
                phone: '+15559876543',
                email: 'david.lee@example.com',
                unit: 'Floor 5',
                defaultAddress: { line1: '555 Lexington Ave', city: 'New York', lat: 40.7550, lng: -73.9730 },
                createdAt: '2025-12-01T16:00:00Z',
                updatedAt: now
            }
        ];
        this.customersSubject.next(seedCustomers);
    }

    /**
     * Search customers by phone, name, or email
     */
    search(params: CustomerSearchParams): Observable<Customer[]> {
        return this.customers$.pipe(
            map(customers => {
                let results = customers;

                if (params.phone) {
                    const normalizedSearch = normalizePhone(params.phone);
                    results = results.filter(c => phoneMatch(c.phone, normalizedSearch));
                }

                if (params.name) {
                    results = results.filter(c => nameMatch(c.name, params.name!));
                }

                if (params.email) {
                    results = results.filter(c =>
                        c.email && c.email.toLowerCase().includes(params.email!.toLowerCase())
                    );
                }

                return results;
            })
        );
    }

    /**
     * Search by phone only (convenience method for auto-complete)
     */
    searchByPhone(phone: string): Customer[] {
        if (!phone || phone.length < 7) return [];
        const normalized = normalizePhone(phone);
        return this.customersSubject.value.filter(c => phoneMatch(c.phone, normalized));
    }

    /**
     * Get customer by ID
     */
    getById(id: CustomerId): Customer | undefined {
        return this.customersSubject.value.find(c => c.id === id);
    }

    /**
     * Create a new customer
     */
    create(data: Omit<Customer, 'id' | 'createdAt' | 'updatedAt'>): Customer {
        const now = new Date().toISOString();
        const newCustomer: Customer = {
            ...data,
            id: 'CUST-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            phone: normalizePhone(data.phone),
            createdAt: now,
            updatedAt: now
        };
        const current = this.customersSubject.value;
        this.customersSubject.next([...current, newCustomer]);
        return newCustomer;
    }

    /**
     * Update a customer
     */
    update(id: CustomerId, patch: Partial<Customer>): Customer | undefined {
        const current = this.customersSubject.value;
        const index = current.findIndex(c => c.id === id);
        if (index === -1) return undefined;

        const updated: Customer = {
            ...current[index],
            ...patch,
            updatedAt: new Date().toISOString()
        };
        if (patch.phone) {
            updated.phone = normalizePhone(patch.phone);
        }
        current[index] = updated;
        this.customersSubject.next([...current]);
        return updated;
    }

    /**
     * Update customer's lastOrderAt
     */
    updateLastOrderAt(id: CustomerId) {
        this.update(id, { lastOrderAt: new Date().toISOString() });
    }

    /**
     * Add address to customer if unique
     */
    addAddress(id: CustomerId, address: Address) {
        const customer = this.getById(id);
        if (!customer) return;

        const existingAddresses = customer.addresses || [];
        const isDuplicate = existingAddresses.some(a =>
            Math.abs(a.lat - address.lat) < 0.0001 && Math.abs(a.lng - address.lng) < 0.0001
        );

        if (!isDuplicate) {
            this.update(id, {
                addresses: [...existingAddresses, address]
            });
        }
    }

    /**
     * Upsert from order form - find by phone or create new
     */
    upsertFromOrderForm(formValues: {
        phone: string;
        name: string;
        email?: string;
        unit?: string;
        address: Address;
    }): { customerId: CustomerId; customer: Customer; isNew: boolean } {
        const matches = this.searchByPhone(formValues.phone);

        if (matches.length === 1) {
            // Single match - use existing
            const customer = matches[0];
            this.addAddress(customer.id, formValues.address);
            return { customerId: customer.id, customer, isNew: false };
        }

        // Create new customer
        const newCustomer = this.create({
            name: formValues.name,
            phone: formValues.phone,
            email: formValues.email,
            unit: formValues.unit,
            defaultAddress: formValues.address,
            addresses: [formValues.address]
        });
        return { customerId: newCustomer.id, customer: newCustomer, isNew: true };
    }

    /**
     * Merge two customers (MVP: prefer master for conflicts)
     */
    merge(
        masterId: CustomerId,
        duplicateId: CustomerId,
        manualResolution?: Partial<Customer>
    ): Customer | undefined {
        const master = this.getById(masterId);
        const duplicate = this.getById(duplicateId);
        if (!master || !duplicate) return undefined;

        // Merge addresses
        const allAddresses = [
            ...(master.addresses || []),
            ...(duplicate.addresses || [])
        ];
        const uniqueAddresses = allAddresses.filter((addr, idx, arr) =>
            arr.findIndex(a =>
                Math.abs(a.lat - addr.lat) < 0.0001 && Math.abs(a.lng - addr.lng) < 0.0001
            ) === idx
        );

        // Merge tags
        const allTags = [...new Set([...(master.tags || []), ...(duplicate.tags || [])])];

        // Merge notes
        const mergedNotes = [master.notes, duplicate.notes].filter(Boolean).join('\n---\n');

        // Apply manual resolution or prefer master
        const merged: Partial<Customer> = {
            name: manualResolution?.name || master.name,
            phone: manualResolution?.phone || master.phone,
            email: manualResolution?.email || master.email || duplicate.email,
            unit: manualResolution?.unit || master.unit || duplicate.unit,
            defaultAddress: master.defaultAddress || duplicate.defaultAddress,
            addresses: uniqueAddresses,
            tags: allTags,
            notes: mergedNotes,
            lastOrderAt: master.lastOrderAt || duplicate.lastOrderAt
        };

        // Update master
        this.update(masterId, merged);

        // Remove duplicate
        const current = this.customersSubject.value.filter(c => c.id !== duplicateId);
        this.customersSubject.next(current);

        return this.getById(masterId);
    }

    /**
     * Get all customers
     */
    getAll(): Customer[] {
        return this.customersSubject.value;
    }
}
