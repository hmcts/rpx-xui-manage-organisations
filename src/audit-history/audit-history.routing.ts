import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditHistoryComponent } from './components/audit-history/audit-history.component';
import { AuditHistoryModule } from './audit-history.module';

export const ROUTES: Routes = [
  {
    path: '',
    component: AuditHistoryComponent
  }
];

export const auditHistoryRouting: ModuleWithProviders<AuditHistoryModule> = RouterModule.forChild(ROUTES);
