import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzListModule } from 'ng-zorro-antd/list';
import { StateService } from '../../core/services/state.service';
import { Observable } from 'rxjs';
import { Technician } from '../../core/models/technician.model';
import { WorkOrder } from '../../core/models/work-order.model';

@Component({
    selector: 'app-map',
    standalone: true,
    imports: [CommonModule, NzCardModule, NzListModule],
    template: `
    <div class="map-container" style="display: flex; gap: 16px; height: 100%;">
      <div style="flex: 1;">
         <nz-card nzTitle="Map Visualization" style="height: 100%; min-height: 500px; background: #f0f2f5; display: flex; align-items: center; justify-content: center;">
            <div style="text-align: center;">
               <span style="font-size: 48px;">🗺️</span>
               <h3>Map Integration Coming Soon</h3>
               <p>Use Azure Maps or Google Maps here.</p>
            </div>
         </nz-card>
      </div>
      <div style="width: 300px; display: flex; flex-direction: column; gap: 16px;">
        <nz-card nzTitle="Technicians Nearby" [nzBodyStyle]="{padding: '0'}">
           <nz-list nzBordered>
              <nz-list-item *ngFor="let tech of technicians$ | async">
                 <span nz-typography><strong>{{tech.name}}</strong></span>
                 <span>{{tech.currentGeo.lat.toFixed(4)}}, {{tech.currentGeo.lng.toFixed(4)}}</span>
              </nz-list-item>
           </nz-list>
        </nz-card>

        <nz-card nzTitle="Open Orders" [nzBodyStyle]="{padding: '0'}">
            <nz-list nzBordered>
              <nz-list-item *ngFor="let order of workOrders$ | async">
                 <span nz-typography>{{order.number}} - {{order.status}}</span>
              </nz-list-item>
           </nz-list>
        </nz-card>
      </div>
    </div>
  `,
    styles: [``]
})
export class MapComponent {
    technicians$: Observable<Technician[]>;
    workOrders$: Observable<WorkOrder[]>;

    constructor(private stateService: StateService) {
        this.technicians$ = this.stateService.technicians$;
        this.workOrders$ = this.stateService.workOrders$;
    }
}
