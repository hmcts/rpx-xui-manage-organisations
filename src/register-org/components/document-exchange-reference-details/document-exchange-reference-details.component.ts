import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DxDetailsMessage } from '../../../register-org/models';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
    selector: 'app-document-exchange-reference-details',
    templateUrl: './document-exchange-reference-details.component.html',
    standalone: false
})
export class DocumentExchangeReferenceDetailsComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public dxFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public dxNumberError: { id: string, message: string };
  public dxExchangeError: { id: string, message: string };

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.dxFormGroup = new FormGroup({
      dxNumber: new FormControl(this.registrationData.dxNumber, Validators.maxLength(13)),
      dxExchange: new FormControl(this.registrationData.dxExchange, Validators.maxLength(20))
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.validateForm()) {
      this.registrationData.dxNumber = this.dxFormGroup.get('dxNumber').value;
      this.registrationData.dxExchange = this.dxFormGroup.get('dxExchange').value;
      // Navigate to office address page
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'regulatory-organisation-type']);
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    if (this.registrationData.dxNumber) {
      this.dxFormGroup.get('dxNumber').setValue(this.registrationData.dxNumber);
    }

    if (this.registrationData.dxExchange) {
      this.dxFormGroup.get('dxExchange').setValue(this.registrationData.dxExchange);
    }
  }

  private validateForm(): boolean {
    this.validationErrors = [];

    if (this.dxFormGroup.invalid) {
      if (this.dxFormGroup.get('dxNumber').invalid) {
        this.dxNumberError = { message: DxDetailsMessage.INVALID_DX_NUMBER, id: 'dx-number' };
        this.validationErrors.push(this.dxNumberError);
      }
      if (this.dxFormGroup.get('dxExchange').invalid) {
        this.dxExchangeError = { message: DxDetailsMessage.INVALID_DX_EXCHANGE, id: 'dx-exchange' };
        this.validationErrors.push(this.dxExchangeError);
      }
      this.mainContentElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    return this.validationErrors.length === 0;
  }
}
