import { ROUTES, usersRouting } from './users.routing';
import {
  EditUserPermissionComponent,
  EditUserPermissionsFailureComponent,
  ManageUserComponent,
  UserDetailsComponent,
  UsersComponent,
  UserUpdatedSuccessComponent
} from './containers';
import { InviteUserComponent } from './containers/invite-user/invite-user.component';
import { InviteUserSuccessComponent } from './containers/invite-user-success/invite-user-success.component';
import { ManageUserFailureComponent } from './containers/manage-user-failure/manage-user-failure.component';

describe('Users routing', () => {
  it('should expose the users child routing module', () => {
    expect(usersRouting).toBeTruthy();
  });

  it('should configure users feature routes', () => {
    expect(ROUTES.map((route) => route.path)).toEqual([
      '',
      'user/:userId',
      'invite-user',
      'invite-user-success',
      'updated-user-success',
      'user/:userId/editpermission-failure',
      'user/:userId/manage-user-failure',
      'user/:userId/editpermission',
      'user/:userId/manage',
      'manage'
    ]);
    expect(ROUTES[0].component).toBe(UsersComponent);
    expect(ROUTES[1].component).toBe(UserDetailsComponent);
    expect(ROUTES[2].component).toBe(InviteUserComponent);
    expect(ROUTES[3].component).toBe(InviteUserSuccessComponent);
    expect(ROUTES[4].component).toBe(UserUpdatedSuccessComponent);
    expect(ROUTES[5].component).toBe(EditUserPermissionsFailureComponent);
    expect(ROUTES[6].component).toBe(ManageUserFailureComponent);
    expect(ROUTES[7].component).toBe(EditUserPermissionComponent);
    expect(ROUTES[8].component).toBe(ManageUserComponent);
    expect(ROUTES[9].component).toBe(ManageUserComponent);
  });
});
