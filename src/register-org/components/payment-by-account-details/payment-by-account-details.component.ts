import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { PbaErrorMessage } from '../../models';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-payment-by-account-details',
  templateUrl: './payment-by-account-details.component.html'
})
export class PaymentByAccountDetailsComponent extends RegisterComponent implements OnInit {
  public pbaDetailsFormGroup: FormGroup;
  public validationErrors: { id: string, message: string }[] = [];

  public summaryErrors: {
    header: string;
    isFromValid: boolean;
    items: {
      id: string;
      message: any;
    }[]
  };

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
    this.pbaDetailsFormGroup.valueChanges.subscribe((value) => {
      if (!value) {
        return;
      }

      if (this.pbaDetailsFormGroup.invalid) {
        this.generateSummaryErrorMessage();
      } else {
        this.clearSummaryErrorMessage();

        if (!value.pbaNumbers) {
          return;
        }
      }
    });
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
    if (this.isFormValid()) {
      const pbaNumbers = this.pbaDetailsFormGroup.value.pbaNumbers.filter((pba) => pba.pbaNumber !== '');
      this.registrationData.pbaNumbers = pbaNumbers.map((pba) => pba.pbaNumber && pba.pbaNumber.length === 7 ? `PBA${pba.pbaNumber}` : pba.pbaNumber);
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
        validators: this.getPbaNumberValidators(),
        updateOn: 'blur'
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
        return { error: 'Enter a valid PBA number' };
      }
      return null;
    };
  }

  private isFormValid(): boolean {
    this.refreshValidation();
    if (!this.pbaDetailsFormGroup.valid) {
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
    const items = this.pbaNumbers.controls.map((control: AbstractControl, index: number) => {
      if (control.valid) {
        return {
          id: `pba-number-${index}`,
          message: ''
        };
      }

      const controlErrors = control.get('pbaNumber').errors;
      if (!controlErrors) {
        return;
      }

      let message: string = PbaErrorMessage.GENERIC_ERROR_MESSAGE;
      if (controlErrors.unique) {
        message = PbaErrorMessage.UNIQUE_ERROR_MESSAGE;
      } else if (controlErrors.noneOf) {
        message = PbaErrorMessage.EXISTING_PBA_NUMBER;
      }

      return {
        id: `pba-number-${index}`,
        message
      };
    }).filter((i) => i);

    if (items.length === 0) {
      this.clearSummaryErrorMessage();
      return;
    }

    if (items.filter((item) => item.message !== '')?.length > 0) {
      this.summaryErrors = {
        isFromValid: false,
        header: 'There is a problem',
        items
      };
      this.validationErrors = this.summaryErrors.items.filter((item) => item.message !== '');
    }
  }

  private clearSummaryErrorMessage(): void {
    this.summaryErrors = null;
    this.validationErrors = [];
  }
}
