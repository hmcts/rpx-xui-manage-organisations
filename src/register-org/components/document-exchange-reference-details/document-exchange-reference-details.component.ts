import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DocumentExchangeDetails } from '../../../shared/components/document-exchange-details/document-exchange-details.component';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-document-exchange-reference-details',
  templateUrl: './document-exchange-reference-details.component.html',
  standalone: false
})
export class DocumentExchangeReferenceDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
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

  public onContinue(details: DocumentExchangeDetails): void {
    this.registrationData.dxNumber = details.dxNumber;
    this.registrationData.dxExchange = details.dxExchange;
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
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }
}
