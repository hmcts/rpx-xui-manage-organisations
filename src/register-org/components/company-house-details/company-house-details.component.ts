import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

// General company house number validation prefixes
const COMPANY_HOUSE_PREFIXES = [
  'AC', 'ZC', 'FC', 'GE', 'LP', 'OC', 'SE', 'SA', 'SZ', 'SF', 'GS', 'SL', 'SO', 'SC', 'ES',
  'NA', 'NZ', 'NF', 'GN', 'NL', 'NC', 'R0', 'NI', 'EN', 'SG', 'FE', 'BR', 'OE', 'RS'
];

// Special company house number validation patterns (e.g. RS12345, RS1234FI, RS123CUS, NI12345A)
const COMPANY_HOUSE_PATTERNS = [
  /^RS\d{5}$/,
  /^(RS|SO)\d{6}$/,
  /^(RS|SO)\d{5}[WSRCZF]$/,
  /^(RS|SO)\d{4}(FI|RS|SA|IP|US|EN|AS)$/,
  /^(RS|SO)\d{3}CUS$/,
  /^(NI|SL)\d{5}[\dA]$/,
  /^OC[\dP]{5}[CWERTB]$/,
  /^OC[\dP]{4}(OC|CU)$/
];

// Sonar complained about complex validation so this was created to simplify and make it more readable
const companyHouseNumberValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const companyHouseNumber = control.value;

  if (!companyHouseNumber) {
    return null;
  }

  const hasKnownPrefix = COMPANY_HOUSE_PREFIXES.includes(companyHouseNumber.slice(0, 2));
  const hasNumberPrefix = /^\d{2}$/.test(companyHouseNumber.slice(0, 2));
  const hasValidStandardFormat = (hasKnownPrefix || hasNumberPrefix) && /^\d{5}[\dCR]$/.test(companyHouseNumber.slice(2));
  const hasValidSpecialFormat = COMPANY_HOUSE_PATTERNS.some((pattern) => pattern.test(companyHouseNumber));

  // Has to match the standard format or one of the special formats to be valid
  return hasValidStandardFormat || hasValidSpecialFormat ? null : { pattern: true };
};

@Component({
  selector: 'app-company-house-details',
  templateUrl: './company-house-details.component.html',
  standalone: false
})
export class CompanyHouseDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  public validationErrors: { id: string, message: string }[] = [];
  public companyHouseFormGroup: FormGroup;
  public companyNameError: { id: string, message: string } = null;
  public companyNumberError: { id: string, message: string } = null;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.companyHouseFormGroup = new FormGroup({
      companyName: new FormControl(this.registrationData.companyName, Validators.required),
      companyHouseNumber: new FormControl(this.registrationData.companyHouseNumber,
        companyHouseNumberValidator
      )
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.validateForm()) {
      this.registrationData.companyName = this.companyHouseFormGroup.get('companyName').value;
      this.registrationData.companyHouseNumber = this.companyHouseFormGroup.get('companyHouseNumber').value;
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address', 'external']);
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-type']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.companyNameError = null;
    this.companyNumberError = null;
    if (this.companyHouseFormGroup.invalid) {
      if (this.companyHouseFormGroup.get('companyName').invalid) {
        this.companyNameError = { id: 'company-name', message: CompanyHouseDetailsMessage.NO_ORG_NAME };
        this.validationErrors.push(this.companyNameError);
      }
      if (this.companyHouseFormGroup.get('companyHouseNumber').invalid) {
        this.companyNumberError = { id: 'company-house-number', message: CompanyHouseDetailsMessage.INVALID_COMPANY_NUMBER };
        this.validationErrors.push(this.companyNumberError);
      }
      return false;
    }
    return true;
  }
}
