import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzEmptyModule } from 'ng-zorro-antd/empty';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzBadgeModule } from 'ng-zorro-antd/badge';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzCheckboxModule } from 'ng-zorro-antd/checkbox';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { CustomerService } from '../../core/services/customer.service';
import { StateService } from '../../core/services/state.service';
import { Customer } from '../../core/models/customer.model';
import { WorkOrder } from '../../core/models/work-order.model';
import { formatPhone, formatRelative } from '../../core/utils/phone.utils';

@Component({
  selector: 'app-crm',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    NzTableModule,
    NzInputModule,
    NzButtonModule,
    NzIconModule,
    NzTagModule,
    NzCardModule,
    NzEmptyModule,
    NzDrawerModule,
    NzDividerModule,
    NzBadgeModule,
    NzStatisticModule,
    NzModalModule,
    NzSelectModule,
    NzFormModule,
    NzCheckboxModule
  ],
  template: `
    <div class="crm-container">
      <div class="page-header">
        <h2>Customer CRM</h2>
        <button nz-button nzType="primary" (click)="showCreateModal()">
          <span nz-icon nzType="plus"></span> Create Customer
        </button>
      </div>

      <!-- Search Bar -->
      <nz-card class="search-card">
        <div class="search-row">
          <nz-input-group nzPrefixIcon="phone" class="search-input">
            <input nz-input placeholder="Search by Phone" [(ngModel)]="searchPhone" (ngModelChange)="onSearchChange()" />
          </nz-input-group>
          <nz-input-group nzPrefixIcon="user" class="search-input">
            <input nz-input placeholder="Search by Name" [(ngModel)]="searchName" (ngModelChange)="onSearchChange()" />
          </nz-input-group>
          <nz-input-group nzPrefixIcon="mail" class="search-input">
            <input nz-input placeholder="Search by Email" [(ngModel)]="searchEmail" (ngModelChange)="onSearchChange()" />
          </nz-input-group>
          <button nz-button nzType="default" (click)="clearSearch()">Clear</button>
        </div>
      </nz-card>

      <!-- Results Table -->
      <nz-table 
        #customerTable 
        [nzData]="filteredCustomers" 
        [nzPageSize]="10" 
        [nzLoading]="loading"
        [nzShowPagination]="filteredCustomers.length > 10"
      >
        <thead>
          <tr>
            <th nzWidth="30px">
              <label nz-checkbox [(ngModel)]="allChecked" (ngModelChange)="checkAll($event)"></label>
            </th>
            <th>Name</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Last Order</th>
            <th>Tags</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let customer of customerTable.data">
            <td>
              <label nz-checkbox [(ngModel)]="customer.checked" (ngModelChange)="refreshCheckedStatus()"></label>
            </td>
            <td>
              <a (click)="openProfile(customer)">{{ customer.name }}</a>
            </td>
            <td>{{ formatPhone(customer.phone) }}</td>
            <td>{{ customer.email || '-' }}</td>
            <td>{{ formatRelative(customer.lastOrderAt) }}</td>
            <td>
              <nz-tag *ngFor="let tag of customer.tags" [nzColor]="getTagColor(tag)">{{ tag }}</nz-tag>
              <span *ngIf="!customer.tags?.length">-</span>
            </td>
            <td>
              <button nz-button nzType="link" nzSize="small" (click)="openProfile(customer)">View</button>
              <button nz-button nzType="link" nzSize="small" (click)="createOrderFor(customer)">Create Order</button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <div *ngIf="filteredCustomers.length === 0 && !loading" class="empty-state">
        <nz-empty [nzNotFoundContent]="emptyTpl">
          <ng-template #emptyTpl>
            <span>No customers found. <a (click)="showCreateModal()">Create one?</a></span>
          </ng-template>
        </nz-empty>
      </div>

      <!-- Merge Button -->
      <div class="merge-bar" *ngIf="checkedCount === 2">
        <button nz-button nzType="primary" nzDanger (click)="showMergeModal()">
          <span nz-icon nzType="merge-cells"></span> Merge Selected ({{ checkedCount }})
        </button>
      </div>

      <!-- Customer Profile Drawer -->
      <nz-drawer
        [nzClosable]="true"
        [nzVisible]="profileVisible"
        nzPlacement="right"
        [nzTitle]="selectedCustomer?.name || 'Customer'"
        (nzOnClose)="closeProfile()"
        [nzWidth]="520"
      >
        <ng-container *nzDrawerContent>
          <div *ngIf="selectedCustomer" class="profile-content">
            <!-- Header -->
            <div class="profile-header">
              <h3>{{ selectedCustomer.name }}</h3>
              <p class="phone">{{ formatPhone(selectedCustomer.phone) }}</p>
              <p *ngIf="selectedCustomer.email" class="email">{{ selectedCustomer.email }}</p>
              <p *ngIf="selectedCustomer.unit" class="unit">Unit: {{ selectedCustomer.unit }}</p>
              <div class="tags">
                <nz-tag *ngFor="let tag of selectedCustomer.tags" [nzColor]="getTagColor(tag)">{{ tag }}</nz-tag>
              </div>
            </div>

            <nz-divider></nz-divider>

            <!-- Stats -->
            <div class="stats-row">
              <nz-statistic [nzValue]="customerOrders.length" nzTitle="Total Orders"></nz-statistic>
              <nz-statistic [nzValue]="warrantyCount" nzTitle="Warranty"></nz-statistic>
              <nz-statistic [nzValue]="completedCount" nzTitle="Completed"></nz-statistic>
            </div>

            <nz-divider nzText="Addresses"></nz-divider>

            <!-- Addresses -->
            <div class="addresses">
              <div *ngFor="let addr of selectedCustomer.addresses; let i = index" class="address-item">
                <nz-badge [nzStatus]="i === 0 ? 'success' : 'default'" [nzText]="addr.line1 + (addr.city ? ', ' + addr.city : '')"></nz-badge>
                <span *ngIf="i === 0" class="default-label">(Default)</span>
              </div>
              <p *ngIf="!selectedCustomer.addresses?.length" class="no-data">No addresses saved</p>
            </div>

            <nz-divider nzText="Notes"></nz-divider>

            <!-- Notes -->
            <div class="notes-section">
              <textarea nz-input [(ngModel)]="editNotes" rows="3" placeholder="Add notes..."></textarea>
              <button nz-button nzSize="small" (click)="saveNotes()" style="margin-top: 8px;">Save Notes</button>
            </div>

            <nz-divider nzText="Order History"></nz-divider>

            <!-- Order History -->
            <nz-table #orderTable [nzData]="customerOrders" nzSize="small" [nzPageSize]="5">
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Category</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let order of orderTable.data">
                  <td><a [routerLink]="['/orders']">{{ order.number }}</a></td>
                  <td>{{ formatDate(order.createdAt) }}</td>
                  <td><nz-tag [nzColor]="getStatusColor(order.status)">{{ order.status }}</nz-tag></td>
                  <td>{{ order.category }}</td>
                </tr>
              </tbody>
            </nz-table>
            <p *ngIf="customerOrders.length === 0" class="no-data">No orders yet</p>

            <div class="profile-actions">
              <button nz-button nzType="primary" (click)="createOrderFor(selectedCustomer!)">Create Order</button>
            </div>
          </div>
        </ng-container>
      </nz-drawer>

      <!-- Create Customer Modal -->
      <nz-modal
        [(nzVisible)]="createModalVisible"
        nzTitle="Create Customer"
        (nzOnCancel)="createModalVisible = false"
        (nzOnOk)="createCustomer()"
        nzOkText="Create"
      >
        <ng-container *nzModalContent>
          <nz-form-item>
            <nz-form-label nzRequired>Name</nz-form-label>
            <nz-form-control>
              <input nz-input [(ngModel)]="newCustomer.name" placeholder="Customer name" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label nzRequired>Phone</nz-form-label>
            <nz-form-control>
              <input nz-input [(ngModel)]="newCustomer.phone" placeholder="+201001234567" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Email</nz-form-label>
            <nz-form-control>
              <input nz-input [(ngModel)]="newCustomer.email" placeholder="email@example.com" />
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-label>Unit</nz-form-label>
            <nz-form-control>
              <input nz-input [(ngModel)]="newCustomer.unit" placeholder="Apt 4B" />
            </nz-form-control>
          </nz-form-item>
        </ng-container>
      </nz-modal>

      <!-- Merge Modal -->
      <nz-modal
        [(nzVisible)]="mergeModalVisible"
        nzTitle="Merge Customers"
        (nzOnCancel)="mergeModalVisible = false"
        (nzOnOk)="confirmMerge()"
        nzOkText="Merge"
        nzOkDanger
      >
        <ng-container *nzModalContent>
          <p>Select which customer to keep as master:</p>
          <nz-select [(ngModel)]="mergeMasterId" style="width: 100%;">
            <nz-option *ngFor="let c of selectedForMerge" [nzValue]="c.id" [nzLabel]="c.name + ' (' + c.phone + ')'"></nz-option>
          </nz-select>
          <p class="merge-warning" style="margin-top: 16px; color: #ff4d4f;">
            The other customer will be deleted and their orders re-linked to the master.
          </p>
        </ng-container>
      </nz-modal>
    </div>
  `,
  styles: [`
    .crm-container { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .search-card { margin-bottom: 16px; }
    .search-row { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .search-input { width: 220px; }
    .empty-state { padding: 48px; text-align: center; }
    .merge-bar { position: fixed; bottom: 24px; left: 50%; transform: translateX(-50%); z-index: 100; }
    
    .profile-content { padding: 0; }
    .profile-header h3 { margin: 0 0 8px; }
    .profile-header .phone { font-size: 16px; color: #1890ff; margin: 0; }
    .profile-header .email, .profile-header .unit { color: #666; margin: 4px 0; }
    .tags { margin-top: 8px; }
    
    .stats-row { display: flex; gap: 32px; }
    .addresses .address-item { margin-bottom: 8px; }
    .default-label { color: #52c41a; font-size: 12px; margin-left: 8px; }
    .notes-section textarea { width: 100%; }
    .no-data { color: #999; font-style: italic; }
    .profile-actions { margin-top: 24px; display: flex; justify-content: flex-end; }
  `]
})
export class CrmComponent implements OnInit {
  searchPhone = '';
  searchName = '';
  searchEmail = '';
  loading = false;
  filteredCustomers: (Customer & { checked?: boolean })[] = [];
  allChecked = false;

  profileVisible = false;
  selectedCustomer: Customer | null = null;
  customerOrders: WorkOrder[] = [];
  editNotes = '';

  createModalVisible = false;
  newCustomer = { name: '', phone: '', email: '', unit: '' };

  mergeModalVisible = false;
  mergeMasterId: string | null = null;
  selectedForMerge: Customer[] = [];

  private searchSubject = new Subject<void>();

  formatPhone = formatPhone;
  formatRelative = formatRelative;

  get checkedCount(): number {
    return this.filteredCustomers.filter(c => c.checked).length;
  }

  get warrantyCount(): number {
    return this.customerOrders.filter(o => o.warranty).length;
  }

  get completedCount(): number {
    return this.customerOrders.filter(o => o.status === 'Completed').length;
  }

  constructor(
    private customerService: CustomerService,
    private stateService: StateService,
    private router: Router,
    private message: NzMessageService,
    private modal: NzModalService
  ) { }

  ngOnInit() {
    this.loadCustomers();
    this.searchSubject.pipe(
      debounceTime(350),
      distinctUntilChanged()
    ).subscribe(() => this.performSearch());
  }

  loadCustomers() {
    this.filteredCustomers = this.customerService.getAll().map(c => ({ ...c, checked: false }));
  }

  onSearchChange() {
    this.searchSubject.next();
  }

  performSearch() {
    if (!this.searchPhone && !this.searchName && !this.searchEmail) {
      this.loadCustomers();
      return;
    }

    this.loading = true;
    this.customerService.search({
      phone: this.searchPhone || undefined,
      name: this.searchName || undefined,
      email: this.searchEmail || undefined
    }).subscribe(results => {
      this.filteredCustomers = results.map(c => ({ ...c, checked: false }));
      this.loading = false;
    });
  }

  clearSearch() {
    this.searchPhone = '';
    this.searchName = '';
    this.searchEmail = '';
    this.loadCustomers();
  }

  checkAll(checked: boolean) {
    this.filteredCustomers.forEach(c => c.checked = checked);
  }

  refreshCheckedStatus() {
    this.allChecked = this.filteredCustomers.every(c => c.checked);
  }

  openProfile(customer: Customer) {
    this.selectedCustomer = customer;
    this.editNotes = customer.notes || '';
    this.loadCustomerOrders(customer.id);
    this.profileVisible = true;
  }

  closeProfile() {
    this.profileVisible = false;
    this.selectedCustomer = null;
  }

  loadCustomerOrders(customerId: string) {
    this.stateService.workOrders$.subscribe(orders => {
      this.customerOrders = orders.filter(o =>
        o.customerId === customerId ||
        (o.customer?.phone && this.customerService.getById(customerId)?.phone === o.customer.phone)
      );
    });
  }

  saveNotes() {
    if (this.selectedCustomer) {
      this.customerService.update(this.selectedCustomer.id, { notes: this.editNotes });
      this.selectedCustomer.notes = this.editNotes;
      this.message.success('Notes saved');
    }
  }

  createOrderFor(customer: Customer) {
    this.router.navigate(['/create'], { queryParams: { customerId: customer.id } });
  }

  showCreateModal() {
    this.newCustomer = { name: '', phone: '', email: '', unit: '' };
    this.createModalVisible = true;
  }

  createCustomer() {
    if (!this.newCustomer.name || !this.newCustomer.phone) {
      this.message.warning('Name and Phone are required');
      return;
    }
    this.customerService.create({
      name: this.newCustomer.name,
      phone: this.newCustomer.phone,
      email: this.newCustomer.email || undefined,
      unit: this.newCustomer.unit || undefined
    });
    this.message.success('Customer created');
    this.createModalVisible = false;
    this.loadCustomers();
  }

  showMergeModal() {
    this.selectedForMerge = this.filteredCustomers.filter(c => c.checked);
    if (this.selectedForMerge.length !== 2) {
      this.message.warning('Select exactly 2 customers to merge');
      return;
    }
    this.mergeMasterId = this.selectedForMerge[0].id;
    this.mergeModalVisible = true;
  }

  confirmMerge() {
    if (!this.mergeMasterId) return;
    const duplicateId = this.selectedForMerge.find(c => c.id !== this.mergeMasterId)?.id;
    if (!duplicateId) return;

    this.customerService.merge(this.mergeMasterId, duplicateId);
    this.message.success('Customers merged');
    this.mergeModalVisible = false;
    this.loadCustomers();
  }

  getTagColor(tag: string): string {
    const map: Record<string, string> = { 'VIP': 'gold', 'Warranty': 'blue' };
    return map[tag] || 'default';
  }

  getStatusColor(status: string): string {
    const map: Record<string, string> = {
      'New': 'default', 'Ready': 'gold', 'Assigned': 'geekblue',
      'EnRoute': 'cyan', 'OnSite': 'processing', 'Completed': 'green',
      'OnHold': 'volcano', 'Cancelled': 'red'
    };
    return map[status] || 'default';
  }

  formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString();
  }
}
