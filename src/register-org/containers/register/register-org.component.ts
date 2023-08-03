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
}
