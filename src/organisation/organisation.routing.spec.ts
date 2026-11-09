import { UserRoleGuard } from '../shared/guards/user-role.guard';
import { AddressUpdateStepGuard } from './guards/address-update-step.guard';
import { OrganisationDetailsUpdateGuard } from './guards/organisation-details-update.guard';
import { OrganisationUpdateCheckGuard } from './guards/organisation-update-check.guard';
import { ROUTES } from './organisation.routing';

describe('organisation update routes', () => {
  it('should restrict address updates to organisation managers', () => {
    const route = ROUTES.find(({ path }) => path === 'organisation/update-address');

    expect(route?.data?.role).toBe('pui-organisation-manager');
    expect(route?.canActivate).toContain(UserRoleGuard);
  });

  it('should guard every address step after the initial entry page', () => {
    const route = ROUTES.find(({ path }) => path === 'organisation/update-address');
    const laterSteps = route?.children?.filter(({ path }) => path !== '') ?? [];

    expect(laterSteps.length).toBe(3);
    laterSteps.forEach((step) => expect(step.canActivate).toContain(AddressUpdateStepGuard));
  });

  it('should restrict name updates to organisation managers and guard check answers', () => {
    const route = ROUTES.find(({ path }) => path === 'organisation/update-org-name');
    const checkRoute = route?.children?.find(({ path }) => path === 'check');

    expect(route?.data?.role).toBe('pui-organisation-manager');
    expect(route?.data?.updateType).toBe('name');
    expect(route?.canActivate).toContain(UserRoleGuard);
    expect(route?.canActivate).toContain(OrganisationDetailsUpdateGuard);
    expect(checkRoute?.canActivate).toContain(OrganisationUpdateCheckGuard);
  });

  it('should restrict SRA updates to organisation managers and guard check answers', () => {
    const route = ROUTES.find(({ path }) => path === 'organisation/update-sra');
    const checkRoute = route?.children?.find(({ path }) => path === 'check');

    expect(route?.data?.role).toBe('pui-organisation-manager');
    expect(route?.data?.updateType).toBe('sra');
    expect(route?.canActivate).toContain(UserRoleGuard);
    expect(route?.canActivate).toContain(OrganisationDetailsUpdateGuard);
    expect(checkRoute?.canActivate).toContain(OrganisationUpdateCheckGuard);
  });
});
