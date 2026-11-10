import { AuditHistoryComponent } from './components/audit-history/audit-history.component';
import { auditHistoryRouting, ROUTES } from './audit-history.routing';

describe('Audit history routing', () => {
  it('should expose the audit history page at the module root', () => {
    expect(ROUTES).toEqual([{
      path: '',
      component: AuditHistoryComponent
    }]);
  });

  it('should export a child router module definition', () => {
    expect(auditHistoryRouting).toBeTruthy();
  });
});
