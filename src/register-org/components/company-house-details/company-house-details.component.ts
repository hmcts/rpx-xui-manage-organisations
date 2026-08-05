import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

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
        Validators.pattern(/^(((AC|ZC|FC|GE|LP|OC|SE|SA|SZ|SF|GS|SL|SO|SC|ES|NA|NZ|NF|GN|NL|NC|R0|NI|EN|\d{2}|SG|FE)\d{5}(\d|C|R))|((RS|SO)\d{3}(\d{3}|\d{2}[WSRCZF]|\d(FI|RS|SA|IP|US|EN|AS)|CUS))|((NI|SL)\d{5}[\dA])|(OC(([\dP]{5}[CWERTB])|([\dP]{4}(OC|CU)))))$/)
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
