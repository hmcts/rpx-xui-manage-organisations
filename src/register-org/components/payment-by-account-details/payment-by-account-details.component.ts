import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-payment-by-account-details',
  templateUrl: './payment-by-account-details.component.html'
})
export class PaymentByAccountDetailsComponent extends RegisterComponent implements OnInit {
  public pbaDetailsFormGroup: FormGroup;
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
    if (this.registrationData.pbaNumbers && this.registrationData.pbaNumbers.length === 0) {
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
      this.registrationData.pbaNumbers = this.pbaDetailsFormGroup.value.pbaNumbers.map((pba) => pba.pbaNumber && pba.pbaNumber.length === 7 ? `PBA${pba.pbaNumber}` : pba.pbaNumber);
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'contact-details']);
    }
  }

  public onBack(): void {
    this.navigateToPreviousPage();
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public setFormControlValues(): void {
    // TODO: Functionality ticket will follow
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
    // TODO: To be used in the functionality ticket if required
    return [
      Validators.minLength(7),
      Validators.maxLength(10),
      this.getPBANumbersCustomValidator(),
      RxwebValidators.unique()
    ];
  }

  private getPBANumbersCustomValidator(): ValidatorFn {
    // TODO: To be used in the functionality ticket if required
    return (control: AbstractControl): { [key: string]: any } => {
      if (control.value.length === 10 && control.value) {
        if (isNaN(Number(control.value.substring(3)))) {
          return { error: 'Enter a valid PBA number' };
        } else if (control.value.substring(0, 3).toUpperCase() !== 'PBA') {
          return { error: 'Enter a valid PBA number' };
        }
      } else if (control.value.length === 7 && isNaN(Number(control.value))) {
        return { error: 'Enter a valid PBA number' };
      }
      return null;
    };
  }

  private isFormValid(): boolean {
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
    const genericErrorMessage = 'Enter a valid PBA number';
    const existingPbaNumber = 'This PBA number is already associated to your organisation';
    const uniqueErrorMessage = 'You have entered this PBA number more than once';

    const items = this.pbaNumbers.controls
      .map((control: AbstractControl, index: number) => {
        if (control.valid) {
          return;
        }

        const controlErrors = control.get('pbaNumber').errors;

        if (!controlErrors) {
          return;
        }

        let message: string = genericErrorMessage;

        if (controlErrors.unique) {
          message = uniqueErrorMessage;
        } else if (controlErrors.noneOf) {
          message = existingPbaNumber;
        }

        return {
          id: `pba-number-input${index}`,
          message
        };
      })
      .filter((i) => i);

    if (items.length === 0) {
      this.clearSummaryErrorMessage();
      return;
    }

    this.summaryErrors = {
      isFromValid: false,
      header: 'There is a problem',
      items
    };
  }

  private clearSummaryErrorMessage(): void {
    this.summaryErrors = null;
  }
}
