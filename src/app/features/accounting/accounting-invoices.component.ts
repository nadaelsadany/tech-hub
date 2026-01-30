import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzCardModule } from 'ng-zorro-antd/card';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AccountingService } from '../../core/services/accounting.service';
import { Invoice } from '../../core/models/invoice.model';

@Component({
    selector: 'app-accounting-invoices',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        RouterLink,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzTagModule,
        NzInputModule,
        NzSelectModule,
        NzDatePickerModule,
        NzCardModule
    ],
    template: `
    <div class="invoices-container">
      <div class="page-header">
        <h2>Invoices</h2>
        <div class="header-actions">
          <nz-input-group [nzPrefix]="prefixIconSearch" style="width: 250px; margin-right: 8px;">
            <input type="text" nz-input placeholder="Search invoices..." [(ngModel)]="searchText" />
          </nz-input-group>
          <ng-template #prefixIconSearch>
            <span nz-icon nzType="search"></span>
          </ng-template>
        </div>
      </div>

      <nz-card>
        <nz-table 
          #invoiceTable 
          [nzData]="filteredInvoices" 
          [nzPageSize]="20"
          [nzScroll]="{ x: '1200px' }">
          <thead>
            <tr>
              <th>Invoice #</th>
              <th>Work Order</th>
              <th>Status</th>
              <th>Issue Date</th>
              <th nzAlign="right">Subtotal</th>
              <th nzAlign="right">Tax</th>
              <th nzAlign="right">Total</th>
              <th nzAlign="right">Balance Due</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let invoice of invoiceTable.data">
              <td>
                <a>{{ invoice.number }}</a>
              </td>
              <td>{{ invoice.workOrderId }}</td>
              <td>
                <nz-tag [nzColor]="getStatusColor(invoice.status)">
                  {{ invoice.status }}
                </nz-tag>
              </td>
              <td>{{ invoice.issueDate | date: 'short' }}</td>
              <td nzAlign="right">{{ invoice.currency }} {{ invoice.subtotal | number: '1.2-2' }}</td>
              <td nzAlign="right">{{ invoice.currency }} {{ invoice.taxTotal | number: '1.2-2' }}</td>
              <td nzAlign="right">
                <strong>{{ invoice.currency }} {{ invoice.grandTotal | number: '1.2-2' }}</strong>
              </td>
              <td nzAlign="right">
                <span [style.color]="invoice.balanceDue > 0 ? '#cf1322' : '#52c41a'">
                  {{ invoice.currency }} {{ invoice.balanceDue | number: '1.2-2' }}
                </span>
              </td>
              <td>
                <button nz-button nzType="link" nzSize="small">
                  <span nz-icon nzType="eye"></span> View
                </button>
                <button nz-button nzType="link" nzSize="small" *ngIf="invoice.status === 'ISSUED'">
                  <span nz-icon nzType="download"></span> PDF
                </button>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </div>
  `,
    styles: [`
    .invoices-container {
      padding: 24px;
    }

    .page-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
    }

    .header-actions {
      display: flex;
      gap: 8px;
    }
  `]
})
export class AccountingInvoicesComponent implements OnInit {
    private accountingService = inject(AccountingService);

    invoices: Invoice[] = [];
    filteredInvoices: Invoice[] = [];
    searchText = '';

    ngOnInit(): void {
        this.loadInvoices();
    }

    loadInvoices(): void {
        this.invoices = this.accountingService.getInvoices();
        this.filteredInvoices = this.invoices;
    }

    getStatusColor(status: string): string {
        const colors: any = {
            'DRAFT': 'default',
            'APPROVED': 'blue',
            'ISSUED': 'cyan',
            'PAID': 'green',
            'PARTIAL': 'orange',
            'VOID': 'red'
        };
        return colors[status] || 'default';
    }
}
