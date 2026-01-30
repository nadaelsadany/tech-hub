import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest, map } from 'rxjs';
import {
    InventoryBalance,
    InventoryTransaction,
    InventoryTxnType,
    Item,
    StockLocation
} from '../models/inventory.model';
import { ItemService } from './item.service';
import { LocationService } from './location.service';

const CURRENT_USER = { id: 'USER-001', name: 'Admin' };

@Injectable({
    providedIn: 'root'
})
export class InventoryService {
    private balancesSubject = new BehaviorSubject<InventoryBalance[]>([]);
    balances$ = this.balancesSubject.asObservable();

    private transactionsSubject = new BehaviorSubject<InventoryTransaction[]>([]);
    transactions$ = this.transactionsSubject.asObservable();

    constructor(
        private itemService: ItemService,
        private locationService: LocationService
    ) {
        this.initSeedBalances();
    }

    private initSeedBalances() {
        const now = new Date().toISOString();
        const items = this.itemService.getAll();
        const locations = this.locationService.getAll();

        const balances: InventoryBalance[] = [];

        // Main Warehouse - high stock
        const mainWh = locations.find(l => l.id === 'LOC-WH-001');
        if (mainWh) {
            items.forEach(item => {
                balances.push({
                    locationId: mainWh.id,
                    itemId: item.id,
                    onHand: 50 + Math.floor(Math.random() * 50),
                    reserved: 0,
                    available: 0,
                    updatedAt: now
                });
            });
        }

        // Truck TECH-01 - small quantities
        const truck1 = locations.find(l => l.id === 'LOC-TRUCK-001');
        if (truck1) {
            balances.push(
                { locationId: truck1.id, itemId: 'ITEM-001', onHand: 5, reserved: 0, available: 0, updatedAt: now },
                { locationId: truck1.id, itemId: 'ITEM-002', onHand: 3, reserved: 0, available: 0, updatedAt: now },
                { locationId: truck1.id, itemId: 'ITEM-004', onHand: 10, reserved: 0, available: 0, updatedAt: now },
                { locationId: truck1.id, itemId: 'ITEM-006', onHand: 2, reserved: 0, available: 0, updatedAt: now }
            );
        }

        // Truck TECH-02 - small quantities
        const truck2 = locations.find(l => l.id === 'LOC-TRUCK-002');
        if (truck2) {
            balances.push(
                { locationId: truck2.id, itemId: 'ITEM-001', onHand: 3, reserved: 0, available: 0, updatedAt: now },
                { locationId: truck2.id, itemId: 'ITEM-005', onHand: 2, reserved: 0, available: 0, updatedAt: now },
                { locationId: truck2.id, itemId: 'ITEM-007', onHand: 4, reserved: 0, available: 0, updatedAt: now }
            );
        }

        // Compute available
        balances.forEach(b => b.available = b.onHand - b.reserved);

        this.balancesSubject.next(balances);
    }

    private generateId(): string {
        return Math.random().toString(36).substr(2, 9);
    }

    // Balance operations
    getBalance(locationId: string, itemId: string): InventoryBalance | undefined {
        return this.balancesSubject.value.find(b => b.locationId === locationId && b.itemId === itemId);
    }

    getBalancesForLocation(locationId: string): InventoryBalance[] {
        return this.balancesSubject.value.filter(b => b.locationId === locationId);
    }

    getBalancesForItem(itemId: string): InventoryBalance[] {
        return this.balancesSubject.value.filter(b => b.itemId === itemId);
    }

    ensureBalance(locationId: string, itemId: string): InventoryBalance {
        let balance = this.getBalance(locationId, itemId);
        if (!balance) {
            balance = {
                locationId,
                itemId,
                onHand: 0,
                reserved: 0,
                available: 0,
                updatedAt: new Date().toISOString()
            };
            this.balancesSubject.next([...this.balancesSubject.value, balance]);
        }
        return balance;
    }

    private updateBalance(locationId: string, itemId: string, changes: Partial<InventoryBalance>) {
        const current = this.balancesSubject.value;
        const index = current.findIndex(b => b.locationId === locationId && b.itemId === itemId);

        if (index >= 0) {
            const updated = {
                ...current[index],
                ...changes,
                updatedAt: new Date().toISOString()
            };
            updated.available = updated.onHand - updated.reserved;
            current[index] = updated;
            this.balancesSubject.next([...current]);
        }
    }

    // Transaction posting
    postTransaction(txn: Omit<InventoryTransaction, 'id' | 'createdAt' | 'createdBy'>): InventoryTransaction {
        const fullTxn: InventoryTransaction = {
            ...txn,
            id: 'TXN-' + this.generateId(),
            createdAt: new Date().toISOString(),
            createdBy: CURRENT_USER
        };

        // Update balances based on transaction type
        switch (txn.type) {
            case 'RECEIVE':
                if (txn.toLocationId) {
                    this.ensureBalance(txn.toLocationId, txn.itemId);
                    const bal = this.getBalance(txn.toLocationId, txn.itemId)!;
                    this.updateBalance(txn.toLocationId, txn.itemId, { onHand: bal.onHand + txn.qty });
                }
                break;

            case 'TRANSFER_OUT':
                if (txn.fromLocationId) {
                    const bal = this.getBalance(txn.fromLocationId, txn.itemId);
                    if (bal) {
                        this.updateBalance(txn.fromLocationId, txn.itemId, { onHand: bal.onHand - txn.qty });
                    }
                }
                break;

            case 'TRANSFER_IN':
                if (txn.toLocationId) {
                    this.ensureBalance(txn.toLocationId, txn.itemId);
                    const bal = this.getBalance(txn.toLocationId, txn.itemId)!;
                    this.updateBalance(txn.toLocationId, txn.itemId, { onHand: bal.onHand + txn.qty });
                }
                break;

            case 'ISSUE_TO_ORDER':
                if (txn.fromLocationId) {
                    const bal = this.getBalance(txn.fromLocationId, txn.itemId);
                    if (bal) {
                        this.updateBalance(txn.fromLocationId, txn.itemId, {
                            onHand: bal.onHand - txn.qty,
                            reserved: Math.max(0, bal.reserved - txn.qty)
                        });
                    }
                }
                break;

            case 'RETURN_FROM_ORDER':
                if (txn.toLocationId) {
                    this.ensureBalance(txn.toLocationId, txn.itemId);
                    const bal = this.getBalance(txn.toLocationId, txn.itemId)!;
                    this.updateBalance(txn.toLocationId, txn.itemId, { onHand: bal.onHand + txn.qty });
                }
                break;

            case 'ADJUST':
                if (txn.fromLocationId) {
                    const bal = this.getBalance(txn.fromLocationId, txn.itemId);
                    if (bal) {
                        this.updateBalance(txn.fromLocationId, txn.itemId, { onHand: bal.onHand + txn.qty });
                    }
                }
                break;
        }

        const currentTxns = this.transactionsSubject.value;
        this.transactionsSubject.next([...currentTxns, fullTxn]);

        return fullTxn;
    }

    // Reserve stock
    reserveStock(locationId: string, itemId: string, qty: number): boolean {
        const balance = this.getBalance(locationId, itemId);
        if (!balance || balance.available < qty) {
            return false;
        }
        this.updateBalance(locationId, itemId, { reserved: balance.reserved + qty });
        return true;
    }

    // Release reserved stock
    releaseReserved(locationId: string, itemId: string, qty: number): boolean {
        const balance = this.getBalance(locationId, itemId);
        if (!balance) return false;
        this.updateBalance(locationId, itemId, { reserved: Math.max(0, balance.reserved - qty) });
        return true;
    }

    // Adjust stock
    adjustStock(locationId: string, itemId: string, qty: number, reason: string) {
        this.ensureBalance(locationId, itemId);
        this.postTransaction({
            type: 'ADJUST',
            itemId,
            qty,
            fromLocationId: locationId,
            reason
        });
    }

    // Low stock check
    getLowStockItems(): { item: Item; location: StockLocation; balance: InventoryBalance }[] {
        const result: { item: Item; location: StockLocation; balance: InventoryBalance }[] = [];

        this.balancesSubject.value.forEach(balance => {
            const item = this.itemService.getById(balance.itemId);
            const location = this.locationService.getById(balance.locationId);

            if (item && location && item.reorderPoint && balance.available <= item.reorderPoint) {
                result.push({ item, location, balance });
            }
        });

        return result;
    }

    // Get total available across all locations
    getTotalAvailable(itemId: string): number {
        return this.balancesSubject.value
            .filter(b => b.itemId === itemId)
            .reduce((sum, b) => sum + b.available, 0);
    }

    // Find best location for item
    findBestLocation(itemId: string, qty: number, preferredLocationId?: string): StockLocation | undefined {
        const balances = this.getBalancesForItem(itemId).filter(b => b.available >= qty);

        if (preferredLocationId) {
            const preferred = balances.find(b => b.locationId === preferredLocationId);
            if (preferred) {
                return this.locationService.getById(preferred.locationId);
            }
        }

        // First try trucks, then warehouses
        const trucks = balances.filter(b => {
            const loc = this.locationService.getById(b.locationId);
            return loc?.type === 'TRUCK';
        });

        if (trucks.length > 0) {
            return this.locationService.getById(trucks[0].locationId);
        }

        const warehouses = balances.filter(b => {
            const loc = this.locationService.getById(b.locationId);
            return loc?.type === 'WAREHOUSE';
        });

        if (warehouses.length > 0) {
            return this.locationService.getById(warehouses[0].locationId);
        }

        return undefined;
    }
}
