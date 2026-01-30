import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzCardModule } from 'ng-zorro-antd/card';
import { FinancialReportsService } from '../../core/services/financial-reports.service';

@Component({
  selector: 'app-accounting-reports',
  standalone: true,
  imports: [
    CommonModule,
    NzTabsModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzCardModule
  ],
  template: `
    <div class="reports-container">
      <div class="page-header">
        <h2>Financial Reports</h2>
      </div>

      <nz-card>
        <nz-tabs>
          <!-- Billing Report -->
          <nz-tab nzTitle="Billing Report">
            <div class="report-actions">
              <button nz-button nzType="default" (click)="exportBillingCSV()">
                <span nz-icon nzType="download"></span> Export CSV
              </button>
            </div>
            
            <nz-table #billingTable [nzData]="billingReport" [nzPageSize]="20" [nzScroll]="{ x: '1400px' }">
              <thead>
                <tr>
                  <th>Order #</th>
                  <th>Customer</th>
                  <th nzAlign="right">Visit</th>
                  <th nzAlign="right">Labor</th>
                  <th nzAlign="right">Parts</th>
                  <th nzAlign="right">Tax</th>
                  <th nzAlign="right">Total</th>
                  <th nzAlign="right">Paid</th>
                  <th nzAlign="right">Balance</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of billingTable.data">
                  <td>{{ row.workOrderNumber }}</td>
                  <td>{{ row.customerName }}</td>
                  <td nzAlign="right">{{ row.visitFees | number: '1.2-2' }}</td>
                  <td nzAlign="right">{{ row.laborFees | number: '1.2-2' }}</td>
                  <td nzAlign="right">{{ row.partsFees | number: '1.2-2' }}</td>
                  <td nzAlign="right">{{ row.taxAmount | number: '1.2-2' }}</td>
                  <td nzAlign="right"><strong>{{ row.grandTotal | number: '1.2-2' }}</strong></td>
                  <td nzAlign="right">{{ row.totalPaid | number: '1.2-2' }}</td>
                  <td nzAlign="right">
                    <span [style.color]="row.balanceDue > 0 ? '#cf1322' : '#52c41a'">
                      {{ row.balanceDue | number: '1.2-2' }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- Technician Earnings -->
          <nz-tab nzTitle="Technician Earnings">
            <div class="report-actions">
              <button nz-button nzType="default" (click)="exportEarningsCSV()">
                <span nz-icon nzType="download"></span> Export CSV
              </button>
            </div>

            <nz-table #earningsTable [nzData]="earningsReport" [nzPageSize]="20">
              <thead>
                <tr>
                  <th>Technician</th>
                  <th nzAlign="right">Orders</th>
                  <th nzAlign="right">Labor Hours</th>
                  <th nzAlign="right">Labor Fees</th>
                  <th nzAlign="right">Avg per Order</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of earningsTable.data">
                  <td>{{ row.technicianName }}</td>
                  <td nzAlign="right">{{ row.orderCount }}</td>
                  <td nzAlign="right">{{ row.totalLaborHours | number: '1.1-1' }}</td>
                  <td nzAlign="right"><strong>EGP {{ row.totalLaborFees | number: '1.2-2' }}</strong></td>
                  <td nzAlign="right">EGP {{ row.avgFeePerOrder | number: '1.2-2' }}</td>
                </tr>
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- Warranty Statement -->
          <nz-tab nzTitle="Warranty Statement">
            <div class="report-actions">
              <button nz-button nzType="default" (click)="exportWarrantyCSV()">
                <span nz-icon nzType="download"></span> Export CSV
              </button>
            </div>

            <nz-table #warrantyTable [nzData]="warrantyReport" [nzPageSize]="20">
              <thead>
                <tr>
                  <th>Provider</th>
                  <th nzAlign="right">Orders</th>
                  <th nzAlign="right">Total Owed</th>
                  <th nzAlign="right">Invoiced</th>
                  <th nzAlign="right">Pending</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let row of warrantyTable.data">
                  <td>{{ row.warrantyProvider }}</td>
                  <td nzAlign="right">{{ row.orderCount }}</td>
                  <td nzAlign="right"><strong>EGP {{ row.totalOwed | number: '1.2-2' }}</strong></td>
                  <td nzAlign="right">EGP {{ row.invoicedAmount | number: '1.2-2' }}</td>
                  <td nzAlign="right">EGP {{ row.pendingAmount | number: '1.2-2' }}</td>
                </tr>
              </tbody>
            </nz-table>
          </nz-tab>
        </nz-tabs>
      </nz-card>
    </div>
  `,
  styles: [`
    .reports-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
    }

    .report-actions {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class AccountingReportsComponent implements OnInit {
  private reportsService = inject(FinancialReportsService);

  billingReport: any[] = [];
  earningsReport: any[] = [];
  warrantyReport: any[] = [];

  ngOnInit(): void {
    this.loadReports();
  }

  loadReports(): void {
    this.billingReport = this.reportsService.generateBillingReport();
    this.earningsReport = this.reportsService.generateTechnicianEarningsReport();
    this.warrantyReport = this.reportsService.generateWarrantyStatement();
  }

  exportBillingCSV(): void {
    const csv = this.reportsService.exportBillingReportCsv(this.billingReport);
    this.downloadCSV(csv, 'billing-report.csv');
  }

  exportEarningsCSV(): void {
    const csv = this.reportsService.exportTechnicianEarningsCsv(this.earningsReport);
    this.downloadCSV(csv, 'technician-earnings.csv');
  }

  exportWarrantyCSV(): void {
    const csv = this.reportsService.exportWarrantyStatementCsv(this.warrantyReport);
    this.downloadCSV(csv, 'warranty-statement.csv');
  }

  private downloadCSV(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
