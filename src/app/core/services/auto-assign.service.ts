import { Injectable } from '@angular/core';
import { Technician } from '../models/technician.model';
import { WorkOrder } from '../models/work-order.model';
import { ConfigService } from './config.service';
import { GeoService } from './geo.service';
import { StateService } from './state.service';
import { Assignment } from '../models/assignment.model';

export interface AutoAssignResult {
    success: boolean;
    technicianId?: string;
    reason?: string;
    distanceKm?: number;
    etaMin?: number;
}

@Injectable({
    providedIn: 'root'
})
export class AutoAssignService {

    constructor(
        private configService: ConfigService,
        private geoService: GeoService,
        private stateService: StateService
    ) { }

    tryAssign(workOrder: WorkOrder): AutoAssignResult {
        const config = this.configService.getConfig();
        // technician data should be fresh from state
        let technicians: Technician[] = [];
        // Subscribing once to get current value - in a real app might want a snapshot method
        // For now, assuming state service has latest
        const sub = this.stateService.technicians$.subscribe(t => technicians = t);
        sub.unsubscribe();

        const assignments: Assignment[] = [];
        const subA = this.stateService.assignments$.subscribe(a => a.forEach(x => assignments.push(x)));
        subA.unsubscribe();

        const candidates = technicians.filter(tech => {
            // 1. Active & Shift
            if (!tech.active || tech.shiftStatus !== 'On') return false;

            // 2. Heartbeat Age
            const lastHeartbeat = new Date(tech.currentGeo.ts).getTime();
            const now = new Date().getTime();
            const ageMin = (now - lastHeartbeat) / (1000 * 60);
            if (ageMin > config.heartbeatMaxAgeMin) return false;

            // 3. Distance
            const dist = this.geoService.getDistanceKm(
                tech.currentGeo.lat, tech.currentGeo.lng,
                workOrder.address.lat, workOrder.address.lng
            );
            const radius = tech.serviceRadiusKm ?? config.maxRadiusKm;
            // Use smaller of tech radius or global max radius? Or tech specific?
            // Prompt says: min(tech.serviceRadiusKm if set, maxRadiusKm)
            const effectiveRadius = Math.min(tech.serviceRadiusKm ?? config.maxRadiusKm, config.maxRadiusKm);

            if (dist > effectiveRadius) return false;

            // 4. Skills
            if (config.requireSkillMatch) {
                if (!tech.skills?.includes(workOrder.category)) return false;
            }

            return true;
        });

        if (candidates.length === 0) {
            return { success: false, reason: 'No eligible technicians nearby' };
        }

        // sort candidates
        const scored = candidates.map(tech => {
            const dist = this.geoService.getDistanceKm(
                tech.currentGeo.lat, tech.currentGeo.lng,
                workOrder.address.lat, workOrder.address.lng
            );

            // workload count (Assigned | EnRoute | OnSite) - assuming simple count from assignments? 
            // Actually simpler: WorkOrders in those statuses assigned to this tech.
            // But we only have assignments list. We need to check active work orders.
            // Let's get work orders to check status.
            let activeWorkOrdersCount = 0;
            // This is expensive, but okay for MVP in-memory
            // In real backend, this would be a SQL count
            // For MVP, lets trust the seed data / status. 
            // We need to know which work orders are active for this tech.
            // Getting all work orders to verify:
            let allWorkOrders: WorkOrder[] = [];
            this.stateService.workOrders$.subscribe(w => allWorkOrders = w).unsubscribe();

            activeWorkOrdersCount = allWorkOrders.filter(w =>
                w.assignedTechnicianId === tech.id &&
                ['Assigned', 'EnRoute', 'OnSite'].includes(w.status)
            ).length;

            return { tech, dist, workload: activeWorkOrdersCount };
        });

        // Tie-breakers: distance asc; workload asc; id hash/string asc
        scored.sort((a, b) => {
            if (Math.abs(a.dist - b.dist) > 0.1) return a.dist - b.dist; // 100m tolerance
            if (a.workload !== b.workload) return a.workload - b.workload;
            return a.tech.id.localeCompare(b.tech.id);
        });

        const best = scored[0];
        const etaMin = Math.max(2, Math.round((best.dist / config.avgSpeedKmh) * 60));

        return {
            success: true,
            technicianId: best.tech.id,
            distanceKm: best.dist,
            etaMin: etaMin
        };
    }
}
