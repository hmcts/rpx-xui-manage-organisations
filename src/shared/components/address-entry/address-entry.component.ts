import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AddressMessageEnum, AddressModel, AddressService } from '@hmcts/rpx-xui-common-lib';
import { postcodeValidator } from '../../../custom-validators/postcode.validator';

const POSTCODE_HEADING = 'What is the registered address of your organisation?';
const INTERNATIONAL_HEADING = 'Is this a UK address?';
const REQUIRED_TEXT_VALIDATORS = [Validators.required, Validators.pattern(/\S/)];

export interface AddressEntryResult {
  address: AddressModel;
  inInternationalMode: boolean;
}

@Component({
  selector: 'app-address-entry',
  templateUrl: './address-entry.component.html',
  providers: [AddressService],
  standalone: false
})
export class AddressEntryComponent implements OnInit, OnChanges {
  @Input() public caption: string = '';
  @Input() public initialAddress: AddressModel | null = null;
  @Input() public initialInternationalMode = false;
  @Input() public showExistingAddress = false;
  @Input() public useMainWrapperBackLink = false;

  @Output() public readonly submitted = new EventEmitter<AddressEntryResult>();
  @Output() public readonly backRequested = new EventEmitter<boolean>();
  @Output() public readonly cancelled = new EventEmitter<void>();

  public formGroup = new FormGroup<any>({});
  public startedInternational = false;
  public addressChosen = false;
  public headingText = POSTCODE_HEADING;
  public isInternational: boolean | undefined = undefined;
  public addressErrors: { id: string, message: string }[] = [];
  public submissionAttempted = false;

  private addressSelectable = false;
  private initialised = false;

  public ngOnInit(): void {
    this.initialiseForm();
    this.initialised = true;
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (this.initialised && (
      changes.initialAddress ||
      changes.initialInternationalMode ||
      changes.showExistingAddress
    )) {
      this.initialiseForm();
    }
  }

  public onContinue(): void {
    if (!this.isFormValid()) {
      this.submissionAttempted = true;
      return;
    }

    const address = { ...this.formGroup.get('address')?.value } as AddressModel;
    if (address.postCode === '') {
      address.postCode = null;
    }

    this.submitted.emit({
      address,
      inInternationalMode: this.startedInternational
    });
  }

  public onBack(resetAddressEntry: boolean): void {
    if (resetAddressEntry) {
      this.resetAddressEntry();
    }
    this.backRequested.emit(resetAddressEntry);
  }

  public onPostcodeOptionSelected(): void {
    this.submissionAttempted = false;
    this.addressChosen = true;
    this.addressErrors = [];
    this.setAddressFormGroup();
  }

  public onInternationalModeStart(): void {
    this.startedInternational = true;
    this.addressChosen = false;
    this.headingText = INTERNATIONAL_HEADING;
    this.addressErrors = [];
    this.isInternational = this.initialInternationalMode && this.initialAddress
      ? this.initialAddress.country !== 'UK'
      : undefined;
    this.setFormGroup(this.initialAddress ?? undefined);
  }

  public onResetSubmission(): void {
    this.submissionAttempted = false;
  }

  public onOptionSelected(isInternational: boolean): void {
    this.isInternational = isInternational;
    this.submissionAttempted = false;
    this.formGroup.get('address')?.get('country')?.setValidators(this.isInternational ? REQUIRED_TEXT_VALIDATORS : null);
    this.formGroup.get('address')?.get('postCode')?.setValidators(this.isInternational ? null : [Validators.required, postcodeValidator()]);
    this.formGroup.get('address')?.get('country')?.updateValueAndValidity();
    this.formGroup.get('address')?.get('postCode')?.updateValueAndValidity();
    this.formGroup.setErrors(null);
    this.formGroup.get('address')?.get('country')?.patchValue(isInternational ? '' : 'UK');
  }

  public onAddressSelectable(addressSelectable: boolean): void {
    this.addressSelectable = addressSelectable;
  }

  private initialiseForm(): void {
    this.resetAddressEntry();
    if (!this.initialAddress) {
      return;
    }

    if (this.showExistingAddress) {
      this.startedInternational = this.initialInternationalMode;
      this.headingText = this.startedInternational ? INTERNATIONAL_HEADING : POSTCODE_HEADING;
      this.isInternational = this.startedInternational ? this.initialAddress.country !== 'UK' : false;
      this.addressChosen = !this.startedInternational;
    }
    this.setFormGroup(this.initialAddress);
  }

  private resetAddressEntry(): void {
    this.headingText = POSTCODE_HEADING;
    this.startedInternational = false;
    this.addressChosen = false;
    this.isInternational = undefined;
    this.addressErrors = [];
    this.submissionAttempted = false;
    this.setFormGroup();
  }

  private isFormValid(): boolean {
    this.addressErrors = [];

    if (!this.addressChosen && !this.startedInternational) {
      this.addressErrors.push({
        id: this.addressSelectable ? 'selectAddress' : 'addressLookup',
        message: this.addressSelectable
          ? AddressMessageEnum.SELECT_ADDRESS
          : AddressMessageEnum.NO_POSTCODE_SELECTED
      });
      return false;
    }

    if (this.startedInternational && this.isInternational === undefined) {
      this.addressErrors.push({ id: 'govuk-radios', message: AddressMessageEnum.NO_OPTION_SELECTED });
      return false;
    }

    if (this.formGroup.invalid) {
      this.addErrorIfInvalid('addressLine1', AddressMessageEnum.NO_STREET_SELECTED);
      this.addErrorIfInvalid('postTown', AddressMessageEnum.NO_CITY_SELECTED);
      if (this.isInternational) {
        this.addErrorIfInvalid('country', AddressMessageEnum.NO_COUNTRY_SELECTED);
      } else {
        this.addErrorIfInvalid('postCode', AddressMessageEnum.NO_POSTCODE_SELECTED);
        if (this.formGroup.get('address')?.get('postCode')?.hasError('invalidPostcode')) {
          this.addressErrors.push({ id: 'postCode', message: AddressMessageEnum.INVALID_POSTCODE });
        }
      }
      return false;
    }

    return true;
  }

  private addErrorIfInvalid(controlName: string, message: AddressMessageEnum): void {
    const control = this.formGroup.get('address')?.get(controlName);
    if (control?.hasError('required') || control?.hasError('pattern')) {
      this.addressErrors.push({ id: controlName, message });
    }
  }

  private setAddressFormGroup(): void {
    if (!this.formGroup.get('address')) {
      this.setFormGroup();
      return;
    }
    const givenAddress = this.formGroup.get('address')?.value;
    this.setFormGroup(givenAddress?.postCode ? givenAddress : undefined);
  }

  private setFormGroup(givenAddress?: AddressModel): void {
    const country = givenAddress?.country ?? (this.isInternational ? null : 'UK');
    this.formGroup = new FormGroup({
      address: new FormGroup({
        addressLine1: new FormControl(givenAddress?.addressLine1 ?? null, REQUIRED_TEXT_VALIDATORS),
        addressLine2: new FormControl(givenAddress?.addressLine2 ?? null),
        addressLine3: new FormControl(givenAddress?.addressLine3 ?? null),
        postTown: new FormControl(givenAddress?.postTown ?? null, REQUIRED_TEXT_VALIDATORS),
        county: new FormControl(givenAddress?.county ?? null),
        country: new FormControl(country, this.isInternational ? REQUIRED_TEXT_VALIDATORS : null),
        postCode: new FormControl(
          givenAddress?.postCode ?? null,
          this.isInternational ? null : [Validators.required, postcodeValidator()]
        )
      })
    });
  }
}
