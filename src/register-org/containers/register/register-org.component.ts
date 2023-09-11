import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegistrationData } from '../../models/registrationdata.model';
import { RegisterOrgService } from '../../services/index';

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register-org.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService) {}

  public registrationData: RegistrationData;

  public ngOnInit(): void {
    this.registrationData = this.registerOrgService.getRegisterData();
  }

  public ngOnDestroy(): void {
    this.registerOrgService.persistRegistrationData(this.registrationData);
  }

  public cancelRegistrationJourney(): void {
    console.log('ONE');
    const confirmed = window.confirm('Cancel would erase all the data you have entered and exit from the registration journey. Are you sure you want to continue?');
    console.log('CONFIRMED', confirmed);
    if (confirmed) {
      console.log('INSIDE IF');
      this.registerOrgService.removeRegistrationData();
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'register']);
    }
    console.log('DONE');
  }
}
