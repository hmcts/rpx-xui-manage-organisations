import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { OrganisationService, OrganisationServicesMessage } from '../../../register-org/models';
import { ORGANISATION_SERVICES } from '../../constants/register-org-constants';
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
  public services: OrganisationService[];
  public selectedServices: OrganisationService[];
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
      services: new FormArray([]),
      otherServices: new FormControl(null)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onServicesSelectionChange(event: any): void {
    if (event.target.checked) {
      this.selectedServices.push({ key: event.target.value, value: event.target.id });
    } else {
      const serviceIndex = this.selectedServices.findIndex((service) => service.key === event.target.value);
      this.selectedServices.splice(serviceIndex, 1);
    }
    this.showOtherServicesInput = this.selectedServices.filter((service) => service.key === 'NONE').length > 0;
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      // Set corresponding registration data
      this.registrationData.services = this.selectedServices.filter((service) => service.key && service.key !== 'NONE');

      this.registrationData.otherServices = this.showOtherServicesInput
        ? this.servicesFormGroup.get('otherServices').value
        : null;

      // Navigate to collect payment by account details
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account']);
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'regulatory-organisation-type']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  private setFormControlValues(): void {
    this.selectedServices = this.registrationData.services;
    this.services.forEach((service) => {
      service.selected = this.selectedServices.find((thisService) => thisService.key === service.key) !== undefined;
    });
    if (this.registrationData.otherServices) {
      this.showOtherServicesInput = true;
      this.selectedServices.push({ key: 'NONE', value: '' });
      this.services.find((service) => service.key === 'NONE').selected = true;
      this.servicesFormGroup.get('otherServices').setValue(this.registrationData.otherServices);
    }
  }

  private isFormValid(): boolean {
    this.validationErrors = [];
    this.noServicesError = null;
    this.otherServicesError = null;
    if (!this.selectedServices.length && !this.showOtherServicesInput) {
      this.validationErrors.push({
        id: this.services[0].value,
        message: OrganisationServicesMessage.NO_ORG_SERVICES
      });
      this.noServicesError = OrganisationServicesMessage.NO_ORG_SERVICES;
    }
    if (this.showOtherServicesInput && !this.servicesFormGroup.get('otherServices').value) {
      this.validationErrors.push({
        id: 'other-services',
        message: OrganisationServicesMessage.OTHER_SERVICES
      });
      this.otherServicesError = OrganisationServicesMessage.OTHER_SERVICES;
    }
    return this.validationErrors.length === 0;
  }
}
