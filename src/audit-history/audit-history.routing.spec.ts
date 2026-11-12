import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { AuditHistoryComponent } from './components/audit-history/audit-history.component';
import { auditHistoryRouting, ROUTES } from './audit-history.routing';

describe('Audit history routing', () => {
  it('should expose the audit history page at the module root', () => {
    expect(ROUTES.length).toBe(1);
    expect(ROUTES[0].path).toBe('');
    expect(ROUTES[0].component).toBe(AuditHistoryComponent);
  });

  it('should restrict audit history to organisation managers', () => {
    expect(ROUTES[0].canActivate).toEqual([UserRoleGuard]);
    expect(ROUTES[0].data?.role).toBe('pui-organisation-manager');
  });

  it('should export a child router module definition', () => {
    expect(auditHistoryRouting).toBeTruthy();
  });
});
