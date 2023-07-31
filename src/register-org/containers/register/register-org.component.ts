import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterOrgService } from '../../services/index';
import { RegistrationData } from '../../models/registrationdata.model';

@Component({
  selector: 'app-prd-register-component',
  templateUrl: './register-org.component.html'
})

export class RegisterComponent implements OnInit, OnDestroy {
  constructor(private readonly router: Router,
    private readonly registerOrgService: RegisterOrgService) {}

  private registrationData: RegistrationData;

  ngOnInit(): void {
    this.registrationData = this.registerOrgService.getRegisterData();
  }

  ngOnDestroy(): void {
    this.registerOrgService.persistRegistrationData(this.registrationData);
  }
}
