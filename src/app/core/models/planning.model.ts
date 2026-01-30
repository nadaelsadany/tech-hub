export interface RouteStop {
    workOrderId: string;
    eta: string;             // ISO
    startServiceAt: string;  // ISO
    endServiceAt: string;    // ISO
    distanceFromPrevKm: number;
    travelMin: number;
}

export interface DayPlan {
    date: string; // YYYY-MM-DD
    technicianId: string;
    stops: RouteStop[];
    totalDistanceKm: number;
    totalTravelMin: number;
    totalServiceMin: number;
    warnings?: string[];
}
