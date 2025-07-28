import { UserAccessType } from '@hmcts/rpx-xui-common-lib';
export interface UserListApiModel {
    id?: number;
    firstName: string;
    lastName: string;
    email: string;
    permissions: string[];
    resendInvite: boolean;
    userAccessTypes?: Array<UserAccessType> ;
}
