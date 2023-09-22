import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { ORGANISATION_SERVICES } from 'src/register-org/constants/register-org-constants';
import { OrganisationService, OrganisationServicesMessage } from '../../../register-org/models';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-organisation-services-access',
  templateUrl: './organisation-services-access.component.html'
})
export class OrganisationServicesAccessComponent extends RegisterComponent implements OnInit, OnDestroy {
  public readonly CATEGORY_SERVICE_ACCESS = 'Service';
  public readonly SERVICE_NOT_LISTED = 'ServiceNotListed';
  public servicesFormGroup: FormGroup;
  public services: OrganisationService[] = [];
  public selectedServices: string[] = [];
  public validationErrors: { id: string, message: string }[] = [];
  public noServicesError: string;
  public otherServicesError: string;
  public showOtherServicesInput: boolean;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.services = ORGANISATION_SERVICES;

    this.servicesFormGroup = new FormGroup({
      services: new FormControl(null),
      otherServices: new FormControl(null)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onServicesSelectionChange(event: any): void {
    if (event.target.checked) {
      this.services.find((service) => service.key === event.target.value).selected = true;
    } else {
      this.services.find((service) => service.key === event.target.value).selected = false;
    }
    this.showOtherServicesInput = event.target.checked && event.target.value === 'NONE';
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.selectedServices = this.services.filter((service) => service.selected && service.key !== 'NONE').map((service) => service.key);
      // Set corresponding registration data
      this.registrationData.services = this.selectedServices;

      this.registrationData.otherServices = this.services.find((service) => service.selected && service.key === 'NONE')
        ? this.servicesFormGroup.get('otherServices').value
        : null;

      // Navigate to collect payment by account details
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    this.services.forEach((service) => {
      if (this.registrationData.services.includes(service.key)) {
        service.selected = true;
      }
    });
    if (this.registrationData.otherServices) {
      this.services.find((service) => service.key === 'NONE').selected = true;
      this.showOtherServicesInput = true;
      this.servicesFormGroup.get('otherServices').setValue(this.registrationData.otherServices);
    }
  }

  private isFormValid(): boolean {
    this.validationErrors = [];
    this.noServicesError = null;
    this.otherServicesError = null;
    if (!this.services.some((service) => service.selected) && !this.showOtherServicesInput) {
      this.validationErrors.push({
        id: this.services[0].key,
        message: OrganisationServicesMessage.NO_ORG_SERVICES
      });
      this.noServicesError = OrganisationServicesMessage.NO_ORG_SERVICES;
    }
    if (this.showOtherServicesInput && !this.servicesFormGroup.get('otherServices').value) {
      console.log('SERVICES', this.services);
      this.validationErrors.push({
        id: 'other-services',
        message: OrganisationServicesMessage.OTHER_SERVICES
      });
      this.otherServicesError = OrganisationServicesMessage.OTHER_SERVICES;
    }
    return this.validationErrors.length === 0;
  }
}
