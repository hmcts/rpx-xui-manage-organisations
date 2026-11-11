import { expect, test } from '../../fixtures';
import { setupAddressUpdateRoutes } from '../../helpers/addressUpdateMockRoutes.helper';
import { addressUpdateCancellationStages, addressUpdateDx, addressUpdateNonManager, addressUpdatePaths, partialAddressUpdateDxCases, updatedUkAddress } from '../../mocks/addressUpdate.mock';
import { openAddressUpdateStage } from '../../helpers/addressUpdateJourney.helper';
import { manageOrgIntegrationOrganisation } from '../../mocks/manageOrgIntegration.mock';
import { AddressUpdatePage } from '../../page-objects/address-update.po';
import { OrganisationPage } from '../../page-objects/organisation.po';
import { UserAdminPage } from '../../page-objects/user-admin.po';

test.describe('Organisation address update negative paths', { tag: ['@integration', '@integration-organisation'] }, () => {
  for (const dxCase of partialAddressUpdateDxCases) {
    test(`requires the missing DX partner for ${dxCase.name} before submission`, async ({ manageOrgIntegrationPage: page }) => {
      const routeState = await setupAddressUpdateRoutes(page);
      const addressPage = new AddressUpdatePage(page);
      await addressPage.openOrganisation();
      await addressPage.startUpdate();
      await addressPage.enterManualAddress(updatedUkAddress);
      await addressPage.dxYesRadio.check();
      await addressPage.continueButton.click();
      await addressPage.dxNumberInput.fill(dxCase.dxNumber);
      await addressPage.dxExchangeInput.fill(dxCase.dxExchange);
      await addressPage.continueButton.click();

      await expect(page).toHaveURL(/\/organisation\/update-address\/document-exchange-reference-details$/);
      await expect(addressPage.validationError(dxCase.message)).toBeVisible();
      await expect(addressPage.checkHeading).toHaveCount(0);
      expect(routeState.updateRequests).toHaveLength(0);
    });
  }

  for (const path of addressUpdatePaths.slice(1)) {
    test(`redirects a cold manager entry from ${path} to address entry`, async ({ manageOrgIntegrationPage: page }) => {
      await setupAddressUpdateRoutes(page);
      const addressPage = new AddressUpdatePage(page);
      await page.goto(path);

      await expect(page).toHaveURL(/\/organisation\/update-address$/);
      await expect(addressPage.addressHeading).toBeVisible();
      await expect(addressPage.submitButton).toHaveCount(0);
      await expect(addressPage.successBanner).toHaveCount(0);
    });
  }

  for (const { stage, path } of addressUpdateCancellationStages) {
    test(`cancels at ${stage} without changing the organisation and starts a fresh draft`, async ({ manageOrgIntegrationPage: page }) => {
      await setupAddressUpdateRoutes(page);
      const addressPage = new AddressUpdatePage(page);
      const organisationPage = new OrganisationPage(page);
      await openAddressUpdateStage(addressPage, stage);
      await expect(page).toHaveURL(new RegExp(`${path}$`));
      await addressPage.cancelButton.click();

      await expect(page).toHaveURL(/\/organisation$/);
      await expect(organisationPage.heading).toBeVisible();
      await expect(organisationPage.summaryValue('Organisation address')).toContainText(manageOrgIntegrationOrganisation.contactInformation[0].addressLine1);
      await expect(organisationPage.summaryValue('Organisation address')).not.toContainText(updatedUkAddress.addressLine1);
      await expect(addressPage.successBanner).toHaveCount(0);
      await addressPage.startUpdate();
      await expect(addressPage.addressHeading).toBeVisible();
      await expect(addressPage.manualAddressLink).toBeVisible();
      await addressPage.manualAddressLink.click();
      await addressPage.ukAddressYesRadio.check();
      await expect(addressPage.addressLine1Input).toHaveValue('');
    });
  }

  test('rejects whitespace-only required UK address fields before advancing to DX', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    await addressPage.openOrganisation();
    await addressPage.startUpdate();
    await addressPage.manualAddressLink.click();
    await addressPage.ukAddressYesRadio.check();
    await addressPage.addressLine1Input.fill('   ');
    await addressPage.postTownInput.fill('   ');
    await addressPage.postCodeInput.fill(updatedUkAddress.postCode);
    await addressPage.continueButton.click();

    await expect(addressPage.validationError('Enter building and street')).toBeVisible();
    await expect(addressPage.validationError('Enter town or city')).toBeVisible();
    await expect(page).toHaveURL(/\/organisation\/update-address$/);
    await expect(addressPage.dxQuestionHeading).toHaveCount(0);
  });

  test('validates manual address and DX length errors before showing check answers', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    await addressPage.openOrganisation();
    await addressPage.startUpdate();
    await addressPage.manualAddressLink.click();
    await addressPage.continueButton.click();
    await expect(addressPage.validationError('Select an option')).toBeVisible();
    await addressPage.ukAddressYesRadio.check();
    await addressPage.continueButton.click();
    await expect(addressPage.validationError('Enter building and street')).toBeVisible();
    await expect(addressPage.validationError('Enter town or city')).toBeVisible();
    await expect(addressPage.validationError('Enter a valid postcode')).toBeVisible();
    await addressPage.addressLine1Input.fill(updatedUkAddress.addressLine1);
    await addressPage.postTownInput.fill(updatedUkAddress.postTown);
    await addressPage.postCodeInput.fill('BAD');
    await addressPage.continueButton.click();
    await expect(addressPage.validationError('Enter valid postcode')).toBeVisible();
    await expect(addressPage.dxQuestionHeading).toHaveCount(0);
    await addressPage.postCodeInput.fill(updatedUkAddress.postCode);
    await addressPage.continueButton.click();
    await addressPage.dxYesRadio.check();
    await addressPage.continueButton.click();
    await addressPage.dxNumberInput.fill('D'.repeat(14));
    await addressPage.dxExchangeInput.fill('E'.repeat(41));
    await addressPage.continueButton.click();
    await expect(addressPage.validationError('Enter valid DX number')).toBeVisible();
    await expect(addressPage.validationError('Enter valid DX exchange')).toBeVisible();
    await expect(addressPage.checkHeading).toHaveCount(0);
    await addressPage.dxNumberInput.fill(addressUpdateDx.dxNumber);
    await addressPage.dxExchangeInput.fill(addressUpdateDx.dxExchange);
    await addressPage.continueButton.click();
    await expect(addressPage.checkHeading).toBeVisible();
    await expect(addressPage.summaryValue('DX reference')).toHaveText(addressUpdateDx.dxNumber);
  });

  test('hides address changes and rejects every direct update route for a non-manager', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page, { userDetails: addressUpdateNonManager });
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await addressPage.openOrganisation();

    await expect(organisationPage.heading).toBeVisible();
    await expect(addressPage.changeAddressLink).toHaveCount(0);
    const userAdminPage = new UserAdminPage(page);
    for (const path of addressUpdatePaths) {
      await page.goto(path);
      await expect(page).toHaveURL(/\/users$/);
      await expect(userAdminPage.heading).toBeVisible();
      await expect(userAdminPage.userList).toBeVisible();
      await expect(addressPage.addressHeading).toHaveCount(0);
      await expect(addressPage.dxQuestionHeading).toHaveCount(0);
      await expect(addressPage.dxDetailsHeading).toHaveCount(0);
      await expect(addressPage.checkHeading).toHaveCount(0);
      await expect(addressPage.submitButton).toHaveCount(0);
    }
  });
});
