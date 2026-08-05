import { expect, test } from '../../fixtures';
import { setupOrganisationDetailsRoutes } from '../../helpers';
import {
  manageOrgIntegrationOrganisation,
  manageOrgIntegrationOrganisationName
} from '../../mocks/manageOrgIntegration.mock';
import { OrganisationPage } from '../../page-objects/organisation.po';

test.describe('Organisation details', { tag: ['@integration', '@integration-organisation'] }, () => {
  test('renders mocked organisation identity, address, payment, regulator and administrator details', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupOrganisationDetailsRoutes(page);
    const organisationPage = new OrganisationPage(page);
    const contactInformation = manageOrgIntegrationOrganisation.contactInformation[0];
    const dxAddress = contactInformation.dxAddress[0];
    const paymentAccount = manageOrgIntegrationOrganisation.paymentAccount[0];
    const pendingPaymentAccount = manageOrgIntegrationOrganisation.pendingPaymentAccount[0];
    const regulator = JSON.parse(manageOrgIntegrationOrganisation.orgAttributes[0].value) as {
      organisationRegistrationNumber: string;
      regulatorType: string;
    };

    await organisationPage.open();

    await expect(page).toHaveURL(/\/organisation$/);
    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.summaryValue('Name')).toContainText(manageOrgIntegrationOrganisationName);

    const addressSummary = organisationPage.summaryValue('Organisation address');
    for (const addressLine of [
      contactInformation.addressLine1,
      contactInformation.addressLine2,
      contactInformation.townCity,
      contactInformation.county,
      contactInformation.postCode
    ]) {
      await expect(addressSummary).toContainText(addressLine);
    }

    await expect(organisationPage.summaryValue('DX reference')).toContainText(dxAddress.dxNumber);
    await expect(organisationPage.summaryValue('DX reference')).toContainText(dxAddress.dxExchange);
    await expect(organisationPage.summaryValue('Organisation type')).toContainText('Solicitor');
    await expect(organisationPage.summaryValue('PBA numbers')).toContainText(paymentAccount);
    await expect(organisationPage.summaryValue('PBA numbers')).toContainText(
      `${pendingPaymentAccount} (Pending approval)`
    );
    await expect(organisationPage.summaryAction('PBA numbers')).toHaveAttribute(
      'href',
      '/organisation/update-pba-numbers'
    );
    await expect(organisationPage.summaryValue('Regulatory organisation type')).toContainText(regulator.regulatorType);
    await expect(organisationPage.summaryValue('Regulatory organisation type')).toContainText(
      regulator.organisationRegistrationNumber
    );
    await expect(page.getByRole('heading', { name: 'Administrator details' })).toBeVisible();
    await expect(organisationPage.summaryValue('First name(s)')).toContainText(
      manageOrgIntegrationOrganisation.superUser.firstName
    );
    await expect(organisationPage.summaryValue('Last name')).toContainText(
      manageOrgIntegrationOrganisation.superUser.lastName
    );
    await expect(organisationPage.summaryValue('Email address')).toContainText(
      manageOrgIntegrationOrganisation.superUser.email
    );

    expect(routeState.lovRequests).toContainEqual({
      categoryId: 'OrgType',
      isChildRequired: 'Y',
      method: 'GET',
      serviceId: null
    });
  });
});
