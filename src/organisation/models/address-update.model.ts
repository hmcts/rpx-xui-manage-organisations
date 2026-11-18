import { AddressModel } from '@hmcts/rpx-xui-common-lib';

export interface AddressUpdateDraft {
  address: AddressModel;
  hasDxReference: boolean | null;
  dxNumber: string | null;
  dxExchange: string | null;
  inInternationalMode: boolean;
  showExistingAddress: boolean;
}
