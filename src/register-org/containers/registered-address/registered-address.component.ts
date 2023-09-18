import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { INTERNATIONAL_HEADING, POSTCODE_HEADING } from '../../constants/register-org-constants';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-registered-address',
  templateUrl: './registered-address.component.html'
})
export class RegisteredAddressComponent extends RegisterComponent implements OnInit, OnDestroy {
  public formGroup = new FormGroup({});
  public startedInternational = false;
  public headingText = POSTCODE_HEADING;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(): void {
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address']);
  }

  public onInternationalModeStart(): void {
    this.startedInternational = true;
    this.headingText = INTERNATIONAL_HEADING;
  }
}
