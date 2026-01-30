export interface Assignment {
    id: string;
    workOrderId: string;
    technicianId: string;
    assignedAt: string;
    etaMin: number;
    distanceKm: number;
    method: 'auto-distance' | 'manual';
}
