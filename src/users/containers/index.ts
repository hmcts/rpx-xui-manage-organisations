import { EditUserPermissionsFailureComponent } from './edit-user-permissions-failure/edit-user-permissions-failure.component';
import { EditUserPermissionComponent } from './edit-user-permissions/edit-user-permission.component';
import { InviteUserSuccessComponent } from './invite-user-success/invite-user-success.component';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { ManageUserComponent } from './manage-user/manage-user.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { UsersComponent } from './users/users.component';
import { UserUpdatedSuccessComponent } from './user-updated-success/user-updated-success.component';
import { ManageUserFailureComponent } from './manage-user-failure/manage-user-failure.component';

export const containers: any[] = [
  UsersComponent,
  InviteUserComponent,
  InviteUserSuccessComponent,
  UserDetailsComponent,
  EditUserPermissionComponent,
  EditUserPermissionsFailureComponent,
  UserUpdatedSuccessComponent,
  ManageUserComponent,
  ManageUserFailureComponent
];

export * from './users/users.component';
export * from './invite-user/invite-user.component';
export * from './invite-user-success/invite-user-success.component';
export * from './user-details/user-details.component';
export * from './edit-user-permissions/edit-user-permission.component';
export * from './edit-user-permissions-failure/edit-user-permissions-failure.component';
export * from './manage-user/manage-user.component';
export * from './user-updated-success/user-updated-success.component';
export * from './manage-user-failure/manage-user-failure.component';
