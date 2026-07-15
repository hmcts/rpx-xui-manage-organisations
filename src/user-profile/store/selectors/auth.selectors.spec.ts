import { AppUtils } from 'src/app/utils/app-utils';
import { UserModel } from '../../models/user.model';
import * as fromAuth from '../reducers/user-profile.reducer';
import * as fromSelectors from './auth.selectors';

describe('Auth Selectors', () => {
  const user = new UserModel({
    email: 'test@example.com',
    orgId: 'org-1',
    roles: ['pui-caa', 'pui-finance-manager'],
    sessionTimeout: {
      idleModalDisplayTime: 10,
      totalIdleTime: 50
    },
    userId: 'user-1'
  });

  const authState: fromAuth.AuthState = {
    ...fromAuth.initialState,
    isAuthenticated: true,
    loaded: true,
    user,
    tAndC: { hasUserAccepted: 'true', loaded: true }
  };

  it('should return auth state values', () => {
    expect(fromSelectors.authState.projector(authState)).toEqual(authState);
    expect(fromSelectors.getIsAuthenticated.projector(authState)).toBeTrue();
    expect(fromSelectors.getUser.projector(authState)).toEqual(user);
    expect(fromSelectors.userLoaded.projector(authState)).toBeTrue();
    expect(fromSelectors.getHasUserSelectedTC.projector(authState)).toEqual({ hasUserAccepted: 'true', loaded: true });
  });

  it('should derive role-based user flags', () => {
    expect(fromSelectors.getIsUserCaaAdmin.projector(user)).toBeTrue();
    expect(fromSelectors.getIsUserPuiFinanceManager.projector(user)).toBeTrue();
    expect(fromSelectors.getIsUserPuiFinanceManager.projector(null)).toBeFalse();
  });

  it('should return the user id when a user is present', () => {
    expect(fromSelectors.getUid.projector(user)).toEqual('user-1');
    expect(fromSelectors.getUid.projector(null)).toBeUndefined();
  });

  it('should derive header visibility from router state and authentication state', () => {
    const router = { state: { url: '/organisation' } } as any;
    spyOn(AppUtils, 'showSubHeaderItems').and.returnValue(true);

    expect(fromSelectors.getShowHeaderItems.projector(router, true)).toBeTrue();
    expect(AppUtils.showSubHeaderItems).toHaveBeenCalledWith(true, router);
  });
});
