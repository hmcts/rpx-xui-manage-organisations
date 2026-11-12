import { AddressModel } from '@hmcts/rpx-xui-common-lib';

// May require editing when API available
export interface AuditHistoryItem {
  user: string;
  name: string;
  address: AddressModel;
  sraId: string;
  createdUpdated: Date;
}
