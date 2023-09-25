import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-document-exchange-reference',
  templateUrl: './document-exchange-reference.component.html'
})
export class DocumentExchangeReferenceComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('errorSummaryTitleElement') public errorSummaryTitleElement: ElementRef;

  public dxFormGroup: FormGroup;
  public dxError: ErrorMessage;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.dxFormGroup = new FormGroup({
      documentExchange: new FormControl(null, Validators.required)
    });

    this.setFormControlValues();
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      if (this.dxFormGroup.get('documentExchange').value === 'yes') {
        // Set corresponding registration data
        this.registrationData.hasDxReference = true;
        // Navigate to collect DX details
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference-details']);
      } else {
        // Set corresponding registration data
        this.registrationData.hasDxReference = false;
        // Navigate to office address page
        this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'office-addresses']);
      }
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigateByUrl(previousUrl);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address', 'external']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    if (this.registrationData.hasDxReference !== null) {
      if (this.registrationData.hasDxReference) {
        this.dxFormGroup.get('documentExchange').setValue('yes');
      } else {
        this.dxFormGroup.get('documentExchange').setValue('no');
      }
    }
  }

  private isFormValid(): boolean {
    if (this.dxFormGroup.invalid) {
      this.dxError = {
        description: 'Please select at least one option',
        title: '',
        fieldId: 'document-exchange-yes'
      };
      this.errorSummaryTitleElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
      return false;
    }
    return true;
  }
}
