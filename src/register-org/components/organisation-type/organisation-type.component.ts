import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { ORGANISATION_TYPES_REF_DATA, OTHER_ORGANISATION_TYPES_REF_DATA } from '../../__mocks__';

@Component({
  selector: 'app-organisation-type',
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent implements OnInit {
  public readonly CATEGORY_ORGANISATION_TYPE = 'OrgType';
  public readonly CATEGORY_OTHER_ORGANISATION_TYPE = 'OrgSubType';

  public organisationTypeFormGroup: UntypedFormGroup;
  public organisationTypes$: Observable<LovRefDataModel[]>;
  public otherOrganisationTypes$: Observable<LovRefDataModel[]>;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService) {}

  public ngOnInit(): void {
    this.organisationTypeFormGroup = new UntypedFormGroup({
      organisationType: new UntypedFormControl(null),
      otherOrganisationType: new UntypedFormControl(null),
      otherOrganisationDetail: new UntypedFormControl(null)
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

  public canShowOtherOrganisationTypes(state: boolean) {
    this.showOtherOrganisationTypes = state;
  }
}
