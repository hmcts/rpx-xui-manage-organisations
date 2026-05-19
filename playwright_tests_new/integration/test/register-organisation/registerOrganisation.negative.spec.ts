import { expect, test } from '../../fixtures';
import {
  completeMinimumSolicitorJourney,
  setupRegisterOrganisationRoutes
} from '../../helpers';
import {
  minimumSolicitorRegistration,
  registrationCannotBeCompletedResponse
} from '../../mocks/registerOrganisation.mock';
import { RegisterOrganisationPage } from '../../page-objects/register-organisation.po';

test.describe('Register organisation negative paths', { tag: ['@integration', '@integration-register-organisation'] }, () => {
  test('keeps the user on Check Your Answers when registration API rejects submission', async ({
    manageOrgIntegrationPage: page
  }) => {
    const routeState = await setupRegisterOrganisationRoutes(page, {
      registrationResponse: registrationCannotBeCompletedResponse,
      registrationStatus: 400
    });
    const registerOrganisationPage = new RegisterOrganisationPage(page);

    await completeMinimumSolicitorJourney(registerOrganisationPage);

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();

    await registerOrganisationPage.submitRegistration();

    await expect(registerOrganisationPage.checkYourAnswersHeading).toBeVisible();
    await expect(registerOrganisationPage.validationSummaryError('Registration cannot be completed')).toBeVisible();
    await expect(page).toHaveURL(/\/register-org-new\/check-your-answers$/);
    await expect.poll(() => routeState.registrationRequests.length).toBe(1);
    expect(routeState.registrationRequests[0]).toMatchObject({
      companyName: minimumSolicitorRegistration.companyName,
      contactDetails: minimumSolicitorRegistration.contactDetails,
      hasDxReference: false,
      hasPBA: false,
      organisationType: {
        key: 'SolicitorOrganisation'
      },
      pbaNumbers: [],
      services: minimumSolicitorRegistration.services
    });
    expect(routeState.registrationResponses).toEqual([registrationCannotBeCompletedResponse]);
  });
});
