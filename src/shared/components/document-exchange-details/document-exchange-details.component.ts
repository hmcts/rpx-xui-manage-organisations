import { Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

export interface DocumentExchangeDetails {
  dxNumber: string;
  dxExchange: string;
}

@Component({
  selector: 'app-document-exchange-details',
  templateUrl: './document-exchange-details.component.html',
  standalone: false
})
export class DocumentExchangeDetailsComponent implements OnChanges {
  @Input() public caption: string = '';
  @Input() public dxNumber: string | null = null;
  @Input() public dxExchange: string | null = null;
  @Input() public useMainWrapperBackLink = false;
  @Input() public dxExchangeMaxLength = 20;
  @Input() public requirePairedDetails = false;

  @Output() public readonly submitted = new EventEmitter<DocumentExchangeDetails>();
  @Output() public readonly backRequested = new EventEmitter<void>();
  @Output() public readonly cancelled = new EventEmitter<void>();

  @ViewChild('mainContent') public mainContentElement: ElementRef | undefined;

  public formGroup = new FormGroup({
    dxNumber: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(13)
    }),
    dxExchange: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(20)
    })
  });

  public validationErrors: { id: string, message: string }[] = [];
  public dxNumberError: { id: string, message: string } | null = null;
  public dxExchangeError: { id: string, message: string } | null = null;

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.dxExchangeMaxLength) {
      this.formGroup.controls.dxExchange.setValidators(Validators.maxLength(this.dxExchangeMaxLength));
      this.formGroup.controls.dxExchange.updateValueAndValidity({ emitEvent: false });
    }
    if (changes.dxNumber || changes.dxExchange) {
      this.formGroup.patchValue({
        dxNumber: this.dxNumber ?? '',
        dxExchange: this.dxExchange ?? ''
      }, { emitEvent: false });
    }
  }

  public onContinue(): void {
    if (!this.validateForm()) {
      return;
    }
    this.submitted.emit(this.formGroup.getRawValue());
  }

  private validateForm(): boolean {
    this.validationErrors = [];
    this.dxNumberError = null;
    this.dxExchangeError = null;

    const { dxNumber, dxExchange } = this.formGroup.getRawValue();
    if (this.formGroup.controls.dxNumber.invalid || (this.requirePairedDetails && dxNumber && !dxNumber.trim())) {
      this.dxNumberError = { message: 'Enter valid DX number', id: 'dx-number' };
    } else if (this.requirePairedDetails && dxExchange.trim() && !dxNumber) {
      this.dxNumberError = { message: 'Enter DX number', id: 'dx-number' };
    }
    if (this.dxNumberError) {
      this.validationErrors.push(this.dxNumberError);
    }
    if (this.formGroup.controls.dxExchange.invalid || (this.requirePairedDetails && dxExchange && !dxExchange.trim())) {
      this.dxExchangeError = { message: 'Enter valid DX exchange', id: 'dx-exchange' };
    } else if (this.requirePairedDetails && dxNumber.trim() && !dxExchange) {
      this.dxExchangeError = { message: 'Enter DX exchange', id: 'dx-exchange' };
    }
    if (this.dxExchangeError) {
      this.validationErrors.push(this.dxExchangeError);
    }
    if (this.validationErrors.length) {
      this.mainContentElement?.nativeElement.scrollIntoView({ behavior: 'smooth' });
    }
    return this.validationErrors.length === 0;
  }
}
