import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../../register-org/containers';
import { ORGANISATION_SERVICES } from '../../constants/register-org-constants';
import { RegulatorType, RegulatoryType } from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-check-your-answers',
  templateUrl: './check-your-answers.component.html'
})
export class CheckYourAnswersComponent extends RegisterComponent implements OnInit {
  public cyaFormGroup: FormGroup;
  public regulatorType = RegulatorType;
  public regulatoryType = RegulatoryType;
  public services: string[] = [];

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.cyaFormGroup = new FormGroup({
      confirmTermsAndConditions: new FormControl(null, Validators.required)
    });

    this.registrationData.services?.forEach((serviceKey) => {
      const service = ORGANISATION_SERVICES.find((service) => service.key === serviceKey).value;
      this.services.push(service);
    });
    if (this.registrationData.otherServices) {
      this.services.push(`Other: ${this.registrationData.otherServices}`);
    }
  }

  public onBack() {
    this.navigateToPreviousPage();
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
