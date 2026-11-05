import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-document-exchange-reference',
  templateUrl: './document-exchange-reference.component.html',
  standalone: false
})
export class DocumentExchangeReferenceComponent extends RegisterComponent implements OnInit, OnDestroy {
  constructor(
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(hasDxReference: boolean): void {
    this.registrationData.hasDxReference = hasDxReference;
    if (hasDxReference) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference-details']);
      return;
    }

    this.registrationData.dxNumber = null;
    this.registrationData.dxExchange = null;
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'regulatory-organisation-type']);
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([
        this.registerOrgService.REGISTER_ORG_NEW_ROUTE,
        this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE
      ]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address', 'internal']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }
}
