import { addressUpdateCancellationStages, addressUpdateDx, updatedUkAddress } from '../mocks/addressUpdate.mock';
import type { RegisterOrganisationAddress } from '../mocks/registerOrganisation.mock';
import { AddressUpdatePage } from '../page-objects/address-update.po';

export const completeAddressUpdateToCheck = async (
  addressPage: AddressUpdatePage,
  address: RegisterOrganisationAddress,
  dx?: { dxNumber: string; dxExchange: string }
): Promise<void> => {
  await addressPage.openOrganisation();
  await addressPage.startUpdate();
  await addressPage.enterManualAddress(address);
  await (dx ? addressPage.dxYesRadio : addressPage.dxNoRadio).check();
  await addressPage.continueButton.click();
  if (dx) {
    await addressPage.dxNumberInput.fill(dx.dxNumber);
    await addressPage.dxExchangeInput.fill(dx.dxExchange);
    await addressPage.continueButton.click();
  }
};

export const openAddressUpdateStage = async (
  addressPage: AddressUpdatePage,
  stage: typeof addressUpdateCancellationStages[number]['stage']
): Promise<void> => {
  if (stage === 'check') {
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);
    return;
  }
  await addressPage.openOrganisation();
  await addressPage.startUpdate();
  if (stage === 'address') {
    return;
  }
  await addressPage.enterManualAddress(updatedUkAddress);
  if (stage === 'DX details') {
    await addressPage.dxYesRadio.check();
    await addressPage.continueButton.click();
  }
};
