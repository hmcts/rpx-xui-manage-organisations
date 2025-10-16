import { Component } from '@angular/core';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
    selector: 'app-registration-submitted',
    templateUrl: './registration-submitted.component.html',
    standalone: false
})
export class RegistrationSubmittedComponent {
  constructor(public readonly registerOrgService: RegisterOrgService) {
  }

  public ngOnInit(): void {
    this.registerOrgService.removeRegistrationData();
  }
}
