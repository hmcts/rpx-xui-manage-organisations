import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { RxwebValidators } from '@rxweb/reactive-form-validators';
import { UpdatePbaNumbers } from '../../../organisation/models/update-pba-numbers.model';

@Component({
  selector: 'app-prd-pba-numbers-form-component',
  templateUrl: './pba-numbers-form.component.html',
})
export class PbaNumbersFormComponent implements OnInit {

  public readonly title = 'Add or remove PBA accounts';

  public pbaFormGroup: FormGroup;
  public summaryErrors: {
    header: string;
    isFromValid: boolean;
    items: {
      id: string;
      message: any;
    }[]
  };

  @Input()
  public updatePbaNumbers: UpdatePbaNumbers;

  constructor(private readonly fb: FormBuilder) { }

  ngOnInit() {
    this.initialiseForm();
  }

  get pbaNumbers(): FormArray {
    return this.pbaFormGroup.get('pbaNumbers') as FormArray;
  }

  public onAddNewBtnClicked(): void {
    this.pbaNumbers.push(this.newPbaNumber());
  }

  public onRemoveNewPbaNumberClicked(i: number): void {
    this.pbaNumbers.removeAt(i);
  }

  public onRemoveExistingPaymentByAccountNumberClicked(paymentByAccountNumber: string): void {
    this.updatePbaNumbers.addPbaNumberToPendingRemove(paymentByAccountNumber);

    this.pbaNumbers.controls.forEach((c: AbstractControl) => {
      const pbaControl = c.get('pbaNumber');
      pbaControl.setValidators(this.getPbaNumberValidators());
      pbaControl.updateValueAndValidity();
    });

    this.generateSummaryErrorMessage();
  }

  private getPbaNumberValidators(): ValidatorFn[] {
    return [
      Validators.pattern(/(PBA\w*)/i),
      Validators.minLength(10),
      Validators.maxLength(10),
      RxwebValidators.noneOf({
        matchValues: this.updatePbaNumbers.currentPbaNumbers
      }),
      RxwebValidators.unique()
    ]
  }

  private initialiseForm(): void {
    this.pbaFormGroup = new FormGroup({
      pbaNumbers: this.fb.array([])
    });

    this.pbaFormGroup.valueChanges.subscribe((control) => {
      if (!control) return;

      if (this.pbaFormGroup.invalid) this.generateSummaryErrorMessage();
      else {
        this.clearSummaryErrorMessage();

        if (!control.pbaNumber) return;
        this.updatePbaNumbers.addPbaNumberToPendingAdd(control.pbaNumber);
      };
    });
  }

  private newPbaNumber(): FormGroup {
    return this.fb.group({
      pbaNumber: new FormControl('', {
        validators: this.getPbaNumberValidators(),
        updateOn: 'blur'
      }),
    });
  }

  public onSubmit(): void {
    if (!this.pbaFormGroup.valid) {
      return;
    }
  }

  private clearSummaryErrorMessage(): void {
    this.summaryErrors = null;
  }

  private generateSummaryErrorMessage(): void {
    const genericErrorMessage = 'Enter a valid PBA number';
    const existingPbaNumber = 'This PBA number is already associated to your organisation';
    const uniqueErrorMessage = 'You have entered this PBA number more than once';

    const items = this.pbaNumbers.controls
      .map((control: AbstractControl, index: number) => {
        if (control.valid) return;
        const controlErrors = control.get('pbaNumber').errors;

        if (!controlErrors) return;

        let message: string = genericErrorMessage;

        if (controlErrors.unique) message = uniqueErrorMessage;
        else if (controlErrors.noneOf) message = existingPbaNumber;

        return {
          id: `pba-number-input${index}`,
          message
        };
      })
      .filter(i => i);

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
}
