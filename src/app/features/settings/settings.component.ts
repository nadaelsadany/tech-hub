import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzSwitchModule } from 'ng-zorro-antd/switch';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzMessageService } from 'ng-zorro-antd/message';
import { NzCardModule } from 'ng-zorro-antd/card';
import { NzGridModule } from 'ng-zorro-antd/grid';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { NzTypographyModule } from 'ng-zorro-antd/typography';
import { ConfigService } from '../../core/services/config.service';
import { AppConfig } from '../../core/models/config.model';

interface ExtendedConfig extends AppConfig {
  autoAssignMode?: 'off' | 'nearest' | 'planning-only';
  fallbackRadiusKm?: number;
  enableMapPreview?: boolean;
  compactTableMode?: boolean;
  theme?: 'light' | 'dark' | 'system';
}

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NzFormModule,
    NzInputNumberModule,
    NzSwitchModule,
    NzButtonModule,
    NzCardModule,
    NzGridModule,
    NzSelectModule,
    NzDividerModule,
    NzTypographyModule
  ],
  template: `
    <div class="settings-container">
      <h2 nz-typography>Settings</h2>
      <p class="subtitle">Configure dispatch behavior, planning parameters, and display preferences.</p>

      <form [formGroup]="form">
        <!-- Assignment Settings -->
        <nz-card nzTitle="Assignment Settings" class="section-card">
          <div nz-row [nzGutter]="24">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Average Speed (km/h)</nz-form-label>
                <nz-form-control nzErrorTip="Required (1-200)">
                  <nz-input-number 
                    formControlName="avgSpeedKmh" 
                    [nzMin]="1" 
                    [nzMax]="200" 
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">Used to calculate ETA for nearest technician assignment.</p>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Max Assignment Radius (km)</nz-form-label>
                <nz-form-control nzErrorTip="Required (1-500)">
                  <nz-input-number 
                    formControlName="maxRadiusKm" 
                    [nzMin]="1" 
                    [nzMax]="500"
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">Maximum distance for auto-assignment eligibility.</p>
              </nz-form-item>
            </div>
          </div>
          <div nz-row [nzGutter]="24">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Heartbeat Max Age (min)</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="heartbeatMaxAgeMin" 
                    [nzMin]="1" 
                    [nzMax]="60"
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">How old a technician's last location update can be.</p>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Require Skill Match</nz-form-label>
                <nz-form-control>
                  <nz-switch formControlName="requireSkillMatch"></nz-switch>
                  <span class="switch-label">{{ form.value.requireSkillMatch ? 'Yes' : 'No' }}</span>
                </nz-form-control>
                <p class="field-hint">Only assign techs whose skills match the job category.</p>
              </nz-form-item>
            </div>
          </div>
        </nz-card>

        <!-- Planning Settings -->
        <nz-card nzTitle="Planning Settings" class="section-card">
          <div nz-row [nzGutter]="24">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Default Service Time (min)</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="defaultServiceTimeMin" 
                    [nzMin]="5" 
                    [nzMax]="480"
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">Default job duration when not specified on work order.</p>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Planning Avg Speed (km/h)</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="planningAvgSpeedKmh" 
                    [nzMin]="1" 
                    [nzMax]="200"
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">Used for ETA estimates when planning routes.</p>
              </nz-form-item>
            </div>
          </div>
        </nz-card>

        <!-- Dispatch Behavior -->
        <nz-card nzTitle="Dispatch Behavior" class="section-card">
          <div nz-row [nzGutter]="24">
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Auto-Assign Mode</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="autoAssignMode" style="width: 100%;">
                    <nz-option nzValue="off" nzLabel="Off"></nz-option>
                    <nz-option nzValue="nearest" nzLabel="Nearest Technician"></nz-option>
                    <nz-option nzValue="planning-only" nzLabel="Daily Planning Only"></nz-option>
                  </nz-select>
                </nz-form-control>
                <p class="field-hint">How orders are automatically assigned when set to Ready.</p>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="12">
              <nz-form-item>
                <nz-form-label>Fallback Radius (km)</nz-form-label>
                <nz-form-control>
                  <nz-input-number 
                    formControlName="fallbackRadiusKm" 
                    [nzMin]="1" 
                    [nzMax]="500"
                    style="width: 100%;"
                  ></nz-input-number>
                </nz-form-control>
                <p class="field-hint">Extended radius when no techs found within max radius.</p>
              </nz-form-item>
            </div>
          </div>
        </nz-card>

        <!-- Display Preferences -->
        <nz-card nzTitle="Display Preferences" class="section-card">
          <div nz-row [nzGutter]="24">
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>Enable Map Preview</nz-form-label>
                <nz-form-control>
                  <nz-switch formControlName="enableMapPreview"></nz-switch>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>Compact Table Mode</nz-form-label>
                <nz-form-control>
                  <nz-switch formControlName="compactTableMode"></nz-switch>
                </nz-form-control>
              </nz-form-item>
            </div>
            <div nz-col [nzSpan]="8">
              <nz-form-item>
                <nz-form-label>Theme</nz-form-label>
                <nz-form-control>
                  <nz-select formControlName="theme" style="width: 100%;">
                    <nz-option nzValue="light" nzLabel="Light"></nz-option>
                    <nz-option nzValue="dark" nzLabel="Dark"></nz-option>
                    <nz-option nzValue="system" nzLabel="System"></nz-option>
                  </nz-select>
                </nz-form-control>
              </nz-form-item>
            </div>
          </div>
        </nz-card>

        <!-- Actions -->
        <div class="actions-row">
          <button nz-button nzType="default" nzGhost (click)="resetDefaults()">Reset to Defaults</button>
          <button nz-button nzType="primary" (click)="saveConfig()">Save Configuration</button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .settings-container { 
      max-width: 800px; 
      margin: 0 auto; 
    }
    .subtitle {
      color: #666;
      margin-bottom: 24px;
    }
    .section-card {
      margin-bottom: 24px;
    }
    .section-card ::ng-deep .ant-card-head-title {
      font-weight: 600;
      font-size: 15px;
    }
    .field-hint {
      font-size: 12px;
      color: #999;
      margin-top: 4px;
      margin-bottom: 0;
    }
    .switch-label {
      margin-left: 8px;
      color: #666;
    }
    nz-form-item {
      margin-bottom: 16px;
    }
    .actions-row {
      display: flex;
      justify-content: center;
      gap: 16px;
      margin-top: 24px;
      padding-bottom: 24px;
    }
  `]
})
export class SettingsComponent implements OnInit {
  form: FormGroup;

  private defaultValues: ExtendedConfig = {
    avgSpeedKmh: 35,
    maxRadiusKm: 25,
    heartbeatMaxAgeMin: 10,
    requireSkillMatch: false,
    defaultSiteId: 'SITE-001',
    defaultServiceTimeMin: 45,
    planningAvgSpeedKmh: 35,
    autoAssignMode: 'nearest',
    fallbackRadiusKm: 50,
    enableMapPreview: true,
    compactTableMode: false,
    theme: 'light'
  };

  constructor(
    private fb: FormBuilder,
    private configService: ConfigService,
    private message: NzMessageService
  ) {
    this.form = this.fb.group({
      avgSpeedKmh: [35, [Validators.required, Validators.min(1), Validators.max(200)]],
      maxRadiusKm: [25, [Validators.required, Validators.min(1), Validators.max(500)]],
      heartbeatMaxAgeMin: [10, [Validators.required, Validators.min(1), Validators.max(60)]],
      requireSkillMatch: [false],
      defaultServiceTimeMin: [45, [Validators.required, Validators.min(5), Validators.max(480)]],
      planningAvgSpeedKmh: [35, [Validators.min(1), Validators.max(200)]],
      autoAssignMode: ['nearest'],
      fallbackRadiusKm: [50, [Validators.min(1), Validators.max(500)]],
      enableMapPreview: [true],
      compactTableMode: [false],
      theme: ['light']
    });
  }

  ngOnInit() {
    const current = this.configService.getConfig();
    this.form.patchValue({
      ...current,
      autoAssignMode: 'nearest',
      fallbackRadiusKm: 50,
      enableMapPreview: true,
      compactTableMode: false,
      theme: 'light'
    });
  }

  saveConfig() {
    if (this.form.valid) {
      const values = this.form.value;
      this.configService.updateConfig({
        avgSpeedKmh: values.avgSpeedKmh,
        maxRadiusKm: values.maxRadiusKm,
        heartbeatMaxAgeMin: values.heartbeatMaxAgeMin,
        requireSkillMatch: values.requireSkillMatch,
        defaultServiceTimeMin: values.defaultServiceTimeMin,
        planningAvgSpeedKmh: values.planningAvgSpeedKmh
      });
      this.message.success('Configuration saved successfully');
    } else {
      this.message.error('Please fix validation errors');
    }
  }

  resetDefaults() {
    this.form.patchValue(this.defaultValues);
    this.message.info('Settings reset to defaults');
  }
}
