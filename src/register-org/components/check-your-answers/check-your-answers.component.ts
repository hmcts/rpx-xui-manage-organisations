import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
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
  public readonly errorMessage = 'Please select checkbox to confirm you have read and understood the terms and conditions';

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

    this.registrationData.services?.forEach((serviceKey) => {
      const service = ORGANISATION_SERVICES.find((service) => service.key === serviceKey).value;
      this.services.push(service);
    });
    if (this.registrationData.otherServices) {
      this.services.push(`Other: ${this.registrationData.otherServices}`);
    }
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

  public onBack() {
    this.navigateToPreviousPage();
  }

  public onSubmitData() {
    if (this.validateForm()) {
      this.registerOrgService.postRegistration().subscribe(() => {
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registration-submitted']);
      },
      ((error) => {
        console.log(error);
      }),);
    }
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    if (!this.cyaFormGroup.valid) {
      this.validationErrors.push({
        id: 'confirmTermsAndConditions',
        message: this.errorMessage
      });
    }
    return this.cyaFormGroup.valid;
  }

  public termsAndConditionsChange(event: any): void {
    this.validateForm();
  }
}
