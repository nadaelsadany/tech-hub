import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { ItemService } from '../../core/services/item.service';
import { LocationService } from '../../core/services/location.service';
import { InventoryService } from '../../core/services/inventory.service';
import { TransferService } from '../../core/services/transfer.service';
import { PartRequestService } from '../../core/services/part-request.service';
import { ReservationService } from '../../core/services/reservation.service';
import { Item, StockLocation, InventoryBalance, Transfer, PartRequest, TRANSFER_STATUS_LABELS, PART_REQUEST_STATUS_LABELS } from '../../core/models/inventory.model';

@Component({
    selector: 'app-inventory-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        RouterLink,
        NzCardModule,
        NzTableModule,
        NzTagModule,
        NzButtonModule,
        NzIconModule,
        NzStatisticModule,
        NzGridModule,
        NzBadgeModule,
        NzEmptyModule
    ],
    template: `
    <div class="inventory-dashboard">
      <div class="page-header">
        <h2>Inventory Dashboard</h2>
        <div class="header-actions">
          <button nz-button routerLink="/inventory/items"><span nz-icon nzType="appstore"></span> Items</button>
          <button nz-button routerLink="/inventory/locations"><span nz-icon nzType="environment"></span> Locations</button>
          <button nz-button routerLink="/inventory/transfers"><span nz-icon nzType="swap"></span> Transfers</button>
        </div>
      </div>

      <!-- KPI Cards -->
      <div nz-row [nzGutter]="16" class="kpi-row">
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="lowStockItems.length" nzTitle="Low Stock Items" [nzValueStyle]="{ color: lowStockItems.length > 0 ? '#ff4d4f' : '#52c41a' }"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="openTransfers.length" nzTitle="Open Transfers" [nzValueStyle]="{ color: '#1890ff' }"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="openRequests.length" nzTitle="Open Part Requests" [nzValueStyle]="{ color: openRequests.length > 0 ? '#faad14' : '#52c41a' }"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="backorderedCount" nzTitle="Backordered" [nzValueStyle]="{ color: backorderedCount > 0 ? '#ff4d4f' : '#52c41a' }"></nz-statistic>
          </nz-card>
        </div>
      </div>

      <!-- Low Stock Table -->
      <nz-card nzTitle="Low Stock Items" [nzExtra]="lowStockExtra" class="section-card">
        <ng-template #lowStockExtra>
          <button nz-button nzType="link" nzSize="small" routerLink="/inventory/items">View All Items</button>
        </ng-template>
        <nz-table #lowStockTable [nzData]="lowStockItems" nzSize="small" [nzPageSize]="5" *ngIf="lowStockItems.length > 0">
          <thead>
            <tr>
              <th>Item</th>
              <th>Location</th>
              <th>Available</th>
              <th>Reorder Point</th>
              <th>Suggested</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let row of lowStockTable.data">
              <td>{{ row.item.name }} <small>({{ row.item.sku }})</small></td>
              <td><nz-tag [nzColor]="row.location.type === 'WAREHOUSE' ? 'blue' : 'green'">{{ row.location.name }}</nz-tag></td>
              <td><nz-badge nzStatus="error" [nzText]="row.balance.available.toString()"></nz-badge></td>
              <td>{{ row.item.reorderPoint || '-' }}</td>
              <td>{{ row.item.reorderQty || '-' }}</td>
            </tr>
          </tbody>
        </nz-table>
        <nz-empty *ngIf="lowStockItems.length === 0" nzNotFoundContent="No low stock items"></nz-empty>
      </nz-card>

      <!-- Open Transfers -->
      <nz-card nzTitle="Open Transfers" [nzExtra]="transfersExtra" class="section-card">
        <ng-template #transfersExtra>
          <button nz-button nzType="link" nzSize="small" routerLink="/inventory/transfers">View All</button>
        </ng-template>
        <nz-table #transferTable [nzData]="openTransfers" nzSize="small" [nzPageSize]="5" *ngIf="openTransfers.length > 0">
          <thead>
            <tr>
              <th>ID</th>
              <th>From → To</th>
              <th>Status</th>
              <th>Lines</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let t of transferTable.data">
              <td><a routerLink="/inventory/transfers">{{ t.id }}</a></td>
              <td>{{ getLocationName(t.fromLocationId) }} → {{ getLocationName(t.toLocationId) }}</td>
              <td><nz-tag [nzColor]="getTransferStatusColor(t.status)">{{ getTransferStatusLabel(t.status) }}</nz-tag></td>
              <td>{{ t.lines.length }} item(s)</td>
            </tr>
          </tbody>
        </nz-table>
        <nz-empty *ngIf="openTransfers.length === 0" nzNotFoundContent="No open transfers"></nz-empty>
      </nz-card>

      <!-- Open Part Requests -->
      <nz-card nzTitle="Open Part Requests" class="section-card">
        <nz-table #requestTable [nzData]="openRequests" nzSize="small" [nzPageSize]="5" *ngIf="openRequests.length > 0">
          <thead>
            <tr>
              <th>Work Order</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let r of requestTable.data">
              <td>{{ r.workOrderId }}</td>
              <td>{{ getItemName(r.itemId) }}</td>
              <td>{{ r.qty }}</td>
              <td><nz-tag [nzColor]="getRequestStatusColor(r.status)">{{ getRequestStatusLabel(r.status) }}</nz-tag></td>
              <td>
                <button nz-button nzType="link" nzSize="small" *ngIf="r.status === 'REQUESTED'" (click)="approveRequest(r)">Approve</button>
              </td>
            </tr>
          </tbody>
        </nz-table>
        <nz-empty *ngIf="openRequests.length === 0" nzNotFoundContent="No open requests"></nz-empty>
      </nz-card>
    </div>
  `,
    styles: [`
    .inventory-dashboard { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .header-actions { display: flex; gap: 8px; }
    .kpi-row { margin-bottom: 16px; }
    .section-card { margin-bottom: 16px; }
  `]
})
export class InventoryDashboardComponent implements OnInit {
    lowStockItems: { item: Item; location: StockLocation; balance: InventoryBalance }[] = [];
    openTransfers: Transfer[] = [];
    openRequests: PartRequest[] = [];
    backorderedCount = 0;

    constructor(
        private itemService: ItemService,
        private locationService: LocationService,
        private inventoryService: InventoryService,
        private transferService: TransferService,
        private partRequestService: PartRequestService,
        private reservationService: ReservationService
    ) { }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.lowStockItems = this.inventoryService.getLowStockItems();
        this.openTransfers = this.transferService.getOpenTransfers();
        this.openRequests = this.partRequestService.getOpenRequests();
        this.backorderedCount = this.reservationService.getBackorderedReservations().length;
    }

    getLocationName(id: string): string {
        return this.locationService.getById(id)?.name || id;
    }

    getItemName(id: string): string {
        return this.itemService.getById(id)?.name || id;
    }

    getTransferStatusColor(status: string): string {
        const map: Record<string, string> = {
            'DRAFT': 'default', 'PICKING': 'processing', 'SHIPPED': 'cyan',
            'RECEIVED': 'green', 'CANCELLED': 'red'
        };
        return map[status] || 'default';
    }

    getTransferStatusLabel(status: string): string {
        return TRANSFER_STATUS_LABELS[status as keyof typeof TRANSFER_STATUS_LABELS] || status;
    }

    getRequestStatusColor(status: string): string {
        const map: Record<string, string> = {
            'REQUESTED': 'gold', 'APPROVED': 'blue', 'ALLOCATED': 'cyan',
            'TRANSFER_CREATED': 'processing', 'FULFILLED': 'green',
            'REJECTED': 'red', 'BACKORDERED': 'volcano'
        };
        return map[status] || 'default';
    }

    getRequestStatusLabel(status: string): string {
        return PART_REQUEST_STATUS_LABELS[status as keyof typeof PART_REQUEST_STATUS_LABELS] || status;
    }

    approveRequest(request: PartRequest) {
        this.partRequestService.approve(request.id);
        this.loadData();
    }
}
