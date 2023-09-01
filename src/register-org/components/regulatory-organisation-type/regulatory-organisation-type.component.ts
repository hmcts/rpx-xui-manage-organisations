import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { FormControl, FormGroup } from '@angular/forms';
import { RegisterOrgService } from '../../services/index';
import { RegulatoryOrganisationType } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent extends RegisterComponent implements OnInit {
  constructor(private readonly lovRefDataService: LovRefDataService,
      public readonly router: Router,
      public readonly registerOrgService: RegisterOrgService) {
    super(router, registerOrgService);
  }

  public regulatoryOrganisationTypeFormGroup: FormGroup;
  public organisationTypes$: Observable<RegulatoryOrganisationType[]>;
  ngOnInit(): void {
    this.regulatoryOrganisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(null),
      otherOrganisationType: new FormControl(null)
    });
    this.regulatoryOrganisationTypeFormGroup.get('otherOrganisationType').setValue('none');
    this.organisationTypes$ = this.lovRefDataService.getRegulatoryOrganisationType();
  }

  public onContinue(): void {
    this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'organisation-services-access']);
  }
}
