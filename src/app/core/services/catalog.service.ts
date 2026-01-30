import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FeeCatalogItem, TaxProfile, CurrencyCode } from '../models/invoice.model';

@Injectable({
    providedIn: 'root'
})
export class CatalogService {
    // Fee Catalog
    private feeCatalogSubject = new BehaviorSubject<FeeCatalogItem[]>([]);
    public feeCatalog$ = this.feeCatalogSubject.asObservable();

    // Tax Profiles
    private taxProfilesSubject = new BehaviorSubject<TaxProfile[]>([]);
    public taxProfiles$ = this.taxProfilesSubject.asObservable();

    constructor() {
        this.initializeDefaults();
    }

    // Initialize with default catalog items and tax profiles
    private initializeDefaults(): void {
        const now = new Date().toISOString();

        // Default fee catalog
        const defaultFees: FeeCatalogItem[] = [
            {
                id: 'FEE-CAT-001',
                code: 'VISIT_STD',
                label: 'Standard Visit Fee',
                description: 'Standard service call visit fee',
                defaultUnitPrice: 150,
                currency: 'EGP',
                unit: 'unit',
                taxable: true,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-002',
                code: 'VISIT_URGENT',
                label: 'Urgent Visit Fee',
                description: 'Urgent/emergency service call',
                defaultUnitPrice: 250,
                currency: 'EGP',
                unit: 'unit',
                taxable: true,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-003',
                code: 'LABOR_HOUR',
                label: 'Labor Per Hour',
                description: 'Standard labor rate per hour',
                defaultUnitPrice: 250,
                currency: 'EGP',
                unit: 'hour',
                taxable: true,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-004',
                code: 'LABOR_SPECIALIST',
                label: 'Specialist Labor Per Hour',
                description: 'Specialist/senior technician rate',
                defaultUnitPrice: 350,
                currency: 'EGP',
                unit: 'hour',
                taxable: true,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-005',
                code: 'AC_DIAG',
                label: 'AC Diagnostic Fee',
                description: 'Air conditioning diagnostic service',
                defaultUnitPrice: 200,
                currency: 'EGP',
                unit: 'unit',
                taxable: true,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-006',
                code: 'SURCHARGE_WEEKEND',
                label: 'Weekend Surcharge',
                description: 'Additional fee for weekend service',
                defaultUnitPrice: 100,
                currency: 'EGP',
                unit: 'unit',
                taxable: false,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'FEE-CAT-007',
                code: 'DISCOUNT_STANDARD',
                label: 'Standard Discount',
                description: 'Standard customer discount',
                defaultUnitPrice: -50,
                currency: 'EGP',
                unit: 'unit',
                taxable: false,
                active: true,
                createdAt: now,
                updatedAt: now
            }
        ];

        // Default tax profiles
        const defaultTaxProfiles: TaxProfile[] = [
            {
                id: 'TAX-001',
                name: 'VAT 14%',
                code: 'VAT_14',
                ratePct: 14,
                inclusive: false,
                active: true,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'TAX-002',
                name: 'VAT 10%',
                code: 'VAT_10',
                ratePct: 10,
                inclusive: false,
                active: false,
                createdAt: now,
                updatedAt: now
            },
            {
                id: 'TAX-003',
                name: 'No Tax',
                code: 'NO_TAX',
                ratePct: 0,
                inclusive: false,
                active: true,
                createdAt: now,
                updatedAt: now
            }
        ];

        this.feeCatalogSubject.next(defaultFees);
        this.taxProfilesSubject.next(defaultTaxProfiles);
    }

    // Fee Catalog Methods
    getFeeCatalog(): FeeCatalogItem[] {
        return this.feeCatalogSubject.value;
    }

    getActiveFees(): FeeCatalogItem[] {
        return this.feeCatalogSubject.value.filter(f => f.active);
    }

    getFeeByCode(code: string): FeeCatalogItem | undefined {
        return this.feeCatalogSubject.value.find(f => f.code === code);
    }

    addFee(fee: Omit<FeeCatalogItem, 'id' | 'createdAt' | 'updatedAt'>): void {
        const now = new Date().toISOString();
        const newFee: FeeCatalogItem = {
            ...fee,
            id: `FEE-CAT-${Date.now()}`,
            createdAt: now,
            updatedAt: now
        };

        const fees = [...this.feeCatalogSubject.value, newFee];
        this.feeCatalogSubject.next(fees);
    }

    updateFee(id: string, updates: Partial<FeeCatalogItem>): void {
        const fees = this.feeCatalogSubject.value;
        const index = fees.findIndex(f => f.id === id);

        if (index === -1) return;

        fees[index] = {
            ...fees[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.feeCatalogSubject.next([...fees]);
    }

    deactivateFee(id: string): void {
        this.updateFee(id, { active: false });
    }

    // Tax Profile Methods
    getTaxProfiles(): TaxProfile[] {
        return this.taxProfilesSubject.value;
    }

    getActiveTaxProfiles(): TaxProfile[] {
        return this.taxProfilesSubject.value.filter(t => t.active);
    }

    getTaxProfileByCode(code: string): TaxProfile | undefined {
        return this.taxProfilesSubject.value.find(t => t.code === code);
    }

    getDefaultTaxProfile(): TaxProfile | undefined {
        return this.taxProfilesSubject.value.find(t => t.code === 'VAT_14' && t.active);
    }

    addTaxProfile(profile: Omit<TaxProfile, 'id' | 'createdAt' | 'updatedAt'>): void {
        const now = new Date().toISOString();
        const newProfile: TaxProfile = {
            ...profile,
            id: `TAX-${Date.now()}`,
            createdAt: now,
            updatedAt: now
        };

        const profiles = [...this.taxProfilesSubject.value, newProfile];
        this.taxProfilesSubject.next(profiles);
    }

    updateTaxProfile(id: string, updates: Partial<TaxProfile>): void {
        const profiles = this.taxProfilesSubject.value;
        const index = profiles.findIndex(t => t.id === id);

        if (index === -1) return;

        profiles[index] = {
            ...profiles[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        this.taxProfilesSubject.next([...profiles]);
    }

    deactivateTaxProfile(id: string): void {
        this.updateTaxProfile(id, { active: false });
    }
}
