import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html'
})
export class CheckYourAnswersComponent extends RegisterComponent implements OnInit {
  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly route: ActivatedRoute,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    // Todo: Test Data, To be deleted
    this.registrationData = {
      name: 'Test organisation name',
      companyHouseNumber: '07911247',
      address: '60 Great Prortland Street, London, TE57NG',
      hasDxReference: true,
      dxNumber: '789MI',
      services: ['Employment Tribunals'],
      organisationType: 'IT & communications',
      organisationNumber: '1234',
      regulatoryOrgType: 'Solicotor Regulation Authority',
      regulatorRegisteredWith: '123456',
      contactDetails: {
        firstName: 'John',
        lastName: 'Davis',
        workEmailAddress: 'John.Davis@testorganisation.com'
      },
      hasPBA: true,
      hasRegisteredWithRegulator: true
    };
    const optional = this.route.snapshot.paramMap.get('optional');
    if (optional === 'false') {
      delete this.registrationData.companyHouseNumber;
      delete this.registrationData.dxNumber;
      delete this.registrationData.organisationNumber;
    }
  }
}
