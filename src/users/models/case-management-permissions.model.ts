import { UserAccessType } from '@hmcts/rpx-xui-common-lib';

export interface CaseManagementPermissions {
  manageCases: boolean;
  userAccessTypes: UserAccessType[];
}
