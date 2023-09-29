import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CompanyHouseDetailsMessage } from '../../../register-org/models';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-company-house-details',
  templateUrl: './company-house-details.component.html'
})
export class CompanyHouseDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;
  public validationErrors: ErrorMessage[] = [];
  public companyHouseFormGroup: FormGroup;
  public companyNameError: ErrorMessage;
  public companyNumberError: ErrorMessage;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.companyHouseFormGroup = new FormGroup({
      companyName: new FormControl(this.registrationData.name, Validators.required),
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
      this.registrationData.name = this.companyHouseFormGroup.get('companyName').value;
      this.registrationData.companyHouseNumber = this.companyHouseFormGroup.get('companyHouseNumber').value;
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  private validateForm(): boolean {
    this.validationErrors = [];

    if (this.companyHouseFormGroup.invalid) {
      if (this.companyHouseFormGroup.get('companyName').invalid) {
        this.companyNameError = { title: '', description: CompanyHouseDetailsMessage.NO_ORG_NAME, fieldId: 'company-name' };
        this.validationErrors.push(this.companyNameError);
      }
      if (this.companyHouseFormGroup.get('companyHouseNumber').invalid) {
        this.companyNumberError = { title: '', description: CompanyHouseDetailsMessage.INVALID_COMPANY_NUMBER, fieldId: 'company-house-number' };
        this.validationErrors.push(this.companyNumberError);
      }
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
