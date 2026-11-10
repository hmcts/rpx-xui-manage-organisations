import { ModuleWithProviders } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuditHistoryComponent } from './components/audit-history/audit-history.component';
import { AuditHistoryModule } from './audit-history.module';
import { UserRoleGuard } from '../shared/guards/user-role.guard';

export const ROUTES: Routes = [
  {
    path: '',
    component: AuditHistoryComponent,
    data: { role: 'pui-organisation-manager' },
    canActivate: [
      UserRoleGuard
    ]
  }
];

export const auditHistoryRouting: ModuleWithProviders<AuditHistoryModule> = RouterModule.forChild(ROUTES);
