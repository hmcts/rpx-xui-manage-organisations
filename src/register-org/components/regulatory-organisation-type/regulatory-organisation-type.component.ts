import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegulatoryType } from 'src/register-org/models';
import { RegulatoryOrganisationType } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/index';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent extends RegisterComponent implements OnInit {
  public regulatoryOrganisationTypeFormGroup: FormGroup;
  public organisationTypes$: Observable<RegulatoryOrganisationType[]>;
  public showRegistrationNumber: boolean;
  public showRegulatorName: boolean;
  public showAddRegulatorButton: boolean;

  constructor(private readonly lovRefDataService: LovRefDataService,
      public readonly router: Router,
      public readonly registerOrgService: RegisterOrgService) {
    super(router, registerOrgService);
  }

  ngOnInit(): void {
    this.regulatoryOrganisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(null),
      otherOrganisationType: new FormControl(null)
    });
    this.regulatoryOrganisationTypeFormGroup.get('otherOrganisationType').setValue('none');
    this.organisationTypes$ = this.lovRefDataService.getRegulatoryOrganisationType();
  }

  public onOptionSelected(value: string): void {
    this.showRegulatorName = false;
    this.showRegistrationNumber = false;
    this.showAddRegulatorButton = false;
    switch (value) {
      case (RegulatoryType.Other): {
        this.showRegulatorName = true;
        this.showRegistrationNumber = true;
        this.showAddRegulatorButton = true;
        break;
      }
      case (RegulatoryType.NotApplicable): {
        this.showAddRegulatorButton = true;
        break;
      }
      default: {
        this.showRegistrationNumber = true;
        this.showAddRegulatorButton = true;
      }
    }
  }
}
