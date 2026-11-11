import { expect, test } from '../../fixtures';
import { completeAddressUpdateToCheck } from '../../helpers/addressUpdateJourney.helper';
import { holdAddressUpdateUserDetails, setupAddressUpdateRoutes } from '../../helpers/addressUpdateMockRoutes.helper';
import {
  addressUpdateDx,
  correctedUkAddress,
  exchangeOnlyAddressUpdateDx,
  historicalExchangeOnlyOrganisation,
  maximumAddressUpdateDx,
  pendingAddressOrganisation,
  updatedInternationalAddress,
  updatedUkAddress
} from '../../mocks/addressUpdate.mock';
import { fulfillJson, routeManageOrgFeatureFlags } from '../../helpers/manageOrgBaseRoutes.helper';
import { manageOrgIntegrationOrganisation, manageOrgIntegrationUserDetails } from '../../mocks/manageOrgIntegration.mock';
import { AddressUpdatePage } from '../../page-objects/address-update.po';
import { OrganisationPage } from '../../page-objects/organisation.po';

test.describe('Organisation address update UI and pending confirmation', { tag: ['@integration', '@integration-organisation'] }, () => {
  test('updates the legacy organisation address without repeating DX exchange or changing PBAs', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page);
    await routeManageOrgFeatureFlags(page, { 'mo-new-register-org': false });
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    const currentAddress = manageOrgIntegrationOrganisation.contactInformation[0];
    const currentPba = manageOrgIntegrationOrganisation.paymentAccount[0];
    await addressPage.openOrganisation();

    await expect(organisationPage.heading).toBeVisible();
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText(currentAddress.addressLine1);
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText(currentAddress.dxAddress[0].dxNumber);
    await expect(addressPage.legacyOrganisationRow('DX exchange')).toHaveCount(0);
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText(
      `DX:${currentAddress.dxAddress[0].dxNumber} ${currentAddress.dxAddress[0].dxExchange}`
    );
    await expect(addressPage.changeAddressLink).toBeVisible();
    await expect(addressPage.changeAddressLink).toHaveAttribute('href', '/organisation/update-address');
    await expect(addressPage.legacyOrganisationRow('PBA numbers')).toContainText(currentPba);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);
    await expect(addressPage.checkHeading).toBeVisible();
    await addressPage.submitButton.click();
    expect(routeState.responseStatuses).toHaveLength(0);
    expect(routeState.updateRequests).toHaveLength(0);

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(organisationPage.heading).toBeVisible();
    await expect(addressPage.successBanner).toBeVisible();
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText(updatedUkAddress.addressLine1);
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText('(Pending approval)');
    await expect(addressPage.legacyOrganisationRow('DX exchange')).toHaveCount(0);
    await expect(addressPage.legacyOrganisationRow('Address')).toContainText(
      `DX:${addressUpdateDx.dxNumber} ${addressUpdateDx.dxExchange}`
    );
    await expect(addressPage.legacyOrganisationRow('PBA numbers')).toContainText(currentPba);
  });

  test('allows a manager to enter the address form after a held cold-start user response', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    const { request } = await holdAddressUpdateUserDetails(page);
    const navigation = page.goto('/organisation/update-address');
    const userRequest = await request;
    await expect(addressPage.addressHeading).toHaveCount(0);
    await fulfillJson(userRequest, manageOrgIntegrationUserDetails);
    await navigation;

    await expect(page).toHaveURL(/\/organisation\/update-address$/);
    await expect(addressPage.addressHeading).toBeVisible();
    await expect(addressPage.manualAddressLink).toBeVisible();
  });

  test('edits a UK address with DX details and shows the submitted pending UI', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);

    await expect(addressPage.checkHeading).toBeVisible();
    for (const value of Object.values(updatedUkAddress)) {
      await expect(addressPage.summaryValue('Organisation address')).toContainText(value);
    }
    await expect(addressPage.summaryValue('Document exchange reference')).toHaveText('Yes');
    await expect(addressPage.summaryValue('DX reference')).toHaveText(addressUpdateDx.dxNumber);
    await expect(addressPage.summaryValue('DX exchange')).toHaveText(addressUpdateDx.dxExchange);
    await addressPage.summaryChangeLink('Organisation address').click();
    await expect(addressPage.addressLine1Input).toHaveValue(updatedUkAddress.addressLine1);
    await addressPage.addressLine1Input.fill(correctedUkAddress.addressLine1);
    await addressPage.continueButton.click();
    await expect(addressPage.dxYesRadio).toBeChecked();
    await addressPage.continueButton.click();
    await expect(addressPage.dxNumberInput).toHaveValue(addressUpdateDx.dxNumber);
    await addressPage.continueButton.click();
    await expect(addressPage.summaryValue('Organisation address')).toContainText(correctedUkAddress.addressLine1);
    await expect(addressPage.summaryValue('Organisation address')).not.toContainText(updatedUkAddress.addressLine1);

    await addressPage.backLink.click();
    await expect(addressPage.dxDetailsHeading).toBeVisible();
    await expect(addressPage.dxExchangeInput).toHaveValue(addressUpdateDx.dxExchange);
    await addressPage.continueButton.click();
    await addressPage.submitButton.click();
    expect(routeState.responseStatuses).toHaveLength(0);
    expect(routeState.updateRequests).toHaveLength(0);

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(organisationPage.heading).toBeVisible();
    await expect(addressPage.successBanner).toContainText('Organisation details submitted. We\'ll email you once they\'re approved.');
    await expect(organisationPage.summaryValue('Organisation address')).toContainText(correctedUkAddress.addressLine1);
    await expect(organisationPage.summaryValue('Organisation address')).toContainText('(Pending approval)');
    await expect(organisationPage.summaryValue('DX reference')).toContainText(addressUpdateDx.dxNumber);
    await expect(organisationPage.summaryValue('DX reference')).toContainText('(Pending approval)');
    await expect(organisationPage.summaryValue('PBA numbers')).toContainText(manageOrgIntegrationOrganisation.paymentAccount[0]);
  });

  test('submits an international address without DX and shows pending UI without stale DX', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await completeAddressUpdateToCheck(addressPage, updatedInternationalAddress);

    await expect(addressPage.checkHeading).toBeVisible();
    await expect(addressPage.summaryValue('Organisation address')).toContainText(updatedInternationalAddress.addressLine1);
    await expect(addressPage.summaryValue('Organisation address')).toContainText(updatedInternationalAddress.country);
    await expect(addressPage.summaryValue('Document exchange reference')).toHaveText('No');
    await expect(addressPage.summaryRow('DX reference')).toHaveCount(0);
    await expect(addressPage.summaryRow('DX exchange')).toHaveCount(0);
    await addressPage.backLink.click();
    await expect(addressPage.dxQuestionHeading).toBeVisible();
    await expect(addressPage.dxNoRadio).toBeChecked();
    await addressPage.continueButton.click();
    await addressPage.submitButton.click();
    expect(routeState.responseStatuses).toHaveLength(0);
    expect(routeState.updateRequests).toHaveLength(0);

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(addressPage.successBanner).toBeVisible();
    await expect(organisationPage.summaryValue('Organisation address')).toContainText(updatedInternationalAddress.addressLine1);
    await expect(organisationPage.summaryValue('Organisation address')).toContainText('(Pending approval)');
    await expect(organisationPage.summaryRow('DX reference')).toHaveCount(0);
  });

  test('accepts the inclusive 13-character DX number and 40-character exchange limits', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, maximumAddressUpdateDx);
    await expect(addressPage.checkHeading).toBeVisible();
    await expect(addressPage.summaryValue('DX reference')).toHaveText(maximumAddressUpdateDx.dxNumber);
    await expect(addressPage.summaryValue('DX exchange')).toHaveText(maximumAddressUpdateDx.dxExchange);
    await addressPage.submitButton.click();

    expect(routeState.responseStatuses).toHaveLength(0);
    expect(routeState.updateRequests).toHaveLength(0);
    await expect(page).toHaveURL(/\/organisation$/);
    await expect(addressPage.successBanner).toBeVisible();
  });

  test('renders a historical exchange-only DX reference without a leading comma', async ({ manageOrgIntegrationPage: page }) => {
    const routeState = await setupAddressUpdateRoutes(page, { organisation: historicalExchangeOnlyOrganisation });
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await addressPage.openOrganisation();

    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.summaryValue('DX reference')).toHaveText(
      `${exchangeOnlyAddressUpdateDx.dxExchange} (Pending approval)`
    );
    expect(routeState.updateRequests).toHaveLength(0);
  });

  test('clears stale DX details when the CYA answer changes to No', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page);
    const addressPage = new AddressUpdatePage(page);
    await completeAddressUpdateToCheck(addressPage, updatedUkAddress, addressUpdateDx);
    await expect(addressPage.summaryValue('DX reference')).toHaveText(addressUpdateDx.dxNumber);
    await addressPage.summaryChangeLink('Document exchange reference').click();
    await expect(addressPage.dxYesRadio).toBeChecked();
    await addressPage.dxNoRadio.check();
    await addressPage.continueButton.click();

    await expect(addressPage.checkHeading).toBeVisible();
    await expect(addressPage.summaryValue('Document exchange reference')).toHaveText('No');
    await expect(addressPage.summaryRow('DX reference')).toHaveCount(0);
    await expect(addressPage.summaryRow('DX exchange')).toHaveCount(0);
    await addressPage.summaryChangeLink('Document exchange reference').click();
    await addressPage.dxYesRadio.check();
    await addressPage.continueButton.click();
    await expect(addressPage.dxNumberInput).toHaveValue('');
    await expect(addressPage.dxExchangeInput).toHaveValue('');
  });

  test('renders an existing pending address without losing organisation details', async ({ manageOrgIntegrationPage: page }) => {
    await setupAddressUpdateRoutes(page, { organisation: pendingAddressOrganisation });
    const addressPage = new AddressUpdatePage(page);
    const organisationPage = new OrganisationPage(page);
    await addressPage.openOrganisation();

    await expect(organisationPage.heading).toBeVisible();
    await expect(addressPage.successBanner).toBeVisible();
    await expect(organisationPage.summaryValue('Organisation address')).toContainText(manageOrgIntegrationOrganisation.contactInformation[0].addressLine1);
    await expect(organisationPage.summaryValue('Organisation address')).toContainText('(Pending approval)');
    await expect(organisationPage.summaryValue('DX reference')).toContainText('(Pending approval)');
  });
});
