import { Routes } from '@angular/router';
import { MainLayoutComponent } from './core/layout/main-layout.component';

export const routes: Routes = [
    {
        path: '',
        component: MainLayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
            {
                path: 'dashboard',
                loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent)
            },
            {
                path: 'orders',
                loadComponent: () => import('./features/orders/orders.component').then(m => m.OrdersComponent)
            },
            {
                path: 'create',
                loadComponent: () => import('./features/create-order/create-order.component').then(m => m.CreateOrderComponent)
            },
            {
                path: 'crm',
                loadComponent: () => import('./features/crm/crm.component').then(m => m.CrmComponent)
            },
            {
                path: 'inventory',
                loadComponent: () => import('./features/inventory/inventory-dashboard.component').then(m => m.InventoryDashboardComponent)
            },
            {
                path: 'inventory/items',
                loadComponent: () => import('./features/inventory/items-catalog.component').then(m => m.ItemsCatalogComponent)
            },
            {
                path: 'inventory/locations',
                loadComponent: () => import('./features/inventory/inventory-locations.component').then(m => m.InventoryLocationsComponent)
            },
            {
                path: 'inventory/transfers',
                loadComponent: () => import('./features/inventory/transfers.component').then(m => m.TransfersComponent)
            },
            {
                path: 'planning',
                loadComponent: () => import('./features/planning/planning.component').then(m => m.PlanningComponent)
            },
            {
                path: 'roster',
                loadComponent: () => import('./features/roster/roster.component').then(m => m.RosterComponent)
            },
            {
                path: 'map',
                loadComponent: () => import('./features/map/map.component').then(m => m.MapComponent)
            },
            {
                path: 'reviews',
                loadComponent: () => import('./features/reviews/reviews.component').then(m => m.ReviewsComponent)
            },
            {
                path: 'reports',
                loadComponent: () => import('./features/reports/reports.component').then(m => m.ReportsComponent)
            },
            {
                path: 'accounting/invoices',
                loadComponent: () => import('./features/accounting/accounting-invoices.component').then(m => m.AccountingInvoicesComponent)
            },
            {
                path: 'accounting/transactions',
                loadComponent: () => import('./features/accounting/accounting-transactions.component').then(m => m.AccountingTransactionsComponent)
            },
            {
                path: 'accounting/reports',
                loadComponent: () => import('./features/accounting/accounting-reports.component').then(m => m.AccountingReportsComponent)
            },
            {
                path: 'accounting/settings',
                loadComponent: () => import('./features/accounting/accounting-settings.component').then(m => m.AccountingSettingsComponent)
            },
            {
                path: 'settings',
                loadComponent: () => import('./features/settings/settings.component').then(m => m.SettingsComponent)
            }
        ]
    }
];
