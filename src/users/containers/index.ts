import { UsersComponent } from './users/users.component';
import { InviteUserComponent } from './invite-user/invite-user.component';
import { InviteUserSuccessComponent } from './invite-user-success/invite-user-success.component';
import { UserDetailsComponent } from './user-details/user-details.component';
import { EditUserPermissionComponent } from './edit-user-permissions/edit-user-permission.component';

export const containers: any[] = [UsersComponent, InviteUserComponent, InviteUserSuccessComponent, UserDetailsComponent,
    EditUserPermissionComponent];


export * from './users/users.component';
export * from './invite-user/invite-user.component';
export * from './invite-user-success/invite-user-success.component';
export * from './user-details/user-details.component';
export * from './edit-user-permissions/edit-user-permission.component';
