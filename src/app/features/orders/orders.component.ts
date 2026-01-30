import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzTooltipModule } from 'ng-zorro-antd/tooltip';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTabsModule, NzTabsComponent, NzTabComponent } from 'ng-zorro-antd/tabs';
import { NzTimelineModule } from 'ng-zorro-antd/timeline';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzDescriptionsModule } from 'ng-zorro-antd/descriptions';
import { NzCardModule } from 'ng-zorro-antd/card';
import { StateService } from '../../core/services/state.service';
import { AutoAssignService } from '../../core/services/auto-assign.service';
import { SupervisorReviewService } from '../../core/services/supervisor-review.service';
import { WorkOrder, WorkOrderStatus } from '../../core/models/work-order.model';
import { StatusEvent, ChangeEntry, WorkResult, ReasonCode, ResolutionCode, REASON_CODE_LABELS, RESOLUTION_CODE_LABELS } from '../../core/models/audit.model';
import { SupervisorReview, REVIEW_OUTCOME_LABELS, REVIEW_OUTCOME_COLORS } from '../../core/models/review.model';
import { OrderFeesComponent } from './order-fees.component';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterLink,
    NzTableModule,
    NzTagModule,
    NzButtonModule,
    NzIconModule,
    NzDrawerModule,
    NzTooltipModule,
    NzDividerModule,
    NzTabsModule,
    NzTimelineModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzInputNumberModule,
    NzModalModule,
    NzEmptyModule,
    NzBadgeModule,
    NzRateModule,
    NzDescriptionsModule,
    NzCardModule,
    OrderFeesComponent
  ],
  template: `
    <div class="orders-container">
      <div class="page-header">
        <h2>Orders</h2>
        <button nz-button nzType="primary" routerLink="/create">Create Order</button>
      </div>

      <nz-table #basicTable [nzData]="(workOrders$ | async) || []" [nzPageSize]="10">
        <thead>
          <tr>
            <th>Number</th>
            <th>Customer</th>
            <th>Category</th>
            <th>Status</th>
            <th>Priority</th>
            <th>Assigned Tech</th>
            <th>Result</th>
            <th>Last Update</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of basicTable.data">
            <td><a (click)="openDrawer(data)">{{data.number}}</a></td>
            <td>{{ data.customer.name }}</td>
            <td>{{data.category}}</td>
            <td><nz-tag [nzColor]="getStatusColor(data.status)">{{data.status}}</nz-tag></td>
            <td><nz-tag [nzColor]="getPriorityColor(data.priority)">{{data.priority}}</nz-tag></td>
            <td>{{ getTechName(data.assignedTechnicianId) }}</td>
            <td>
              <nz-badge *ngIf="data.result" nzStatus="success" nzText="Yes"></nz-badge>
              <span *ngIf="!data.result" style="color:#999">-</span>
            </td>
            <td>{{ getRelativeTime(data) }}</td>
            <td>
              <button nz-button nzType="link" (click)="openDrawer(data)">Details</button>
              <button nz-button nzType="link" *ngIf="data.status === 'New'" (click)="setReady(data)">Set Ready</button>
              <button nz-button nzType="link" *ngIf="data.status === 'Ready'" (click)="autoAssign(data)">Auto Assign</button>
              <button nz-button nzType="text" nzDanger *ngIf="canCancel(data)" (click)="cancelOrder(data)">Cancel</button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- Order Details Drawer -->
      <nz-drawer
        [nzClosable]="true"
        [nzVisible]="drawerVisible"
        nzPlacement="right"
        [nzTitle]="drawerTitle"
        (nzOnClose)="closeDrawer()"
        [nzWidth]="560"
      >
        <ng-template #drawerTitle>
          <div class="drawer-header" *ngIf="selectedOrder">
            <span class="wo-number">{{selectedOrder.number}}</span>
            <nz-tag [nzColor]="getStatusColor(selectedOrder.status)">{{selectedOrder.status}}</nz-tag>
            <nz-tag [nzColor]="getPriorityColor(selectedOrder.priority)">{{selectedOrder.priority}}</nz-tag>
            <nz-tag *ngIf="selectedOrder.warranty" nzColor="blue">Warranty</nz-tag>
          </div>
        </ng-template>
        
        <ng-container *nzDrawerContent>
          <nz-tabs *ngIf="selectedOrder">
            <!-- Details Tab -->
            <nz-tab nzTitle="Details">
              <div class="tab-content">
                <h4>Customer</h4>
                <p><strong>Name:</strong> {{selectedOrder.customer.name}}</p>
                <p><strong>Phone:</strong> {{selectedOrder.customer.phone || 'N/A'}}</p>
                <p><strong>Email:</strong> {{selectedOrder.customer.email || 'N/A'}}</p>
                <p *ngIf="selectedOrder.customer.unit"><strong>Unit:</strong> {{selectedOrder.customer.unit}}</p>
                
                <nz-divider></nz-divider>
                
                <h4>Address</h4>
                <p>{{selectedOrder.address.line1}}</p>
                <p *ngIf="selectedOrder.address.city">{{selectedOrder.address.city}}</p>
                
                <nz-divider></nz-divider>
                
                <h4>Assignment</h4>
                <p *ngIf="selectedOrder.assignedTechnicianId">
                  <strong>Technician:</strong> {{getTechName(selectedOrder.assignedTechnicianId)}}<br>
                  <strong>Scheduled:</strong> {{formatDateTime(selectedOrder.scheduledStartAt)}}<br>
                  <strong>ETA:</strong> {{selectedOrder.etaMin || '-'}} min
                </p>
                <p *ngIf="!selectedOrder.assignedTechnicianId">Not assigned yet.</p>
                
                <div class="action-buttons" *ngIf="selectedOrder.status !== 'Completed' && selectedOrder.status !== 'Cancelled'">
                  <button nz-button *ngIf="selectedOrder.assignedTechnicianId" (click)="showReassignModal()">Reassign</button>
                  <button nz-button nzType="primary" *ngIf="selectedOrder.status === 'OnSite'" (click)="completeOrder()">Complete</button>
                </div>
              </div>
            </nz-tab>

            <!-- Timeline Tab -->
            <nz-tab nzTitle="Timeline">
              <div class="tab-content">
                <nz-timeline *ngIf="selectedOrder.statusHistory?.length; else noTimeline">
                  <nz-timeline-item 
                    *ngFor="let event of selectedOrder.statusHistory" 
                    [nzColor]="getTimelineColor(event.toStatus)"
                  >
                    <div class="timeline-item">
                      <strong>{{event.toStatus}}</strong>
                      <span class="timeline-by"> by {{event.by.name}}</span>
                      <div class="timeline-time">{{formatDateTime(event.at)}}</div>
                      <div *ngIf="event.reason" class="timeline-reason">
                        <nz-tag>{{getReasonLabel(event.reason)}}</nz-tag>
                      </div>
                      <div *ngIf="event.note" class="timeline-note">{{event.note}}</div>
                    </div>
                  </nz-timeline-item>
                </nz-timeline>
                <ng-template #noTimeline>
                  <nz-empty nzNotFoundContent="No status history yet"></nz-empty>
                </ng-template>
              </div>
            </nz-tab>

            <!-- Audit Tab -->
            <nz-tab nzTitle="Audit">
              <div class="tab-content">
                <nz-table 
                  #auditTable 
                  [nzData]="selectedOrder.changeLog || []" 
                  [nzPageSize]="5"
                  nzSize="small"
                  *ngIf="selectedOrder.changeLog?.length; else noAudit"
                >
                  <thead>
                    <tr>
                      <th>Field</th>
                      <th>From</th>
                      <th>To</th>
                      <th>By</th>
                      <th>When</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr *ngFor="let entry of auditTable.data">
                      <td>{{formatFieldName(entry.field)}}</td>
                      <td>{{entry.from || '-'}}</td>
                      <td>{{entry.to || '-'}}</td>
                      <td>{{entry.by.name}}</td>
                      <td>{{formatDateTime(entry.at)}}</td>
                    </tr>
                  </tbody>
                </nz-table>
                <ng-template #noAudit>
                  <nz-empty nzNotFoundContent="No changes recorded"></nz-empty>
                </ng-template>
              </div>
            </nz-tab>

            <!-- Result Tab -->
            <nz-tab nzTitle="Result">
              <div class="tab-content">
                <form [formGroup]="resultForm" nz-form nzLayout="vertical">
                  <nz-form-item>
                    <nz-form-label nzRequired>Resolution</nz-form-label>
                    <nz-form-control>
                      <nz-select formControlName="resolutionCode" style="width: 100%;">
                        <nz-option *ngFor="let r of resolutionOptions" [nzValue]="r.value" [nzLabel]="r.label"></nz-option>
                      </nz-select>
                    </nz-form-control>
                  </nz-form-item>
                  
                  <nz-form-item>
                    <nz-form-label nzRequired>Summary</nz-form-label>
                    <nz-form-control nzErrorTip="Summary is required">
                      <textarea nz-input formControlName="summary" rows="3" placeholder="Describe work performed..."></textarea>
                    </nz-form-control>
                  </nz-form-item>

                  <nz-form-item>
                    <nz-form-label>On-site Duration (min)</nz-form-label>
                    <nz-form-control>
                      <nz-input-number formControlName="durationMin" [nzMin]="0" [nzMax]="480" style="width: 100%;"></nz-input-number>
                    </nz-form-control>
                  </nz-form-item>

                  <nz-form-item>
                    <nz-form-label>Technician Note</nz-form-label>
                    <nz-form-control>
                      <textarea nz-input formControlName="technicianNote" rows="2" placeholder="Additional notes..."></textarea>
                    </nz-form-control>
                  </nz-form-item>

                  <nz-divider nzText="Charges (Optional)"></nz-divider>
                  
                  <div nz-row [nzGutter]="16">
                    <div nz-col [nzSpan]="12">
                      <nz-form-item>
                        <nz-form-label>Warranty Covered</nz-form-label>
                        <nz-form-control>
                          <nz-input-number formControlName="warrantyCovered" [nzMin]="0" style="width: 100%;"></nz-input-number>
                        </nz-form-control>
                      </nz-form-item>
                    </div>
                    <div nz-col [nzSpan]="12">
                      <nz-form-item>
                        <nz-form-label>Customer Charge</nz-form-label>
                        <nz-form-control>
                          <nz-input-number formControlName="customerCharge" [nzMin]="0" style="width: 100%;"></nz-input-number>
                        </nz-form-control>
                      </nz-form-item>
                    </div>
                  </div>

                  <div class="result-actions">
                    <button nz-button nzType="primary" (click)="saveResult()">Save Result</button>
                  </div>
                </form>
              </div>
            </nz-tab>

            <!-- Review Tab -->
            <nz-tab nzTitle="Review">
              <div class="tab-content">
                <div *ngIf="selectedOrderReview$ | async as review; else noReview">
                  <nz-descriptions nzBordered [nzColumn]="1">
                    <nz-descriptions-item nzTitle="Outcome">
                      <nz-tag [nzColor]="getOutcomeColor(review.outcome)">
                        {{ getOutcomeLabel(review.outcome) }}
                      </nz-tag>
                    </nz-descriptions-item>
                    <nz-descriptions-item nzTitle="Score">
                      <nz-rate [ngModel]="review.score / 20" nzDisabled [nzAllowHalf]="true"></nz-rate>
                      <span style="margin-left: 8px;">{{ review.score }}/100</span>
                    </nz-descriptions-item>
                    <nz-descriptions-item nzTitle="Reviewed At">
                      {{ formatDateTime(review.reviewedAt) }}
                    </nz-descriptions-item>
                    <nz-descriptions-item nzTitle="Supervisor">
                      Supervisor {{ review.supervisorId.slice(-4) }}
                    </nz-descriptions-item>
                  </nz-descriptions>

                  <nz-divider nzText="Compliance Checklist"></nz-divider>
                  <nz-card>
                    <div class="compliance-grid">
                      <div class="compliance-item">
                        <span nz-icon [nzType]="review.compliance.safety ? 'check-circle' : 'close-circle'" 
                          [nzTheme]="review.compliance.safety ? 'twotone' : 'fill'"
                          [nzTwotoneColor]="review.compliance.safety ? '#52c41a' : '#ff4d4f'"></span>
                        <span>Safety Protocols</span>
                      </div>
                      <div class="compliance-item">
                        <span nz-icon [nzType]="review.compliance.partsMatchedReservation ? 'check-circle' : 'close-circle'" 
                          [nzTheme]="review.compliance.partsMatchedReservation ? 'twotone' : 'fill'"
                          [nzTwotoneColor]="review.compliance.partsMatchedReservation ? '#52c41a' : '#ff4d4f'"></span>
                        <span>Parts Matched Reservation</span>
                      </div>
                      <div class="compliance-item">
                        <span nz-icon [nzType]="review.compliance.paymentCapturedIfRequired ? 'check-circle' : 'close-circle'" 
                          [nzTheme]="review.compliance.paymentCapturedIfRequired ? 'twotone' : 'fill'"
                          [nzTwotoneColor]="review.compliance.paymentCapturedIfRequired ? '#52c41a' : '#ff4d4f'"></span>
                        <span>Payment Captured</span>
                      </div>
                      <div class="compliance-item">
                        <span nz-icon [nzType]="review.compliance.photosSufficient ? 'check-circle' : 'close-circle'" 
                          [nzTheme]="review.compliance.photosSufficient ? 'twotone' : 'fill'"
                          [nzTwotoneColor]="review.compliance.photosSufficient ? '#52c41a' : '#ff4d4f'"></span>
                        <span>Photos Sufficient</span>
                      </div>
                      <div class="compliance-item">
                        <span nz-icon [nzType]="review.compliance.customerCommunicated ? 'check-circle' : 'close-circle'" 
                          [nzTheme]="review.compliance.customerCommunicated ? 'twotone' : 'fill'"
                          [nzTwotoneColor]="review.compliance.customerCommunicated ? '#52c41a' : '#ff4d4f'"></span>
                        <span>Customer Communication</span>
                      </div>
                    </div>
                  </nz-card>

                  <nz-divider nzText="Notes" *ngIf="review.notes"></nz-divider>
                  <p *ngIf="review.notes" class="review-notes">{{ review.notes }}</p>

                  <nz-divider nzText="Attachments" *ngIf="review.attachments?.length"></nz-divider>
                  <div *ngIf="review.attachments?.length" class="attachments">
                    <nz-tag *ngFor="let att of review.attachments" nzColor="blue">
                      <span nz-icon nzType="paper-clip"></span> {{ att.name }}
                    </nz-tag>
                  </div>
                </div>
                <ng-template #noReview>
                  <nz-empty nzNotFoundContent="No supervisor review yet">
                    <ng-template nz-empty-description>
                      <p>This order has not been reviewed by a supervisor.</p>
                      <p *ngIf="selectedOrder?.status === 'Completed'"><small>A review task should be created within 24 hours of completion.</small></p>
                    </ng-template>
                  </nz-empty>
                </ng-template>
              </div>
            </nz-tab>

            <!-- Fees Tab -->
            <nz-tab nzTitle="Fees">
              <div class="tab-content">
                <app-order-fees [workOrder]="selectedOrder"></app-order-fees>
              </div>
            </nz-tab>
          </nz-tabs>
        </ng-container>
      </nz-drawer>

      <!-- Reassign Modal -->
      <nz-modal
        [(nzVisible)]="reassignModalVisible"
        nzTitle="Reassign Technician"
        (nzOnCancel)="reassignModalVisible = false"
        (nzOnOk)="confirmReassign()"
      >
        <ng-container *nzModalContent>
          <nz-form-item>
            <nz-form-label>Select Technician</nz-form-label>
            <nz-form-control>
              <nz-select [(ngModel)]="reassignTechId" style="width: 100%;">
                <nz-option *ngFor="let t of availableTechs" [nzValue]="t.id" [nzLabel]="t.name"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Reason</nz-form-label>
            <nz-form-control>
              <nz-select [(ngModel)]="reassignReason" style="width: 100%;">
                <nz-option *ngFor="let r of reasonOptions" [nzValue]="r.value" [nzLabel]="r.label"></nz-option>
              </nz-select>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Note (optional)</nz-form-label>
            <nz-form-control>
              <textarea nz-input [(ngModel)]="reassignNote" rows="2"></textarea>
            </nz-form-control>
          </nz-form-item>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .orders-container { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .drawer-header { display: flex; align-items: center; gap: 8px; }
    .wo-number { font-weight: 600; font-size: 16px; }
    .tab-content { padding: 16px 0; }
    .action-buttons { margin-top: 16px; display: flex; gap: 8px; }
    
    .timeline-item { line-height: 1.6; }
    .timeline-by { color: #666; }
    .timeline-time { font-size: 12px; color: #999; }
    .timeline-reason { margin-top: 4px; }
    .timeline-note { font-style: italic; color: #666; margin-top: 4px; }
    
    .result-actions { margin-top: 16px; display: flex; justify-content: flex-end; }
    
    .compliance-grid { display: grid; grid-template-columns: 1fr; gap: 12px; }
    .compliance-item { display: flex; align-items: center; gap: 8px; }
    .compliance-item span[nz-icon] { font-size: 18px; }
    .review-notes { padding: 12px; background: #f5f5f5; border-radius: 4px; white-space: pre-wrap; }
    .attachments { display: flex; flex-wrap: wrap; gap: 8px; }
  `]
})
export class OrdersComponent implements OnInit {
  workOrders$: Observable<WorkOrder[]>;
  drawerVisible = false;
  selectedOrder: WorkOrder | null = null;

  // Result form
  resultForm: FormGroup;
  resolutionOptions = Object.entries(RESOLUTION_CODE_LABELS).map(([value, label]) => ({ value, label }));

  // Reassign modal
  reassignModalVisible = false;
  reassignTechId: string | null = null;
  reassignReason: ReasonCode = 'Reassign-Capacity';
  reassignNote = '';
  availableTechs: { id: string; name: string }[] = [];
  reasonOptions = Object.entries(REASON_CODE_LABELS).map(([value, label]) => ({ value, label }));

  // Review data
  selectedOrderReview$: Observable<SupervisorReview | undefined> | null = null;
  outcomeLabels = REVIEW_OUTCOME_LABELS;
  outcomeColors = REVIEW_OUTCOME_COLORS;

  constructor(
    private stateService: StateService,
    private autoAssignService: AutoAssignService,
    private reviewService: SupervisorReviewService,
    private message: NzMessageService,
    private modal: NzModalService,
    private fb: FormBuilder
  ) {
    this.workOrders$ = this.stateService.workOrders$;
    this.resultForm = this.fb.group({
      resolutionCode: ['Fixed', Validators.required],
      summary: ['', Validators.required],
      durationMin: [null],
      technicianNote: [''],
      warrantyCovered: [null],
      customerCharge: [null]
    });
  }

  ngOnInit(): void {
    this.availableTechs = this.stateService.getTechnicians()
      .filter(t => t.active)
      .map(t => ({ id: t.id, name: t.name }));
  }

  getStatusColor(status: WorkOrderStatus): string {
    const map: Record<string, string> = {
      'New': 'default', 'Ready': 'gold', 'Assigned': 'geekblue',
      'EnRoute': 'cyan', 'OnSite': 'processing', 'Completed': 'green',
      'OnHold': 'volcano', 'Cancelled': 'red'
    };
    return map[status] || 'default';
  }

  getPriorityColor(priority: string): string {
    const map: Record<string, string> = { 'Low': 'success', 'Normal': 'processing', 'High': 'warning', 'Urgent': 'error' };
    return map[priority] || 'default';
  }

  getTechName(id: string | null | undefined): string {
    if (!id) return '-';
    const tech = this.stateService.getTechnician(id);
    return tech ? tech.name : id;
  }

  getRelativeTime(order: WorkOrder): string {
    const lastUpdate = this.stateService.getLastUpdate(order.id);
    if (!lastUpdate) return '-';
    const diffMs = Date.now() - lastUpdate.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    const diffHours = Math.floor(diffMin / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return `${Math.floor(diffHours / 24)}d ago`;
  }

  canCancel(order: WorkOrder): boolean {
    return !['Completed', 'Cancelled'].includes(order.status);
  }

  openDrawer(order: WorkOrder) {
    this.selectedOrder = order;
    this.drawerVisible = true;
    // Load review if exists
    this.selectedOrderReview$ = this.reviewService.getByWorkOrder(order.id);
    // Load result into form if exists
    if (order.result) {
      this.resultForm.patchValue({
        resolutionCode: order.result.resolutionCode,
        summary: order.result.summary,
        durationMin: order.result.durationMin,
        technicianNote: order.result.technicianNote,
        warrantyCovered: order.result.charges?.warrantyCovered,
        customerCharge: order.result.charges?.customerCharge
      });
    } else {
      this.resultForm.reset({ resolutionCode: 'Fixed' });
    }
  }

  closeDrawer() {
    this.drawerVisible = false;
    this.selectedOrder = null;
  }

  setReady(order: WorkOrder) {
    this.stateService.updateWorkOrderTracked(order.id, { status: 'Ready' });
    this.message.success(`Order ${order.number} marked as Ready`);
  }

  autoAssign(order: WorkOrder) {
    const result = this.autoAssignService.tryAssign(order);
    if (result.success) {
      this.stateService.updateWorkOrderTracked(order.id, {
        status: 'Assigned',
        assignedTechnicianId: result.technicianId,
        etaMin: result.etaMin,
        distanceKm: result.distanceKm
      });
      this.message.success(`Assigned to ${this.getTechName(result.technicianId)}`);
    } else {
      this.message.error(`Auto-assign failed: ${result.reason}`);
    }
  }

  cancelOrder(order: WorkOrder) {
    this.modal.confirm({
      nzTitle: 'Cancel Order?',
      nzContent: 'This action cannot be undone. Are you sure?',
      nzOkText: 'Yes, Cancel',
      nzOkDanger: true,
      nzOnOk: () => {
        this.stateService.updateWorkOrderTracked(order.id, { status: 'Cancelled' }, 'Other', 'Cancelled by dispatcher');
        this.message.info(`Order ${order.number} cancelled`);
        this.closeDrawer();
      }
    });
  }

  completeOrder() {
    if (!this.selectedOrder) return;
    const hasResult = !!this.selectedOrder.result;

    if (!hasResult) {
      this.modal.confirm({
        nzTitle: 'No Result Recorded',
        nzContent: 'This order has no result recorded. Complete anyway?',
        nzOkText: 'Complete',
        nzOnOk: () => this.doComplete()
      });
    } else {
      this.doComplete();
    }
  }

  private doComplete() {
    if (!this.selectedOrder) return;
    this.stateService.updateWorkOrderTracked(this.selectedOrder.id, { status: 'Completed' });
    this.message.success('Order completed');
    this.closeDrawer();
  }

  showReassignModal() {
    this.reassignTechId = null;
    this.reassignReason = 'Reassign-Capacity';
    this.reassignNote = '';
    this.reassignModalVisible = true;
  }

  confirmReassign() {
    if (!this.selectedOrder || !this.reassignTechId) {
      this.message.warning('Please select a technician');
      return;
    }

    this.stateService.updateWorkOrderTracked(
      this.selectedOrder.id,
      { assignedTechnicianId: this.reassignTechId },
      this.reassignReason,
      this.reassignNote
    );

    this.message.success(`Reassigned to ${this.getTechName(this.reassignTechId)}`);
    this.reassignModalVisible = false;

    // Refresh selected order
    this.selectedOrder = this.stateService.getWorkOrder(this.selectedOrder.id) || null;
  }

  saveResult() {
    if (!this.selectedOrder) return;

    if (this.resultForm.invalid) {
      Object.values(this.resultForm.controls).forEach(c => c.markAsDirty());
      this.message.warning('Please fill required fields');
      return;
    }

    const val = this.resultForm.value;
    const result: WorkResult = {
      resolutionCode: val.resolutionCode,
      summary: val.summary,
      durationMin: val.durationMin,
      technicianNote: val.technicianNote,
      charges: {
        warrantyCovered: val.warrantyCovered,
        customerCharge: val.customerCharge,
        total: (val.warrantyCovered || 0) + (val.customerCharge || 0),
        currency: 'USD'
      }
    };

    this.stateService.updateResult(this.selectedOrder.id, result);
    this.message.success('Result saved');

    // Prompt to complete if applicable
    if (['Fixed', 'InspectionOnly'].includes(val.resolutionCode) && this.selectedOrder.status !== 'Completed') {
      this.modal.confirm({
        nzTitle: 'Mark as Completed?',
        nzContent: 'The result has been saved. Would you like to mark this order as Completed?',
        nzOkText: 'Complete',
        nzOnOk: () => {
          this.stateService.updateWorkOrderTracked(this.selectedOrder!.id, { status: 'Completed' });
          this.message.success('Order completed');
          this.closeDrawer();
        }
      });
    }

    // Refresh
    this.selectedOrder = this.stateService.getWorkOrder(this.selectedOrder.id) || null;
  }

  // Helpers
  getTimelineColor(status: string): string {
    const map: Record<string, string> = {
      'New': 'gray', 'Ready': 'gold', 'Assigned': 'blue',
      'EnRoute': 'cyan', 'OnSite': 'orange', 'Completed': 'green',
      'OnHold': 'red', 'Cancelled': 'red'
    };
    return map[status] || 'gray';
  }

  getReasonLabel(reason: ReasonCode): string {
    return REASON_CODE_LABELS[reason] || reason;
  }

  formatDateTime(iso: string | null | undefined): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleString();
  }

  formatFieldName(field: string): string {
    return field.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase());
  }

  getOutcomeColor(outcome: string): string {
    return (this.outcomeColors as any)[outcome] || 'default';
  }

  getOutcomeLabel(outcome: string): string {
    return (this.outcomeLabels as any)[outcome] || outcome;
  }
}
