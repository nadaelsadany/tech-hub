import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ReportConfig } from '../models/kpi.model';

@Injectable({
    providedIn: 'root'
})
export class ReportConfigService {
    private configsSubject = new BehaviorSubject<ReportConfig[]>([]);
    public readonly configs$ = this.configsSubject.asObservable();

    constructor() {
        this.loadFromStorage();
    }

    /**
     * Save a new report configuration
     */
    saveConfig(config: Omit<ReportConfig, 'id' | 'createdAt' | 'updatedAt'>): ReportConfig {
        const newConfig: ReportConfig = {
            ...config,
            id: this.generateId(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        const configs = this.configsSubject.value;
        const updated = [...configs, newConfig];
        this.configsSubject.next(updated);
        this.saveToStorage(updated);

        return newConfig;
    }

    /**
     * Update an existing report configuration
     */
    updateConfig(id: string, updates: Partial<ReportConfig>): ReportConfig | null {
        const configs = this.configsSubject.value;
        const index = configs.findIndex(c => c.id === id);

        if (index === -1) return null;

        const updatedConfig = {
            ...configs[index],
            ...updates,
            updatedAt: new Date().toISOString()
        };

        const updatedConfigs = [...configs];
        updatedConfigs[index] = updatedConfig;
        this.configsSubject.next(updatedConfigs);
        this.saveToStorage(updatedConfigs);

        return updatedConfig;
    }

    /**
     * Delete a report configuration
     */
    deleteConfig(id: string): boolean {
        const configs = this.configsSubject.value;
        const filtered = configs.filter(c => c.id !== id);

        if (filtered.length === configs.length) return false;

        this.configsSubject.next(filtered);
        this.saveToStorage(filtered);
        return true;
    }

    /**
     * Get a specific configuration by ID
     */
    getConfig(id: string): Observable<ReportConfig | undefined> {
        return new Observable(observer => {
            this.configs$.subscribe(configs => {
                const config = configs.find(c => c.id === id);
                observer.next(config);
            });
        });
    }

    /**
     * Get all configurations for a specific report type
     */
    getConfigsByType(reportType: string): Observable<ReportConfig[]> {
        return new Observable(observer => {
            this.configs$.subscribe(configs => {
                const filtered = configs.filter(c => c.reportType === reportType);
                observer.next(filtered);
            });
        });
    }

    /**
     * Get all scheduled reports (configs with schedule enabled)
     */
    getScheduledReports(): Observable<ReportConfig[]> {
        return new Observable(observer => {
            this.configs$.subscribe(configs => {
                const scheduled = configs.filter(c => c.schedule?.enabled === true);
                observer.next(scheduled);
            });
        });
    }

    /**
     * Enable/disable schedule for a config
     */
    toggleSchedule(id: string, enabled: boolean): ReportConfig | null {
        const configs = this.configsSubject.value;
        const index = configs.findIndex(c => c.id === id);

        if (index === -1 || !configs[index].schedule) return null;

        const updatedConfig = {
            ...configs[index],
            schedule: {
                ...configs[index].schedule!,
                enabled
            },
            updatedAt: new Date().toISOString()
        };

        const updatedConfigs = [...configs];
        updatedConfigs[index] = updatedConfig;
        this.configsSubject.next(updatedConfigs);
        this.saveToStorage(updatedConfigs);

        return updatedConfig;
    }

    // LocalStorage persistence (for MVP)
    private readonly STORAGE_KEY = 'technicians-hub-report-configs';

    private loadFromStorage(): void {
        try {
            const stored = localStorage.getItem(this.STORAGE_KEY);
            if (stored) {
                const configs = JSON.parse(stored) as ReportConfig[];
                this.configsSubject.next(configs);
            }
        } catch (error) {
            console.error('Failed to load report configs from storage:', error);
        }
    }

    private saveToStorage(configs: ReportConfig[]): void {
        try {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(configs));
        } catch (error) {
            console.error('Failed to save report configs to storage:', error);
        }
    }

    private generateId(): string {
        return `RC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
}
