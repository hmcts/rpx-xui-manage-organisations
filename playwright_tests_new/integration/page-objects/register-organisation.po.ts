import type { Locator, Page } from '@playwright/test';
import type { RegisterOrganisationAddress } from '../mocks/registerOrganisation.mock';

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class RegisterOrganisationPage {
  public readonly addressLine1Input: Locator;
  public readonly addressLine2Input: Locator;
  public readonly addressLine3Input: Locator;
  public readonly checkYourAnswersHeading: Locator;
  public readonly companyHouseNumberInput: Locator;
  public readonly confirmedOrganisationAccountCheckbox: Locator;
  public readonly countryInput: Locator;
  public readonly countyInput: Locator;
  public readonly documentExchangeNoRadio: Locator;
  public readonly documentExchangeYesRadio: Locator;
  public readonly dxExchangeInput: Locator;
  public readonly dxNumberInput: Locator;
  public readonly firstNameInput: Locator;
  public readonly lastNameInput: Locator;
  public readonly manualAddressLink: Locator;
  public readonly otherServicesCheckbox: Locator;
  public readonly otherServicesInput: Locator;
  public readonly organisationNameInput: Locator;
  public readonly organisationRegistrationNumberInput: Locator;
  public readonly otherOrganisationDetailInput: Locator;
  public readonly otherOrganisationTypeRadio: Locator;
  public readonly otherOrganisationTypeSelect: Locator;
  public readonly pbaNoRadio: Locator;
  public readonly pbaYesRadio: Locator;
  public readonly postCodeInput: Locator;
  public readonly postTownInput: Locator;
  public readonly registeredWithRegulatorNoRadio: Locator;
  public readonly registeredWithRegulatorYesRadio: Locator;
  public readonly regulatorNameInput: Locator;
  public readonly regulatorTypeSelect: Locator;
  public readonly solicitorOrganisationTypeRadio: Locator;
  public readonly submittedHeading: Locator;
  public readonly termsAndConditionsCheckbox: Locator;
  public readonly ukAddressNoRadio: Locator;
  public readonly ukAddressYesRadio: Locator;
  public readonly workEmailAddressInput: Locator;

  constructor(private readonly page: Page) {
    this.addressLine1Input = this.page.locator('#addressLine1');
    this.addressLine2Input = this.page.locator('#addressLine2');
    this.addressLine3Input = this.page.locator('#addressLine3');
    this.checkYourAnswersHeading = this.page.getByRole('heading', {
      name: 'Check your answers before you register'
    });
    this.companyHouseNumberInput = this.page.locator('#company-house-number');
    this.confirmedOrganisationAccountCheckbox = this.page.locator('#confirmed-organisation-account');
    this.countryInput = this.page.locator('#country');
    this.countyInput = this.page.locator('#county');
    this.documentExchangeNoRadio = this.page.locator('#document-exchange-no');
    this.documentExchangeYesRadio = this.page.locator('#document-exchange-yes');
    this.dxExchangeInput = this.page.locator('#dx-exchange');
    this.dxNumberInput = this.page.locator('#dx-number');
    this.firstNameInput = this.page.locator('#first-name');
    this.lastNameInput = this.page.locator('#last-name');
    this.manualAddressLink = this.page.getByRole('link', { name: 'I can\'t enter a UK postcode' });
    this.otherServicesCheckbox = this.page.locator('input[data-service-label="Service not listed"]');
    this.otherServicesInput = this.page.locator('#other-services');
    this.organisationNameInput = this.page.locator('#company-name');
    this.organisationRegistrationNumberInput = this.page.locator('#organisation-registration-number0');
    this.otherOrganisationDetailInput = this.page.locator('#other-organisation-detail');
    this.otherOrganisationTypeRadio = this.page.locator('#OTHER');
    this.otherOrganisationTypeSelect = this.page.locator('#other-organisation-type');
    this.pbaNoRadio = this.page.locator('#pba-no');
    this.pbaYesRadio = this.page.locator('#pba-yes');
    this.postCodeInput = this.page.locator('#postCode');
    this.postTownInput = this.page.locator('#postTown');
    this.registeredWithRegulatorNoRadio = this.page.locator('#registered-with-regulator-no');
    this.registeredWithRegulatorYesRadio = this.page.locator('#registered-with-regulator-yes');
    this.regulatorNameInput = this.page.locator('#regulator-name0');
    this.regulatorTypeSelect = this.page.locator('#regulator-type0');
    this.solicitorOrganisationTypeRadio = this.page.locator('#SolicitorOrganisation');
    this.submittedHeading = this.page.getByRole('heading', { name: 'Registration details submitted' });
    this.termsAndConditionsCheckbox = this.page.locator('#confirm-terms-and-conditions');
    this.ukAddressNoRadio = this.page.locator('#no');
    this.ukAddressYesRadio = this.page.locator('#yes');
    this.workEmailAddressInput = this.page.locator('#work-email-address');
  }

  public validationSummaryError(message: string): Locator {
    return this.page.getByRole('alert').getByText(message, { exact: true });
  }

  public summaryRow(label: string | RegExp): Locator {
    const keyText = typeof label === 'string' ? new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) : label;

    return this.page.locator('.govuk-summary-list__row').filter({
      has: this.page.locator('.govuk-summary-list__key', { hasText: keyText })
    });
  }

  public summaryValue(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__value');
  }

  public summaryChangeLink(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__actions a');
  }

  public pbaNumberInput(index = 0): Locator {
    return this.page.locator(`#pba-number-${index}`);
  }

  public async openStartPage(): Promise<void> {
    await this.page.goto('/register-org-new/register');
    await this.waitForLoader();
  }

  public async openWorkflowPage(path: string): Promise<void> {
    await this.page.goto(`/register-org-new/${path}`);
    await this.waitForLoader();
  }

  public async startRegistration(): Promise<void> {
    await this.confirmedOrganisationAccountCheckbox.check();
    await this.continueWith('Start');
  }

  public async chooseOtherOrganisationType(otherOrganisationTypeLabel: string, details: string): Promise<void> {
    await this.otherOrganisationTypeRadio.check();
    await this.otherOrganisationTypeSelect.selectOption({ label: otherOrganisationTypeLabel });
    await this.otherOrganisationDetailInput.fill(details);
    await this.continueWith();
  }

  public async chooseSolicitorOrganisationType(): Promise<void> {
    await this.solicitorOrganisationTypeRadio.check();
    await this.continueWith();
  }

  public async enterOrganisationName(organisationName: string): Promise<void> {
    await this.organisationNameInput.fill(organisationName);
    await this.continueWith();
  }

  public async enterOrganisationNameAndCompanyHouseNumber(
    organisationName: string,
    companyHouseNumber: string
  ): Promise<void> {
    await this.organisationNameInput.fill(organisationName);
    await this.companyHouseNumberInput.fill(companyHouseNumber);
    await this.continueWith();
  }

  public async enterManualUkAddress(address: RegisterOrganisationAddress): Promise<void> {
    await this.manualAddressLink.click();
    await this.ukAddressYesRadio.check();
    await this.fillManualAddress(address);
    await this.continueWith();
  }

  public async enterManualInternationalAddress(address: RegisterOrganisationAddress): Promise<void> {
    await this.manualAddressLink.click();
    await this.ukAddressNoRadio.check();
    await this.fillManualAddress(address);
    await this.continueWith();
  }

  public async enterDocumentExchangeReference(dxNumber: string, dxExchange: string): Promise<void> {
    await this.documentExchangeYesRadio.check();
    await this.continueWith();
    await this.dxNumberInput.fill(dxNumber);
    await this.dxExchangeInput.fill(dxExchange);
    await this.continueWith();
  }

  public async declineDocumentExchangeReference(): Promise<void> {
    await this.documentExchangeNoRadio.check();
    await this.continueWith();
  }

  public async enterOrganisationRegulator(registrationNumber: string): Promise<void> {
    await this.regulatorTypeSelect.selectOption({ label: 'Solicitor Regulation Authority (SRA)' });
    await this.organisationRegistrationNumberInput.fill(registrationNumber);
    await this.continueWith();
  }

  public async enterOtherOrganisationRegulator(regulatorName: string, registrationNumber: string): Promise<void> {
    await this.regulatorTypeSelect.selectOption({ label: 'Other' });
    await this.regulatorNameInput.fill(regulatorName);
    await this.organisationRegistrationNumberInput.fill(registrationNumber);
    await this.continueWith();
  }

  public async chooseServices(...serviceLabels: string[]): Promise<void> {
    for (const serviceLabel of serviceLabels) {
      await this.page.locator(`input[data-service-label="${serviceLabel}"]`).check();
    }
    await this.continueWith();
  }

  public async enterPaymentByAccountNumbers(pbaNumbers: string[]): Promise<void> {
    await this.pbaYesRadio.check();
    await this.continueWith();

    for (const [index, pbaNumber] of pbaNumbers.entries()) {
      if (index > 0) {
        await this.addAnotherPaymentByAccountNumber();
      }
      await this.pbaNumberInput(index).fill(pbaNumber);
    }
    await this.continueWith();
  }

  public async declinePaymentByAccount(): Promise<void> {
    await this.pbaNoRadio.check();
    await this.continueWith();
  }

  public async addAnotherPaymentByAccountNumber(): Promise<void> {
    await this.page.getByRole('button', { name: 'Add another PBA number' }).click();
  }

  public async enterContactDetails(contactDetails: {
    firstName: string;
    lastName: string;
    workEmailAddress: string;
  }): Promise<void> {
    await this.firstNameInput.fill(contactDetails.firstName);
    await this.lastNameInput.fill(contactDetails.lastName);
    await this.workEmailAddressInput.fill(contactDetails.workEmailAddress);
    await this.continueWith();
  }

  public async enterOtherIndividualRegulator(regulatorName: string, registrationNumber: string): Promise<void> {
    await this.registeredWithRegulatorYesRadio.check();
    await this.continueWith();
    await this.regulatorTypeSelect.selectOption({ label: 'Other' });
    await this.regulatorNameInput.fill(regulatorName);
    await this.organisationRegistrationNumberInput.fill(registrationNumber);
    await this.continueWith();
  }

  public async declineIndividualRegulator(): Promise<void> {
    await this.registeredWithRegulatorNoRadio.check();
    await this.continueWith();
  }

  public async submitRegistration(): Promise<void> {
    await this.termsAndConditionsCheckbox.check();
    await this.submitRegistrationForm();
  }

  public async submitRegistrationForm(): Promise<void> {
    await this.continueWith('Confirm and submit');
  }

  public async continueWith(buttonName = 'Continue'): Promise<void> {
    await this.waitForLoader();
    await this.page.getByRole('button', { name: buttonName, exact: true }).click();
    await this.waitForLoader();
  }

  public async goBack(): Promise<void> {
    await this.waitForLoader();

    const backButton = this.page.getByRole('button', { name: 'Back', exact: true });
    if (await backButton.count()) {
      await backButton.click();
    } else {
      await this.page.getByRole('link', { name: 'Back', exact: true }).click();
    }

    await this.waitForLoader();
  }

  private async fillManualAddress(address: RegisterOrganisationAddress): Promise<void> {
    await this.addressLine1Input.fill(address.addressLine1);
    await this.addressLine2Input.fill(address.addressLine2 ?? '');
    await this.addressLine3Input.fill(address.addressLine3 ?? '');
    await this.postTownInput.fill(address.postTown);
    await this.countyInput.fill(address.county ?? '');

    if (address.country !== 'UK') {
      await this.countryInput.fill(address.country);
    }

    await this.postCodeInput.fill(address.postCode ?? '');
  }

  private async waitForLoader(): Promise<void> {
    await this.page.locator('app-loader .overlay').waitFor({ state: 'hidden' });
  }
}
