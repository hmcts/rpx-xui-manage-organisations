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

  public async openStartPage(): Promise<void> {
    await this.page.goto('/register-org-new/register');
  }

  public async startRegistration(): Promise<void> {
    await this.page.locator('#confirmed-organisation-account').check();
    await this.continueWith('Start');
  }

  public async chooseSolicitorOrganisationType(): Promise<void> {
    await this.page.getByLabel('Solicitor', { exact: true }).check();
    await this.continueWith();
  }

  public async enterOrganisationName(organisationName: string): Promise<void> {
    await this.page.locator('#company-name').fill(organisationName);
    await this.continueWith();
  }

  public async enterOrganisationNameAndCompanyHouseNumber(organisationName: string, companyHouseNumber: string): Promise<void> {
    await this.page.locator('#company-name').fill(organisationName);
    await this.page.locator('#company-house-number').fill(companyHouseNumber);
    await this.continueWith();
  }

  public async selectRegisteredAddress(postcode: string): Promise<string> {
    await this.page.locator('#postcodeInput').fill(postcode);
    await this.page.getByRole('button', { name: 'Find address' }).click();

    const addressList = this.page.locator('#addressList');
    await expect(addressList).toBeVisible();

    const addressOption = addressList.locator('option').nth(1);
    const selectedAddress = (await addressOption.textContent())?.trim();
    if (!selectedAddress) {
      throw new Error('Address lookup returned no selectable address option.');
    }

    await addressList.selectOption({ index: 1 });
    await this.continueWith();
    return selectedAddress;
  }

  public async enterManualUkAddress(address: ManualAddress): Promise<void> {
    await this.page.getByRole('link', { name: 'I can\'t enter a UK postcode' }).click();
    await this.page.locator('#yes').check();
    await this.fillManualAddress(address);
    await this.continueWith();
  }

  public async enterManualInternationalAddress(address: ManualAddress): Promise<void> {
    await this.page.getByRole('link', { name: 'I can\'t enter a UK postcode' }).click();
    await this.page.locator('#no').check();
    await this.fillManualAddress(address);
    await this.continueWith();
  }

  public async enterDocumentExchangeReference(dxNumber: string, dxExchange: string): Promise<void> {
    await this.page.locator('#document-exchange-yes').check();
    await this.continueWith();
    await this.page.locator('#dx-number').fill(dxNumber);
    await this.page.locator('#dx-exchange').fill(dxExchange);
    await this.continueWith();
  }

  public async declineDocumentExchangeReference(): Promise<void> {
    await this.page.locator('#document-exchange-no').check();
    await this.continueWith();
  }

  public async enterOrganisationRegulator(registrationNumber: string): Promise<void> {
    await this.page.locator('#regulator-type0').selectOption({ label: 'Solicitor Regulation Authority (SRA)' });
    await this.page.locator('#organisation-registration-number0').fill(registrationNumber);
    await this.continueWith();
  }

  public async enterOtherOrganisationRegulator(regulatorName: string, registrationNumber: string): Promise<void> {
    await this.page.locator('#regulator-type0').selectOption({ label: 'Other' });
    await this.page.locator('#regulator-name0').fill(regulatorName);
    await this.page.locator('#organisation-registration-number0').fill(registrationNumber);
    await this.continueWith();
  }

  public async chooseDivorceService(): Promise<void> {
    await this.page.locator('input[data-service-label="Divorce"]').check();
    await this.continueWith();
  }

  public async chooseServices(...serviceLabels: string[]): Promise<void> {
    for (const serviceLabel of serviceLabels) {
      await this.page.locator(`input[data-service-label="${serviceLabel}"]`).check();
    }
    await this.continueWith();
  }

  public async declinePaymentByAccount(): Promise<void> {
    await this.page.locator('#pba-no').check();
    await this.continueWith();
  }

  public async enterPaymentByAccountNumbers(pbaNumbers: string[]): Promise<void> {
    await this.page.locator('#pba-yes').check();
    await this.continueWith();

    for (const [index, pbaNumber] of pbaNumbers.entries()) {
      if (index > 0) {
        await this.page.getByRole('button', { name: 'Add another PBA number' }).click();
      }
      await this.page.locator(`#pba-number-${index}`).fill(pbaNumber);
    }
    await this.continueWith();
  }

  public async enterContactDetails(data: ContactDetails): Promise<void> {
    await this.page.locator('#first-name').fill(data.firstName);
    await this.page.locator('#last-name').fill(data.lastName);
    await this.page.locator('#work-email-address').fill(data.email);
    await this.continueWith();
  }

  public async declineIndividualRegulator(): Promise<void> {
    await this.page.locator('#registered-with-regulator-no').check();
    await this.continueWith();
  }

  public async enterOtherIndividualRegulator(regulatorName: string, registrationNumber: string): Promise<void> {
    await this.page.locator('#registered-with-regulator-yes').check();
    await this.continueWith();
    await this.page.locator('#regulator-type0').selectOption({ label: 'Other' });
    await this.page.locator('#regulator-name0').fill(regulatorName);
    await this.page.locator('#organisation-registration-number0').fill(registrationNumber);
    await this.continueWith();
  }

  public async submitRegistration(): Promise<void> {
    await this.page.locator('#confirm-terms-and-conditions').check();
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

  private async continueWith(buttonName = 'Continue'): Promise<void> {
    await this.page.getByRole('button', { name: buttonName }).click();
  }

  private async fillManualAddress(address: ManualAddress): Promise<void> {
    await this.page.locator('#addressLine1').fill(address.line1);
    await this.page.locator('#addressLine2').fill(address.line2 ?? '');
    await this.page.locator('#addressLine3').fill(address.line3 ?? '');
    await this.page.locator('#postTown').fill(address.town);
    await this.page.locator('#county').fill(address.county ?? '');

    if (address.country !== 'UK') {
      await this.page.locator('#country').fill(address.country);
    }

    await this.page.locator('#postCode').fill(address.postcode ?? '');
  }
}
