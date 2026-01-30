import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { AccountingService } from '../../core/services/accounting.service';
import { PaymentRecord } from '../../core/models/invoice.model';

@Component({
    selector: 'app-accounting-transactions',
    standalone: true,
    imports: [
        CommonModule,
        NzTableModule,
        NzTagModule,
        NzCardModule,
        NzStatisticModule
    ],
    template: `
    <div class="transactions-container">
      <div class="page-header">
        <h2>Payment Transactions</h2>
      </div>

      <div class="stats-row">
        <nz-card>
          <nz-statistic 
            [nzValue]="totalPayments" 
            [nzTitle]="'Total Payments'" 
            [nzPrefix]="'EGP'">
          </nz-statistic>
        </nz-card>
        <nz-card>
          <nz-statistic 
            [nzValue]="paymentCount" 
            [nzTitle]="'Transactions'">
          </nz-statistic>
        </nz-card>
      </div>

      <nz-card>
        <nz-table #paymentTable [nzData]="payments" [nzPageSize]="20">
          <thead>
            <tr>
              <th>Date</th>
              <th>Invoice #</th>
              <th>Method</th>
              <th>Party</th>
              <th nzAlign="right">Amount</th>
              <th>Reference</th>
              <th>Received By</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let payment of paymentTable.data">
              <td>{{ payment.receivedAt | date: 'medium' }}</td>
              <td>{{ payment.invoiceNumber || '-' }}</td>
              <td><nz-tag>{{ payment.method }}</nz-tag></td>
              <td><nz-tag [nzColor]="getPartyColor(payment.party)">{{ payment.party }}</nz-tag></td>
              <td nzAlign="right">EGP {{ payment.amount | number: '1.2-2' }}</td>
              <td>{{ payment.reference || '-' }}</td>
              <td>{{ payment.receivedBy.name }}</td>
            </tr>
          </tbody>
        </nz-table>
      </nz-card>
    </div>
  `,
    styles: [`
    .transactions-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
    }

    .stats-row {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 16px;
      margin-bottom: 24px;
    }
  `]
})
export class AccountingTransactionsComponent implements OnInit {
    private accountingService = inject(AccountingService);

    payments: any[] = [];
    totalPayments = 0;
    paymentCount = 0;

    ngOnInit(): void {
        this.loadPayments();
    }

    loadPayments(): void {
        const invoices = this.accountingService.getInvoices();
        this.payments = [];

        invoices.forEach(invoice => {
            if (invoice.payments) {
                invoice.payments.forEach(payment => {
                    this.payments.push({
                        ...payment,
                        invoiceNumber: invoice.number
                    });
                });
            }
        });

        this.paymentCount = this.payments.length;
        this.totalPayments = this.payments.reduce((sum, p) => sum + p.amount, 0);
    }

    getPartyColor(party: string): string {
        const colors: any = {
            'CUSTOMER': 'blue',
            'WARRANTY': 'purple',
            'COMPANY': 'green'
        };
        return colors[party] || 'default';
    }
}
