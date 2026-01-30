import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { CatalogService } from '../../core/services/catalog.service';
import { FeeCatalogItem, TaxProfile } from '../../core/models/invoice.model';

@Component({
  selector: 'app-accounting-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NzCardModule,
    NzTableModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzTabsModule
  ],
  template: `
    <div class="settings-container">
      <div class="page-header">
        <h2>Accounting Settings</h2>
      </div>

      <nz-card>
        <nz-tabs>
          <!-- Fee Catalog -->
          <nz-tab nzTitle="Fee Catalog">
            <div class="tab-actions">
              <button nz-button nzType="primary">
                <span nz-icon nzType="plus"></span> Add Fee Item
              </button>
            </div>

            <nz-table #feeCatalogTable [nzData]="feeCatalog" [nzPageSize]="20">
              <thead>
                <tr>
                  <th>Code</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th nzAlign="right">Default Price</th>
                  <th>Currency</th>
                  <th>Taxable</th>
                  <th nzAlign="center">Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of feeCatalogTable.data">
                  <td>{{ item.label }}</td>
                  <td>{{ item.code }}</td>
                  <td nzAlign="right">{{ item.defaultUnitPrice | number: '1.2-2' }}</td>
                  <td>{{ item.currency }}</td>
                  <td>
                    <span nz-icon [nzType]="item.taxable ? 'check' : 'close'"></span>
                  </td>
                  <td nzAlign="center">
                    <nz-switch [ngModel]="item.active" nzSize="small" disabled></nz-switch>
                  </td>
                  <td>
                    <button nz-button nzType="link" nzSize="small">Edit</button>
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </nz-tab>

          <!-- Tax Profiles -->
          <nz-tab nzTitle="Tax Profiles">
            <div class="tab-actions">
              <button nz-button nzType="primary">
                <span nz-icon nzType="plus"></span> Add Tax Profile
              </button>
            </div>

            <nz-table #taxProfileTable [nzData]="taxProfiles" [nzPageSize]="10">
              <thead>
                <tr>
                  <th>Name</th>
                  <th nzAlign="right">Rate (%)</th>
                  <th>Calculation</th>
                  <th nzAlign="center">Active</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let profile of taxProfileTable.data">
                  <td>{{ profile.name }}</td>
                  <td nzAlign="right">{{ profile.ratePct }}</td>
                  <td>{{ profile.inclusive ? 'Inclusive' : 'Exclusive' }}</td>
                  <td nzAlign="center">
                    <nz-switch [ngModel]="profile.active" nzSize="small" disabled></nz-switch>
                  </td>
                  <td>
                    <button nz-button nzType="link" nzSize="small">Edit</button>
                  </td>
                </tr>
              </tbody>
            </nz-table>
          </nz-tab>
        </nz-tabs>
      </nz-card>
    </div>
  `,
  styles: [`
    .settings-container {
      padding: 24px;
    }

    .page-header {
      margin-bottom: 24px;
    }

    .page-header h2 {
      margin: 0;
    }

    .tab-actions {
      margin-bottom: 16px;
      display: flex;
      justify-content: flex-end;
    }
  `]
})
export class AccountingSettingsComponent implements OnInit {
  private catalogService = inject(CatalogService);

  feeCatalog: FeeCatalogItem[] = [];
  taxProfiles: TaxProfile[] = [];

  ngOnInit(): void {
    this.loadSettings();
  }

  loadSettings(): void {
    this.catalogService.feeCatalog$.subscribe(items => {
      this.feeCatalog = items;
    });

    this.catalogService.taxProfiles$.subscribe(profiles => {
      this.taxProfiles = profiles;
    });
  }
}
