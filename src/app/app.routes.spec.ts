import { AppConstants } from './app.constants';
import { ROUTES } from './app.routes';

describe('App routes', () => {
  it('should redirect the empty path to home', () => {
    expect(ROUTES[0]).toEqual(jasmine.objectContaining({
      path: '',
      redirectTo: 'home',
      pathMatch: 'full'
    }));
  });

  it('should configure register-org feature toggle routing', () => {
    const registerOrgRoute = ROUTES.find((route) => route.path === 'register-org');

    expect(registerOrgRoute?.data).toEqual({
      title: 'Register Organisation',
      needsFeaturesEnabled: [AppConstants.FEATURE_NAMES.newRegisterOrg],
      expectFeatureEnabled: false,
      featureDisabledRedirect: '/register-org-new/register'
    });
  });

  it('should configure register-org-new feature toggle routing', () => {
    const registerOrgNewRoute = ROUTES.find((route) => route.path === 'register-org-new');

    expect(registerOrgNewRoute?.data).toEqual({
      title: 'Register Organisation',
      needsFeaturesEnabled: [AppConstants.FEATURE_NAMES.newRegisterOrg],
      expectFeatureEnabled: true,
      featureDisabledRedirect: '/register-org/register'
    });
  });

  it('should redirect unknown paths to home', () => {
    const wildcardRoute = ROUTES[ROUTES.length - 1];

    expect(wildcardRoute).toEqual(jasmine.objectContaining({
      path: '**',
      redirectTo: '/home',
      pathMatch: 'full'
    }));
  });
});
