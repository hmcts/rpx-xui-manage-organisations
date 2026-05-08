import { expect, type Locator } from '@playwright/test';
import { BasePage } from '../base';

type ContactDetails = {
  firstName: string;
  lastName: string;
  email: string;
};

type ManualAddress = {
  line1: string;
  line2?: string;
  line3?: string;
  town: string;
  county?: string;
  postcode?: string;
  country: string;
};

const escapeRegExp = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export class RegisterOrganisationPage extends BasePage {
  public readonly startPageHeading = this.page.getByRole('heading', {
    name: 'Apply for an organisation to manage civil, family and tribunal cases'
  });

  public readonly alreadyRegisteredHeading = this.page.getByRole('heading', {
    name: 'If you\'re already registered for MyHMCTS'
  });

  public readonly checkYourAnswersHeading = this.page.getByRole('heading', {
    name: 'Check your answers before you register'
  });

  public readonly submittedHeading = this.page.getByRole('heading', {
    name: 'Registration details submitted'
  });

  public readonly manageCasesLink = this.page.getByRole('link', { name: 'manage your cases' });

  public readonly manageOrganisationLink = this.page.getByRole('link', { name: 'manage your organisation' });

  public readonly confirmedOrganisationAccountCheckbox = this.page.locator('#confirmed-organisation-account');
  public readonly solicitorOrganisationTypeRadio = this.page.getByLabel('Solicitor', { exact: true });
  public readonly organisationNameInput = this.page.locator('#company-name');
  public readonly companyHouseNumberInput = this.page.locator('#company-house-number');
  public readonly postcodeInput = this.page.locator('#postcodeInput');
  public readonly findAddressButton = this.page.getByRole('button', { name: 'Find address' });
  public readonly addressList = this.page.locator('#addressList');
  public readonly manualAddressLink = this.page.getByRole('link', { name: 'I can\'t enter a UK postcode' });
  public readonly ukAddressYesRadio = this.page.locator('#yes');
  public readonly ukAddressNoRadio = this.page.locator('#no');
  public readonly addressLine1Input = this.page.locator('#addressLine1');
  public readonly addressLine2Input = this.page.locator('#addressLine2');
  public readonly addressLine3Input = this.page.locator('#addressLine3');
  public readonly townInput = this.page.locator('#postTown');
  public readonly countyInput = this.page.locator('#county');
  public readonly countryInput = this.page.locator('#country');
  public readonly postCodeInput = this.page.locator('#postCode');
  public readonly documentExchangeYesRadio = this.page.locator('#document-exchange-yes');
  public readonly documentExchangeNoRadio = this.page.locator('#document-exchange-no');
  public readonly dxNumberInput = this.page.locator('#dx-number');
  public readonly dxExchangeInput = this.page.locator('#dx-exchange');
  public readonly regulatorTypeSelect = this.page.locator('#regulator-type0');
  public readonly regulatorNameInput = this.page.locator('#regulator-name0');
  public readonly organisationRegistrationNumberInput = this.page.locator('#organisation-registration-number0');
  public readonly pbaYesRadio = this.page.locator('#pba-yes');
  public readonly pbaNoRadio = this.page.locator('#pba-no');
  public readonly addAnotherPbaButton = this.page.getByRole('button', { name: 'Add another PBA number' });
  public readonly firstNameInput = this.page.locator('#first-name');
  public readonly lastNameInput = this.page.locator('#last-name');
  public readonly workEmailAddressInput = this.page.locator('#work-email-address');
  public readonly individualRegulatorYesRadio = this.page.locator('#registered-with-regulator-yes');
  public readonly individualRegulatorNoRadio = this.page.locator('#registered-with-regulator-no');
  public readonly termsAndConditionsCheckbox = this.page.locator('#confirm-terms-and-conditions');

  public async openStartPage(): Promise<void> {
    await this.page.goto('/register-org-new/register');
  }

  public async openWorkflowPage(path: string): Promise<void> {
    await this.page.goto(`/register-org-new/${path}`);
  }

  public validationSummaryError(message: string): Locator {
    return this.page.getByRole('alert').getByText(message, { exact: true });
  }

  public async continueWith(buttonName = 'Continue'): Promise<void> {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  public async startRegistration(): Promise<void> {
    await this.confirmedOrganisationAccountCheckbox.check();
    await this.continueWith('Start');
  }

  public async chooseSolicitorOrganisationType(): Promise<void> {
    await this.solicitorOrganisationTypeRadio.check();
    await this.continueWith();
  }

  public async enterOrganisationName(organisationName: string): Promise<void> {
    await this.organisationNameInput.fill(organisationName);
    await this.continueWith();
  }

  public async enterOrganisationNameAndCompanyHouseNumber(organisationName: string, companyHouseNumber: string): Promise<void> {
    await this.organisationNameInput.fill(organisationName);
    await this.companyHouseNumberInput.fill(companyHouseNumber);
    await this.continueWith();
  }

  public async selectRegisteredAddress(postcode: string): Promise<string> {
    await this.postcodeInput.fill(postcode);
    await this.findAddressButton.click();

    await expect(this.addressList).toBeVisible();

    const addressOption = this.addressList.locator('option').nth(1);
    const selectedAddress = (await addressOption.textContent())?.trim();
    if (!selectedAddress) {
      throw new Error('Address lookup returned no selectable address option.');
    }

    await this.addressList.selectOption({ index: 1 });
    await this.continueWith();
    return selectedAddress;
  }

  public async enterManualUkAddress(address: ManualAddress): Promise<void> {
    await this.manualAddressLink.click();
    await this.ukAddressYesRadio.check();
    await this.fillManualAddress(address);
    await this.continueWith();
  }

  public async enterManualInternationalAddress(address: ManualAddress): Promise<void> {
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

  public async chooseDivorceService(): Promise<void> {
    await this.serviceCheckbox('Divorce').check();
    await this.continueWith();
  }

  public async chooseServices(...serviceLabels: string[]): Promise<void> {
    for (const serviceLabel of serviceLabels) {
      await this.serviceCheckbox(serviceLabel).check();
    }
    await this.continueWith();
  }

  public async declinePaymentByAccount(): Promise<void> {
    await this.pbaNoRadio.check();
    await this.continueWith();
  }

  public async enterPaymentByAccountNumbers(pbaNumbers: string[]): Promise<void> {
    await this.pbaYesRadio.check();
    await this.continueWith();

    for (const [index, pbaNumber] of pbaNumbers.entries()) {
      if (index > 0) {
        await this.addAnotherPbaButton.click();
      }
      await this.pbaNumberInput(index).fill(pbaNumber);
    }
    await this.continueWith();
  }

  public async enterPaymentByAccountDetails(): Promise<void> {
    await this.pbaYesRadio.check();
    await this.continueWith();
  }

  public async fillPaymentByAccountNumber(pbaNumber: string, index = 0): Promise<void> {
    await this.pbaNumberInput(index).fill(pbaNumber);
  }

  public async enterContactDetails(data: ContactDetails): Promise<void> {
    await this.firstNameInput.fill(data.firstName);
    await this.lastNameInput.fill(data.lastName);
    await this.workEmailAddressInput.fill(data.email);
    await this.continueWith();
  }

  public async declineIndividualRegulator(): Promise<void> {
    await this.individualRegulatorNoRadio.check();
    await this.continueWith();
  }

  public async enterOtherIndividualRegulator(regulatorName: string, registrationNumber: string): Promise<void> {
    await this.individualRegulatorYesRadio.check();
    await this.continueWith();
    await this.regulatorTypeSelect.selectOption({ label: 'Other' });
    await this.regulatorNameInput.fill(regulatorName);
    await this.organisationRegistrationNumberInput.fill(registrationNumber);
    await this.continueWith();
  }

  public async submitRegistration(): Promise<void> {
    await this.termsAndConditionsCheckbox.check();
    await this.continueWith('Confirm and submit');
  }

  public summaryValue(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__value');
  }

  public summaryChangeLink(label: string | RegExp): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__actions a');
  }

  public summaryRow(label: string | RegExp): Locator {
    const keyText = typeof label === 'string' ? new RegExp(`^\\s*${escapeRegExp(label)}\\s*$`) : label;

    return this.page.locator('.govuk-summary-list__row').filter({
      has: this.page.locator('.govuk-summary-list__key', { hasText: keyText })
    });
  }

  private serviceCheckbox(serviceLabel: string): Locator {
    return this.page.locator(`input[data-service-label="${serviceLabel}"]`);
  }

  private pbaNumberInput(index: number): Locator {
    return this.page.locator(`#pba-number-${index}`);
  }

  private async fillManualAddress(address: ManualAddress): Promise<void> {
    await this.addressLine1Input.fill(address.line1);
    await this.addressLine2Input.fill(address.line2 ?? '');
    await this.addressLine3Input.fill(address.line3 ?? '');
    await this.townInput.fill(address.town);
    await this.countyInput.fill(address.county ?? '');

    if (address.country !== 'UK') {
      await this.countryInput.fill(address.country);
    }

    await this.postCodeInput.fill(address.postcode ?? '');
  }
}
