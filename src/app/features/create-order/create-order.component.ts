import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { NzAlertModule } from 'ng-zorro-antd/alert';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { StateService } from '../../core/services/state.service';
import { AutoAssignService } from '../../core/services/auto-assign.service';
import { CustomerService } from '../../core/services/customer.service';
import { WorkOrder, Address } from '../../core/models/work-order.model';
import { Customer } from '../../core/models/customer.model';
import { normalizePhone, formatPhone } from '../../core/utils/phone.utils';

@Component({
  selector: 'app-create-order',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    NzFormModule,
    NzInputModule,
    NzSelectModule,
    NzSwitchModule,
    NzButtonModule,
    NzInputNumberModule,
    NzCardModule,
    NzGridModule,
    NzAlertModule,
    NzIconModule,
    NzDropDownModule,
    NzTagModule
  ],
  template: `
    <div class="create-container">
      <h2>Create Work Order</h2>
      <form nz-form [formGroup]="form" nzLayout="vertical" (ngSubmit)="save('new')">
        
        <!-- Customer Section -->
        <nz-card [nzTitle]="customerCardTitle" [nzExtra]="customerExtra" style="margin-bottom: 16px;">
          <ng-template #customerCardTitle>
            <span>Customer Information</span>
            <nz-tag *ngIf="matchedCustomer" nzColor="success" style="margin-left: 8px;">Existing Customer</nz-tag>
            <nz-tag *ngIf="!matchedCustomer && form.get('customerPhone')?.value" nzColor="default" style="margin-left: 8px;">New Customer</nz-tag>
          </ng-template>
          <ng-template #customerExtra>
            <a *ngIf="matchedCustomer" [routerLink]="['/crm']" [queryParams]="{id: matchedCustomer.id}">View Profile</a>
          </ng-template>

          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Phone</nz-form-label>
                <nz-form-control nzHasFeedback [nzValidateStatus]="phoneStatus" nzErrorTip="Phone is required (7+ digits)">
                  <nz-input-group [nzSuffix]="phoneSuffix">
                    <input nz-input formControlName="customerPhone" placeholder="+201001234567" (input)="onPhoneInput()" />
                  </nz-input-group>
                  <ng-template #phoneSuffix>
                    <span *ngIf="phoneSearching" nz-icon nzType="loading"></span>
                    <span *ngIf="matchedCustomer && !phoneSearching" nz-icon nzType="check-circle" nzTheme="fill" style="color: #52c41a;"></span>
                    <span *ngIf="!matchedCustomer && !phoneSearching && form.get('customerPhone')?.value?.length >= 7" nz-icon nzType="plus-circle" style="color: #1890ff;"></span>
                  </ng-template>
                </nz-form-control>
                <p class="field-hint">Type a phone to search existing customers. If found, data will auto-fill.</p>
              </nz-form-item>

              <!-- Multiple matches dropdown -->
              <div *ngIf="customerMatches.length > 1" class="matches-dropdown">
                <p>Multiple customers found. Select one:</p>
                <div *ngFor="let c of customerMatches" class="match-option" (click)="selectCustomer(c)">
                  <strong>{{ c.name }}</strong> - {{ formatPhone(c.phone) }}
                  <span *ngIf="c.email" class="email">{{ c.email }}</span>
                </div>
              </div>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Customer Name</nz-form-label>
                <nz-form-control nzErrorTip="Customer name is required (min 2 characters)">
                  <input nz-input formControlName="customerName" placeholder="Full name" />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Email</nz-form-label>
                <nz-form-control nzErrorTip="Please enter a valid email">
                  <input nz-input formControlName="customerEmail" placeholder="email@example.com" type="email" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Unit / Apartment</nz-form-label>
                <nz-form-control>
                  <input nz-input formControlName="customerUnit" placeholder="Apt 4B" />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>

          <button *ngIf="matchedCustomer" nz-button nzType="link" nzSize="small" (click)="clearCustomerMatch()">
            <span nz-icon nzType="close"></span> Clear match (create new)
          </button>
        </nz-card>

        <!-- Address Section -->
        <nz-card nzTitle="Address" style="margin-bottom: 16px;">
          <!-- Address picker from customer history -->
          <div *ngIf="matchedCustomer?.addresses?.length" style="margin-bottom: 16px;">
            <nz-form-item>
              <nz-form-label>Use previous address</nz-form-label>
              <nz-form-control>
                <nz-select [(ngModel)]="selectedAddressIndex" [ngModelOptions]="{standalone: true}" (ngModelChange)="onAddressSelect($any($event))" style="width: 100%;" nzPlaceHolder="Select an address...">
                  <nz-option *ngFor="let addr of matchedCustomer?.addresses; let i = index" [nzValue]="i" [nzLabel]="addr.line1 + (addr.city ? ', ' + addr.city : '') + (i === 0 ? ' (Default)' : '')"></nz-option>
                  <nz-option [nzValue]="-1" nzLabel="Enter new address"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
          </div>

          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="16">
              <nz-form-item>
                <nz-form-label nzRequired>Address Line</nz-form-label>
                <nz-form-control nzErrorTip="Address is required">
                  <input nz-input formControlName="addressLine" placeholder="123 Main Street" />
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>City</nz-form-label>
                <nz-form-control>
                  <input nz-input formControlName="city" placeholder="New York" />
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Latitude</nz-form-label>
                <nz-form-control nzErrorTip="Latitude is required (-90 to 90)">
                  <nz-input-number formControlName="lat" [nzMin]="-90" [nzMax]="90" [nzStep]="0.0001" style="width: 100%;"></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label nzRequired>Longitude</nz-form-label>
                <nz-form-control nzErrorTip="Longitude is required (-180 to 180)">
                  <nz-input-number formControlName="lng" [nzMin]="-180" [nzMax]="180" [nzStep]="0.0001" style="width: 100%;"></nz-input-number>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </nz-card>

        <!-- Work Details Section -->
        <nz-card nzTitle="Work Details" style="margin-bottom: 16px;">
          <div nz-row [nzGutter]="16">
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label nzRequired>Category</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="category" style="width: 100%;">
                    <nz-option nzValue="AC" nzLabel="AC"></nz-option>
                    <nz-option nzValue="Mechanical" nzLabel="Mechanical"></nz-option>
                    <nz-option nzValue="Electrical" nzLabel="Electrical"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label nzRequired>Priority</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="priority" style="width: 100%;">
                    <nz-option nzValue="Low" nzLabel="Low"></nz-option>
                    <nz-option nzValue="Normal" nzLabel="Normal"></nz-option>
                    <nz-option nzValue="High" nzLabel="High"></nz-option>
                    <nz-option nzValue="Urgent" nzLabel="Urgent"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>Warranty</nz-form-label>
                <nz-form-control>
                  <nz-switch formControlName="warranty"></nz-switch>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
          <nz-form-item>
            <nz-form-label>Notes</nz-form-label>
            <nz-form-control>
              <textarea nz-input formControlName="notes" rows="3" placeholder="Additional notes..."></textarea>
            </nz-form-control>
          </nz-form-item>
        </nz-card>

        <!-- Buttons -->
        <div class="button-row">
          <button nz-button nzType="primary" type="submit">Save as New</button>
          <button nz-button nzType="default" type="button" (click)="save('ready')" style="margin-left: 8px;">Save & Ready</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .create-container { max-width: 900px; margin: 0 auto; }
    .button-row { display: flex; justify-content: flex-end; }
    .field-hint { font-size: 11px; color: #999; margin-top: 4px; }
    .matches-dropdown { background: #fafafa; border: 1px solid #e8e8e8; border-radius: 4px; padding: 8px; margin-top: 8px; }
    .match-option { padding: 8px; cursor: pointer; border-bottom: 1px solid #f0f0f0; }
    .match-option:hover { background: #e6f7ff; }
    .match-option:last-child { border-bottom: none; }
    .match-option .email { color: #999; margin-left: 8px; font-size: 12px; }
  `]
})
export class CreateOrderComponent implements OnInit, OnDestroy {
  form: FormGroup;

  matchedCustomer: Customer | null = null;
  customerMatches: Customer[] = [];
  phoneSearching = false;
  phoneStatus = '';
  selectedAddressIndex: number | null = null;

  formatPhone = formatPhone;

  private phoneSearch$ = new Subject<string>();
  private destroy$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private autoAssign: AutoAssignService,
    private customerService: CustomerService,
    private notification: NzNotificationService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      // Customer
      customerPhone: [null, [Validators.required, Validators.minLength(7)]],
      customerName: [null, [Validators.required, Validators.minLength(2)]],
      customerEmail: [null, [Validators.email]],
      customerUnit: [null],
      // Address
      addressLine: [null, [Validators.required]],
      city: [null],
      lat: [40.7128, [Validators.required, Validators.min(-90), Validators.max(90)]],
      lng: [-74.0060, [Validators.required, Validators.min(-180), Validators.max(180)]],
      // Work Details
      category: ['AC', [Validators.required]],
      priority: ['Normal', [Validators.required]],
      warranty: [false],
      notes: [null]
    });
  }

  ngOnInit() {
    // Phone search with debounce
    this.phoneSearch$.pipe(
      debounceTime(350),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(phone => this.searchCustomerByPhone(phone));

    // Check for customerId query param (from CRM page)
    this.route.queryParams.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['customerId']) {
        const customer = this.customerService.getById(params['customerId']);
        if (customer) {
          this.selectCustomer(customer);
        }
      }
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPhoneInput() {
    const phone = this.form.get('customerPhone')?.value || '';
    if (phone.length >= 7) {
      this.phoneSearching = true;
      this.phoneSearch$.next(phone);
    } else {
      this.customerMatches = [];
      this.matchedCustomer = null;
    }
  }

  searchCustomerByPhone(phone: string) {
    const normalized = normalizePhone(phone);
    const matches = this.customerService.searchByPhone(normalized);
    this.phoneSearching = false;

    if (matches.length === 1) {
      this.selectCustomer(matches[0]);
      this.customerMatches = [];
    } else if (matches.length > 1) {
      this.customerMatches = matches;
      this.matchedCustomer = null;
    } else {
      this.customerMatches = [];
      this.matchedCustomer = null;
    }
  }

  selectCustomer(customer: Customer) {
    this.matchedCustomer = customer;
    this.customerMatches = [];
    this.phoneStatus = 'success';

    // Auto-fill customer fields
    this.form.patchValue({
      customerPhone: customer.phone,
      customerName: customer.name,
      customerEmail: customer.email || null,
      customerUnit: customer.unit || null
    });

    // If customer has default address, select it
    if (customer.addresses?.length) {
      this.selectedAddressIndex = 0;
      this.onAddressSelect(0);
    }
  }

  clearCustomerMatch() {
    this.matchedCustomer = null;
    this.customerMatches = [];
    this.phoneStatus = '';
    this.selectedAddressIndex = null;
    // Keep phone, clear other fields
    this.form.patchValue({
      customerName: null,
      customerEmail: null,
      customerUnit: null
    });
  }

  onAddressSelect(index: number) {
    if (index === -1 || !this.matchedCustomer?.addresses) {
      // Clear address fields for new entry
      this.form.patchValue({
        addressLine: null,
        city: null,
        lat: 40.7128,
        lng: -74.0060
      });
      return;
    }

    const addr = this.matchedCustomer.addresses[index];
    this.form.patchValue({
      addressLine: addr.line1,
      city: addr.city || null,
      lat: addr.lat,
      lng: addr.lng
    });
  }

  save(mode: 'new' | 'ready'): void {
    if (this.form.invalid) {
      Object.values(this.form.controls).forEach(control => {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      });
      this.notification.warning('Validation Error', 'Please fix the highlighted fields.');
      return;
    }

    const val = this.form.value;
    const address: Address = {
      line1: val.addressLine,
      city: val.city || undefined,
      lat: val.lat,
      lng: val.lng
    };

    // Upsert customer in CRM
    let customerId: string;
    if (this.matchedCustomer) {
      customerId = this.matchedCustomer.id;
      // Add new address if different
      this.customerService.addAddress(customerId, address);
      this.customerService.updateLastOrderAt(customerId);
    } else {
      // Create new customer
      const result = this.customerService.upsertFromOrderForm({
        phone: val.customerPhone,
        name: val.customerName,
        email: val.customerEmail,
        unit: val.customerUnit,
        address
      });
      customerId = result.customerId;
    }

    const newOrder: WorkOrder = {
      id: 'WO-' + Math.floor(Math.random() * 100000),
      number: 'WO-' + (1000 + Math.floor(Math.random() * 9000)),
      siteId: 'SITE-001',
      customerId,
      category: val.category,
      priority: val.priority,
      warranty: val.warranty,
      status: mode === 'ready' ? 'Ready' : 'New',
      customer: {
        name: val.customerName,
        phone: val.customerPhone || undefined,
        email: val.customerEmail || undefined,
        unit: val.customerUnit || undefined
      },
      address,
      notes: val.notes,
      createdAt: new Date().toISOString()
    };

    this.stateService.addWorkOrder(newOrder);

    if (mode === 'ready') {
      const result = this.autoAssign.tryAssign(newOrder);
      if (result.success) {
        this.stateService.updateWorkOrderTracked(newOrder.id, {
          status: 'Assigned',
          assignedTechnicianId: result.technicianId,
          etaMin: result.etaMin,
          distanceKm: result.distanceKm
        });
        this.notification.success('Created & Assigned', `Nearest technician assigned.`);
      } else {
        this.notification.warning('Created (Ready)', `No eligible technicians nearby: ${result.reason}`);
      }
    } else {
      this.notification.success('Order Created', 'Work order saved as New.');
    }

    this.router.navigate(['/orders']);
  }
}
