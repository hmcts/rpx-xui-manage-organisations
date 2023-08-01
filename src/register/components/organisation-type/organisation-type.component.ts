import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';

@Component({
  selector: 'app-organisation-type',
  templateUrl: './organisation-type.component.html'
})
export class OrganisationTypeComponent implements OnInit {
  public readonly CATEGORY = 'OrgType';

  public otherOrganisationTypes$: Observable<LovRefDataModel[]>;
  public showOtherOrganisationTypes = false;

  constructor(private readonly lovRefDataService: LovRefDataService) {}

  public ngOnInit(): void {
    this.otherOrganisationTypes$ = this.lovRefDataService.getListOfValues(this.CATEGORY, true);
  }

  public canShowOtherOrganisationTypes(state: boolean) {
    this.showOtherOrganisationTypes = state;
  }
}
