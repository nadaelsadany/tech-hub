import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';
import { NzLayoutModule } from 'ng-zorro-antd/layout';
import { NzMenuModule } from 'ng-zorro-antd/menu';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzAvatarModule } from 'ng-zorro-antd/avatar';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    NzLayoutModule,
    NzMenuModule,
    NzIconModule,
    NzAvatarModule,
    NzDropDownModule
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-sider nzCollapsible nzBreakpoint="lg" [nzCollapsedWidth]="0">
        <div class="logo">
          <h2>TechHub</h2>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="inline">
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/dashboard">
              <span nz-icon nzType="dashboard"></span>
              <span>Dashboard</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/orders">
              <span nz-icon nzType="unordered-list"></span>
              <span>Orders</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/crm">
              <span nz-icon nzType="contacts"></span>
              <span>CRM</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/inventory">
              <span nz-icon nzType="appstore"></span>
              <span>Inventory</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/planning">
              <span nz-icon nzType="calendar"></span>
              <span>Planning</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/create">
              <span nz-icon nzType="plus-circle"></span>
              <span>Create Order</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/roster">
              <span nz-icon nzType="team"></span>
              <span>Roster</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/map">
              <span nz-icon nzType="global"></span>
              <span>Map</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/reviews">
              <span nz-icon nzType="check-circle"></span>
              <span>Reviews</span>
            </a>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/reports">
              <span nz-icon nzType="bar-chart"></span>
              <span>Reports</span>
            </a>
          </li>
          <li nz-submenu nzTitle="Accounting" nzIcon="dollar">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounting/invoices">
                  <span nz-icon nzType="file-text"></span>
                  <span>Invoices</span>
                </a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounting/transactions">
                  <span nz-icon nzType="transaction"></span>
                  <span>Transactions</span>
                </a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounting/reports">
                  <span nz-icon nzType="fund"></span>
                  <span>Reports</span>
                </a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/accounting/settings">
                  <span nz-icon nzType="setting"></span>
                  <span>Settings</span>
                </a>
              </li>
            </ul>
          </li>
          <li nz-menu-item nzMatchRouter>
            <a routerLink="/settings">
              <span nz-icon nzType="setting"></span>
              <span>Settings</span>
            </a>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="header-content">
            <span class="trigger" nz-icon nzType="menu-fold"></span>
            <h1>Technicians Hub – Dispatcher</h1>
            <div class="user-profile">
               <nz-avatar nzIcon="user" nzSrc=""></nz-avatar>
               <span class="username">Admin</span>
            </div>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [`
    .app-layout { height: 100vh; }
    .logo { height: 32px; background: rgba(255, 255, 255, 0.2); margin: 16px; display: flex; align-items: center; justify-content: center; color: white; }
    .logo h2 { color: white; margin: 0; font-size: 16px; }
    
    /* Fixed sidebar */
    nz-sider {
      position: fixed !important;
      left: 0;
      top: 0;
      bottom: 0;
      height: 100vh;
      overflow-y: auto;
      z-index: 100;
    }
    
    /* Adjust main layout to account for fixed sidebar */
    nz-layout nz-layout {
      margin-left: 200px;
      transition: margin-left 0.2s;
    }
    
    :host ::ng-deep .ant-layout-sider-collapsed + nz-layout {
      margin-left: 0;
    }
    
    nz-header { 
      background: #fff; 
      padding: 0;
      position: sticky;
      top: 0;
      z-index: 50;
    }
    .header-content { display: flex; justify-content: space-between; align-items: center; padding: 0 24px; height: 100%; }
    
    nz-content {
      overflow-y: auto;
      height: calc(100vh - 64px);
    }
    
    .inner-content { padding: 24px; min-height: 280px; }
    .user-profile { display: flex; align-items: center; gap: 8px; }
  `]
})
export class MainLayoutComponent { }
