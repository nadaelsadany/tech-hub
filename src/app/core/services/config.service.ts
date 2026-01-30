import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AppConfig } from '../models/config.model';

const DEFAULT_CONFIG: AppConfig = {
    avgSpeedKmh: 35,
    maxRadiusKm: 25,
    heartbeatMaxAgeMin: 10,
    requireSkillMatch: false,
    defaultSiteId: 'SITE-001',
    planningAvgSpeedKmh: 35,
    defaultServiceTimeMin: 45
};

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private configSubject = new BehaviorSubject<AppConfig>(DEFAULT_CONFIG);
    config$ = this.configSubject.asObservable();

    constructor() { }

    updateConfig(config: Partial<AppConfig>) {
        const current = this.configSubject.value;
        this.configSubject.next({ ...current, ...config });
    }

    getConfig(): AppConfig {
        return this.configSubject.value;
    }
}
