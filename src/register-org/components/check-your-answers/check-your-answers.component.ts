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
  }
}
