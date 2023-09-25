import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
import { RegistrationData } from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html'
})
export class CheckYourAnswersComponent extends RegisterComponent implements OnInit {
  public registrationDataToDisplay: RegistrationData;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly route: ActivatedRoute,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    // Todo: Test Data, To be deleted
    this.registrationDataToDisplay = {
      name: 'Test organisation name',
      companyHouseNumber: '07911247',
      address: { addressLine1: '60 Great Prortland Street', postTown: 'London', country: 'UK', postCode: 'TE57NG' },
      hasDxReference: true,
      dxNumber: '789MI',
      services: ['Employment Tribunals'],
      organisationType: 'IT & communications',
      organisationNumber: '1234',
      regulators: [{
        regulatorType: 'Other',
        regulatorName: 'Solicotor Regulation Authority',
        organisationRegistrationNumber: '1234'
      }],
      regulatorRegisteredWith: '123456',
      contactDetails: {
        firstName: 'John',
        lastName: 'Davis',
        workEmailAddress: 'John.Davis@testorganisation.com'
      },
      hasPBA: true,
      inInternationalMode: false,
      hasIndividualRegisteredWithRegulator: true
    };
    const optional = this.route.snapshot.paramMap.get('optional');
    if (optional === 'false') {
      delete this.registrationData.companyHouseNumber;
      delete this.registrationData.dxNumber;
      delete this.registrationData.organisationNumber;
    }
  }

  public onSubmitData() {
    this.registerOrgService.postRegistration().subscribe(() => {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registration-submitted']);
    },
    ((error) => {
      console.log(error);
    }),);
  }
}
