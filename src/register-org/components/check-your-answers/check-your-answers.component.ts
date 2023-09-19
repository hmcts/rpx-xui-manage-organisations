import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
import { RegulatoryType } from '../../models/regulatory-organisation.enum';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html'
})
export class CheckYourAnswersComponent extends RegisterComponent implements OnInit {
  public cyaFormGroup: FormGroup;
  public regulatoryType = RegulatoryType;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly route: ActivatedRoute,
  ) {
    super(router, registerOrgService);

    this.cyaFormGroup = new FormGroup({
      confirmTermsAndConditions: new FormControl(null, Validators.required)
    });
  }

  public ngOnInit(): void {
    super.ngOnInit();

    if (this.registrationData) {
      this.registrationData.address = {
        addressLine1: '102 Petty France',
        postTown: 'Westminster',
        county: 'Greater London',
        postCode: 'SW1H 9AJ',
        country: 'England'
      };
      this.registrationData.pbaNumbers = [
        '12345678',
        '87654321',
        '13572468',
        '86427531'
      ];
    }
  }

  public onBack(): void {
    if (this.registrationData.hasIndividualRegisteredWithRegulator) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator-details']);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'individual-registered-with-regulator']);
    }
  }
}
