import { test, expect } from '../../fixtures';

test.use({ manageOrgUserRole: 'roo' });

test.describe('Register organisation validation', () => {
  test(
    'validates required organisation and registered-address fields',
    { tag: ['@e2e', '@registration', '@validation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      await registerOrganisationPage.openWorkflowPage('organisation-type');
      await expect(signedInPage.getByRole('heading', {
        name: 'What type of organisation are you registering?'
      })).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select an organisation')).toBeVisible();

      await registerOrganisationPage.chooseSolicitorOrganisationType();
      await expect(signedInPage.getByRole('heading', {
        name: 'What is your organisation name and Companies House number?'
      })).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter an organisation name')).toBeVisible();

      await registerOrganisationPage.openWorkflowPage('registered-address/external');
      await expect(signedInPage.getByRole('heading', {
        name: 'What is the registered address of your organisation?'
      })).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter a valid postcode')).toBeVisible();
    }
  );

  test(
    'validates regulator, services, and payment-by-account fields',
    { tag: ['@e2e', '@registration', '@validation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      await registerOrganisationPage.openWorkflowPage('regulatory-organisation-type');
      await expect(signedInPage.getByText('Who is your organisation registered with?')).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError(
        'Please select a regulatory organisation'
      )).toBeVisible();

      await registerOrganisationPage.regulatorTypeSelect.selectOption({
        label: 'Solicitor Regulation Authority (SRA)'
      });
      await expect(registerOrganisationPage.organisationRegistrationNumberInput).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter a registration reference')).toBeVisible();

      await registerOrganisationPage.organisationRegistrationNumberInput.fill('12345678');
      await registerOrganisationPage.continueWith();
      await expect(signedInPage.getByText('Which services will your organisation need to access?')).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select at least one service')).toBeVisible();

      await registerOrganisationPage.chooseServices('Damages');
      await expect(signedInPage.getByText('Does your organisation have a payment by account number?')).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();

      await registerOrganisationPage.enterPaymentByAccountDetails();
      await expect(signedInPage.getByRole('heading', {
        name: 'What PBA numbers does your organisation use?'
      })).toBeVisible();

      await registerOrganisationPage.fillPaymentByAccountNumber('PBAABC1234');
      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter a valid PBA number')).toBeVisible();
    }
  );

  test(
    'validates contact and individual-regulator fields',
    { tag: ['@e2e', '@registration', '@validation'] },
    async ({ signedInPage, registerOrganisationPage }) => {
      await registerOrganisationPage.openWorkflowPage('contact-details');
      await expect(signedInPage.getByRole('heading', { name: 'Provide your contact details' })).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter first name')).toBeVisible();
      await expect(registerOrganisationPage.validationSummaryError('Enter last name')).toBeVisible();
      await expect(registerOrganisationPage.validationSummaryError('Enter email address')).toBeVisible();

      await registerOrganisationPage.firstNameInput.fill('Playwright');
      await registerOrganisationPage.lastNameInput.fill('Validator');
      await registerOrganisationPage.workEmailAddressInput.fill('playwright.validator@example.com');
      await registerOrganisationPage.continueWith();
      await expect(signedInPage.getByText('Are you (as an individual) registered with a regulator?')).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Please select an option')).toBeVisible();

      await registerOrganisationPage.individualRegulatorYesRadio.check();
      await registerOrganisationPage.continueWith();
      await expect(signedInPage.getByText(
        'What regulator are you (as an individual) registered with?'
      )).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError(
        'Please select a regulatory organisation'
      )).toBeVisible();

      await registerOrganisationPage.regulatorTypeSelect.selectOption({
        label: 'Solicitor Regulation Authority (SRA)'
      });
      await expect(registerOrganisationPage.organisationRegistrationNumberInput).toBeVisible();

      await registerOrganisationPage.continueWith();
      await expect(registerOrganisationPage.validationSummaryError('Enter a registration reference')).toBeVisible();
    }
  );
});
