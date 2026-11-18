import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { UserModel } from 'src/user-profile/models/user.model';
import * as fromAuthStore from '../../user-profile/store/index';
import { UserRoleGuard } from './user-role.guard';

const mockUser = {
  id: 't',
  roles: []
} as UserModel;

describe('UserRoleGuard', () => {
  let guard: UserRoleGuard;
  let mockStore: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj<Store<fromAuthStore.AuthState>>('store', ['pipe', 'dispatch']);
    guard = new UserRoleGuard(mockStore);
  });

  it('should activate when the role matches', (done) => {
    mockUser.roles = ['pui-finance-manager'];
    mockStore.pipe.and.returnValue(of(mockUser));

    const data = {
      role: 'pui-finance-manager'
    } as Data;

    const dummyRoute = {
      data
    } as ActivatedRouteSnapshot;

    guard.canActivate(dummyRoute).subscribe((result) => {
      expect(result).toBeTrue();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
      done();
    });
  });

  it('should wait for the user before checking the role', (done) => {
    mockUser.roles = ['pui-organisation-manager'];
    mockStore.pipe.and.returnValue(of(null, mockUser));

    const dummyRoute = {
      data: { role: 'pui-organisation-manager' } as Data
    } as ActivatedRouteSnapshot;

    guard.canActivate(dummyRoute).subscribe((result) => {
      expect(result).toBeTrue();
      expect(mockStore.dispatch).not.toHaveBeenCalled();
      done();
    });
  });
});
