import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-company-house-details',
  templateUrl: './company-house-details.component.html'
})
export class CompanyHouseDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
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
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address']);
  }
}
