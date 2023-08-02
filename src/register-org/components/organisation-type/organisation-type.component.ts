import { Component, OnInit } from '@angular/core';
import { Observable, of } from 'rxjs';
import { OTHER_ORGANISATION_TYPES_REF_DATA } from 'src/register-org/__mocks__';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-organisation-type',
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent implements OnInit {
  public readonly CATEGORY = 'OrgType';

  public organisationTypeFormGroup: FormGroup;
  public otherOrganisationTypes$: Observable<LovRefDataModel[]>;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService) {}

  public ngOnInit(): void {
    this.organisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(null),
      otherOrganisationType: new FormControl(null),
      otherOrganisationDetail: new FormControl(null)
    });
    this.organisationTypeFormGroup.get('otherOrganisationType').setValue('none');

    this.otherOrganisationTypes$ = of(OTHER_ORGANISATION_TYPES_REF_DATA);
    // TODO: Integration with ref data
    //  1. Delete the above line where it uses the mock data
    //  2. Uncomment the below line to integrate with Ref data
    // this.otherOrganisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY, true);
  }

  public canShowOtherOrganisationTypes(state: boolean) {
    this.showOtherOrganisationTypes = state;
  }
}
