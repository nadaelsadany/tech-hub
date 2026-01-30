import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Item, UoM } from '../models/inventory.model';

@Injectable({
    providedIn: 'root'
})
export class ItemService {
    private itemsSubject = new BehaviorSubject<Item[]>([]);
    items$ = this.itemsSubject.asObservable();

    constructor() {
        this.initSeedData();
    }

    private initSeedData() {
        const now = new Date().toISOString();
        const seedItems: Item[] = [
            {
                id: 'ITEM-001', sku: 'FLT-001', name: 'Air Filter (Standard)', uom: 'pcs',
                category: 'Filters', reorderPoint: 10, reorderQty: 25, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-002', sku: 'CAP-001', name: 'AC Capacitor 35μF', uom: 'pcs',
                category: 'Electrical', reorderPoint: 5, reorderQty: 10, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-003', sku: 'CMP-001', name: 'Scroll Compressor 3-Ton', uom: 'unit',
                category: 'Compressors', reorderPoint: 2, reorderQty: 3, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-004', sku: 'COP-001', name: 'Copper Pipe 3/8"', uom: 'pcs',
                category: 'Piping', reorderPoint: 20, reorderQty: 50, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-005', sku: 'VLV-001', name: 'Expansion Valve', uom: 'pcs',
                category: 'Valves', reorderPoint: 5, reorderQty: 10, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-006', sku: 'THR-001', name: 'Digital Thermostat', uom: 'pcs',
                category: 'Controls', reorderPoint: 8, reorderQty: 15, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-007', sku: 'REF-001', name: 'R-410A Refrigerant', uom: 'unit',
                category: 'Refrigerants', reorderPoint: 10, reorderQty: 20, active: true, createdAt: now, updatedAt: now
            },
            {
                id: 'ITEM-008', sku: 'FAN-001', name: 'Blower Motor 1/2HP', uom: 'unit',
                category: 'Motors', reorderPoint: 3, reorderQty: 5, active: true, createdAt: now, updatedAt: now
            }
        ];
        this.itemsSubject.next(seedItems);
    }

    getAll(): Item[] {
        return this.itemsSubject.value;
    }

    getById(id: string): Item | undefined {
        return this.itemsSubject.value.find(i => i.id === id);
    }

    getBySku(sku: string): Item | undefined {
        return this.itemsSubject.value.find(i => i.sku === sku);
    }

    search(query: string): Item[] {
        const q = query.toLowerCase();
        return this.itemsSubject.value.filter(i =>
            i.sku.toLowerCase().includes(q) ||
            i.name.toLowerCase().includes(q) ||
            (i.category && i.category.toLowerCase().includes(q))
        );
    }

    create(data: Omit<Item, 'id' | 'createdAt' | 'updatedAt'>): Item {
        const now = new Date().toISOString();
        const newItem: Item = {
            ...data,
            id: 'ITEM-' + Math.random().toString(36).substr(2, 6).toUpperCase(),
            createdAt: now,
            updatedAt: now
        };
        const current = this.itemsSubject.value;
        this.itemsSubject.next([...current, newItem]);
        return newItem;
    }

    update(id: string, patch: Partial<Item>): Item | undefined {
        const current = this.itemsSubject.value;
        const index = current.findIndex(i => i.id === id);
        if (index === -1) return undefined;

        const updated: Item = {
            ...current[index],
            ...patch,
            updatedAt: new Date().toISOString()
        };
        current[index] = updated;
        this.itemsSubject.next([...current]);
        return updated;
    }

    getByCategory(category: string): Item[] {
        return this.itemsSubject.value.filter(i => i.category === category);
    }

    getCategories(): string[] {
        const categories = new Set<string>();
        this.itemsSubject.value.forEach(i => {
            if (i.category) categories.add(i.category);
        });
        return Array.from(categories);
    }
}
