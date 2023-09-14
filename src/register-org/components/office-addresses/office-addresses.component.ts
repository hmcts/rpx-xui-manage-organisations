import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers';
import { RegisterOrgService } from '../../services';

@Component({
  selector: 'app-office-addresses',
  templateUrl: './office-addresses.component.html'
})
export class OfficeAddressesComponent extends RegisterComponent {
  constructor(private readonly lovRefDataService: LovRefDataService,
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService) {
    super(router, registerOrgService);
  }

  public onContinue(): void {
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-services-access']);
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }
}
