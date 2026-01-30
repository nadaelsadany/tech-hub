import { Injectable } from '@angular/core';
import { DayPlan, RouteStop } from '../models/planning.model';
import { WorkOrder } from '../models/work-order.model';
import { Technician } from '../models/technician.model';
import { GeoService } from './geo.service';
import { ConfigService } from './config.service';
import { StateService } from './state.service';

interface InsertionResult {
    feasible: boolean;
    addedTravelMin: number;
    addedDistanceKm: number;
    violations: string[];
}

@Injectable({
    providedIn: 'root'
})
export class PlanningEngineService {

    constructor(
        private geoService: GeoService,
        private configService: ConfigService,
        private stateService: StateService
    ) { }

    /**
     * Build greedy day plans for all technicians
     */
    async buildGreedyPlan(
        date: string,
        orders: WorkOrder[],
        technicians: Technician[]
    ): Promise<Map<string, DayPlan>> {
        const config = this.configService.getConfig();
        const avgSpeed = config.planningAvgSpeedKmh || config.avgSpeedKmh;
        const defaultServiceTime = config.defaultServiceTimeMin;

        const plans = new Map<string, DayPlan>();

        // Initialize empty plans for each active technician
        technicians.filter(t => t.active && t.shiftStatus === 'On').forEach(tech => {
            plans.set(tech.id, {
                date,
                technicianId: tech.id,
                stops: [],
                totalDistanceKm: 0,
                totalTravelMin: 0,
                totalServiceMin: 0,
                warnings: []
            });
        });

        // Sort orders by priority then by time window start
        const priorityOrder: Record<string, number> = { 'Urgent': 0, 'High': 1, 'Normal': 2, 'Low': 3 };
        const sortedOrders = [...orders].sort((a, b) => {
            const pa = priorityOrder[a.priority] ?? 2;
            const pb = priorityOrder[b.priority] ?? 2;
            if (pa !== pb) return pa - pb;

            // Sort by time window start (nulls last)
            const aStart = a.timeWindow?.start ? new Date(a.timeWindow.start).getTime() : Infinity;
            const bStart = b.timeWindow?.start ? new Date(b.timeWindow.start).getTime() : Infinity;
            return aStart - bStart;
        });

        // Assign each order to best technician
        for (const order of sortedOrders) {
            // Skip locked orders that are already assigned
            if (order.lockedInPlan && order.assignedTechnicianId) {
                continue;
            }

            let bestTech: string | null = null;
            let bestPosition = -1;
            let bestAddedTravel = Infinity;

            // Try each technician
            for (const [techId, plan] of plans) {
                const tech = technicians.find(t => t.id === techId);
                if (!tech) continue;

                // Try each insertion position
                for (let pos = 0; pos <= plan.stops.length; pos++) {
                    const result = this.evaluateInsertion(plan, pos, order, tech, avgSpeed, defaultServiceTime, date);
                    if (result.feasible && result.addedTravelMin < bestAddedTravel) {
                        bestTech = techId;
                        bestPosition = pos;
                        bestAddedTravel = result.addedTravelMin;
                    }
                }
            }

            if (bestTech && bestPosition >= 0) {
                const plan = plans.get(bestTech)!;
                const tech = technicians.find(t => t.id === bestTech)!;
                this.insertStop(plan, bestPosition, order, tech, avgSpeed, defaultServiceTime, date);
                plans.set(bestTech, plan);
            }
        }

        // Recalculate all plans to ensure consistency
        for (const [techId, plan] of plans) {
            const tech = technicians.find(t => t.id === techId);
            if (tech) {
                this.recalcPlan(plan, tech, avgSpeed, defaultServiceTime, date);
            }
        }

        return plans;
    }

    /**
     * Evaluate feasibility and cost of inserting a work order at a position
     */
    private evaluateInsertion(
        plan: DayPlan,
        position: number,
        order: WorkOrder,
        tech: Technician,
        avgSpeed: number,
        defaultServiceTime: number,
        date: string
    ): InsertionResult {
        const violations: string[] = [];
        const serviceTime = order.serviceTimeMin || defaultServiceTime;

        // Get previous location
        let prevLat: number, prevLng: number;
        if (position === 0) {
            prevLat = tech.startLocation?.lat ?? tech.currentGeo.lat;
            prevLng = tech.startLocation?.lng ?? tech.currentGeo.lng;
        } else {
            const prevOrder = this.stateService.getWorkOrder(plan.stops[position - 1].workOrderId);
            if (!prevOrder) return { feasible: false, addedTravelMin: Infinity, addedDistanceKm: 0, violations: ['Previous order not found'] };
            prevLat = prevOrder.address.lat;
            prevLng = prevOrder.address.lng;
        }

        // Calculate travel to new order
        const distToNew = this.geoService.getDistanceKm(prevLat, prevLng, order.address.lat, order.address.lng);
        const travelToNew = Math.round((distToNew / avgSpeed) * 60);

        // Calculate arrival time
        let arrivalTime: Date;
        if (position === 0) {
            const shiftStart = tech.shift?.start ? new Date(tech.shift.start) : new Date(`${date}T08:00:00`);
            arrivalTime = new Date(shiftStart.getTime() + travelToNew * 60 * 1000);
        } else {
            const prevStop = plan.stops[position - 1];
            const prevEnd = new Date(prevStop.endServiceAt);
            arrivalTime = new Date(prevEnd.getTime() + travelToNew * 60 * 1000);
        }

        // Check time window
        if (order.timeWindow) {
            const windowStart = new Date(order.timeWindow.start);
            const windowEnd = new Date(order.timeWindow.end);

            // Wait if arriving early
            if (arrivalTime < windowStart) {
                arrivalTime = windowStart;
            }

            // Violation if arriving late
            if (arrivalTime > windowEnd) {
                violations.push('Time window violation');
            }
        }

        const endServiceTime = new Date(arrivalTime.getTime() + serviceTime * 60 * 1000);

        // Check shift end
        if (tech.shift?.end) {
            const shiftEnd = new Date(tech.shift.end);
            if (endServiceTime > shiftEnd) {
                violations.push('Shift overflow');
            }
        }

        // Check break overlap (simplified)
        if (tech.breaks) {
            for (const brk of tech.breaks) {
                const breakStart = new Date(brk.start);
                const breakEnd = new Date(brk.end);
                if (arrivalTime < breakEnd && endServiceTime > breakStart) {
                    violations.push('Break overlap');
                }
            }
        }

        // Calculate added travel if there's a next stop
        let totalAddedTravel = travelToNew;
        let totalAddedDist = distToNew;

        if (position < plan.stops.length) {
            const nextOrder = this.stateService.getWorkOrder(plan.stops[position].workOrderId);
            if (nextOrder) {
                // Remove old travel from prev to next
                const oldDist = plan.stops[position].distanceFromPrevKm;
                const oldTravel = plan.stops[position].travelMin;

                // Add new travel from new order to next
                const newDist = this.geoService.getDistanceKm(order.address.lat, order.address.lng, nextOrder.address.lat, nextOrder.address.lng);
                const newTravel = Math.round((newDist / avgSpeed) * 60);

                totalAddedTravel = travelToNew + newTravel - oldTravel;
                totalAddedDist = distToNew + newDist - oldDist;
            }
        }

        return {
            feasible: violations.length === 0,
            addedTravelMin: totalAddedTravel,
            addedDistanceKm: totalAddedDist,
            violations
        };
    }

    /**
     * Insert a stop at the given position
     */
    private insertStop(
        plan: DayPlan,
        position: number,
        order: WorkOrder,
        tech: Technician,
        avgSpeed: number,
        defaultServiceTime: number,
        date: string
    ) {
        const serviceTime = order.serviceTimeMin || defaultServiceTime;

        // Calculate ETA
        let prevLat: number, prevLng: number, prevEndTime: Date;
        if (position === 0) {
            prevLat = tech.startLocation?.lat ?? tech.currentGeo.lat;
            prevLng = tech.startLocation?.lng ?? tech.currentGeo.lng;
            prevEndTime = tech.shift?.start ? new Date(tech.shift.start) : new Date(`${date}T08:00:00`);
        } else {
            const prevOrder = this.stateService.getWorkOrder(plan.stops[position - 1].workOrderId);
            prevLat = prevOrder!.address.lat;
            prevLng = prevOrder!.address.lng;
            prevEndTime = new Date(plan.stops[position - 1].endServiceAt);
        }

        const distKm = this.geoService.getDistanceKm(prevLat, prevLng, order.address.lat, order.address.lng);
        const travelMin = Math.round((distKm / avgSpeed) * 60);
        const eta = new Date(prevEndTime.getTime() + travelMin * 60 * 1000);

        // Handle time window wait
        let startService = eta;
        if (order.timeWindow?.start) {
            const windowStart = new Date(order.timeWindow.start);
            if (eta < windowStart) {
                startService = windowStart;
            }
        }

        const endService = new Date(startService.getTime() + serviceTime * 60 * 1000);

        const newStop: RouteStop = {
            workOrderId: order.id,
            eta: eta.toISOString(),
            startServiceAt: startService.toISOString(),
            endServiceAt: endService.toISOString(),
            distanceFromPrevKm: distKm,
            travelMin
        };

        plan.stops.splice(position, 0, newStop);
    }

    /**
     * Recalculate ETAs and violations for an entire plan
     */
    recalcPlan(plan: DayPlan, tech: Technician, avgSpeed?: number, defaultServiceTime?: number, date?: string): DayPlan {
        const config = this.configService.getConfig();
        const speed = avgSpeed ?? config.planningAvgSpeedKmh ?? config.avgSpeedKmh;
        const defService = defaultServiceTime ?? config.defaultServiceTimeMin;
        const planDate = date ?? plan.date;

        plan.warnings = [];
        plan.totalDistanceKm = 0;
        plan.totalTravelMin = 0;
        plan.totalServiceMin = 0;

        let prevLat = tech.startLocation?.lat ?? tech.currentGeo.lat;
        let prevLng = tech.startLocation?.lng ?? tech.currentGeo.lng;
        let prevEndTime = tech.shift?.start ? new Date(tech.shift.start) : new Date(`${planDate}T08:00:00`);

        for (let i = 0; i < plan.stops.length; i++) {
            const stop = plan.stops[i];
            const order = this.stateService.getWorkOrder(stop.workOrderId);
            if (!order) continue;

            const serviceTime = order.serviceTimeMin || defService;

            const distKm = this.geoService.getDistanceKm(prevLat, prevLng, order.address.lat, order.address.lng);
            const travelMin = Math.round((distKm / speed) * 60);
            const eta = new Date(prevEndTime.getTime() + travelMin * 60 * 1000);

            let startService = eta;
            if (order.timeWindow?.start) {
                const windowStart = new Date(order.timeWindow.start);
                if (eta < windowStart) {
                    startService = windowStart;
                }
                const windowEnd = new Date(order.timeWindow.end);
                if (startService > windowEnd) {
                    plan.warnings!.push(`${order.number}: Time window violation`);
                }
            }

            const endService = new Date(startService.getTime() + serviceTime * 60 * 1000);

            // Check shift overflow
            if (tech.shift?.end) {
                const shiftEnd = new Date(tech.shift.end);
                if (endService > shiftEnd) {
                    const overflowMin = Math.round((endService.getTime() - shiftEnd.getTime()) / 60000);
                    plan.warnings!.push(`Shift overflow by ${overflowMin} min`);
                }
            }

            stop.eta = eta.toISOString();
            stop.startServiceAt = startService.toISOString();
            stop.endServiceAt = endService.toISOString();
            stop.distanceFromPrevKm = distKm;
            stop.travelMin = travelMin;

            plan.totalDistanceKm += distKm;
            plan.totalTravelMin += travelMin;
            plan.totalServiceMin += serviceTime;

            prevLat = order.address.lat;
            prevLng = order.address.lng;
            prevEndTime = endService;
        }

        return plan;
    }

    /**
     * Commit plan: update work orders with assignments
     */
    commitPlan(plans: Map<string, DayPlan>) {
        for (const [techId, plan] of plans) {
            for (const stop of plan.stops) {
                const order = this.stateService.getWorkOrder(stop.workOrderId);
                if (order) {
                    const updated: WorkOrder = {
                        ...order,
                        status: 'Assigned',
                        assignedTechnicianId: techId,
                        scheduledStartAt: stop.startServiceAt
                    };
                    this.stateService.updateWorkOrder(updated);
                }
            }
        }
    }
}
