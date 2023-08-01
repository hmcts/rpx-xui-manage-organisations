import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-document-exchange-reference-details',
  templateUrl: './document-exchange-reference-details.component.html'
})
export class DocumentExchangeReferenceDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  public dxFormGroup: FormGroup;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.dxFormGroup = new FormGroup({
      dxNumber: new FormControl(null),
      dxExchange: new FormControl(null)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    this.registrationData.dxNumber = this.dxFormGroup.get('dxNumber').value;
    this.registrationData.dxExchange = this.dxFormGroup.get('dxExchange').value;
    // TODO: Navigate to office address page
    // Navigating to Before you start page just to reflect the session storage update
    this.router.navigate(['register-org-new', 'before-you-start']);
  }

  public setFormControlValues(): void {
    if (this.registrationData.dxNumber) {
      this.dxFormGroup.get('dxNumber').setValue(this.registrationData.dxNumber);
    }

    if (this.registrationData.dxExchange) {
      this.dxFormGroup.get('dxExchange').setValue(this.registrationData.dxExchange);
    }
  }
}
