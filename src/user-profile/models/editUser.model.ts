import { UserAccessType } from '@hmcts/rpx-xui-common-lib';

export class EditUserModel {
  constructor(
    public id: string,
    public email: string,
    public firstName: string,
    public lastName: string,
    public idamStatus: string,
    public rolesAdd: string[],
    public rolesDelete: string[],
    public accessTypes: UserAccessType[]
  ) {}
}
