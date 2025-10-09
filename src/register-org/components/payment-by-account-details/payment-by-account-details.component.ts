import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { PbaErrorMessage } from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
    selector: 'app-payment-by-account-details',
    templateUrl: './payment-by-account-details.component.html',
    standalone: false
})
export class PaymentByAccountDetailsComponent extends RegisterComponent implements OnInit {
  public pbaDetailsFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];
  public displayErrorBanner = false;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    private readonly fb: FormBuilder
  ) {
    super(router, registerOrgService);
  }

  public ngOnInit(): void {
    super.ngOnInit();

    this.pbaDetailsFormGroup = new FormGroup({
      pbaNumbers: this.fb.array([])
    });
    this.hydratePbaFormFromExistingPendingAddPbas();
    if (this.registrationData.pbaNumbers?.length === 0) {
      this.onAddNewPBANumber();
    }
  }

  private hydratePbaFormFromExistingPendingAddPbas(): void {
    this.registrationData.pbaNumbers.forEach((pbaNumber) => {
      this.pbaNumbers.push(this.newPbaNumber(pbaNumber));
    });
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    this.formatPbaNumbers();
    if (this.isFormValid()) {
      const pbaNumbers = this.pbaDetailsFormGroup.value.pbaNumbers.filter((pba) => pba.pbaNumber !== '');
      this.registrationData.pbaNumbers = pbaNumbers.map((pba) => pba.pbaNumber);
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public onBack(): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'payment-by-account']);
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public get pbaNumbers(): FormArray {
    return this.pbaDetailsFormGroup.get('pbaNumbers') as FormArray;
  }

  public onAddNewPBANumber(): void {
    this.pbaNumbers.push(this.newPbaNumber());
  }

  public onRemovePBANumber(i: number): void {
    this.pbaNumbers.removeAt(i);
    this.refreshValidation();
  }

  private newPbaNumber(value: string = ''): FormGroup {
    return this.fb.group({
      pbaNumber: new FormControl(value, {
        validators: this.getPbaNumberValidators()
      })
    });
  }

  private getPbaNumberValidators(): ValidatorFn[] {
    return [
      Validators.pattern(/(PBA\w*)/i),
      Validators.minLength(10),
      Validators.maxLength(10),
      this.getPBANumbersCustomValidator(),
      RxwebValidators.unique()
    ];
  }

  private getPBANumbersCustomValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value && isNaN(Number(control.value.substring(3)))) {
        return { error: PbaErrorMessage.GENERIC_ERROR_MESSAGE };
      }
      return null;
    };
  }

  private formatPbaNumbers(): void {
    this.pbaNumbers.controls.forEach((pba) => {
      let pbaNumber = pba.get('pbaNumber').value.toUpperCase();
      if (pbaNumber.length > 0) {
        if (!pbaNumber.startsWith('PBA')) {
          pbaNumber = `PBA${pbaNumber}`;
        }
      }
      pba.get('pbaNumber').setValue(pbaNumber);
    });
  }

  private isFormValid(): boolean {
    if (!this.pbaDetailsFormGroup.valid) {
      this.generateSummaryErrorMessage();
      return false;
    }
    return true;
  }

  private refreshValidation(): void {
    this.pbaNumbers.controls.forEach((c: AbstractControl) => {
      const pbaControl = c.get('pbaNumber');
      pbaControl.setValidators(this.getPbaNumberValidators());
      pbaControl.updateValueAndValidity();
    });

    this.generateSummaryErrorMessage();
  }

  private generateSummaryErrorMessage(): void {
    this.validationErrors = [];
    for (let index = 0; index < this.pbaNumbers.controls.length; index++) {
      const control: AbstractControl = this.pbaNumbers.controls[index];
      this.validationErrors.push({
        id: `pba-number-${index}`,
        message: this.getValidationError(control)
      });
    }
    this.displayErrorBanner = this.validationErrors?.filter((error) => error.message !== '').length > 0;
  }

  private getValidationError(control: AbstractControl): string {
    const controlErrors = control.get('pbaNumber').errors;
    if (control.valid || !controlErrors) {
      return '';
    }
    if (controlErrors?.unique) {
      return PbaErrorMessage.UNIQUE_ERROR_MESSAGE;
    }
    if (controlErrors?.noneOf) {
      return PbaErrorMessage.EXISTING_PBA_NUMBER;
    }
    return PbaErrorMessage.GENERIC_ERROR_MESSAGE;
  }
}
