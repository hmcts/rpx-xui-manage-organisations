import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-individual-registered-with-regulator',
  templateUrl: './individual-registered-with-regulator.component.html'
})
export class IndividualRegisteredWithRegulatorComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('errorSummaryTitleElement') public errorSummaryTitleElement: ElementRef;

  public registeredWithRegulatorFormGroup: FormGroup;
  public registeredWithRegulatorError: ErrorMessage;

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
        // Note: optional currently a placeholder to make the route work
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'check-your-answers', 'optional']);
      }
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
      this.registeredWithRegulatorError = {
        description: 'Please select at least one option',
        title: '',
        fieldId: 'registered-with-regulator-yes'
      };
      this.errorSummaryTitleElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
