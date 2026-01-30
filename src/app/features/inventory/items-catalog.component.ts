import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzMessageService } from 'ng-zorro-antd/message';
import { ItemService } from '../../core/services/item.service';
import { Item, UoM, UOM_LABELS } from '../../core/models/inventory.model';

@Component({
    selector: 'app-items-catalog',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        NzTableModule,
        NzButtonModule,
        NzIconModule,
        NzTagModule,
        NzInputModule,
        NzSelectModule,
        NzModalModule,
        NzFormModule,
        NzInputNumberModule,
        NzSwitchModule
    ],
    template: `
    <div class="items-catalog">
      <div class="page-header">
        <h2>Items Catalog</h2>
        <button nz-button nzType="primary" (click)="showModal()">
          <span nz-icon nzType="plus"></span> Add Item
        </button>
      </div>

      <!-- Search -->
      <div class="search-bar">
        <nz-input-group nzPrefixIcon="search" style="width: 300px;">
          <input nz-input placeholder="Search by SKU, name, or category" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()" />
        </nz-input-group>
        <nz-select [(ngModel)]="categoryFilter" (ngModelChange)="onSearch()" style="width: 200px; margin-left: 16px;" nzPlaceHolder="Filter by Category" nzAllowClear>
          <nz-option *ngFor="let cat of categories" [nzValue]="cat" [nzLabel]="cat"></nz-option>
        </nz-select>
      </div>

      <!-- Items Table -->
      <nz-table #itemsTable [nzData]="filteredItems" [nzPageSize]="10">
        <thead>
          <tr>
            <th>SKU</th>
            <th>Name</th>
            <th>UoM</th>
            <th>Category</th>
            <th>Reorder Point</th>
            <th>Reorder Qty</th>
            <th>Active</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let item of itemsTable.data">
            <td><code>{{ item.sku }}</code></td>
            <td>{{ item.name }}</td>
            <td>{{ getUomLabel(item.uom) }}</td>
            <td><nz-tag *ngIf="item.category">{{ item.category }}</nz-tag></td>
            <td>{{ item.reorderPoint || '-' }}</td>
            <td>{{ item.reorderQty || '-' }}</td>
            <td>
              <nz-tag [nzColor]="item.active ? 'green' : 'red'">{{ item.active ? 'Active' : 'Inactive' }}</nz-tag>
            </td>
            <td>
              <button nz-button nzType="link" nzSize="small" (click)="editItem(item)">Edit</button>
            </td>
          </tr>
        </tbody>
      </nz-table>

      <!-- Create/Edit Modal -->
      <nz-modal
        [(nzVisible)]="modalVisible"
        [nzTitle]="editingItem ? 'Edit Item' : 'Create Item'"
        (nzOnCancel)="modalVisible = false"
        (nzOnOk)="saveItem()"
        nzOkText="Save"
      >
        <ng-container *nzModalContent>
          <form nz-form [formGroup]="form" nzLayout="vertical">
            <nz-form-item>
              <nz-form-label nzRequired>SKU</nz-form-label>
              <nz-form-control nzErrorTip="SKU is required">
                <input nz-input formControlName="sku" placeholder="FLT-001" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Name</nz-form-label>
              <nz-form-control nzErrorTip="Name is required">
                <input nz-input formControlName="name" placeholder="Air Filter" />
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label nzRequired>Unit of Measure</nz-form-label>
              <nz-form-control>
                <nz-select formControlName="uom" style="width: 100%;">
                  <nz-option *ngFor="let uom of uomOptions" [nzValue]="uom.value" [nzLabel]="uom.label"></nz-option>
                </nz-select>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Category</nz-form-label>
              <nz-form-control>
                <input nz-input formControlName="category" placeholder="Filters" />
              </nz-form-control>
            </nz-form-item>
            <div nz-row [nzGutter]="16">
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label>Reorder Point</nz-form-label>
                  <nz-form-control>
                    <nz-input-number formControlName="reorderPoint" [nzMin]="0" style="width: 100%;"></nz-input-number>
                  </nz-form-control>
                </nz-form-item>
              </div>
              <div nz-col [nzSpan]="12">
                <nz-form-item>
                  <nz-form-label>Reorder Qty</nz-form-label>
                  <nz-form-control>
                    <nz-input-number formControlName="reorderQty" [nzMin]="0" style="width: 100%;"></nz-input-number>
                  </nz-form-control>
                </nz-form-item>
              </div>
            </div>
            <nz-form-item>
              <nz-form-label>Active</nz-form-label>
              <nz-form-control>
                <nz-switch formControlName="active"></nz-switch>
              </nz-form-control>
            </nz-form-item>
            <nz-form-item>
              <nz-form-label>Notes</nz-form-label>
              <nz-form-control>
                <textarea nz-input formControlName="notes" rows="2"></textarea>
              </nz-form-control>
            </nz-form-item>
          </form>
        </ng-container>
      </nz-modal>
    </div>
  `,
    styles: [`
    .items-catalog { padding: 0; }
    .page-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
    .search-bar { margin-bottom: 16px; display: flex; align-items: center; }
  `]
})
export class ItemsCatalogComponent implements OnInit {
    items: Item[] = [];
    filteredItems: Item[] = [];
    categories: string[] = [];
    searchQuery = '';
    categoryFilter = '';

    modalVisible = false;
    editingItem: Item | null = null;
    form: FormGroup;

    uomOptions = Object.entries(UOM_LABELS).map(([value, label]) => ({ value, label }));

    constructor(
        private itemService: ItemService,
        private fb: FormBuilder,
        private message: NzMessageService
    ) {
        this.form = this.fb.group({
            sku: ['', Validators.required],
            name: ['', Validators.required],
            uom: ['pcs', Validators.required],
            category: [''],
            reorderPoint: [null],
            reorderQty: [null],
            active: [true],
            notes: ['']
        });
    }

    ngOnInit() {
        this.loadData();
    }

    loadData() {
        this.items = this.itemService.getAll();
        this.filteredItems = [...this.items];
        this.categories = this.itemService.getCategories();
    }

    onSearch() {
        let result = [...this.items];
        if (this.searchQuery) {
            result = this.itemService.search(this.searchQuery);
        }
        if (this.categoryFilter) {
            result = result.filter(i => i.category === this.categoryFilter);
        }
        this.filteredItems = result;
    }

    getUomLabel(uom: UoM): string {
        return UOM_LABELS[uom] || uom;
    }

    showModal() {
        this.editingItem = null;
        this.form.reset({ uom: 'pcs', active: true });
        this.modalVisible = true;
    }

    editItem(item: Item) {
        this.editingItem = item;
        this.form.patchValue({
            sku: item.sku,
            name: item.name,
            uom: item.uom,
            category: item.category || '',
            reorderPoint: item.reorderPoint,
            reorderQty: item.reorderQty,
            active: item.active,
            notes: item.notes || ''
        });
        this.modalVisible = true;
    }

    saveItem() {
        if (this.form.invalid) {
            Object.values(this.form.controls).forEach(c => c.markAsDirty());
            return;
        }

        const val = this.form.value;
        if (this.editingItem) {
            this.itemService.update(this.editingItem.id, val);
            this.message.success('Item updated');
        } else {
            this.itemService.create(val);
            this.message.success('Item created');
        }

        this.modalVisible = false;
        this.loadData();
    }
}
