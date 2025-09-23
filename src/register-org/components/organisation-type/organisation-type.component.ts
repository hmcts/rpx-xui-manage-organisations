import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppUtils } from '../../../app/utils/app-utils';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers';
import { OrgTypeMessageEnum } from '../../models/organisation-type.enum';
import { RegisterOrgService } from '../../services';

@Component({
    selector: 'app-organisation-type',
    templateUrl: './organisation-type.component.html',
    standalone: false
})
export class OrganisationTypeComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public readonly CATEGORY_ORGANISATION_TYPE = 'OrgType';

  public organisationTypeFormGroup: FormGroup;
  public organisationTypeErrors: { id: string, message: string }[] = [];
  public otherOrgTypeErrors: { id: string, message: string };
  public otherOrgDetailsErrors: { id: string, message: string };
  public organisationTypes: LovRefDataModel[];
  public otherOrganisationTypes: LovRefDataModel[];
  public subscription: Subscription;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService,
    public readonly registerOrgService: RegisterOrgService,
    public readonly router: Router) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.organisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(this.registrationData.organisationType?.key, Validators.required),
      otherOrganisationType: new FormControl(this.registrationData.otherOrganisationType?.key),
      otherOrganisationDetail: new FormControl(this.registrationData.otherOrganisationDetail)
    });
    if (this.registrationData.organisationType?.key !== 'OTHER') {
      this.organisationTypeFormGroup.get('otherOrganisationType').setValue('none');
      this.organisationTypeFormGroup.get('otherOrganisationDetail').setValue('');
    } else {
      this.showOtherOrganisationTypes = true;
    }

    this.subscription = this.lovRefDataService.getListOfValues(this.CATEGORY_ORGANISATION_TYPE, true).subscribe((orgTypes) => {
      this.organisationTypes = AppUtils.setOtherAsLastOption(orgTypes);

      const otherTypes = orgTypes.find((orgType) => orgType.key === 'OTHER').child_nodes;
      this.otherOrganisationTypes = otherTypes;
    }, () => this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'service-down']));
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      // Choose known orgType from radio
      const orgTypeSelected = {
        key: this.organisationTypeFormGroup.get('organisationType').value,
        description: this.organisationTypes.find((orgType) => orgType.key === this.organisationTypeFormGroup.get('organisationType').value).value_en
      };
      this.registrationData.organisationType = orgTypeSelected;
      this.registrationData.otherOrganisationType = null;
      this.registrationData.otherOrganisationDetail = null;
      if (this.showOtherOrganisationTypes) {
        // Other type selected from dropdown
        const otherOrgTypeSelected = {
          key: this.organisationTypeFormGroup.get('otherOrganisationType').value,
          description: this.otherOrganisationTypes.find((orgType) => orgType.key === this.organisationTypeFormGroup.get('otherOrganisationType').value).value_en
        };
        this.registrationData.otherOrganisationType = otherOrgTypeSelected;
        this.registrationData.otherOrganisationDetail = this.organisationTypeFormGroup.get('otherOrganisationDetail').value;
      }
      this.registerOrgService.persistRegistrationData(this.registrationData);
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'company-house-details']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE]);
    }
  }

  private isFormValid(): boolean {
    this.organisationTypeErrors = [];
    this.otherOrgTypeErrors = null;
    this.otherOrgDetailsErrors = null;
    if (this.organisationTypeFormGroup.invalid) {
      this.organisationTypeErrors.push({
        id: 'govuk-radios',
        message: OrgTypeMessageEnum.NO_ORG_SELECTED
      });
    }
    if (this.showOtherOrganisationTypes && this.organisationTypeFormGroup.get('otherOrganisationType').value === 'none') {
      this.otherOrgTypeErrors = {
        id: 'other-organisation-type',
        message: OrgTypeMessageEnum.NO_ORG_TYPE_SELECTED
      };
      this.organisationTypeErrors.push(this.otherOrgTypeErrors);
    }
    if (this.showOtherOrganisationTypes && this.organisationTypeFormGroup.get('otherOrganisationDetail').value === '') {
      this.otherOrgDetailsErrors = {
        id: 'other-organisation-detail',
        message: OrgTypeMessageEnum.NO_ORG_DETAIS
      };
      this.organisationTypeErrors.push(this.otherOrgDetailsErrors);
    }
    if (this.organisationTypeErrors.length > 0) {
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    return this.organisationTypeErrors.length === 0;
  }

  public canShowOtherOrganisationTypes(state: boolean) {
    this.organisationTypeErrors = [];
    this.showOtherOrganisationTypes = state;
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
    super.ngOnDestroy();
  }
}
