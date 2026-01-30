import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Reservation, ReservationStatus } from '../models/inventory.model';
import { InventoryService } from './inventory.service';

@Injectable({
    providedIn: 'root'
})
export class ReservationService {
    private reservationsSubject = new BehaviorSubject<Reservation[]>([]);
    reservations$ = this.reservationsSubject.asObservable();

    constructor(private inventoryService: InventoryService) { }

    private generateId(): string {
        return 'RES-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    getAll(): Reservation[] {
        return this.reservationsSubject.value;
    }

    getById(id: string): Reservation | undefined {
        return this.reservationsSubject.value.find(r => r.id === id);
    }

    getByWorkOrder(workOrderId: string): Reservation[] {
        return this.reservationsSubject.value.filter(r => r.workOrderId === workOrderId);
    }

    getByStatus(status: ReservationStatus): Reservation[] {
        return this.reservationsSubject.value.filter(r => r.status === status);
    }

    getBackorderedReservations(): Reservation[] {
        return this.getByStatus('BACKORDERED');
    }

    reserve(workOrderId: string, itemId: string, locationId: string, qty: number): Reservation | null {
        // Try to reserve stock
        const success = this.inventoryService.reserveStock(locationId, itemId, qty);
        if (!success) {
            return null;
        }

        const reservation: Reservation = {
            id: this.generateId(),
            workOrderId,
            itemId,
            locationId,
            qty,
            status: 'RESERVED',
            createdAt: new Date().toISOString()
        };

        this.reservationsSubject.next([...this.reservationsSubject.value, reservation]);
        return reservation;
    }

    createBackorder(workOrderId: string, itemId: string, locationId: string, qty: number): Reservation {
        const reservation: Reservation = {
            id: this.generateId(),
            workOrderId,
            itemId,
            locationId,
            qty,
            status: 'BACKORDERED',
            createdAt: new Date().toISOString()
        };

        this.reservationsSubject.next([...this.reservationsSubject.value, reservation]);
        return reservation;
    }

    release(id: string): boolean {
        const current = this.reservationsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index === -1) return false;

        const res = current[index];
        if (res.status !== 'RESERVED') return false;

        // Release the reserved stock
        this.inventoryService.releaseReserved(res.locationId, res.itemId, res.qty);

        current[index] = { ...res, status: 'RELEASED' };
        this.reservationsSubject.next([...current]);
        return true;
    }

    consume(id: string, workOrderId: string): boolean {
        const current = this.reservationsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index === -1) return false;

        const res = current[index];
        if (res.status !== 'RESERVED') return false;

        // Post issue transaction
        this.inventoryService.postTransaction({
            type: 'ISSUE_TO_ORDER',
            itemId: res.itemId,
            qty: res.qty,
            fromLocationId: res.locationId,
            workOrderId,
            reason: 'Consumed on work order completion'
        });

        current[index] = { ...res, status: 'CONSUMED' };
        this.reservationsSubject.next([...current]);
        return true;
    }

    updateStatus(id: string, status: ReservationStatus): Reservation | undefined {
        const current = this.reservationsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index === -1) return undefined;

        current[index] = { ...current[index], status };
        this.reservationsSubject.next([...current]);
        return current[index];
    }
}
