// Inventory Types and Models

export type LocationType = 'WAREHOUSE' | 'TRUCK' | 'SITE';
export type UoM = 'pcs' | 'box' | 'set' | 'unit';

export interface Item {
    id: string;
    sku: string;
    name: string;
    uom: UoM;
    category?: string;
    serialTracked?: boolean;
    reorderPoint?: number;
    reorderQty?: number;
    active: boolean;
    notes?: string;
    createdAt: string;
    updatedAt: string;
}

export interface StockLocation {
    id: string;
    name: string;
    type: LocationType;
    siteId?: string;
    technicianId?: string;
    address?: string;
    active: boolean;
}

export interface InventoryBalance {
    locationId: string;
    itemId: string;
    onHand: number;
    reserved: number;
    available: number;  // computed = onHand - reserved
    updatedAt: string;
}

export type InventoryTxnType = 'RECEIVE' | 'TRANSFER_OUT' | 'TRANSFER_IN' | 'ISSUE_TO_ORDER' | 'RETURN_FROM_ORDER' | 'ADJUST';

export interface InventoryTransaction {
    id: string;
    type: InventoryTxnType;
    itemId: string;
    qty: number;
    fromLocationId?: string;
    toLocationId?: string;
    workOrderId?: string;
    reason?: string;
    createdAt: string;
    createdBy: { id: string; name: string };
    meta?: Record<string, any>;
}

export type ReservationStatus = 'RESERVED' | 'RELEASED' | 'CONSUMED' | 'BACKORDERED';

export interface Reservation {
    id: string;
    workOrderId: string;
    itemId: string;
    locationId: string;
    qty: number;
    status: ReservationStatus;
    createdAt: string;
}

export type TransferStatus = 'DRAFT' | 'PICKING' | 'SHIPPED' | 'RECEIVED' | 'CANCELLED';

export interface TransferLine {
    itemId: string;
    qty: number;
}

export interface Transfer {
    id: string;
    fromLocationId: string;
    toLocationId: string;
    status: TransferStatus;
    lines: TransferLine[];
    relatedWorkOrderId?: string;
    createdAt: string;
    updatedAt: string;
}

export type PartRequestStatus = 'REQUESTED' | 'APPROVED' | 'ALLOCATED' | 'TRANSFER_CREATED' | 'FULFILLED' | 'REJECTED' | 'BACKORDERED';

export interface PartRequest {
    id: string;
    workOrderId: string;
    technicianId: string;
    itemId: string;
    qty: number;
    status: PartRequestStatus;
    reason?: string;
    createdAt: string;
    updatedAt: string;
}

export interface WorkOrderPart {
    itemId: string;
    qtyRequested: number;
    qtyReserved?: number;
    qtyConsumed?: number;
    fromLocationId?: string;
    notes?: string;
}

// Helper constants
export const UOM_LABELS: Record<UoM, string> = {
    'pcs': 'Pieces',
    'box': 'Box',
    'set': 'Set',
    'unit': 'Unit'
};

export const LOCATION_TYPE_LABELS: Record<LocationType, string> = {
    'WAREHOUSE': 'Warehouse',
    'TRUCK': 'Truck',
    'SITE': 'Site'
};

export const TRANSFER_STATUS_LABELS: Record<TransferStatus, string> = {
    'DRAFT': 'Draft',
    'PICKING': 'Picking',
    'SHIPPED': 'Shipped',
    'RECEIVED': 'Received',
    'CANCELLED': 'Cancelled'
};

export const PART_REQUEST_STATUS_LABELS: Record<PartRequestStatus, string> = {
    'REQUESTED': 'Requested',
    'APPROVED': 'Approved',
    'ALLOCATED': 'Allocated',
    'TRANSFER_CREATED': 'Transfer Created',
    'FULFILLED': 'Fulfilled',
    'REJECTED': 'Rejected',
    'BACKORDERED': 'Backordered'
};
