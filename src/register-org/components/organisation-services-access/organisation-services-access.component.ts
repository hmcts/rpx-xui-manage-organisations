import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { SERVICES_REF_DATA } from '../../__mocks__';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-organisation-services-access',
  templateUrl: './organisation-services-access.component.html'
})
export class OrganisationServicesAccessComponent extends RegisterComponent implements OnInit, OnDestroy {
  public readonly CATEGORY_SERVICE_ACCESS = 'Service';
  public servicesFormGroup: FormGroup;
  public lovRefDataSubscription: Subscription;
  public services: LovRefDataModel[] = [];
  public selectedServices: string[] = [];

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly lovRefDataService: LovRefDataService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.services = SERVICES_REF_DATA;
    // TODO: Integration with ref data
    //  1. Delete the above line where it uses the mock data
    //  2. Uncomment the below lines to integrate with Ref data
    // this.lovRefDataService.getListOfValues(this.CATEGORY_SERVICE_ACCESS, false).subscribe((lov) => {
    //   this.services = lov;
    // });

    this.servicesFormGroup = new FormGroup({
      services: new FormControl(null)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();

    if (this.lovRefDataSubscription) {
      this.lovRefDataSubscription.unsubscribe();
    }
  }

  public onServicesSelectionChange(event: any): void {
    if (event.target.checked) {
      this.services.find((service) => service.value_en === event.target.value).selected = true;
    } else {
      this.services.find((service) => service.value_en === event.target.value).selected = false;
    }
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.selectedServices = this.services.filter((service) => service.selected).map((service) => service.value_en);
      // Set corresponding registration data
      this.registrationData.services = this.selectedServices;
      // Navigate to collect payment by account details
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account']);
    }
  }

  public onBack(): void {
    if (this.getPreviousUrl()?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'regulatory-organisation-type']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    // TODO: The functionality of setting the checkbox selections
    //  based on the values from registration data will be handled
    // in a separate JIRA ticket
  }

  private isFormValid(): boolean {
    // TODO: Validation to be handled in a separate JIRA ticket
    return true;
  }
}
