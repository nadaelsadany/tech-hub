import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { StateService } from '../../core/services/state.service';
import { Observable, map } from 'rxjs';
import { WorkOrder } from '../../core/models/work-order.model';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [
        CommonModule,
        NzGridModule,
        NzStatisticModule,
        NzCardModule,
        NzTableModule,
        NzTagModule
    ],
    template: `
    <div class="dashboard-container">
      <div nz-row [nzGutter]="16">
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="(newCount$ | async)!" [nzTitle]="'New Orders'"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="(readyCount$ | async)!" [nzTitle]="'Ready to Assign'"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="(assignedCount$ | async)!" [nzTitle]="'Assigned / In Progress'"></nz-statistic>
          </nz-card>
        </div>
        <div nz-col [nzSpan]="6">
          <nz-card>
            <nz-statistic [nzValue]="(completedCount$ | async)!" [nzTitle]="'Completed Today'"></nz-statistic>
          </nz-card>
        </div>
      </div>

      <div class="at-risk-section" style="margin-top: 24px;">
        <h3>At Risk / Attention Needed</h3>
        <!-- Showing 'New' or 'Ready' orders that are unassigned as 'At Risk' for MVP -->
        <nz-table #basicTable [nzData]="(atRiskOrders$ | async) || []" [nzShowPagination]="false">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Status</th>
              <th>Created</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of basicTable.data">
              <td>{{data.number}}</td>
              <td><nz-tag [nzColor]="'gold'">{{data.status}}</nz-tag></td>
              <td>{{data.createdAt | date:'shortTime'}}</td>
              <td>{{data.priority}}</td>
            </tr>
          </tbody>
        </nz-table>
      </div>
    </div>
  `,
    styles: [`
    .dashboard-container { }
  `]
})
export class DashboardComponent implements OnInit {
    newCount$: Observable<number>;
    readyCount$: Observable<number>;
    assignedCount$: Observable<number>;
    completedCount$: Observable<number>;
    atRiskOrders$: Observable<WorkOrder[]>;

    constructor(private stateService: StateService) {
        const orders$ = this.stateService.workOrders$;

        this.newCount$ = orders$.pipe(map(list => list.filter(o => o.status === 'New').length));
        this.readyCount$ = orders$.pipe(map(list => list.filter(o => o.status === 'Ready').length));
        this.assignedCount$ = orders$.pipe(map(list => list.filter(o => ['Assigned', 'EnRoute', 'OnSite'].includes(o.status)).length));
        this.completedCount$ = orders$.pipe(map(list => list.filter(o => o.status === 'Completed').length));

        // Simple logic for At Risk: Ready items.
        this.atRiskOrders$ = orders$.pipe(map(list => list.filter(o => o.status === 'Ready')));
    }

    ngOnInit(): void { }
}
