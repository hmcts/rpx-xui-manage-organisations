import type { Locator, Page } from '@playwright/test';
import type { RegisterOrganisationAddress } from '../mocks/registerOrganisation.mock';

export class AddressUpdatePage {
  public readonly addressHeading: Locator;
  public readonly dxQuestionHeading: Locator;
  public readonly dxDetailsHeading: Locator;
  public readonly checkHeading: Locator;
  public readonly changeAddressLink: Locator;
  public readonly manualAddressLink: Locator;
  public readonly ukAddressYesRadio: Locator;
  public readonly ukAddressNoRadio: Locator;
  public readonly addressLine1Input: Locator;
  public readonly postTownInput: Locator;
  public readonly postCodeInput: Locator;
  public readonly countryInput: Locator;
  public readonly dxYesRadio: Locator;
  public readonly dxNoRadio: Locator;
  public readonly dxNumberInput: Locator;
  public readonly dxExchangeInput: Locator;
  public readonly continueButton: Locator;
  public readonly cancelButton: Locator;
  public readonly backLink: Locator;
  public readonly submitButton: Locator;
  public readonly successBanner: Locator;

  constructor(private readonly page: Page) {
    this.addressHeading = page.getByRole('heading', { name: 'What is the registered address of your organisation?', exact: true });
    this.dxQuestionHeading = page.getByRole('heading', { name: 'Do you have a document exchange reference for your main office?', exact: true });
    this.dxDetailsHeading = page.getByRole('heading', { name: 'What\'s the DX reference for this office?', exact: true });
    this.checkHeading = page.getByRole('heading', { name: 'Check your answers', exact: true });
    this.changeAddressLink = page.locator('#change-address__link');
    this.manualAddressLink = page.getByRole('link', { name: 'I can\'t enter a UK postcode', exact: true });
    this.ukAddressYesRadio = page.locator('#yes');
    this.ukAddressNoRadio = page.locator('#no');
    this.addressLine1Input = page.locator('#addressLine1');
    this.postTownInput = page.locator('#postTown');
    this.postCodeInput = page.locator('#postCode');
    this.countryInput = page.locator('#country');
    this.dxYesRadio = page.locator('#document-exchange-yes');
    this.dxNoRadio = page.locator('#document-exchange-no');
    this.dxNumberInput = page.locator('#dx-number');
    this.dxExchangeInput = page.locator('#dx-exchange');
    this.continueButton = page.getByRole('button', { name: 'Continue', exact: true });
    this.cancelButton = page.getByRole('button', { name: 'Cancel', exact: true });
    this.backLink = page.getByRole('link', { name: 'Back', exact: true });
    this.submitButton = page.locator('#submit-address-update');
    this.successBanner = page.locator('app-prd-org-change-success .hmcts-banner--success');
  }

  public async openOrganisation(): Promise<void> {
    await this.page.goto('/organisation');
  }

  public async startUpdate(): Promise<void> {
    await this.changeAddressLink.click();
  }

  public async enterManualAddress(address: RegisterOrganisationAddress): Promise<void> {
    await this.manualAddressLink.click();
    await (address.country === 'UK' ? this.ukAddressYesRadio : this.ukAddressNoRadio).check();
    await this.addressLine1Input.fill(address.addressLine1);
    await this.page.locator('#addressLine2').fill(address.addressLine2 ?? '');
    await this.page.locator('#addressLine3').fill(address.addressLine3 ?? '');
    await this.postTownInput.fill(address.postTown);
    await this.page.locator('#county').fill(address.county ?? '');
    if (address.country !== 'UK') {
      await this.countryInput.fill(address.country);
    }
    await this.postCodeInput.fill(address.postCode ?? '');
    await this.continueButton.click();
  }

  public legacyOrganisationRow(label: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByRole('rowheader', { name: label, exact: true })
    });
  }

  public summaryRow(label: string): Locator {
    return this.page.locator('.govuk-summary-list__row').filter({
      has: this.page.locator('.govuk-summary-list__key').getByText(label, { exact: true })
    });
  }

  public summaryValue(label: string): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__value');
  }

  public summaryChangeLink(label: string): Locator {
    return this.summaryRow(label).locator('.govuk-summary-list__actions a');
  }

  public validationError(message: string): Locator {
    return this.page.getByRole('alert').getByText(message, { exact: true });
  }
}
