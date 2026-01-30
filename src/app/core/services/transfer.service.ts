import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Transfer, TransferLine, TransferStatus } from '../models/inventory.model';
import { InventoryService } from './inventory.service';
import { LocationService } from './location.service';

@Injectable({
    providedIn: 'root'
})
export class TransferService {
    private transfersSubject = new BehaviorSubject<Transfer[]>([]);
    transfers$ = this.transfersSubject.asObservable();

    constructor(
        private inventoryService: InventoryService,
        private locationService: LocationService
    ) {
        this.initSeedData();
    }

    private initSeedData() {
        const now = new Date().toISOString();
        const seedTransfers: Transfer[] = [
            {
                id: 'TRF-001',
                fromLocationId: 'LOC-WH-001',
                toLocationId: 'LOC-TRUCK-001',
                status: 'PICKING',
                lines: [
                    { itemId: 'ITEM-003', qty: 1 },
                    { itemId: 'ITEM-007', qty: 5 }
                ],
                createdAt: now,
                updatedAt: now
            }
        ];
        this.transfersSubject.next(seedTransfers);
    }

    private generateId(): string {
        return 'TRF-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    getAll(): Transfer[] {
        return this.transfersSubject.value;
    }

    getById(id: string): Transfer | undefined {
        return this.transfersSubject.value.find(t => t.id === id);
    }

    getByStatus(status: TransferStatus): Transfer[] {
        return this.transfersSubject.value.filter(t => t.status === status);
    }

    getOpenTransfers(): Transfer[] {
        return this.transfersSubject.value.filter(t => !['RECEIVED', 'CANCELLED'].includes(t.status));
    }

    create(fromLocationId: string, toLocationId: string, lines: TransferLine[], workOrderId?: string): Transfer {
        const now = new Date().toISOString();
        const transfer: Transfer = {
            id: this.generateId(),
            fromLocationId,
            toLocationId,
            status: 'DRAFT',
            lines,
            relatedWorkOrderId: workOrderId,
            createdAt: now,
            updatedAt: now
        };
        this.transfersSubject.next([...this.transfersSubject.value, transfer]);
        return transfer;
    }

    updateStatus(id: string, status: TransferStatus): Transfer | undefined {
        const current = this.transfersSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index === -1) return undefined;

        current[index] = {
            ...current[index],
            status,
            updatedAt: new Date().toISOString()
        };
        this.transfersSubject.next([...current]);
        return current[index];
    }

    startPicking(id: string): Transfer | undefined {
        return this.updateStatus(id, 'PICKING');
    }

    ship(id: string): Transfer | undefined {
        const transfer = this.getById(id);
        if (!transfer || transfer.status !== 'PICKING') return undefined;

        // Reserve stock at source (mark as in-transit)
        transfer.lines.forEach(line => {
            this.inventoryService.postTransaction({
                type: 'TRANSFER_OUT',
                itemId: line.itemId,
                qty: line.qty,
                fromLocationId: transfer.fromLocationId,
                toLocationId: transfer.toLocationId,
                reason: `Transfer ${id} shipped`
            });
        });

        return this.updateStatus(id, 'SHIPPED');
    }

    receive(id: string): Transfer | undefined {
        const transfer = this.getById(id);
        if (!transfer || transfer.status !== 'SHIPPED') return undefined;

        // Add stock at destination
        transfer.lines.forEach(line => {
            this.inventoryService.postTransaction({
                type: 'TRANSFER_IN',
                itemId: line.itemId,
                qty: line.qty,
                fromLocationId: transfer.fromLocationId,
                toLocationId: transfer.toLocationId,
                reason: `Transfer ${id} received`
            });
        });

        return this.updateStatus(id, 'RECEIVED');
    }

    cancel(id: string): Transfer | undefined {
        const transfer = this.getById(id);
        if (!transfer || ['RECEIVED', 'CANCELLED'].includes(transfer.status)) return undefined;

        // If shipped, need to reverse
        if (transfer.status === 'SHIPPED') {
            transfer.lines.forEach(line => {
                this.inventoryService.postTransaction({
                    type: 'ADJUST',
                    itemId: line.itemId,
                    qty: line.qty,
                    fromLocationId: transfer.fromLocationId,
                    reason: `Transfer ${id} cancelled - reversing`
                });
            });
        }

        return this.updateStatus(id, 'CANCELLED');
    }

    addLine(id: string, itemId: string, qty: number): Transfer | undefined {
        const current = this.transfersSubject.value;
        const index = current.findIndex(t => t.id === id);
        if (index === -1 || current[index].status !== 'DRAFT') return undefined;

        current[index].lines.push({ itemId, qty });
        current[index].updatedAt = new Date().toISOString();
        this.transfersSubject.next([...current]);
        return current[index];
    }
}
