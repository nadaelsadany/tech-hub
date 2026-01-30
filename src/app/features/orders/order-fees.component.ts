import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzDrawerModule, NzDrawerService } from 'ng-zorro-antd/drawer';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { WorkOrder } from '../../core/models/work-order.model';
import { Invoice, FeeLine, PaymentRecord, SplitEntry, FeeLineType } from '../../core/models/invoice.model';
import { AccountingService } from '../../core/services/accounting.service';
import { CatalogService } from '../../core/services/catalog.service';
import { StateService } from '../../core/services/state.service';

@Component({
  selector: 'app-order-fees',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzCardModule,
    NzStatisticModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzDrawerModule,
    NzFormModule,
    NzInputModule,
    NzInputNumberModule,
    NzSelectModule,
    NzSwitchModule,
    NzSpaceModule,
    NzDividerModule
  ],
  template: `
    <div class="order-fees-container">
      <!-- Header -->
      <nz-card class="fees-header">
        <div class="header-content">
          <div>
            <h3>Financial Details</h3>
            <div class="status-row">
              <span>Status:</span>
              <nz-tag [nzColor]="getStatusColor(invoice?.status || 'unbilled')">
                {{ invoice?.status || 'Unbilled' }}
              </nz-tag>
              <span *ngIf="invoice" class="invoice-number">{{ invoice.number }}</span>
            </div>
          </div>
          <div class="header-actions" *ngIf="canEdit()">
            <button nz-button nzType="default" (click)="suggestLines()" [disabled]="invoice?.status !== 'DRAFT'">
              <span nz-icon nzType="bulb"></span> Suggest Lines
            </button>
            <button nz-button nzType="primary" (click)="saveInvoice()" [disabled]="!hasChanges">
              <span nz-icon nzType="save"></span> Save
            </button>
          </div>
        </div>
      </nz-card>

      <!-- Summary Cards -->
      <div class="summary-cards" *ngIf="invoice">
        <nz-card>
          <nz-statistic 
            [nzValue]="invoice.subtotal" 
            [nzTitle]="'Subtotal'" 
            [nzPrefix]="'EGP'">
          </nz-statistic>
        </nz-card>
        <nz-card>
          <nz-statistic 
            [nzValue]="invoice.taxTotal" 
            [nzTitle]="'Tax'" 
            [nzPrefix]="'EGP'">
          </nz-statistic>
        </nz-card>
        <nz-card>
          <nz-statistic 
            [nzValue]="invoice.grandTotal" 
            [nzTitle]="'Total'" 
            [nzPrefix]="'EGP'"
            [nzValueStyle]="{ color: '#3f8600' }">
          </nz-statistic>
        </nz-card>
        <nz-card>
          <nz-statistic 
            [nzValue]="invoice.balanceDue" 
            [nzTitle]="'Balance Due'" 
            [nzPrefix]="'EGP'"
            [nzValueStyle]="{ color: invoice.balanceDue > 0 ? '#cf1322' : '#3f8600' }">
          </nz-statistic>
        </nz-card>
      </div>

      <!-- Fee Lines Table -->
      <nz-card nzTitle="Fee Lines" [nzExtra]="feeTableExtra" class="fees-table-card">
        <ng-template #feeTableExtra>
          <button nz-button nzType="link" (click)="openAddLineDrawer()" *ngIf="canEdit() && invoice?.status === 'DRAFT'">
            <span nz-icon nzType="plus"></span> Add Line
          </button>
        </ng-template>

        <nz-table #feeTable [nzData]="invoice?.feeLines || []" [nzPageSize]="20" [nzScroll]="{ x: '1200px' }">
          <thead>
            <tr>
              <th>Type</th>
              <th>Description</th>
              <th nzAlign="right">Qty</th>
              <th nzAlign="right">Unit Price</th>
              <th nzAlign="center">Taxable</th>
              <th>Technician</th>
              <th nzAlign="right">Line Total</th>
              <th>Source</th>
              <th nzWidth="120px" nzAlign="center" *ngIf="canEdit()">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let line of feeTable.data">
              <td><nz-tag [nzColor]="getFeeTypeColor(line.type)">{{ line.type }}</nz-tag></td>
              <td>{{ line.description }}</td>
              <td nzAlign="right">{{ line.qty }}</td>
              <td nzAlign="right">{{ line.unitPrice | number: '1.2-2' }}</td>
              <td nzAlign="center">
                <span nz-icon [nzType]="line.taxable ? 'check-circle' : 'close-circle'" 
                      [nzTheme]="line.taxable ? 'twotone' : 'outline'"
                      [nzTwotoneColor]="'#52c41a'"></span>
              </td>
              <td>{{ getTechnicianName(line.technicianId) }}</td>
              <td nzAlign="right">{{ (line.qty * line.unitPrice) | number: '1.2-2' }}</td>
              <td><nz-tag>{{ line.source || 'MANUAL' }}</nz-tag></td>
              <td nzAlign="center" *ngIf="canEdit()">
                <button nz-button nzType="link" nzSize="small" (click)="editLine(line)" [disabled]="invoice?.status !== 'DRAFT'">
                  Edit
                </button>
                <nz-divider nzType="vertical"></nz-divider>
                <button nz-button nzType="link" nzSize="small" nzDanger (click)="deleteLine(line.id)" [disabled]="invoice?.status !== 'DRAFT'">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>

      <!-- Splits Configuration -->
      <nz-card nzTitle="Payment Splits" class="splits-card" *ngIf="invoice">
        <div class="splits-config">
          <div class="split-entry" *ngFor="let split of invoice.splits; let i = index">
            <span class="split-party">{{ split.party }}:</span>
            <span class="split-amount" *ngIf="split.percentage">
              {{ split.percentage }}% = EGP {{ getAllocationAmount(split.party) | number: '1.2-2' }}
            </span>
            <span class="split-amount" *ngIf="split.flatAmount">
              EGP {{ split.flatAmount | number: '1.2-2' }}
            </span>
          </div>

          <button nz-button nzType="dashed" nzBlock (click)="configureSplits()" *ngIf="canEdit()" style="margin-top: 16px;">
            <span nz-icon nzType="setting"></span> Configure Splits
          </button>
        </div>
      </nz-card>

      <!-- Payments -->
      <nz-card nzTitle="Payments" [nzExtra]="paymentTableExtra" class="payments-card" *ngIf="invoice">
        <ng-template #paymentTableExtra>
          <button nz-button nzType="link" (click)="recordPayment()" *ngIf="canEdit()">
            <span nz-icon nzType="plus"></span> Record Payment
          </button>
        </ng-template>

        <nz-table #paymentTable [nzData]="invoice.payments || []" [nzPageSize]="10">
          <thead>
            <tr>
              <th>Method</th>
              <th nzAlign="right">Amount</th>
              <th>Party</th>
              <th>Reference</th>
              <th>Date</th>
              <th>Received By</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of paymentTable.data">
              <td><nz-tag>{{ payment.method }}</nz-tag></td>
              <td nzAlign="right">EGP {{ payment.amount | number: '1.2-2' }}</td>
              <td><nz-tag>{{ payment.party }}</nz-tag></td>
              <td>{{ payment.reference || '-' }}</td>
              <td>{{ payment.receivedAt | date: 'short' }}</td>
              <td>{{ payment.receivedBy.name }}</td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>

      <!-- Action Buttons -->
      <nz-card class="actions-card" *ngIf="invoice && canEdit()">
        <nz-space>
          <button *nzSpaceItem nz-button nzType="default" (click)="approveInvoice()" 
                  [disabled]="invoice.status !== 'DRAFT'">
            <span nz-icon nzType="check"></span> Approve
          </button>
          <button *nzSpaceItem nz-button nzType="primary" (click)="issueInvoice()" 
                  [disabled]="invoice.status !== 'APPROVED'">
            <span nz-icon nzType="file-text"></span> Issue Invoice
          </button>
          <button *nzSpaceItem nz-button nzType="default" (click)="markAsPaid()" 
                  [disabled]="invoice.status !== 'ISSUED' && invoice.status !== 'PARTIAL'">
            <span nz-icon nzType="dollar"></span> Mark as Paid
          </button>
          <button *nzSpaceItem nz-button nzDanger (click)="voidInvoice()" 
                  [disabled]="invoice.status === 'VOID'">
            <span nz-icon nzType="close-circle"></span> Void
          </button>
        </nz-space>
      </nz-card>

      <!-- Create Invoice Button (if no invoice exists) -->
      <nz-card *ngIf="!invoice" class="no-invoice-card">
        <div class="no-invoice-content">
          <span nz-icon nzType="file-text" style="font-size: 48px; color: #ccc;"></span>
          <h3>No Invoice Created</h3>
          <p>Create an invoice to manage fees and payments for this order.</p>
          <button nz-button nzType="primary" nzSize="large" (click)="createInvoice()" *ngIf="canEdit()">
            <span nz-icon nzType="plus"></span> Create Invoice
          </button>
        </div>
      </nz-card>
    </div>
  `,
  styles: [`
    .order-fees-container {
      padding: 16px;
    }

    .fees-header .header-content {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }

    .status-row {
      display: flex;
      align-items: center;
      gap: 8px;
      margin-top: 8px;
    }

    .invoice-number {
      font-family: monospace;
      font-weight: 600;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }

    .summary-cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin: 16px 0;
    }

    .fees-table-card,
    .splits-card,
    .payments-card,
    .actions-card {
      margin-top: 16px;
    }

    .splits-config {
      max-width: 600px;
    }

    .split-entry {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      border-bottom: 1px solid #f0f0f0;
    }

    .split-party {
      font-weight: 600;
    }

    .split-amount {
      color: #52c41a;
      font-weight: 500;
    }

    .no-invoice-card {
      margin-top: 32px;
    }

    .no-invoice-content {
      text-align: center;
      padding: 48px 24px;
    }

    .no-invoice-content h3 {
      margin: 16px 0 8px;
    }

    .no-invoice-content p {
      color: #8c8c8c;
      margin-bottom: 24px;
    }
  `]
})
export class OrderFeesComponent implements OnInit {
  @Input() workOrder!: WorkOrder;

  private accountingService = inject(AccountingService);
  private catalogService = inject(CatalogService);
  private stateService = inject(StateService);
  private modal = inject(NzModalService);
  private drawer = inject(NzDrawerService);
  private fb = inject(FormBuilder);

  invoice: Invoice | undefined;
  hasChanges = false;

  ngOnInit(): void {
    this.loadInvoice();
  }

  loadInvoice(): void {
    if (this.workOrder.invoiceId) {
      this.invoice = this.accountingService.getInvoiceById(this.workOrder.invoiceId);
    }
  }

  createInvoice(): void {
    this.invoice = this.accountingService.createInvoiceForWorkOrder(this.workOrder);
    this.hasChanges = true;
  }

  suggestLines(): void {
    if (!this.invoice) return;

    const suggested = this.accountingService.suggestFeeLines(this.workOrder.id);
    suggested.forEach(line => {
      this.accountingService.addFeeLine(this.invoice!.id, line);
    });

    // Apply default tax
    this.accountingService.applyTax(this.invoice.id, 14);

    this.loadInvoice();
    this.hasChanges = false;
  }

  saveInvoice(): void {
    // Changes are already saved through the service
    this.hasChanges = false;
  }

  approveInvoice(): void {
    if (!this.invoice) return;

    this.modal.confirm({
      nzTitle: 'Approve Invoice?',
      nzContent: 'This will lock the invoice for editing. Continue?',
      nzOnOk: () => {
        this.accountingService.updateStatus(this.invoice!.id, 'APPROVED');
        this.loadInvoice();
      }
    });
  }

  issueInvoice(): void {
    if (!this.invoice) return;

    this.accountingService.updateStatus(this.invoice.id, 'ISSUED');
    this.loadInvoice();
  }

  markAsPaid(): void {
    if (!this.invoice) return;

    this.accountingService.updateStatus(this.invoice.id, 'PAID');
    this.loadInvoice();
  }

  voidInvoice(): void {
    if (!this.invoice) return;

    this.modal.confirm({
      nzTitle: 'Void Invoice?',
      nzContent: 'Provide a reason for voiding:',
      nzOkText: 'Void',
      nzOkDanger: true,
      nzOnOk: () => {
        this.accountingService.updateStatus(this.invoice!.id, 'VOID', 'Voided by user');
        this.loadInvoice();
      }
    });
  }

  openAddLineDrawer(): void {
    // TODO: Implement drawer for adding fee lines
    console.log('Add line drawer');
  }

  editLine(line: FeeLine): void {
    // TODO: Implement edit functionality
    console.log('Edit line', line);
  }

  deleteLine(lineId: string): void {
    if (!this.invoice) return;

    this.accountingService.removeFeeLine(this.invoice.id, lineId);
    this.loadInvoice();
  }

  configureSplits(): void {
    // TODO: Implement splits configuration modal
    console.log('Configure splits');
  }

  recordPayment(): void {
    // TODO: Implement payment recording modal
    console.log('Record payment');
  }

  canEdit(): boolean {
    // TODO: Implement RBAC - check if user is Accountant or Admin
    return true;
  }

  getStatusColor(status: string): string {
    const colors: any = {
      'DRAFT': 'default',
      'APPROVED': 'blue',
      'ISSUED': 'cyan',
      'PAID': 'green',
      'PARTIAL': 'orange',
      'VOID': 'red',
      'unbilled': 'default'
    };
    return colors[status] || 'default';
  }

  getFeeTypeColor(type: FeeLineType): string {
    const colors: any = {
      'VISIT': 'blue',
      'LABOR': 'green',
      'PART': 'orange',
      'TOOL': 'purple',
      'SURCHARGE': 'red',
      'DISCOUNT': 'magenta',
      'TAX': 'cyan'
    };
    return colors[type] || 'default';
  }

  getTechnicianName(techId?: string): string {
    if (!techId) return '-';
    const tech = this.stateService.getTechnicians().find((t: any) => t.id === techId);
    return tech?.name || techId;
  }

  getAllocationAmount(party: string): number {
    if (!this.invoice?.allocations) return 0;
    const allocation = this.invoice.allocations.find(a => a.party === party);
    return allocation?.amount || 0;
  }
}
