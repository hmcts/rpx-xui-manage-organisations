import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/index';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-registered-regulator',
  templateUrl: './registered-regulator.component.html'
})
export class RegisteredRegulatorComponent extends RegisterComponent implements OnInit {
  public regulatoryOrganisationFormGroup: FormGroup;

  constructor(private readonly lovRefDataService: LovRefDataService,
    public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService) {
    super(router, registerOrgService);
  }

  ngOnInit(): void {
    super.ngOnInit();
  }

  public onContinue(): void {
    // Note: optional currently a placeholder to make the route work
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
  }

  public onBack(): void {
    if (this.getPreviousUrl().includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }
}
