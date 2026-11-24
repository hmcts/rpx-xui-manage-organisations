import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-registration-submitted',
  templateUrl: './registration-submitted.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class RegistrationSubmittedComponent implements OnInit {
  constructor(public readonly registerOrgService: RegisterOrgService) {
  }

  public ngOnInit(): void {
    this.registerOrgService.removeRegistrationData();
  }
}
