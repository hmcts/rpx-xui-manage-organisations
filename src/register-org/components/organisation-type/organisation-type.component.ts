import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { ORGANISATION_TYPES_REF_DATA, OTHER_ORGANISATION_TYPES_REF_DATA } from '../../__mocks__';
import { RegisterComponent } from '../../containers';
import { OrgTypeMessageEnum } from '../../models/organisation-type.enum';
import { RegisterOrgService } from '../../services';

@Component({
  selector: 'app-organisation-type',
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public readonly CATEGORY_ORGANISATION_TYPE = 'OrgType';
  public readonly CATEGORY_OTHER_ORGANISATION_TYPE = 'OrgSubType';

  public organisationTypeFormGroup: FormGroup;
  public organisationTypeErrors: { id: string, message: string }[] = [];
  public otherOrgTypeErrors: { id: string, message: string };
  public otherOrgDetailsErrors: { id: string, message: string };
  public organisationTypes$: Observable<LovRefDataModel[]>;
  public otherOrganisationTypes$: Observable<LovRefDataModel[]>;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService,
    public readonly registerOrgService: RegisterOrgService,
    public readonly router: Router) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();
    this.organisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(this.registrationData.organisationType, Validators.required),
      otherOrganisationType: new FormControl(this.registrationData.otherOrganisationType),
      otherOrganisationDetail: new FormControl(this.registrationData.otherOrganisationDetail)
    });
    if (this.registrationData.organisationType !== 'other') {
      this.organisationTypeFormGroup.get('otherOrganisationType').setValue('none');
      this.organisationTypeFormGroup.get('otherOrganisationDetail').setValue('');
    } else {
      this.showOtherOrganisationTypes = true;
    }

    this.organisationTypes$ = of(ORGANISATION_TYPES_REF_DATA);
    this.otherOrganisationTypes$ = of(OTHER_ORGANISATION_TYPES_REF_DATA);
    // TODO: Integration with ref data
    //  1. Delete the above two lines where it uses the mock data
    //  2. Uncomment the below two lines to integrate with Ref data
    // this.organisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY_ORGANISATION_TYPE, false);
    // this.otherOrganisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY_OTHER_ORGANISATION_TYPE, false);
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.registrationData.organisationType = this.organisationTypeFormGroup.get('organisationType').value;
      this.registrationData.otherOrganisationType = this.showOtherOrganisationTypes ? this.organisationTypeFormGroup.get('otherOrganisationType').value : null;
      this.registrationData.otherOrganisationDetail = this.showOtherOrganisationTypes ? this.organisationTypeFormGroup.get('otherOrganisationDetail').value : null;
      this.registerOrgService.persistRegistrationData(this.registrationData);
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'company-house-details']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
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
    super.ngOnDestroy();
  }
}
