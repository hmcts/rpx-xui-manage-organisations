import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-payment-by-account',
  templateUrl: './payment-by-account.component.html',
  standalone: false
})
export class PaymentByAccountComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('errorSummaryTitleElement') public errorSummaryTitleElement: ElementRef;

  public pbaFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];

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
        this.registrationData.pbaNumbers = [];
        // Navigate to collect contact details
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
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
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-services-access']);
    }
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
    this.validationErrors = [];
    if (this.pbaFormGroup.invalid) {
      this.validationErrors.push({
        id: 'pba-yes',
        message: 'Please select an option'
      });
      this.errorSummaryTitleElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
