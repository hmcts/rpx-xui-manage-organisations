import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
import { ORGANISATION_TYPES_REF_DATA } from '../../__mocks__';
import { ORGANISATION_SERVICES } from '../../constants/register-org-constants';
import { RegulatorType, RegulatoryType } from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html'
})
export class CheckYourAnswersComponent extends RegisterComponent implements OnInit {
  public cyaFormGroup: FormGroup;
  public regulatorType = RegulatorType;
  public regulatoryType = RegulatoryType;
  public services: string[] = [];
  public validationErrors: { id: string, message: string }[] = [];
  public pbaUrl: string;
  public readonly errorMessage = 'Please select checkbox to confirm you have read and understood the terms and conditions';
  public readonly apiErrorMessage = 'Sorry, there is a problem with the service. Try again later';

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.cyaFormGroup = new FormGroup({
      confirmTermsAndConditions: new FormControl(null, [Validators.required, this.getCustomValidationForTermsAndConditions()])
    });
    this.pbaUrl = this.registrationData.hasPBA
      ? `/${this.registerOrgService.REGISTER_ORG_NEW_ROUTE}/payment-by-account-details`
      : `/${this.registerOrgService.REGISTER_ORG_NEW_ROUTE}/payment-by-account`;

    this.registrationData.services?.forEach((thisService) => {
      const service = ORGANISATION_SERVICES.find((service) => service.key === thisService.key).value;
      this.services.push(service);
    });
    if (this.registrationData.otherServices) {
      this.services.push(`Other: ${this.registrationData.otherServices}`);
    }
  }

  public onBack(): void {
    this.registrationData.hasIndividualRegisteredWithRegulator
      ? this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator-details', true])
      : this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator']);
  }

  public onSubmitData(): void {
    if (this.validateForm()) {
      this.registerOrgService.postRegistration().subscribe(() => {
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registration-submitted']);
      },
      (() => {
        this.validationErrors.push({
          id: 'confirm-terms-and-conditions',
          message: this.apiErrorMessage
        });
      }));
    }
  }

  public getOrganisationType(organisationType: string): string {
    const orgRefData = ORGANISATION_TYPES_REF_DATA.find((orgType) => orgType.key === organisationType);
    return orgRefData ? orgRefData.value_en : null;
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    if (!this.cyaFormGroup.valid) {
      this.validationErrors.push({
        id: 'confirm-terms-and-conditions',
        message: this.errorMessage
      });
    }
    return this.cyaFormGroup.valid;
  }

  private getCustomValidationForTermsAndConditions(): ValidatorFn {
    // TODO: To be used in the functionality ticket if required
    return (control: AbstractControl): { [key: string]: any } => {
      if (!control.value) {
        return { error: this.errorMessage };
      }
      return null;
    };
  }
}
