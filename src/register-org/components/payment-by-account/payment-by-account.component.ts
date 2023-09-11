import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-payment-by-account',
  templateUrl: './payment-by-account.component.html'
})
export class PaymentByAccountComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('errorSummaryTitleElement') public errorSummaryTitleElement: ElementRef;

  public pbaFormGroup: FormGroup;
  public pbaError: ErrorMessage;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.pbaFormGroup = new FormGroup({
      pba: new FormControl(null, Validators.required)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      if (this.pbaFormGroup.get('pba').value === 'yes') {
        // Set corresponding registration data
        this.registrationData.hasPBA = true;
        // Navigate to collect PBA details
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account-details']);
      } else {
        // Set corresponding registration data
        this.registrationData.hasPBA = false;
        // Navigate to collect contact details
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
      }
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    if (this.registrationData.hasPBA !== null) {
      if (this.registrationData.hasPBA) {
        this.pbaFormGroup.get('pba').setValue('yes');
      } else {
        this.pbaFormGroup.get('pba').setValue('no');
      }
    }
  }

  private isFormValid(): boolean {
    if (this.pbaFormGroup.invalid) {
      this.pbaError = {
        description: 'Please select at least one option',
        title: '',
        fieldId: 'pba-yes'
      };
      this.errorSummaryTitleElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
