import { UserAccessType } from '@hmcts/rpx-xui-common-lib';

export class EditUserModel {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public idamStatus: string,
    public rolesAdd: RoleChange[],
    public rolesDelete: RoleChange[],
    public userAccessTypes: UserAccessType[]
  ) {}
}

export interface RoleChange {
  name: string;
}
