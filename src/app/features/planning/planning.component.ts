import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { Router } from '@angular/router';
import { Subject, takeUntil, combineLatest } from 'rxjs';
import { PlanningStateService } from '../../core/services/planning-state.service';
import { PlanningEngineService } from '../../core/services/planning-engine.service';
import { StateService } from '../../core/services/state.service';
import { ConfigService } from '../../core/services/config.service';
import { WorkOrder } from '../../core/models/work-order.model';
import { Technician } from '../../core/models/technician.model';
import { DayPlan, RouteStop } from '../../core/models/planning.model';

interface LaneData {
    technician: Technician;
    plan: DayPlan;
    orders: WorkOrder[];
}

@Component({
    selector: 'app-planning',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        DragDropModule,
        NzCardModule,
        NzButtonModule,
        NzDatePickerModule,
        NzSelectModule,
        NzTagModule,
        NzIconModule,
        NzSwitchModule,
        NzBadgeModule,
        NzEmptyModule,
        NzGridModule
    ],
    template: `
    <div class="planning-container">
      <!-- Header -->
      <div class="planning-header">
        <div class="header-left">
          <h2>Daily Planning</h2>
          <nz-date-picker 
            [(ngModel)]="selectedDate" 
            (ngModelChange)="onDateChange($event)"
            [nzAllowClear]="false"
          ></nz-date-picker>
          <nz-select [(ngModel)]="selectedSite" style="width: 150px; margin-left: 12px;">
            <nz-option nzValue="SITE-001" nzLabel="Site 001"></nz-option>
          </nz-select>
        </div>
        <div class="header-right">
          <button nz-button nzType="primary" (click)="optimizeDay()" [nzLoading]="optimizing">
            <span nz-icon nzType="thunderbolt"></span> Optimize Day
          </button>
          <button nz-button (click)="recalcETAs()" style="margin-left: 8px;">
            <span nz-icon nzType="sync"></span> Recalculate ETAs
          </button>
          <button nz-button nzType="default" nzDanger (click)="commitPlan()" style="margin-left: 8px;" [disabled]="!hasPlannedOrders">
            <span nz-icon nzType="check-circle"></span> Commit Plan
          </button>
        </div>
      </div>

      <!-- Main Content -->
      <div class="planning-body">
        <!-- Unplanned Orders (Left) -->
        <div class="unplanned-column">
          <nz-card nzTitle="Unplanned Orders" [nzExtra]="unplannedExtra" class="panel-card">
            <ng-template #unplannedExtra>
              <nz-tag>{{ unplannedOrders.length }}</nz-tag>
            </ng-template>
            <div 
              cdkDropList 
              #unplannedList="cdkDropList"
              [cdkDropListData]="unplannedOrders"
              [cdkDropListConnectedTo]="laneIds"
              (cdkDropListDropped)="dropToUnplanned($event)"
              class="job-list"
            >
              <div *ngIf="unplannedOrders.length === 0" class="empty-state">
                <nz-empty nzNotFoundContent="All orders planned!"></nz-empty>
              </div>
              <div 
                *ngFor="let order of unplannedOrders" 
                cdkDrag 
                [cdkDragData]="order"
                [cdkDragDisabled]="order.lockedInPlan"
                class="job-card"
              >
                <div class="job-header">
                  <span class="job-number">{{ order.number }}</span>
                  <nz-tag [nzColor]="getPriorityColor(order.priority)" nzMode="default">{{ order.priority }}</nz-tag>
                </div>
                <div class="job-customer">{{ order.customer?.name || 'N/A' }}</div>
                <div class="job-details">
                  <span>{{ order.category }}</span>
                  <span *ngIf="order.warranty" class="warranty-badge">Warranty</span>
                </div>
                <div class="job-meta">
                  <span *ngIf="order.timeWindow" class="time-window">
                    {{ formatTime(order.timeWindow.start) }} - {{ formatTime(order.timeWindow.end) }}
                  </span>
                  <span class="service-time">{{ order.serviceTimeMin || 45 }} min</span>
                </div>
                <div class="job-location">{{ order.address.city || order.address.line1 }}</div>
              </div>
            </div>
          </nz-card>
        </div>

        <!-- Technician Lanes (Center) -->
        <div class="lanes-column">
          <div class="lanes-wrapper">
            <div *ngFor="let lane of lanes; let i = index" class="tech-lane">
              <nz-card [nzTitle]="laneTitle" [nzExtra]="laneExtra" class="lane-card">
                <ng-template #laneTitle>
                  <div class="lane-header-content">
                    <span class="tech-name">{{ lane.technician.name }}</span>
                    <span class="tech-shift" *ngIf="lane.technician.shift">
                      {{ formatTime(lane.technician.shift.start) }} - {{ formatTime(lane.technician.shift.end) }}
                    </span>
                  </div>
                </ng-template>
                <ng-template #laneExtra>
                  <nz-tag nzColor="blue">{{ lane.orders.length }} jobs</nz-tag>
                </ng-template>

                <div 
                  cdkDropList
                  [id]="'lane-' + lane.technician.id"
                  [cdkDropListData]="lane.orders"
                  [cdkDropListConnectedTo]="getAllConnectedLists(lane.technician.id)"
                  (cdkDropListDropped)="dropToLane($event, lane)"
                  class="job-list lane-list"
                >
                  <div *ngIf="lane.orders.length === 0" class="empty-lane">
                    <span nz-icon nzType="inbox" nzTheme="outline"></span>
                    <p>Drop jobs here</p>
                  </div>
                  <div 
                    *ngFor="let order of lane.orders; let j = index" 
                    cdkDrag 
                    [cdkDragData]="order"
                    [cdkDragDisabled]="order.lockedInPlan"
                    class="job-card planned-card"
                  >
                    <div class="job-header">
                      <span class="stop-number">{{ j + 1 }}</span>
                      <span class="job-number">{{ order.number }}</span>
                      <button 
                        nz-button nzType="text" nzSize="small" 
                        (click)="toggleLock(order, $event)"
                        [class.locked]="order.lockedInPlan"
                      >
                        <span nz-icon [nzType]="order.lockedInPlan ? 'lock' : 'unlock'"></span>
                      </button>
                    </div>
                    <div class="job-customer">{{ order.customer?.name || 'N/A' }}</div>
                    <div class="job-times" *ngIf="getStopInfo(lane.plan, order.id) as stop">
                      <span class="eta">ETA: {{ formatTime(stop.eta) }}</span>
                      <span class="service">{{ formatTime(stop.startServiceAt) }} - {{ formatTime(stop.endServiceAt) }}</span>
                    </div>
                    <div class="job-violations">
                      <nz-tag *ngIf="hasTimeWindowViolation(lane.plan, order)" nzColor="red">Window Violation</nz-tag>
                      <nz-tag *ngIf="hasShiftOverflow(lane.plan, order)" nzColor="volcano">Shift Overflow</nz-tag>
                    </div>
                  </div>
                </div>

                <!-- Lane Footer -->
                <div class="lane-footer" *ngIf="lane.plan">
                  <span>{{ lane.plan.totalDistanceKm.toFixed(1) }} km</span>
                  <span>{{ lane.plan.totalTravelMin }} min travel</span>
                  <span>{{ lane.plan.totalServiceMin }} min service</span>
                </div>
                <div class="lane-warnings" *ngIf="lane.plan?.warnings?.length">
                  <nz-tag *ngFor="let warn of lane.plan.warnings" nzColor="warning">{{ warn }}</nz-tag>
                </div>
              </nz-card>
            </div>
          </div>
        </div>

        <!-- Map Preview (Right) -->
        <div class="map-column">
          <nz-card nzTitle="Route Map" class="panel-card map-card">
            <div class="map-placeholder">
              <span nz-icon nzType="environment" nzTheme="outline" style="font-size: 48px; color: #ccc;"></span>
              <p>Map preview coming soon</p>
              <p class="map-hint">Integrate Azure Maps or Google Maps</p>
            </div>
            <div class="route-legend">
              <div *ngFor="let lane of lanes" class="legend-item">
                <span class="legend-dot" [style.background]="getTechColor(lane.technician.id)"></span>
                <span>{{ lane.technician.name }} ({{ lane.orders.length }} stops)</span>
              </div>
            </div>
          </nz-card>
        </div>
      </div>
    </div>
  `,
    styles: [`
    .planning-container { height: calc(100vh - 120px); display: flex; flex-direction: column; }
    .planning-header { 
      display: flex; justify-content: space-between; align-items: center; 
      padding: 16px 0; border-bottom: 1px solid #f0f0f0; margin-bottom: 16px;
    }
    .header-left { display: flex; align-items: center; gap: 12px; }
    .header-left h2 { margin: 0; }
    .header-right { display: flex; gap: 8px; }

    .planning-body { display: flex; flex: 1; gap: 16px; overflow: hidden; }
    
    .unplanned-column { width: 280px; flex-shrink: 0; }
    .lanes-column { flex: 1; overflow-x: auto; }
    .map-column { width: 300px; flex-shrink: 0; }

    .panel-card { height: 100%; display: flex; flex-direction: column; }
    .panel-card ::ng-deep .ant-card-body { flex: 1; overflow-y: auto; padding: 12px; }

    .lanes-wrapper { display: flex; gap: 16px; height: 100%; min-width: max-content; }
    .tech-lane { width: 280px; flex-shrink: 0; }
    .lane-card { height: 100%; display: flex; flex-direction: column; }
    .lane-card ::ng-deep .ant-card-body { flex: 1; overflow-y: auto; padding: 8px; }

    .lane-header-content { display: flex; flex-direction: column; }
    .tech-name { font-weight: 600; }
    .tech-shift { font-size: 12px; color: #888; }

    .job-list { min-height: 100px; }
    .lane-list { min-height: 200px; background: #fafafa; border-radius: 4px; padding: 8px; }
    
    .job-card {
      background: white; border: 1px solid #e8e8e8; border-radius: 6px;
      padding: 10px; margin-bottom: 8px; cursor: grab;
      transition: box-shadow 0.2s;
    }
    .job-card:hover { box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
    .job-card.cdk-drag-placeholder { background: #f0f0f0; border: 2px dashed #1890ff; }
    .job-card.cdk-drag-preview { box-shadow: 0 4px 16px rgba(0,0,0,0.2); }
    
    .planned-card { border-left: 3px solid #1890ff; }

    .job-header { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .stop-number { 
      width: 20px; height: 20px; border-radius: 50%; background: #1890ff; 
      color: white; font-size: 11px; display: flex; align-items: center; justify-content: center;
    }
    .job-number { font-weight: 600; flex: 1; }

    .job-customer { font-size: 13px; color: #333; margin-bottom: 4px; }
    .job-details { font-size: 12px; color: #666; display: flex; gap: 8px; }
    .warranty-badge { color: #1890ff; }
    
    .job-meta { font-size: 11px; color: #888; display: flex; gap: 12px; margin-top: 4px; }
    .time-window { background: #e6f7ff; padding: 2px 6px; border-radius: 3px; }
    .service-time { background: #f0f0f0; padding: 2px 6px; border-radius: 3px; }

    .job-location { font-size: 11px; color: #999; margin-top: 4px; }

    .job-times { font-size: 11px; color: #52c41a; margin: 4px 0; }
    .job-times .eta { margin-right: 12px; }

    .job-violations { margin-top: 4px; }

    .lane-footer { 
      display: flex; gap: 12px; padding: 8px; background: #fafafa; 
      border-top: 1px solid #f0f0f0; font-size: 11px; color: #666;
    }
    .lane-warnings { padding: 4px 8px; }

    .empty-state, .empty-lane { 
      display: flex; flex-direction: column; align-items: center; 
      justify-content: center; padding: 24px; color: #999;
    }

    .map-card ::ng-deep .ant-card-body { display: flex; flex-direction: column; }
    .map-placeholder { 
      flex: 1; display: flex; flex-direction: column; 
      align-items: center; justify-content: center; 
      background: #fafafa; border-radius: 4px; min-height: 200px;
    }
    .map-hint { font-size: 11px; color: #999; }
    
    .route-legend { padding-top: 12px; border-top: 1px solid #f0f0f0; margin-top: 12px; }
    .legend-item { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; font-size: 12px; }
    .legend-dot { width: 12px; height: 12px; border-radius: 50%; }

    button.locked { color: #faad14; }

    .cdk-drag-animating { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
    .cdk-drop-list-dragging .job-card:not(.cdk-drag-placeholder) { transition: transform 250ms cubic-bezier(0, 0, 0.2, 1); }
  `]
})
export class PlanningComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();

    selectedDate: Date = new Date();
    selectedSite = 'SITE-001';
    optimizing = false;

    unplannedOrders: WorkOrder[] = [];
    lanes: LaneData[] = [];
    laneIds: string[] = [];

    technicians: Technician[] = [];
    private techColors = ['#1890ff', '#52c41a', '#fa8c16', '#eb2f96', '#722ed1'];

    get hasPlannedOrders(): boolean {
        return this.lanes.some(l => l.orders.length > 0);
    }

    constructor(
        private planningState: PlanningStateService,
        private planningEngine: PlanningEngineService,
        private stateService: StateService,
        private configService: ConfigService,
        private message: NzMessageService,
        private notification: NzNotificationService,
        private router: Router
    ) { }

    ngOnInit() {
        // Subscribe to technicians
        this.stateService.technicians$.pipe(takeUntil(this.destroy$)).subscribe(techs => {
            this.technicians = techs.filter(t => t.active && t.shiftStatus === 'On');
            this.initializeLanes();
        });

        // Subscribe to unplanned orders
        this.planningState.unplannedOrders$.pipe(takeUntil(this.destroy$)).subscribe(orders => {
            this.unplannedOrders = orders;
        });

        // Subscribe to plans
        this.planningState.plans$.pipe(takeUntil(this.destroy$)).subscribe(plans => {
            this.updateLanesFromPlans(plans);
        });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    private initializeLanes() {
        this.lanes = this.technicians.map(tech => ({
            technician: tech,
            plan: {
                date: this.planningState.getDate(),
                technicianId: tech.id,
                stops: [],
                totalDistanceKm: 0,
                totalTravelMin: 0,
                totalServiceMin: 0,
                warnings: []
            },
            orders: []
        }));
        this.laneIds = this.lanes.map(l => 'lane-' + l.technician.id);
    }

    private updateLanesFromPlans(plans: Map<string, DayPlan>) {
        for (const lane of this.lanes) {
            const plan = plans.get(lane.technician.id);
            if (plan) {
                lane.plan = plan;
                lane.orders = plan.stops.map(stop =>
                    this.stateService.getWorkOrder(stop.workOrderId)
                ).filter((o): o is WorkOrder => !!o);
            } else {
                lane.plan = {
                    date: this.planningState.getDate(),
                    technicianId: lane.technician.id,
                    stops: [],
                    totalDistanceKm: 0,
                    totalTravelMin: 0,
                    totalServiceMin: 0,
                    warnings: []
                };
                lane.orders = [];
            }
        }
    }

    onDateChange(date: Date) {
        if (date) {
            const dateStr = date.toISOString().split('T')[0];
            this.planningState.setDate(dateStr);
        }
    }

    async optimizeDay() {
        this.optimizing = true;
        this.planningState.saveSnapshot();

        try {
            const plans = await this.planningEngine.buildGreedyPlan(
                this.planningState.getDate(),
                this.unplannedOrders,
                this.technicians
            );
            this.planningState.setPlans(plans);
            this.message.success('Optimization complete!');
        } catch (err) {
            this.message.error('Optimization failed');
        } finally {
            this.optimizing = false;
        }
    }

    recalcETAs() {
        const config = this.configService.getConfig();
        const avgSpeed = config.planningAvgSpeedKmh || config.avgSpeedKmh;
        const defaultService = config.defaultServiceTimeMin;
        const date = this.planningState.getDate();

        for (const lane of this.lanes) {
            if (lane.orders.length > 0) {
                // Rebuild stops from current order sequence
                lane.plan.stops = lane.orders.map(order => ({
                    workOrderId: order.id,
                    eta: '',
                    startServiceAt: '',
                    endServiceAt: '',
                    distanceFromPrevKm: 0,
                    travelMin: 0
                }));
                this.planningEngine.recalcPlan(lane.plan, lane.technician, avgSpeed, defaultService, date);
                this.planningState.updatePlan(lane.technician.id, lane.plan);
            }
        }
        this.message.info('ETAs recalculated');
    }

    commitPlan() {
        this.planningState.saveSnapshot();
        const plans = this.planningState.getPlans();
        this.planningEngine.commitPlan(plans);

        this.notification.success(
            'Plan Committed',
            `${this.getTotalPlannedCount()} jobs assigned to ${plans.size} technicians`
        );
        this.router.navigate(['/orders']);
    }

    private getTotalPlannedCount(): number {
        return this.lanes.reduce((sum, l) => sum + l.orders.length, 0);
    }

    // Drag & Drop handlers
    dropToUnplanned(event: CdkDragDrop<WorkOrder[]>) {
        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );
            this.syncLanesToState();
        }
    }

    dropToLane(event: CdkDragDrop<WorkOrder[]>, lane: LaneData) {
        if (event.previousContainer === event.container) {
            moveItemInArray(lane.orders, event.previousIndex, event.currentIndex);
        } else {
            transferArrayItem(
                event.previousContainer.data,
                lane.orders,
                event.previousIndex,
                event.currentIndex
            );
        }
        this.syncLanesToState();
        this.recalcSingleLane(lane);
    }

    private syncLanesToState() {
        const plans = new Map<string, DayPlan>();
        for (const lane of this.lanes) {
            lane.plan.stops = lane.orders.map(o => ({
                workOrderId: o.id,
                eta: '',
                startServiceAt: '',
                endServiceAt: '',
                distanceFromPrevKm: 0,
                travelMin: 0
            }));
            plans.set(lane.technician.id, lane.plan);
        }
        this.planningState.setPlans(plans);
    }

    private recalcSingleLane(lane: LaneData) {
        const config = this.configService.getConfig();
        this.planningEngine.recalcPlan(
            lane.plan,
            lane.technician,
            config.planningAvgSpeedKmh || config.avgSpeedKmh,
            config.defaultServiceTimeMin,
            this.planningState.getDate()
        );
        this.planningState.updatePlan(lane.technician.id, lane.plan);
    }

    getAllConnectedLists(currentTechId: string): string[] {
        return ['unplannedList', ...this.laneIds.filter(id => id !== 'lane-' + currentTechId)];
    }

    toggleLock(order: WorkOrder, event: Event) {
        event.stopPropagation();
        order.lockedInPlan = !order.lockedInPlan;
        this.stateService.updateWorkOrder(order);
    }

    // Helpers
    getPriorityColor(priority: string): string {
        const map: Record<string, string> = { 'Low': 'success', 'Normal': 'processing', 'High': 'warning', 'Urgent': 'error' };
        return map[priority] || 'default';
    }

    formatTime(isoString: string): string {
        if (!isoString) return '--:--';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    }

    getStopInfo(plan: DayPlan, orderId: string): RouteStop | undefined {
        return plan.stops.find(s => s.workOrderId === orderId);
    }

    hasTimeWindowViolation(plan: DayPlan, order: WorkOrder): boolean {
        return plan.warnings?.some(w => w.includes(order.number) && w.includes('Time window')) ?? false;
    }

    hasShiftOverflow(plan: DayPlan, order: WorkOrder): boolean {
        return plan.warnings?.some(w => w.includes('Shift overflow')) ?? false;
    }

    getTechColor(techId: string): string {
        const idx = this.technicians.findIndex(t => t.id === techId);
        return this.techColors[idx % this.techColors.length];
    }
}
