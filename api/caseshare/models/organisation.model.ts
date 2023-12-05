import { UserDetails } from '@hmcts/rpx-xui-common-lib/lib/models/user-details.model';

export interface OrganisationModel {
  orgId: string
  orgName: string
  orgStatus: string
  orgProfileIds: string[]
  users: UserDetails[]
}
