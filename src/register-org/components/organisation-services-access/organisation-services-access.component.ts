import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrganisationServicesMessage } from '../../../register-org/models';
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
  public validationErrors: { id: string, message: string }[] = [];

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly lovRefDataService: LovRefDataService,
    private readonly route: ActivatedRoute
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.services = SERVICES_REF_DATA;
    // TODO: Integration with ref data
    //  1. Delete the above line where it uses the mock data
    //  2. Uncommented the below lines to test service error
    const realApi = this.route.snapshot.queryParams.api;
    if (realApi) {
      this.lovRefDataService.getListOfValues(this.CATEGORY_SERVICE_ACCESS, false).subscribe((lov) => {
        this.services = lov;
      }, (error) => {
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'service-down']);
      });
    }

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

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    this.services.forEach((service) => {
      if (this.registrationData.services.includes(service.value_en)) {
        service.selected = true;
      }
    });
  }

  private isFormValid(): boolean {
    if (!this.services.some((service) => service.selected)) {
      this.validationErrors.push({
        id: this.services[0].key,
        message: OrganisationServicesMessage.NO_ORG_SERVICES
      });
    }
    return this.services.some((service) => service.selected);
  }
}
