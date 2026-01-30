import { Injectable } from '@angular/core';
import { Technician } from '../models/technician.model';
import { WorkOrder } from '../models/work-order.model';

@Injectable({
    providedIn: 'root'
})
export class SeedDataService {

    getTechnicians(): Technician[] {
        const today = new Date().toISOString().split('T')[0];
        return [
            {
                id: 'TECH-001',
                name: 'Alice Johnson',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7128, lng: -74.0060, ts: new Date().toISOString() },
                serviceRadiusKm: 30,
                skills: ['AC', 'Mechanical'],
                dailyCapacity: 5,
                shift: { start: `${today}T08:00:00`, end: `${today}T17:00:00` },
                breaks: [{ start: `${today}T12:00:00`, end: `${today}T12:30:00` }],
                startLocation: { lat: 40.7128, lng: -74.0060, name: 'North Office' }
            },
            {
                id: 'TECH-002',
                name: 'Bob Smith',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7300, lng: -73.9950, ts: new Date().toISOString() },
                serviceRadiusKm: 20,
                skills: ['Electrical'],
                dailyCapacity: 4,
                shift: { start: `${today}T09:00:00`, end: `${today}T18:00:00` },
                breaks: [{ start: `${today}T13:00:00`, end: `${today}T13:30:00` }],
                startLocation: { lat: 40.7300, lng: -73.9950, name: 'South Depot' }
            },
            {
                id: 'TECH-003',
                name: 'Charlie Davis',
                active: true,
                shiftStatus: 'Off',
                currentGeo: { lat: 40.7589, lng: -73.9851, ts: new Date().toISOString() },
                serviceRadiusKm: 25,
                skills: ['AC', 'Electrical'],
                dailyCapacity: 5,
                shift: { start: `${today}T08:00:00`, end: `${today}T16:00:00` },
                startLocation: { lat: 40.7589, lng: -73.9851, name: 'East Depot' }
            },
            {
                id: 'TECH-004',
                name: 'Diana Martinez',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7200, lng: -74.0100, ts: new Date().toISOString() },
                serviceRadiusKm: 35,
                skills: ['AC', 'Mechanical', 'Electrical'],
                dailyCapacity: 6,
                shift: { start: `${today}T07:00:00`, end: `${today}T16:00:00` },
                breaks: [{ start: `${today}T11:30:00`, end: `${today}T12:00:00` }],
                startLocation: { lat: 40.7200, lng: -74.0100, name: 'West Office' }
            },
            {
                id: 'TECH-005',
                name: 'Ethan Lee',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7400, lng: -73.9900, ts: new Date().toISOString() },
                serviceRadiusKm: 28,
                skills: ['Mechanical'],
                dailyCapacity: 4,
                shift: { start: `${today}T08:30:00`, end: `${today}T17:30:00` },
                breaks: [{ start: `${today}T12:30:00`, end: `${today}T13:00:00` }],
                startLocation: { lat: 40.7400, lng: -73.9900, name: 'North Office' }
            },
            {
                id: 'TECH-006',
                name: 'Fiona Chen',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7500, lng: -73.9800, ts: new Date().toISOString() },
                serviceRadiusKm: 22,
                skills: ['Electrical', 'AC'],
                dailyCapacity: 5,
                shift: { start: `${today}T09:00:00`, end: `${today}T18:00:00` },
                breaks: [{ start: `${today}T13:00:00`, end: `${today}T13:30:00` }],
                startLocation: { lat: 40.7500, lng: -73.9800, name: 'East Depot' }
            },
            {
                id: 'TECH-007',
                name: 'George Wilson',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7100, lng: -74.0150, ts: new Date().toISOString() },
                serviceRadiusKm: 30,
                skills: ['AC', 'Mechanical'],
                dailyCapacity: 5,
                shift: { start: `${today}T08:00:00`, end: `${today}T17:00:00` },
                breaks: [{ start: `${today}T12:00:00`, end: `${today}T12:30:00` }],
                startLocation: { lat: 40.7100, lng: -74.0150, name: 'South Depot' }
            },
            {
                id: 'TECH-008',
                name: 'Hannah Park',
                active: true,
                shiftStatus: 'On',
                currentGeo: { lat: 40.7600, lng: -73.9750, ts: new Date().toISOString() },
                serviceRadiusKm: 26,
                skills: ['Electrical', 'Mechanical'],
                dailyCapacity: 4,
                shift: { start: `${today}T09:00:00`, end: `${today}T18:00:00` },
                breaks: [{ start: `${today}T13:00:00`, end: `${today}T13:30:00` }],
                startLocation: { lat: 40.7600, lng: -73.9750, name: 'West Office' }
            }
        ];
    }

    getWorkOrders(): WorkOrder[] {
        const now = new Date();
        const today = now.toISOString().split('T')[0];

        // Helper to create dates in the past
        const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000).toISOString();
        const hoursAgo = (hours: number) => new Date(now.getTime() - hours * 60 * 60 * 1000).toISOString();

        return [
            // Completed orders with reviews (for reporting)
            {
                id: 'WO-2001', number: 'WO-2001', siteId: 'North', category: 'AC', priority: 'High', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-001',
                customer: { name: 'ABC Corp', phone: '+1-555-1001', email: 'abc@example.com', unit: 'Floor 3' },
                address: { line1: '100 Broadway', city: 'New York', lat: 40.7130, lng: -74.0050 },
                createdAt: daysAgo(25), completedAt: daysAgo(24), serviceTimeMin: 90,
                supervisorReviewId: 'REV-001', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2002', number: 'WO-2002', siteId: 'South', category: 'Electrical', priority: 'Normal', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-002',
                customer: { name: 'XYZ Industries', phone: '+1-555-1002' },
                address: { line1: '200 5th Ave', city: 'New York', lat: 40.7484, lng: -73.9857 },
                createdAt: daysAgo(23), completedAt: daysAgo(22), serviceTimeMin: 60,
                supervisorReviewId: 'REV-002', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2003', number: 'WO-2003', siteId: 'East', category: 'Mechanical', priority: 'Low', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-003',
                customer: { name: 'Tech Solutions', email: 'tech@example.com' },
                address: { line1: '300 Park Ave', city: 'New York', lat: 40.7614, lng: -73.9776 },
                createdAt: daysAgo(20), completedAt: daysAgo(19), serviceTimeMin: 45,
                supervisorReviewId: 'REV-003', supervisorReviewOutcome: 'NeedFollowUp'
            },
            {
                id: 'WO-2004', number: 'WO-2004', siteId: 'West', category: 'AC', priority: 'Urgent', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-004',
                customer: { name: 'Global Services', phone: '+1-555-1004' },
                address: { line1: '400 Wall St', city: 'New York', lat: 40.7074, lng: -74.0113 },
                createdAt: daysAgo(18), completedAt: daysAgo(17), serviceTimeMin: 120,
                supervisorReviewId: 'REV-004', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2005', number: 'WO-2005', siteId: 'North', category: 'Electrical', priority: 'High', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-005',
                customer: { name: 'Metro Group', phone: '+1-555-1005', email: 'metro@example.com' },
                address: { line1: '500 Madison Ave', city: 'New York', lat: 40.7589, lng: -73.9740 },
                createdAt: daysAgo(15), completedAt: daysAgo(14), serviceTimeMin: 75,
                supervisorReviewId: 'REV-005', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2006', number: 'WO-2006', siteId: 'South', category: 'AC', priority: 'Normal', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-006',
                customer: { name: 'Downtown LLC', phone: '+1-555-1006' },
                address: { line1: '600 Lexington Ave', city: 'New York', lat: 40.7520, lng: -73.9722 },
                createdAt: daysAgo(12), completedAt: daysAgo(11), serviceTimeMin: 90,
                supervisorReviewId: 'REV-006', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2007', number: 'WO-2007', siteId: 'East', category: 'Mechanical', priority: 'High', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-007',
                customer: { name: 'Central Plaza', email: 'central@example.com', unit: 'Suite 200' },
                address: { line1: '700 7th Ave', city: 'New York', lat: 40.7590, lng: -73.9845 },
                createdAt: daysAgo(10), completedAt: daysAgo(9), serviceTimeMin: 60,
                supervisorReviewId: 'REV-007', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2008', number: 'WO-2008', siteId: 'West', category: 'Electrical', priority: 'Low', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-008',
                customer: { name: 'Riverside Co', phone: '+1-555-1008' },
                address: { line1: '800 Amsterdam Ave', city: 'New York', lat: 40.7890, lng: -73.9750 },
                createdAt: daysAgo(8), completedAt: daysAgo(7), serviceTimeMin: 50,
                supervisorReviewId: 'REV-008', supervisorReviewOutcome: 'NeedFollowUp'
            },
            {
                id: 'WO-2009', number: 'WO-2009', siteId: 'North', category: 'AC', priority: 'Normal', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-001',
                customer: { name: 'Uptown Properties', phone: '+1-555-1009', email: 'uptown@example.com' },
                address: { line1: '900 Columbus Ave', city: 'New York', lat: 40.7950, lng: -73.9660 },
                createdAt: daysAgo(6), completedAt: daysAgo(5), serviceTimeMin: 85,
                supervisorReviewId: 'REV-009', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2010', number: 'WO-2010', siteId: 'South', category: 'Mechanical', priority: 'High', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-002',
                customer: { name: 'Financial District Inc', phone: '+1-555-1010' },
                address: { line1: '1000 Water St', city: 'New York', lat: 40.7030, lng: -74.0080 },
                createdAt: daysAgo(5), completedAt: daysAgo(4), serviceTimeMin: 70,
                supervisorReviewId: 'REV-010', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2011', number: 'WO-2011', siteId: 'East', category: 'Electrical', priority: 'Urgent', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-003',
                customer: { name: 'Midtown Ventures', email: 'midtown@example.com', unit: 'PH' },
                address: { line1: '1100 3rd Ave', city: 'New York', lat: 40.7550, lng: -73.9680 },
                createdAt: daysAgo(4), completedAt: daysAgo(3), serviceTimeMin: 95,
                supervisorReviewId: 'REV-011', supervisorReviewOutcome: 'Approved'
            },
            {
                id: 'WO-2012', number: 'WO-2012', siteId: 'West', category: 'AC', priority: 'Normal', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-004',
                customer: { name: 'Westside Management', phone: '+1-555-1012' },
                address: { line1: '1200 Broadway', city: 'New York', lat: 40.7450, lng: -73.9880 },
                createdAt: daysAgo(3), completedAt: daysAgo(2), serviceTimeMin: 55,
                supervisorReviewOutcome: 'Pending' // No review yet
            },
            {
                id: 'WO-2013', number: 'WO-2013', siteId: 'North', category: 'Mechanical', priority: 'Low', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-005',
                customer: { name: 'Eastside Properties', phone: '+1-555-1013', email: 'eastside@example.com' },
                address: { line1: '1300 2nd Ave', city: 'New York', lat: 40.7620, lng: -73.9620 },
                createdAt: daysAgo(2), completedAt: hoursAgo(36), serviceTimeMin: 40,
                supervisorReviewOutcome: 'Pending'
            },
            {
                id: 'WO-2014', number: 'WO-2014', siteId: 'South', category: 'Electrical', priority: 'High', warranty: false,
                status: 'Completed', assignedTechnicianId: 'TECH-006',
                customer: { name: 'Battery Park LLC', phone: '+1-555-1014' },
                address: { line1: '1400 State St', city: 'New York', lat: 40.7000, lng: -74.0170 },
                createdAt: hoursAgo(48), completedAt: hoursAgo(24), serviceTimeMin: 80,
                supervisorReviewOutcome: 'Pending'
            },
            {
                id: 'WO-2015', number: 'WO-2015', siteId: 'East', category: 'AC', priority: 'Normal', warranty: true,
                status: 'Completed', assignedTechnicianId: 'TECH-007',
                customer: { name: 'Chelsea Towers', email: 'chelsea@example.com', unit: '12A' },
                address: { line1: '1500 6th Ave', city: 'New York', lat: 40.7560, lng: -73.9830 },
                createdAt: hoursAgo(36), completedAt: hoursAgo(12), serviceTimeMin: 65,
                supervisorReviewOutcome: 'Pending'
            },

            // Current/pending orders
            {
                id: 'WO-1001', number: 'WO-1001', siteId: 'North', category: 'AC', priority: 'High', warranty: true,
                status: 'Ready',
                customer: { name: 'John Doe', phone: '+1-555-0101', email: 'john.doe@example.com', unit: 'Apt 4B' },
                address: { line1: '123 Broadway', city: 'New York', lat: 40.7130, lng: -74.0050 },
                createdAt: hoursAgo(1), notes: 'AC unit making loud noise', serviceTimeMin: 60,
                timeWindow: { start: `${today}T10:00:00`, end: `${today}T12:00:00` }
            },
            {
                id: 'WO-1002', number: 'WO-1002', siteId: 'South', category: 'Mechanical', priority: 'Normal', warranty: false,
                status: 'New',
                customer: { name: 'Jane Smith', phone: '+1-555-0202', email: 'jane.smith@example.com' },
                address: { line1: '456 5th Ave', city: 'New York', lat: 40.7484, lng: -73.9857 },
                createdAt: new Date(now.getTime() - 1000 * 60 * 30).toISOString(),
                serviceTimeMin: 45
            },
            {
                id: 'WO-1003', number: 'WO-1003', siteId: 'East', category: 'Electrical', priority: 'Urgent', warranty: false,
                status: 'Ready',
                customer: { name: 'Mike Wilson', phone: '+1-555-0303' },
                address: { line1: '789 Park Ave', city: 'New York', lat: 40.7614, lng: -73.9776 },
                createdAt: new Date(now.getTime() - 1000 * 60 * 15).toISOString(),
                serviceTimeMin: 30,
                timeWindow: { start: `${today}T09:00:00`, end: `${today}T10:00:00` }
            },
            {
                id: 'WO-1004', number: 'WO-1004', siteId: 'West', category: 'AC', priority: 'Low', warranty: true,
                status: 'New',
                customer: { name: 'Sarah Brown', email: 'sarah.b@example.com' },
                address: { line1: '321 Wall St', city: 'New York', lat: 40.7074, lng: -74.0113 },
                createdAt: new Date(now.getTime() - 1000 * 60 * 45).toISOString(),
                serviceTimeMin: 45
            }
        ];
    }
}

