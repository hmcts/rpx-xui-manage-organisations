import { expect, test } from '../../fixtures';
import { setupAddressUpdateRoutes } from '../../helpers/addressUpdateMockRoutes.helper';
import { addressUpdateCancellationStages, addressUpdateDx, addressUpdateNonManager, addressUpdatePaths, addressUpdateServiceDownStatuses, addressUpdateSystemError, correctedUkAddress, expectedUkAddressOnlyUpdate, expectedUkAddressUpdate, partialAddressUpdateDxCases, updatedUkAddress } from '../../mocks/addressUpdate.mock';
import { completeAddressUpdateToCheck, openAddressUpdateStage } from '../../helpers/addressUpdateJourney.helper';
import { manageOrgIntegrationOrganisation } from '../../mocks/manageOrgIntegration.mock';
import { AddressUpdatePage } from '../../page-objects/address-update.po';
import { OrganisationPage } from '../../page-objects/organisation.po';
import { UserAdminPage } from '../../page-objects/user-admin.po';

test.describe('Organisation address update negative paths', { tag: ['@integration', '@integration-organisation'] }, () => {
  test('keeps the editable check page and shows the exact system error after an HTTP 500 submission', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page, { updateStatus: 500 });
    const addressPage = new AddressUpdatePage(page);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress);
    await expect(addressPage.checkHeading).toBeVisible();
    await addressPage.submitButton.click();

    await test.info().attach('address-update-requests', {
      body: JSON.stringify(routeState), contentType: 'application/json'
    });
    await expect(page).toHaveURL(/\/organisation\/update-address\/check$/);
    await expect(addressPage.validationError(addressUpdateSystemError)).toBeVisible();
    await expect(addressPage.submitButton).toBeEnabled();
    await expect(addressPage.summaryChangeLink('Organisation address')).toBeVisible();
    await expect(addressPage.summaryValue('Organisation address')).toContainText(updatedUkAddress.addressLine1);
    await expect(addressPage.successBanner).toHaveCount(0);
    await expect.poll(() => routeState.responseStatuses).toEqual([500]);
    expect(routeState.updateRequests).toHaveLength(1);
    expect(routeState.updateRequests[0]).toEqual({ method: 'PUT', body: expectedUkAddressOnlyUpdate });
    await addressPage.summaryChangeLink('Organisation address').click();
    await expect(addressPage.addressLine1Input).toHaveValue(updatedUkAddress.addressLine1);
    await addressPage.addressLine1Input.fill(correctedUkAddress.addressLine1);
    await addressPage.continueButton.click();
    await expect(addressPage.dxNoRadio).toBeChecked();
    await addressPage.continueButton.click();
    await expect(addressPage.checkHeading).toBeVisible();
    await expect(addressPage.summaryValue('Organisation address')).toContainText(correctedUkAddress.addressLine1);
    await expect(addressPage.validationError(addressUpdateSystemError)).toHaveCount(0);
    routeState.updateStatus = 204;
    await addressPage.submitButton.click();

    await expect.poll(() => routeState.responseStatuses).toEqual([500, 204]);
    expect(routeState.updateRequests).toEqual([
      { method: 'PUT', body: expectedUkAddressOnlyUpdate },
      { method: 'PUT', body: { ...expectedUkAddressOnlyUpdate, addressLine1: correctedUkAddress.addressLine1 } }
    ]);
    await expect(page).toHaveURL(/\/organisation$/);
    await expect(addressPage.successBanner).toBeVisible();
  });

  test('keeps the original organisation address after a rejected submission is cancelled', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page, { updateStatus: 500 });
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);
    await addressPage.submitButton.click();
    await expect(addressPage.validationError(addressUpdateSystemError)).toBeVisible();
    await addressPage.cancelButton.click();

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.summaryValue('Organisation address')).toContainText(manageOrgIntegrationOrganisation.contactInformation[0].addressLine1);
    await expect(organisationPage.summaryValue('Organisation address')).not.toContainText(updatedUkAddress.addressLine1);
    await expect(organisationPage.summaryValue('Organisation address')).not.toContainText('(Pending approval)');
    await expect(addressPage.successBanner).toHaveCount(0);
    await expect.poll(() => routeState.responseStatuses).toEqual([500]);
    expect(routeState.updateRequests).toEqual([{ method: 'PUT', body: expectedUkAddressUpdate }]);
  });

  for (const status of addressUpdateServiceDownStatuses) {
    test(`uses the existing service-down flow after HTTP ${status} without pending success`, async ({ manageOrgIntegrationPage: page }) => {
      const routeState = await setupAddressUpdateRoutes(page, { updateStatus: status });
      const addressPage = new AddressUpdatePage(page);
      await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);
      await addressPage.submitButton.click();

      await expect(page).toHaveURL(/\/service-down$/);
      await expect(page.getByRole('heading', { name: 'Sorry, there is a problem with the service', exact: true })).toBeVisible();
      await expect(addressPage.successBanner).toHaveCount(0);
      await expect.poll(() => routeState.responseStatuses).toEqual([status]);
      expect(routeState.updateRequests).toEqual([{ method: 'PUT', body: expectedUkAddressUpdate }]);
    });
  }

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
