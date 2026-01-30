export interface AppConfig {
    avgSpeedKmh: number;
    maxRadiusKm: number;
    heartbeatMaxAgeMin: number;
    requireSkillMatch: boolean;
    defaultSiteId: string;
    // Planning extensions
    planningAvgSpeedKmh?: number;     // default = avgSpeedKmh
    defaultServiceTimeMin: number;    // default 45
    // Quality & Review settings
    reviewSlaHours?: number;           // default 24
    reviewScoringScale?: '0-100' | '1-5'; // default '0-100'
    scheduledReportsEnabled?: boolean; // default false
    defaultReportTime?: string;        // HH:mm, default '07:00'
    showSupervisorToTechnicians?: boolean; // default false
}
