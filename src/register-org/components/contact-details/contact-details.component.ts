import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html'
})
export class ContactDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  public contactDetailsFormGroup: UntypedFormGroup;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.contactDetailsFormGroup = new UntypedFormGroup({
      firstName: new UntypedFormControl(null),
      lastName: new UntypedFormControl(null),
      workEmailAddress: new UntypedFormControl(null)
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
      // TODO: Navigate to 'Are you (as an individual) registered with a regulator' page
    }
  }

  public setFormControlValues(): void {
    const contactDetails = this.registrationData.contactDetails;
    if (contactDetails) {
      this.contactDetailsFormGroup.get('firstName').setValue(contactDetails.firstName);
      this.contactDetailsFormGroup.get('lastName').setValue(contactDetails.lastName);
      this.contactDetailsFormGroup.get('workEmailAddress').setValue(contactDetails.workEmailAddress);
    }
  }

  public isFormValid(): boolean {
    // TODO: Functionality ticket will follow
    return true;
  }
}
