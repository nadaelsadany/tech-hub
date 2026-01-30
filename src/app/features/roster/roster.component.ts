import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { StateService } from '../../core/services/state.service';
import { Technician } from '../../core/models/technician.model';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-roster',
    standalone: true,
    imports: [CommonModule, NzTableModule, NzTagModule, NzButtonModule],
    template: `
    <div class="roster-container">
      <h2>Technician Roster</h2>
      <nz-table #basicTable [nzData]="(technicians$ | async) || []" [nzPageSize]="10">
        <thead>
          <tr>
            <th>Name</th>
            <th>Shift Status</th>
            <th>Skills</th>
            <th>Radius (km)</th>
            <th>Last Heartbeat</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          <tr *ngFor="let data of basicTable.data">
            <td>{{data.name}}</td>
            <td>
              <nz-tag [nzColor]="data.shiftStatus === 'On' ? 'green' : 'default'">
                {{data.shiftStatus}}
              </nz-tag>
            </td>
            <td>
              <nz-tag *ngFor="let skill of data.skills" nzColor="blue">{{skill}}</nz-tag>
            </td>
            <td>{{data.serviceRadiusKm}}</td>
            <td>{{ data.currentGeo.ts | date:'shortTime' }}</td>
            <td>
              <nz-tag [nzColor]="data.active ? 'success' : 'error'">
                {{ data.active ? 'Yes' : 'No' }}
              </nz-tag>
            </td>
          </tr>
        </tbody>
      </nz-table>
    </div>
  `,
    styles: [``]
})
export class RosterComponent {
    technicians$: Observable<Technician[]>;

    constructor(private stateService: StateService) {
        this.technicians$ = this.stateService.technicians$;
    }
}
