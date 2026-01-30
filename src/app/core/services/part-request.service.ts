import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { PartRequest, PartRequestStatus } from '../models/inventory.model';
import { InventoryService } from './inventory.service';
import { LocationService } from './location.service';
import { ReservationService } from './reservation.service';
import { TransferService } from './transfer.service';

@Injectable({
    providedIn: 'root'
})
export class PartRequestService {
    private requestsSubject = new BehaviorSubject<PartRequest[]>([]);
    requests$ = this.requestsSubject.asObservable();

    constructor(
        private inventoryService: InventoryService,
        private locationService: LocationService,
        private reservationService: ReservationService,
        private transferService: TransferService
    ) { }

    private generateId(): string {
        return 'REQ-' + Math.random().toString(36).substr(2, 6).toUpperCase();
    }

    getAll(): PartRequest[] {
        return this.requestsSubject.value;
    }

    getById(id: string): PartRequest | undefined {
        return this.requestsSubject.value.find(r => r.id === id);
    }

    getByWorkOrder(workOrderId: string): PartRequest[] {
        return this.requestsSubject.value.filter(r => r.workOrderId === workOrderId);
    }

    getByStatus(status: PartRequestStatus): PartRequest[] {
        return this.requestsSubject.value.filter(r => r.status === status);
    }

    getOpenRequests(): PartRequest[] {
        return this.requestsSubject.value.filter(r =>
            !['FULFILLED', 'REJECTED'].includes(r.status)
        );
    }

    create(
        workOrderId: string,
        technicianId: string,
        itemId: string,
        qty: number,
        reason?: string
    ): PartRequest {
        const now = new Date().toISOString();
        const request: PartRequest = {
            id: this.generateId(),
            workOrderId,
            technicianId,
            itemId,
            qty,
            status: 'REQUESTED',
            reason,
            createdAt: now,
            updatedAt: now
        };

        this.requestsSubject.next([...this.requestsSubject.value, request]);
        return request;
    }

    updateStatus(id: string, status: PartRequestStatus): PartRequest | undefined {
        const current = this.requestsSubject.value;
        const index = current.findIndex(r => r.id === id);
        if (index === -1) return undefined;

        current[index] = {
            ...current[index],
            status,
            updatedAt: new Date().toISOString()
        };
        this.requestsSubject.next([...current]);
        return current[index];
    }

    approve(id: string): PartRequest | undefined {
        const request = this.getById(id);
        if (!request || request.status !== 'REQUESTED') return undefined;
        return this.updateStatus(id, 'APPROVED');
    }

    reject(id: string): PartRequest | undefined {
        return this.updateStatus(id, 'REJECTED');
    }

    allocateFromLocation(id: string, locationId: string): {
        success: boolean;
        reservation?: any;
        needsTransfer: boolean;
        truckLocationId?: string;
    } {
        const request = this.getById(id);
        if (!request) return { success: false, needsTransfer: false };

        const balance = this.inventoryService.getBalance(locationId, request.itemId);
        if (!balance || balance.available < request.qty) {
            return { success: false, needsTransfer: false };
        }

        // Create reservation
        const reservation = this.reservationService.reserve(
            request.workOrderId,
            request.itemId,
            locationId,
            request.qty
        );

        if (!reservation) {
            return { success: false, needsTransfer: false };
        }

        // Check if this is the technician's truck
        const truckForTech = this.locationService.getTruckForTechnician(request.technicianId);
        const needsTransfer = truckForTech ? locationId !== truckForTech.id : false;

        this.updateStatus(id, 'ALLOCATED');

        return {
            success: true,
            reservation,
            needsTransfer,
            truckLocationId: truckForTech?.id
        };
    }

    createTransferForRequest(id: string, fromLocationId: string, toLocationId: string): {
        success: boolean;
        transfer?: any;
    } {
        const request = this.getById(id);
        if (!request) return { success: false };

        const transfer = this.transferService.create(
            fromLocationId,
            toLocationId,
            [{ itemId: request.itemId, qty: request.qty }],
            request.workOrderId
        );

        this.updateStatus(id, 'TRANSFER_CREATED');

        return { success: true, transfer };
    }

    fulfill(id: string): PartRequest | undefined {
        return this.updateStatus(id, 'FULFILLED');
    }

    backorder(id: string): PartRequest | undefined {
        const request = this.getById(id);
        if (!request) return undefined;

        // Create backorder reservation
        const truckForTech = this.locationService.getTruckForTechnician(request.technicianId);
        if (truckForTech) {
            this.reservationService.createBackorder(
                request.workOrderId,
                request.itemId,
                truckForTech.id,
                request.qty
            );
        }

        return this.updateStatus(id, 'BACKORDERED');
    }
}
