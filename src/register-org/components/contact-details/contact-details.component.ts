import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { ContactDetailsErrorMessage } from '../../models/contact-details.enum';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  standalone: false
})
export class ContactDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  public contactDetailsFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public firstNameError = null;
  public lastNameError = null;
  public workEmailAddressError = null;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.contactDetailsFormGroup = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      workEmailAddress: new FormControl(null, [Validators.required, Validators.email])
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.registrationData.contactDetails = {
        firstName: this.contactDetailsFormGroup.get('firstName').value,
        lastName: this.contactDetailsFormGroup.get('lastName').value,
        workEmailAddress: this.contactDetailsFormGroup.get('workEmailAddress').value
      };
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator']);
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      if (this.registrationData.hasPBA) {
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account-details']);
      } else {
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account']);
      }
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    const contactDetails = this.registrationData.contactDetails;
    if (contactDetails) {
      this.contactDetailsFormGroup.get('firstName').setValue(contactDetails.firstName);
      this.contactDetailsFormGroup.get('lastName').setValue(contactDetails.lastName);
      this.contactDetailsFormGroup.get('workEmailAddress').setValue(contactDetails.workEmailAddress);
    }
  }

  private isFormValid(): boolean {
    this.validationErrors = [];
    this.firstNameError = null;
    this.lastNameError = null;
    this.workEmailAddressError = null;
    if (this.contactDetailsFormGroup.invalid) {
      if (this.contactDetailsFormGroup.get('firstName').errors) {
        this.validationErrors.push({
          id: 'first-name',
          message: ContactDetailsErrorMessage.FIRST_NAME
        });
        this.firstNameError = ContactDetailsErrorMessage.FIRST_NAME;
      }
      if (this.contactDetailsFormGroup.get('lastName').errors) {
        this.validationErrors.push({
          id: 'last-name',
          message: ContactDetailsErrorMessage.LAST_NAME
        });
        this.lastNameError = ContactDetailsErrorMessage.LAST_NAME;
      }
      if (this.contactDetailsFormGroup.get('workEmailAddress').errors) {
        this.validationErrors.push({
          id: 'work-email-address',
          message: ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS
        });
        this.workEmailAddressError = ContactDetailsErrorMessage.WORK_EMAIL_ADDRESS;
      }
      return false;
    }
    return true;
  }
}
