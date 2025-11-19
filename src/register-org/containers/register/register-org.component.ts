import { Component, OnDestroy, OnInit } from '@angular/core';
import { Navigation, Router } from '@angular/router';
import { RegistrationData } from '../../models/registration-data.model';
import { RegisterOrgService } from '../../services/index';

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register-org.component.html',
  standalone: false
})

export class RegisterComponent implements OnInit, OnDestroy {
  private isRegistrationJourneyCancelled = false;
  private routerCurrentNavigation: Navigation;
  public registrationData: RegistrationData;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService) {
    // Angular Router exposes getCurrentNavigation(); currentNavigation is not an invocable function.
    this.routerCurrentNavigation = this.router.getCurrentNavigation?.();
  }

  public get currentNavigation(): Navigation {
    return this.routerCurrentNavigation;
  }

  public ngOnInit(): void {
    this.initialiseRegistrationJourney();
  }

  public ngOnDestroy(): void {
    // Registration data in the session storage must have been deleted if the user cancelled the registration journey
    // and the property "isRegistrationJourneyCancelled" must be true.
    // Persisting registration data is required only if the user continues with the registration journey
    // i.e. registration data already exists in the session storage.
    if (!this.isRegistrationJourneyCancelled) {
      this.registerOrgService.persistRegistrationData(this.registrationData);
    }
  }

  public cancelRegistrationJourney(): void {
    const confirmed = window.confirm('Cancel will erase all the data you have entered and exit from the registration journey. Are you sure you want to continue?');
    if (confirmed) {
      this.isRegistrationJourneyCancelled = true;
      this.registerOrgService.removeRegistrationData();
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'register']);
    }
  }

  private initialiseRegistrationJourney(): void {
    this.isRegistrationJourneyCancelled = false;
    this.registrationData = this.registerOrgService.getRegistrationData();
  }
}
