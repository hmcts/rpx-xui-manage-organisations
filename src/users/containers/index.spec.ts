import { containers } from './index';
import { EditUserPermissionComponent } from './edit-user-permissions/edit-user-permission.component';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { UsersComponent } from './users/users.component';

describe('Users containers index', () => {
  it('should export the expected container collection', () => {
    expect(containers).toContain(UsersComponent);
    expect(containers).toContain(InviteUserComponent);
    expect(containers).toContain(EditUserPermissionComponent);
  });
});
