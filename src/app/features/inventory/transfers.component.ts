import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzStepsModule } from 'ng-zorro-antd/steps';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzMessageService } from 'ng-zorro-antd/message';
import { TransferService } from '../../core/services/transfer.service';
import { LocationService } from '../../core/services/location.service';
import { ItemService } from '../../core/services/item.service';
import { InventoryService } from '../../core/services/inventory.service';
import { Transfer, StockLocation, Item, TRANSFER_STATUS_LABELS } from '../../core/models/inventory.model';

@Component({
    selector: 'app-transfers',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzTagModule,
        NzModalModule,
        NzFormModule,
        NzSelectModule,
        NzInputNumberModule,
        NzStepsModule,
        NzDividerModule
    ],
    template: `
    <div class="transfers-page">
      <div class="page-header">
        <h2>Transfers</h2>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <span nz-icon nzType="plus"></span> Create Transfer
        </button>
      </div>

      <!-- Transfers Table -->
      <nz-table #transfersTable [nzData]="transfers" [nzPageSize]="10">
        <thead>
          <tr>
            <th>ID</th>
            <th>From</th>
            <th>To</th>
            <th>Status</th>
            <th>Lines</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let t of transfersTable.data">
            <td><a (click)="viewTransfer(t)">{{ t.id }}</a></td>
            <td>{{ getLocationName(t.fromLocationId) }}</td>
            <td>{{ getLocationName(t.toLocationId) }}</td>
            <td><nz-tag [nzColor]="getStatusColor(t.status)">{{ getStatusLabel(t.status) }}</nz-tag></td>
            <td>{{ t.lines.length }} item(s)</td>
            <td>{{ formatDate(t.updatedAt) }}</td>
            <td>
              <button nz-button nzType="link" nzSize="small" (click)="viewTransfer(t)">View</button>
              <button nz-button nzType="link" nzSize="small" *ngIf="t.status === 'DRAFT'" (click)="startPicking(t)">Start Picking</button>
              <button nz-button nzType="link" nzSize="small" *ngIf="t.status === 'PICKING'" (click)="shipTransfer(t)">Ship</button>
              <button nz-button nzType="link" nzSize="small" *ngIf="t.status === 'SHIPPED'" (click)="receiveTransfer(t)">Receive</button>
              <button nz-button nzType="text" nzDanger nzSize="small" *ngIf="canCancel(t)" (click)="cancelTransfer(t)">Cancel</button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- View Transfer Modal -->
      <nz-modal
        [(nzVisible)]="viewModalVisible"
        [nzTitle]="'Transfer ' + (selectedTransfer?.id || '')"
        (nzOnCancel)="viewModalVisible = false"
        [nzFooter]="null"
        nzWidth="600"
      >
        <ng-container *nzModalContent>
          <div *ngIf="selectedTransfer">
            <!-- Status Steps -->
            <nz-steps [nzCurrent]="getStepIndex(selectedTransfer.status)" nzSize="small" style="margin-bottom: 24px;">
              <nz-step nzTitle="Draft"></nz-step>
              <nz-step nzTitle="Picking"></nz-step>
              <nz-step nzTitle="Shipped"></nz-step>
              <nz-step nzTitle="Received"></nz-step>
            </nz-steps>

            <p><strong>From:</strong> {{ getLocationName(selectedTransfer.fromLocationId) }}</p>
            <p><strong>To:</strong> {{ getLocationName(selectedTransfer.toLocationId) }}</p>
            <p><strong>Status:</strong> <nz-tag [nzColor]="getStatusColor(selectedTransfer.status)">{{ getStatusLabel(selectedTransfer.status) }}</nz-tag></p>

            <nz-divider nzText="Items"></nz-divider>

            <nz-table #linesTable [nzData]="selectedTransfer.lines" nzSize="small" [nzShowPagination]="false">
              <thead>
                <tr><th>Item</th><th>Qty</th></tr>
              </thead>
              <tbody>
                <tr *ngFor="let line of linesTable.data">
                  <td>{{ getItemName(line.itemId) }}</td>
                  <td>{{ line.qty }}</td>
                </tr>
              </tbody>
            </nz-table>
          </div>
        </ng-container>
      </nz-modal>

      <!-- Create Transfer Wizard Modal -->
      <nz-modal
        [(nzVisible)]="createModalVisible"
        nzTitle="Create Transfer"
        (nzOnCancel)="createModalVisible = false"
        [nzFooter]="wizardFooter"
        nzWidth="700"
      >
        <ng-container *nzModalContent>
          <nz-steps [nzCurrent]="wizardStep" nzSize="small" style="margin-bottom: 24px;">
            <nz-step nzTitle="Locations"></nz-step>
            <nz-step nzTitle="Items"></nz-step>
            <nz-step nzTitle="Confirm"></nz-step>
          </nz-steps>

          <!-- Step 1: Locations -->
          <div *ngIf="wizardStep === 0">
            <form nz-form [formGroup]="createForm" nzLayout="vertical">
              <nz-form-item>
                <nz-form-label nzRequired>From Location</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="fromLocationId" style="width: 100%;" nzShowSearch nzPlaceHolder="Select source">
                    <nz-option *ngFor="let loc of locations" [nzValue]="loc.id" [nzLabel]="loc.name + ' (' + loc.type + ')'"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
              <nz-form-item>
                <nz-form-label nzRequired>To Location</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="toLocationId" style="width: 100%;" nzShowSearch nzPlaceHolder="Select destination">
                    <nz-option *ngFor="let loc of locations" [nzValue]="loc.id" [nzLabel]="loc.name + ' (' + loc.type + ')'"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </form>
          </div>

          <!-- Step 2: Items -->
          <div *ngIf="wizardStep === 1">
            <div *ngFor="let line of transferLines; let i = index" class="line-row">
              <nz-select [(ngModel)]="line.itemId" style="width: 60%;" nzPlaceHolder="Select item" nzShowSearch>
                <nz-option *ngFor="let item of items" [nzValue]="item.id" [nzLabel]="item.name + ' (Avail: ' + getAvailable(item.id) + ')'"></nz-option>
              </nz-select>
              <nz-input-number [(ngModel)]="line.qty" [nzMin]="1" style="width: 25%; margin-left: 8px;"></nz-input-number>
              <button nz-button nzType="text" nzDanger (click)="removeLine(i)" style="margin-left: 8px;">
                <span nz-icon nzType="delete"></span>
              </button>
            </div>
            <button nz-button nzType="dashed" (click)="addLine()" style="margin-top: 8px;">
              <span nz-icon nzType="plus"></span> Add Item
            </button>
          </div>

          <!-- Step 3: Confirm -->
          <div *ngIf="wizardStep === 2">
            <p><strong>From:</strong> {{ getLocationName(createForm.value.fromLocationId) }}</p>
            <p><strong>To:</strong> {{ getLocationName(createForm.value.toLocationId) }}</p>
            <nz-divider nzText="Items"></nz-divider>
            <ul>
              <li *ngFor="let line of transferLines">{{ getItemName(line.itemId) }} × {{ line.qty }}</li>
            </ul>
          </div>
        </ng-container>

        <ng-template #wizardFooter>
          <button nz-button (click)="prevStep()" *ngIf="wizardStep > 0">Back</button>
          <button nz-button nzType="primary" (click)="nextStep()" *ngIf="wizardStep < 2">Next</button>
          <button nz-button nzType="primary" (click)="createTransfer()" *ngIf="wizardStep === 2">Create</button>
        </ng-template>
      </nz-modal>
    </div>
  `,
    styles: [`
    .transfers-page { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .line-row { display: flex; align-items: center; margin-bottom: 8px; }
  `]
})
export class TransfersComponent implements OnInit {
    transfers: Transfer[] = [];
    locations: StockLocation[] = [];
    items: Item[] = [];

    viewModalVisible = false;
    selectedTransfer: Transfer | null = null;

    createModalVisible = false;
    wizardStep = 0;
    createForm: FormGroup;
    transferLines: { itemId: string; qty: number }[] = [];

    constructor(
        private transferService: TransferService,
        private locationService: LocationService,
        private itemService: ItemService,
        private inventoryService: InventoryService,
        private fb: FormBuilder,
        private message: NzMessageService
    ) {
        this.createForm = this.fb.group({
            fromLocationId: ['', Validators.required],
            toLocationId: ['', Validators.required]
        });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.transfers = this.transferService.getAll();
        this.locations = this.locationService.getAll();
        this.items = this.itemService.getAll();
    }

    getLocationName(id: string): string {
        return this.locationService.getById(id)?.name || id;
    }

    getItemName(id: string): string {
        return this.itemService.getById(id)?.name || id;
    }

    getAvailable(itemId: string): number {
        const fromId = this.createForm.value.fromLocationId;
        if (!fromId) return 0;
        return this.inventoryService.getBalance(fromId, itemId)?.available || 0;
    }

    getStatusColor(status: string): string {
        const map: Record<string, string> = {
            'DRAFT': 'default', 'PICKING': 'processing', 'SHIPPED': 'cyan',
            'RECEIVED': 'green', 'CANCELLED': 'red'
        };
        return map[status] || 'default';
    }

    getStatusLabel(status: string): string {
        return TRANSFER_STATUS_LABELS[status as keyof typeof TRANSFER_STATUS_LABELS] || status;
    }

    getStepIndex(status: string): number {
        const map: Record<string, number> = { 'DRAFT': 0, 'PICKING': 1, 'SHIPPED': 2, 'RECEIVED': 3, 'CANCELLED': 3 };
        return map[status] || 0;
    }

    canCancel(t: Transfer): boolean {
        return !['RECEIVED', 'CANCELLED'].includes(t.status);
    }

    formatDate(iso: string): string {
        return new Date(iso).toLocaleDateString();
    }

    viewTransfer(t: Transfer) {
        this.selectedTransfer = t;
        this.viewModalVisible = true;
    }

    startPicking(t: Transfer) {
        this.transferService.startPicking(t.id);
        this.message.success('Transfer started picking');
        this.loadData();
    }

    shipTransfer(t: Transfer) {
        this.transferService.ship(t.id);
        this.message.success('Transfer shipped');
        this.loadData();
    }

    receiveTransfer(t: Transfer) {
        this.transferService.receive(t.id);
        this.message.success('Transfer received');
        this.loadData();
    }

    cancelTransfer(t: Transfer) {
        this.transferService.cancel(t.id);
        this.message.info('Transfer cancelled');
        this.loadData();
    }

    showCreateModal() {
        this.wizardStep = 0;
        this.createForm.reset();
        this.transferLines = [{ itemId: '', qty: 1 }];
        this.createModalVisible = true;
    }

    addLine() {
        this.transferLines.push({ itemId: '', qty: 1 });
    }

    removeLine(index: number) {
        this.transferLines.splice(index, 1);
    }

    prevStep() {
        this.wizardStep--;
    }

    nextStep() {
        if (this.wizardStep === 0 && this.createForm.invalid) {
            Object.values(this.createForm.controls).forEach(c => c.markAsDirty());
            return;
        }
        if (this.wizardStep === 1 && this.transferLines.filter(l => l.itemId && l.qty > 0).length === 0) {
            this.message.warning('Add at least one item');
            return;
        }
        this.wizardStep++;
    }

    createTransfer() {
        const validLines = this.transferLines.filter(l => l.itemId && l.qty > 0);
        const { fromLocationId, toLocationId } = this.createForm.value;

        this.transferService.create(fromLocationId, toLocationId, validLines);
        this.message.success('Transfer created');
        this.createModalVisible = false;
        this.loadData();
    }
}
