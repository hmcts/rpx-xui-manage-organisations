import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { ORGANISATION_TYPES_REF_DATA, OTHER_ORGANISATION_TYPES_REF_DATA } from '../../__mocks__';
import { RegisterOrgService } from '../../services';

@Component({
  selector: 'app-organisation-type',
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent implements OnInit {
  public readonly CATEGORY_ORGANISATION_TYPE = 'OrgType';
  public readonly CATEGORY_OTHER_ORGANISATION_TYPE = 'OrgSubType';

  public organisationTypeFormGroup: FormGroup;
  public organisationTypes$: Observable<LovRefDataModel[]>;
  public otherOrganisationTypes$: Observable<LovRefDataModel[]>;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService,
    public readonly registerOrgService: RegisterOrgService,
    public readonly router: Router) {}

  public ngOnInit(): void {
    this.organisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(null),
      otherOrganisationType: new FormControl(null),
      otherOrganisationDetail: new FormControl(null)
    });
    this.organisationTypeFormGroup.get('otherOrganisationType').setValue('none');

    this.organisationTypes$ = of(ORGANISATION_TYPES_REF_DATA);
    this.otherOrganisationTypes$ = of(OTHER_ORGANISATION_TYPES_REF_DATA);
    // TODO: Integration with ref data
    //  1. Delete the above two lines where it uses the mock data
    //  2. Uncomment the below two lines to integrate with Ref data
    // this.organisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY_ORGANISATION_TYPE, false);
    // this.otherOrganisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY_OTHER_ORGANISATION_TYPE, false);
  }

  public onContinue(): void {
    const organisationType = this.organisationTypeFormGroup.get('organisationType').value;
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-type'],
    { state: { organisationType } });
  }

  public canShowOtherOrganisationTypes(state: boolean) {
    this.showOtherOrganisationTypes = state;
  }
}
