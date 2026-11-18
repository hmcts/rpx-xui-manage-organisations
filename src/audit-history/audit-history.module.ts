import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AuditHistoryComponent } from './components/audit-history/audit-history.component';
import { auditHistoryRouting } from './audit-history.routing';

@NgModule({
  declarations: [AuditHistoryComponent],
  imports: [
    CommonModule,
    auditHistoryRouting
  ]
})
export class AuditHistoryModule {}
