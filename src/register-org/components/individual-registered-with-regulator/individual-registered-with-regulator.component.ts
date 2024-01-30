import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-individual-registered-with-regulator',
  templateUrl: './individual-registered-with-regulator.component.html'
})
export class IndividualRegisteredWithRegulatorComponent extends RegisterComponent implements OnInit, OnDestroy {
  public registeredWithRegulatorFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.registeredWithRegulatorFormGroup = new FormGroup({
      registeredWithRegulator: new FormControl(null, Validators.required)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      if (this.registeredWithRegulatorFormGroup.get('registeredWithRegulator').value === 'yes') {
        // Set corresponding registration data
        this.registrationData.hasIndividualRegisteredWithRegulator = true;
        // Navigate to what regulator are you registered with page
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator-details']);
      } else {
        // Set corresponding registration data
        this.registrationData.hasIndividualRegisteredWithRegulator = false;
        this.registrationData.individualRegulators = [];
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
      }
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public setFormControlValues(): void {
    if (this.registrationData.hasIndividualRegisteredWithRegulator !== null) {
      if (this.registrationData.hasIndividualRegisteredWithRegulator) {
        this.registeredWithRegulatorFormGroup.get('registeredWithRegulator').setValue('yes');
      } else {
        this.registeredWithRegulatorFormGroup.get('registeredWithRegulator').setValue('no');
      }
    }
  }

  private isFormValid(): boolean {
    if (this.registeredWithRegulatorFormGroup.invalid) {
      this.validationErrors.push({
        id: 'registered-with-regulator-yes',
        message: 'Please select an option'
      });
      return false;
    }
    return true;
  }
}
