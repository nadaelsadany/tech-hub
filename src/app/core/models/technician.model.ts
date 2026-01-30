import { TimeWindow } from './work-order.model';

export interface GeoLocation {
    lat: number;
    lng: number;
    name?: string;
}

export interface Technician {
    id: string;
    name: string;
    phone?: string;
    active: boolean;
    shiftStatus: 'On' | 'Off' | 'Break';
    currentGeo: {
        lat: number;
        lng: number;
        ts: string; // ISO string
    };
    serviceRadiusKm?: number;
    skills?: string[];
    dailyCapacity?: number;
    // Planning extensions
    shift?: TimeWindow;                // shift start/end for the day
    breaks?: TimeWindow[];             // meal/rest breaks
    startLocation?: GeoLocation;       // depot/home
    endLocation?: GeoLocation;         // optional end location
}
