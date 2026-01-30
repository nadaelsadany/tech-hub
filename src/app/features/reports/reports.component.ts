import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// NG-ZORRO imports
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzTabsModule } from 'ng-zorro-antd/tabs';
import { NzStatisticModule } from 'ng-zorro-antd/statistic';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDatePickerModule } from 'ng-zorro-antd/date-picker';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSpaceModule } from 'ng-zorro-antd/space';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzRateModule } from 'ng-zorro-antd/rate';
import { NzGridModule } from 'ng-zorro-antd/grid';

import { KpiService } from '../../core/services/kpi.service';
import { StateService } from '../../core/services/state.service';
import { KpiSnapshot, ReportFilter } from '../../core/models/kpi.model';
import { WorkOrder } from '../../core/models/work-order.model';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    NzCardModule,
    NzTabsModule,
    NzStatisticModule,
    NzTableModule,
    NzDatePickerModule,
    NzSelectModule,
    NzButtonModule,
    NzSpaceModule,
    NzTagModule,
    NzRateModule,
    NzGridModule
  ],
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {
  private kpiService = inject(KpiService);
  private stateService = inject(StateService);

  // Filters
  dateRange: Date[] | null = null;
  selectedSites: string[] = [];
  selectedTechnicians: string[] = [];
  selectedStatuses: string[] = [];

  // Data
  kpiSnapshot$: Observable<KpiSnapshot> | null = null;
  workOrders: WorkOrder[] = [];
  reviewTasks$: Observable<any[]> | null = null;
  filteredReviewTasks$: Observable<any[]> | null = null;

  // Options
  siteOptions = ['North', 'South', 'East', 'West'];
  technicianOptions: { label: string; value: string }[] = [];

  ngOnInit() {
    // Get technician options
    this.technicianOptions = this.stateService.getTechnicians()
      .map(t => ({ label: t.name, value: t.id }));

    // Load initial data (last 30 days)
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    this.dateRange = [start, end];
    this.loadReport();

    // Load review tasks
    this.loadReviewTasks();
  }

  loadReport() {
    const filter: ReportFilter = {
      dateRange: this.dateRange ? {
        start: this.dateRange[0].toISOString(),
        end: this.dateRange[1].toISOString()
      } : { start: '', end: '' },
      siteId: this.selectedSites.length > 0 ? this.selectedSites[0] : undefined,
      technicianIds: this.selectedTechnicians.length > 0 ? this.selectedTechnicians : undefined
    };

    this.kpiSnapshot$ = this.kpiService.buildKpiSnapshot(filter);

    // Get filtered work orders for table
    this.stateService.workOrders$.subscribe(orders => {
      this.workOrders = orders.filter(o => {
        if (!o.completedAt) return false;
        if (this.dateRange) {
          const completed = new Date(o.completedAt);
          if (completed < this.dateRange[0] || completed > this.dateRange[1]) return false;
        }
        if (this.selectedSites.length > 0 && !this.selectedSites.includes(o.siteId)) return false;
        if (this.selectedTechnicians.length > 0 && o.assignedTechnicianId && !this.selectedTechnicians.includes(o.assignedTechnicianId)) return false;
        return true;
      });
    });
  }

  clearFilters() {
    this.dateRange = null;
    this.selectedSites = [];
    this.selectedTechnicians = [];
    this.loadReport();
  }

  loadReviewTasks() {
    this.reviewTasks$ = this.stateService.reviewTasks$;

    // Apply filters if any are set
    if (this.dateRange || this.selectedStatuses.length > 0 || this.selectedTechnicians.length > 0) {
      this.filteredReviewTasks$ = this.reviewTasks$.pipe(
        map(tasks => tasks.filter(task => {
          // Date range filter
          if (this.dateRange) {
            const taskDate = new Date(task.createdAt);
            if (taskDate < this.dateRange[0] || taskDate > this.dateRange[1]) {
              return false;
            }
          }

          // Status filter
          if (this.selectedStatuses.length > 0) {
            // Check if overdue
            const isOverdue = task.status === 'Pending' && new Date(task.dueAt) < new Date();
            const effectiveStatus = isOverdue ? 'Overdue' : task.status;
            if (!this.selectedStatuses.includes(effectiveStatus)) {
              return false;
            }
          }

          // Technician filter
          if (this.selectedTechnicians.length > 0 && !this.selectedTechnicians.includes(task.technicianId)) {
            return false;
          }

          return true;
        }))
      );
    } else {
      this.filteredReviewTasks$ = this.reviewTasks$;
    }
  }

  clearReviewFilters() {
    this.selectedStatuses = [];
    this.selectedTechnicians = [];
    const end = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 30);
    this.dateRange = [start, end];
    this.loadReviewTasks();
  }

  exportCsv() {
    if (this.workOrders.length === 0) return;

    const csv = this.generateOrdersCsv(this.workOrders);
    this.downloadCsv(csv, 'Orders_Quality_Report.csv');
  }

  exportExcel() {
    if (this.workOrders.length === 0) return;

    const data = this.workOrders.map(wo => ({
      'Order Number': wo.number,
      'Customer': wo.customer.name,
      'Technician': this.getTechName(wo.assignedTechnicianId),
      'Completed At': this.formatDateTime(wo.completedAt),
      'Reviewed': wo.supervisorReviewId ? 'Yes' : 'Pending',
      'Outcome': wo.supervisorReviewOutcome || '-'
    }));

    this.downloadExcel(data, 'Orders_Quality_Report.xlsx');
  }

  exportTechnicianCsv() {
    if (!this.kpiSnapshot$) return;

    this.kpiSnapshot$.subscribe(snapshot => {
      if (!snapshot.byTechnician || snapshot.byTechnician.length === 0) return;

      const csv = this.generateTechnicianCsv(snapshot.byTechnician);
      this.downloadCsv(csv, 'Technician_Performance.csv');
    });
  }

  exportTechnicianExcel() {
    if (!this.kpiSnapshot$) return;

    this.kpiSnapshot$.subscribe(snapshot => {
      if (!snapshot.byTechnician || snapshot.byTechnician.length === 0) return;

      const data = snapshot.byTechnician.map(tech => ({
        'Technician': tech.name,
        'Completed': tech.completed,
        'Reviewed': tech.reviewed,
        'Review Coverage %': this.getPercentage(tech.reviewed, tech.completed),
        'Avg Score': tech.reviewScoreAvg,
        'On-Time %': tech.onTimeArrivalPct,
        'Follow-Ups Needed': tech.followUpsNeeded,
        'Reassignment Rate %': tech.reassignmentRate
      }));

      this.downloadExcel(data, 'Technician_Performance.xlsx');
    });
  }

  exportReviewSlaCsv() {
    if (!this.reviewTasks$) return;

    this.reviewTasks$.subscribe(tasks => {
      if (tasks.length === 0) return;

      const csv = this.generateReviewSlaCsv(tasks);
      this.downloadCsv(csv, 'Review_SLA_Report.csv');
    });
  }

  exportReviewSlaExcel() {
    if (!this.reviewTasks$) return;

    this.reviewTasks$.subscribe(tasks => {
      if (tasks.length === 0) return;

      const data = tasks.map(task => ({
        'Order #': task.workOrderNumber,
        'Technician': this.getTechName(task.technicianId),
        'Assigned To': task.assignedToId ? task.assignedToId.slice(-4) : 'Unassigned',
        'Created': this.formatDateTime(task.createdAt),
        'Due': this.formatDateTime(task.dueAt),
        'Status': task.status,
        'Time Remaining': task.status === 'Pending' ?
          this.formatTimeRemaining(this.getTimeRemaining(task.dueAt)) : '-'
      }));

      this.downloadExcel(data, 'Review_SLA_Report.xlsx');
    });
  }

  formatDateTime(iso: string | null | undefined): string {
    if (!iso) return '-';
    return new Date(iso).toLocaleString();
  }

  getTechName(id: string | null | undefined): string {
    if (!id) return '-';
    const tech = this.stateService.getTechnician(id);
    return tech ? tech.name : id;
  }

  // Technician Performance helpers
  getPercentage(value: number, total: number): number {
    if (total === 0) return 0;
    return Math.round((value / total) * 100);
  }

  // Review SLA helpers
  getTotalReviews(tasks: any[]): number {
    return tasks.length;
  }

  getPendingReviews(tasks: any[]): number {
    return tasks.filter(t => t.status === 'Pending').length;
  }

  getOverdueReviews(tasks: any[]): number {
    const now = new Date().getTime();
    return tasks.filter(t => t.status === 'Pending' && new Date(t.dueAt).getTime() < now).length;
  }

  getSlaCompliance(tasks: any[]): number {
    if (tasks.length === 0) return 100;
    const completed = tasks.filter(t => t.status !== 'Pending').length;
    const onTime = tasks.filter(t =>
      t.status !== 'Pending' && t.completedAt && new Date(t.completedAt) <= new Date(t.dueAt)
    ).length;
    if (completed === 0) return 100;
    return Math.round((onTime / completed) * 100);
  }

  getTimeRemaining(dueAt: string): number {
    return new Date(dueAt).getTime() - new Date().getTime();
  }

  getTimeBadgeStatus(ms: number): "success" | "processing" | "error" | "default" | "warning" {
    if (ms < 0) return 'error';
    const hours = ms / (1000 * 60 * 60);
    if (hours < 6) return 'warning';
    if (hours < 24) return 'processing';
    return 'success';
  }

  formatTimeRemaining(ms: number): string {
    if (ms < 0) {
      const hoursOverdue = Math.abs(ms) / (1000 * 60 * 60);
      return `${Math.round(hoursOverdue)}h overdue`;
    }
    const hours = ms / (1000 * 60 * 60);
    if (hours < 24) {
      return `${Math.round(hours)}h remaining`;
    }
    const days = hours / 24;
    return `${Math.round(days)}d remaining`;
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'Completed': return 'green';
      case 'Pending': return 'orange';
      case 'Overdue': return 'red';
      default: return 'default';
    }
  }

  // Export helpers
  private generateOrdersCsv(orders: WorkOrder[]): string {
    const headers = ['Order Number', 'Customer', 'Technician', 'Completed At', 'Reviewed', 'Outcome'];
    const rows = orders.map(wo => [
      wo.number,
      wo.customer.name,
      this.getTechName(wo.assignedTechnicianId),
      this.formatDateTime(wo.completedAt),
      wo.supervisorReviewId ? 'Yes' : 'Pending',
      wo.supervisorReviewOutcome || '-'
    ]);

    return this.arrayToCsv([headers, ...rows]);
  }

  private generateTechnicianCsv(technicians: any[]): string {
    const headers = ['Technician', 'Completed', 'Reviewed', 'Review Coverage %', 'Avg Score', 'On-Time %', 'Follow-Ups', 'Reassignment Rate %'];
    const rows = technicians.map(tech => [
      tech.name,
      tech.completed.toString(),
      tech.reviewed.toString(),
      this.getPercentage(tech.reviewed, tech.completed).toString(),
      tech.reviewScoreAvg.toString(),
      tech.onTimeArrivalPct.toString(),
      tech.followUpsNeeded.toString(),
      tech.reassignmentRate.toString()
    ]);

    return this.arrayToCsv([headers, ...rows]);
  }

  private generateReviewSlaCsv(tasks: any[]): string {
    const headers = ['Order #', 'Technician', 'Assigned To', 'Created', 'Due', 'Status', 'Time Remaining'];
    const rows = tasks.map(task => [
      task.workOrderNumber,
      this.getTechName(task.technicianId),
      task.assignedToId ? task.assignedToId.slice(-4) : 'Unassigned',
      this.formatDateTime(task.createdAt),
      this.formatDateTime(task.dueAt),
      task.status,
      task.status === 'Pending' ? this.formatTimeRemaining(this.getTimeRemaining(task.dueAt)) : '-'
    ]);

    return this.arrayToCsv([headers, ...rows]);
  }

  private arrayToCsv(data: string[][]): string {
    return data.map(row =>
      row.map(cell => {
        // Escape quotes and wrap in quotes if contains comma, quote, or newline
        const escaped = cell.replace(/"/g, '""');
        return /[",\n]/.test(cell) ? `"${escaped}"` : escaped;
      }).join(',')
    ).join('\n');
  }

  private downloadCsv(csv: string, filename: string): void {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  private downloadExcel(data: any[], filename: string): void {
    // Dynamic import to avoid bundling xlsx if not used
    import('xlsx').then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Report');
      XLSX.writeFile(wb, filename);
    });
  }
}
