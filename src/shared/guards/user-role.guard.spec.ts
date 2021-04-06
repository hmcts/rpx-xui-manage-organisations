import { UserRoleGuard } from './user-role.guard';
import { Store } from '@ngrx/store';
import * as fromAuthStore from '../../user-profile/store/index';
import { UserModel } from 'src/user-profile/models/user.model';
import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { of } from 'rxjs';

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

  it('should activate when the role matches', () => {
    mockUser.roles = ['pui-finance-manager'];
    mockStore.pipe.and.returnValue(of(mockUser));

    const data = {
      role: 'pui-finance-manager'
    } as Data;

    const dummyRoute = {
      data
    } as ActivatedRouteSnapshot;
    
    const result = guard.canActivate(dummyRoute);
    expect(result).toBeTruthy();
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});
