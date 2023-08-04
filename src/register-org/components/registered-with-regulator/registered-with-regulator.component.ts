import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-registered-with-regulator',
  templateUrl: './registered-with-regulator.component.html'
})
export class RegisteredWithRegulatorComponent extends RegisterComponent implements OnInit, OnDestroy {
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
        this.registrationData.hasDxReference = true;
        // Navigate to collect DX details
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference-details']);
      } else {
        // Set corresponding registration data
        this.registrationData.hasDxReference = false;
        // Navigate to office address page
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'office-addresses']);
      }
    }
  }

  public setFormControlValues(): void {
    if (this.registrationData.hasDxReference !== null) {
      if (this.registrationData.hasDxReference) {
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
