import { test, expect } from '../../fixtures';

type OrganisationApiResponse = {
  name: string;
  contactInformation: Array<{
    addressLine1?: string;
  }>;
};

test(
  'displays authenticated organisation name and address details',
  { tag: ['@e2e', '@organisation'] },
  async ({ signedInPage, organisationPage }) => {
    const organisationResponse = await signedInPage.request.get('/api/organisation');
    expect(organisationResponse.ok()).toBeTruthy();
    const expectedOrganisation = await organisationResponse.json() as OrganisationApiResponse;
    expect(expectedOrganisation.contactInformation.length).toBeGreaterThan(0);
    const expectedContactInformation = expectedOrganisation.contactInformation[0];
    expect(expectedContactInformation.addressLine1).toBeTruthy();

    await organisationPage.open();

    await expect(organisationPage.heading).toBeVisible();
    await expect(organisationPage.root).toBeVisible();
    await expect(organisationPage.summaryValue(/^Name$/)).toContainText(expectedOrganisation.name);
    await expect(organisationPage.summaryValue(/^(Organisation address|Address)$/)).toContainText(
      expectedContactInformation.addressLine1 as string
    );
  }
);
