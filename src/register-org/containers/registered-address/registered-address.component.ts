import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressModel } from '@hmcts/rpx-xui-common-lib';
import { AddressEntryResult } from '../../../shared/components/address-entry/address-entry.component';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-registered-address',
  templateUrl: './registered-address.component.html',
  standalone: false
})
export class RegisteredAddressComponent extends RegisterComponent implements OnInit, OnDestroy {
  public isInternal = false;
  public initialAddress: AddressModel | null = null;
  public initialInternationalMode = false;

  constructor(
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    public readonly route: ActivatedRoute
  ) {
    super(router, registerOrgService);
    this.isInternal = this.route.snapshot.params.internal === 'internal';
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.initialAddress = this.registrationData.address;
    this.initialInternationalMode = Boolean(this.registrationData.inInternationalMode);
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(result: AddressEntryResult): void {
    this.registrationData.address = result.address;
    this.registrationData.inInternationalMode = result.inInternationalMode;
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(resetAddressEntry: boolean): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      void this.router.navigate([
        this.registerOrgService.REGISTER_ORG_NEW_ROUTE,
        this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE
      ]);
    } else if (resetAddressEntry) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address', 'external']);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'company-house-details']);
    }
  }
}
