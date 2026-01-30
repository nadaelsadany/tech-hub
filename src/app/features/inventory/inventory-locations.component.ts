import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { LocationService } from '../../core/services/location.service';
import { InventoryService } from '../../core/services/inventory.service';
import { ItemService } from '../../core/services/item.service';
import { StockLocation, InventoryBalance, LOCATION_TYPE_LABELS } from '../../core/models/inventory.model';

@Component({
    selector: 'app-inventory-locations',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzTagModule,
        NzDrawerModule,
        NzModalModule,
        NzFormModule,
        NzInputModule,
        NzInputNumberModule,
        NzSelectModule,
        NzDividerModule
    ],
    template: `
    <div class="locations-page">
      <div class="page-header">
        <h2>Stock Locations</h2>
      </div>

      <!-- Locations Table -->
      <nz-table #locationsTable [nzData]="locations" [nzPageSize]="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Technician</th>
            <th>Items</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let loc of locationsTable.data">
            <td>{{ loc.name }}</td>
            <td><nz-tag [nzColor]="getTypeColor(loc.type)">{{ getTypeLabel(loc.type) }}</nz-tag></td>
            <td>{{ loc.technicianId || '-' }}</td>
            <td>{{ getItemCount(loc.id) }} items</td>
            <td>
              <button nz-button nzType="link" nzSize="small" (click)="openDrawer(loc)">View Stock</button>
              <button nz-button nzType="link" nzSize="small" (click)="showAdjustModal(loc)">Adjust</button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- Location Stock Drawer -->
      <nz-drawer
        [nzClosable]="true"
        [nzVisible]="drawerVisible"
        nzPlacement="right"
        [nzTitle]="selectedLocation?.name || 'Location'"
        (nzOnClose)="closeDrawer()"
        [nzWidth]="520"
      >
        <ng-container *nzDrawerContent>
          <div *ngIf="selectedLocation">
            <p><strong>Type:</strong> {{ getTypeLabel(selectedLocation.type) }}</p>
            <p *ngIf="selectedLocation.technicianId"><strong>Technician:</strong> {{ selectedLocation.technicianId }}</p>
            <p *ngIf="selectedLocation.address"><strong>Address:</strong> {{ selectedLocation.address }}</p>

            <nz-divider nzText="Stock Balances"></nz-divider>

            <nz-table #balanceTable [nzData]="locationBalances" nzSize="small" [nzPageSize]="10">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>On Hand</th>
                  <th>Reserved</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let b of balanceTable.data">
                  <td>{{ getItemName(b.itemId) }}</td>
                  <td>{{ b.onHand }}</td>
                  <td>{{ b.reserved }}</td>
                  <td [class.low-stock]="isLowStock(b)">{{ b.available }}</td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </ng-container>
      </nz-drawer>

      <!-- Adjust Stock Modal -->
      <nz-modal
        [(nzVisible)]="adjustModalVisible"
        nzTitle="Adjust Stock"
        (nzOnCancel)="adjustModalVisible = false"
        (nzOnOk)="saveAdjustment()"
        nzOkText="Save"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="adjustForm" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>Item</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="itemId" style="width: 100%;" nzShowSearch nzPlaceHolder="Select item">
                  <nz-option *ngFor="let item of allItems" [nzValue]="item.id" [nzLabel]="item.name + ' (' + item.sku + ')'"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Adjustment (+/-)</nz-form-label>
              <nz-form-control nzErrorTip="Enter adjustment qty">
                <nz-input-number formControlName="qty" style="width: 100%;"></nz-input-number>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Reason</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="reason" style="width: 100%;">
                  <nz-option nzValue="Cycle Count" nzLabel="Cycle Count"></nz-option>
                  <nz-option nzValue="Damage" nzLabel="Damage"></nz-option>
                  <nz-option nzValue="Receiving" nzLabel="Receiving"></nz-option>
                  <nz-option nzValue="Correction" nzLabel="Correction"></nz-option>
                  <nz-option nzValue="Other" nzLabel="Other"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
    styles: [`
    .locations-page { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .low-stock { color: #ff4d4f; font-weight: bold; }
  `]
})
export class InventoryLocationsComponent implements OnInit {
    locations: StockLocation[] = [];
    allItems: any[] = [];

    drawerVisible = false;
    selectedLocation: StockLocation | null = null;
    locationBalances: InventoryBalance[] = [];

    adjustModalVisible = false;
    adjustLocationId: string = '';
    adjustForm: FormGroup;

    constructor(
        private locationService: LocationService,
        private inventoryService: InventoryService,
        private itemService: ItemService,
        private fb: FormBuilder,
        private message: NzMessageService
    ) {
        this.adjustForm = this.fb.group({
            itemId: ['', Validators.required],
            qty: [0, Validators.required],
            reason: ['Cycle Count', Validators.required]
        });
    }

    ngOnInit() {
        this.locations = this.locationService.getAll();
        this.allItems = this.itemService.getAll();
    }

    getTypeColor(type: string): string {
        const map: Record<string, string> = { 'WAREHOUSE': 'blue', 'TRUCK': 'green', 'SITE': 'purple' };
        return map[type] || 'default';
    }

    getTypeLabel(type: string): string {
        return LOCATION_TYPE_LABELS[type as keyof typeof LOCATION_TYPE_LABELS] || type;
    }

    getItemCount(locationId: string): number {
        return this.inventoryService.getBalancesForLocation(locationId).length;
    }

    getItemName(itemId: string): string {
        return this.itemService.getById(itemId)?.name || itemId;
    }

    isLowStock(balance: InventoryBalance): boolean {
        const item = this.itemService.getById(balance.itemId);
        return !!item?.reorderPoint && balance.available <= item.reorderPoint;
    }

    openDrawer(location: StockLocation) {
        this.selectedLocation = location;
        this.locationBalances = this.inventoryService.getBalancesForLocation(location.id);
        this.drawerVisible = true;
    }

    closeDrawer() {
        this.drawerVisible = false;
        this.selectedLocation = null;
    }

    showAdjustModal(location: StockLocation) {
        this.adjustLocationId = location.id;
        this.adjustForm.reset({ qty: 0, reason: 'Cycle Count' });
        this.adjustModalVisible = true;
    }

    saveAdjustment() {
        if (this.adjustForm.invalid) {
            Object.values(this.adjustForm.controls).forEach(c => c.markAsDirty());
            return;
        }

        const { itemId, qty, reason } = this.adjustForm.value;
        this.inventoryService.adjustStock(this.adjustLocationId, itemId, qty, reason);
        this.message.success('Stock adjusted');
        this.adjustModalVisible = false;

        // Refresh drawer if open
        if (this.selectedLocation?.id === this.adjustLocationId) {
            this.locationBalances = this.inventoryService.getBalancesForLocation(this.adjustLocationId);
        }
    }
}
