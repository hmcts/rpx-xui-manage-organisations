import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup } from '@angular/forms';
import { ErrorMessagesModel } from '@hmcts/rpx-xui-common-lib';

@Component({
  selector: 'app-prd-pba-number-input-component',
  templateUrl: './pba-number-input.component.html',
  standalone: false
})
export class PbaNumberInputComponent implements OnInit {
  public static PBA_GENERIC_ERROR_MESSAGE = ['There is a problem. Enter a PBA number, for example PBA1234567'];
  public static PBA_UNIQUE_ERROR_MESSAGE = ['You have entered this PBA number more than once'];
  public static PBA_EXISTING_ERROR_MESSAGE = ['This PBA number is already associated with your organisation'];

  @Input() public id: string;
  @Input() public group: FormGroup;

  public control: FormControl;

  public errorMessages: ErrorMessagesModel = {
    isInvalid: false,
    messages: []
  };

  public ngOnInit(): void {
    if (!this.group) {
      return;
    }

    this.group.valueChanges.subscribe(() => this.onPbaNumberValueChange());
  }

  private onPbaNumberValueChange(): void {
    const control: AbstractControl = this.group.get('pbaNumber');

    if (!control) {
      return;
    }

    control.patchValue(this.formatPbaNumber(control), { emitEvent: false });

    this.errorMessages.isInvalid = control.invalid;
    this.errorMessages.messages = control.invalid ? this.generateErrorMessage(control) : [];
  }

  private generateErrorMessage(control: AbstractControl): string[] {
    if (control.errors.unique) {
      return PbaNumberInputComponent.PBA_UNIQUE_ERROR_MESSAGE;
    }

    if (control.errors.noneOf) {
      return PbaNumberInputComponent.PBA_EXISTING_ERROR_MESSAGE;
    }

    return PbaNumberInputComponent.PBA_GENERIC_ERROR_MESSAGE;
  }

  private formatPbaNumber(control: AbstractControl): string {
    const value = control.value as string;
    let cleanedValue = value.trim().toUpperCase();

    if (!cleanedValue.startsWith('PBA') && cleanedValue.length !== 0) {
      cleanedValue = `PBA${cleanedValue}`;
    }

    return cleanedValue;
  }
}
