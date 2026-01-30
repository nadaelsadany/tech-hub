import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StockLocation, LocationType } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class LocationService {
    private locationsSubject = new BehaviorSubject<StockLocation[]>([]);
    locations$ = this.locationsSubject.asObservable();

    constructor() {
        this.initSeedData();
    }

    private initSeedData() {
        const seedLocations: StockLocation[] = [
            {
                id: 'LOC-WH-001',
                name: 'Main Warehouse - Sunny Site',
                type: 'WAREHOUSE',
                siteId: 'SITE-001',
                address: '100 Industrial Blvd',
                active: true
            },
            {
                id: 'LOC-WH-002',
                name: 'Secondary Warehouse',
                type: 'WAREHOUSE',
                siteId: 'SITE-001',
                address: '200 Storage Ave',
                active: true
            },
            {
                id: 'LOC-TRUCK-001',
                name: 'Truck - TECH-01',
                type: 'TRUCK',
                technicianId: 'TECH-01',
                siteId: 'SITE-001',
                active: true
            },
            {
                id: 'LOC-TRUCK-002',
                name: 'Truck - TECH-02',
                type: 'TRUCK',
                technicianId: 'TECH-02',
                siteId: 'SITE-001',
                active: true
            },
            {
                id: 'LOC-TRUCK-003',
                name: 'Truck - TECH-03',
                type: 'TRUCK',
                technicianId: 'TECH-03',
                siteId: 'SITE-001',
                active: true
            }
        ];
        this.locationsSubject.next(seedLocations);
    }

    getAll(): StockLocation[] {
        return this.locationsSubject.value;
    }

    getById(id: string): StockLocation | undefined {
        return this.locationsSubject.value.find(l => l.id === id);
    }

    getByType(type: LocationType): StockLocation[] {
        return this.locationsSubject.value.filter(l => l.type === type);
    }

    getWarehouses(): StockLocation[] {
        return this.getByType('WAREHOUSE');
    }

    getTrucks(): StockLocation[] {
        return this.getByType('TRUCK');
    }

    getTruckForTechnician(technicianId: string): StockLocation | undefined {
        return this.locationsSubject.value.find(l => l.type === 'TRUCK' && l.technicianId === technicianId);
    }

    getWarehousesForSite(siteId: string): StockLocation[] {
        return this.locationsSubject.value.filter(l => l.type === 'WAREHOUSE' && l.siteId === siteId);
    }

    getTrucksForSite(siteId: string): StockLocation[] {
        return this.locationsSubject.value.filter(l => l.type === 'TRUCK' && l.siteId === siteId);
    }

    create(data: Omit<StockLocation, 'id'>): StockLocation {
        const newLoc: StockLocation = {
            ...data,
            id: 'LOC-' + Math.random().toString(36).substr(2, 6).toUpperCase()
        };
        const current = this.locationsSubject.value;
        this.locationsSubject.next([...current, newLoc]);
        return newLoc;
    }

    update(id: string, patch: Partial<StockLocation>): StockLocation | undefined {
        const current = this.locationsSubject.value;
        const index = current.findIndex(l => l.id === id);
        if (index === -1) return undefined;

        current[index] = { ...current[index], ...patch };
        this.locationsSubject.next([...current]);
        return current[index];
    }
}
