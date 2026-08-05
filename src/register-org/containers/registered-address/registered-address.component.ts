import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AddressMessageEnum, AddressModel } from '@hmcts/rpx-xui-common-lib';
import { postcodeValidator } from '../../../custom-validators/postcode.validator';
import { INTERNATIONAL_HEADING, POSTCODE_HEADING } from '../../constants/register-org-constants';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { RegisterOrgService } from '../../services/register-org.service';

@Component({
  selector: 'app-registered-address',
  templateUrl: './registered-address.component.html',
  standalone: false
})
export class RegisteredAddressComponent extends RegisterComponent implements OnInit, OnDestroy {
  @ViewChild('mainContent') public mainContentElement: ElementRef;

  public formGroup = new FormGroup<any>({});
  public startedInternational = false;
  public addressChosen = false;
  public headingText = POSTCODE_HEADING;

  public isInternational: boolean;

  public addressErrors: { id: string, message: string }[] = [];

  public submissionAttempted = false;

  public isInternal = false;

  public postcodeErrorFound = false;

  private addressSelectable = false;

  constructor(public readonly router: Router,
    public readonly registerOrgService: RegisterOrgService,
    public readonly route: ActivatedRoute
  ) {
    super(router, registerOrgService);
    this.isInternal = this.route.snapshot.params.internal === 'internal';
  }

  public ngOnInit(): void {
    super.ngOnInit();
    if (this.isInternal) {
      this.setExistingFormGroup();
    } else if (this.addressExists()) {
      this.setFormGroup(this.registrationData.address);
    }
  }

  private setExistingFormGroup(): void {
    if (this.addressExists()) {
      if (this.registrationData.inInternationalMode) {
        this.startedInternational = true;
        this.headingText = INTERNATIONAL_HEADING;
        this.isInternational = this.registrationData.address.country !== 'UK';
      } else {
        // check to ensure the user has not just started international mode
        this.addressChosen = !this.startedInternational;
      }
      this.setFormGroup(this.registrationData.address);
    }
  }

  public ngOnDestroy(): void {
    super.ngOnDestroy();
  }

  public onContinue(): void {
    if (this.isFormValid()) {
      this.registrationData.address = this.formGroup.get('address').value;
      if (this.registrationData.address.postCode === '') {
        this.registrationData.address.postCode = null;
      }
      this.registrationData.inInternationalMode = this.startedInternational;

      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'document-exchange-reference']);
    } else {
      this.submissionAttempted = true;
    }
  }

  public onCancel(): void {
    this.cancelRegistrationJourney();
  }

  public onBack(refreshPage: boolean): void {
    const previousUrl = this.currentNavigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl?.includes(this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE)) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, this.registerOrgService.CHECK_YOUR_ANSWERS_ROUTE]);
    } else if (refreshPage) {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'registered-address', 'external']);
      this.headingText = POSTCODE_HEADING;
      this.startedInternational = false;
      this.addressChosen = false;
    } else {
      this.router.navigate([this.registerOrgService.REGISTER_ORG_NEW_ROUTE, 'company-house-details']);
    }
  }

  private isFormValid(): boolean {
    this.addressErrors = [];

    if (this.hasAddressSelectionError()) {
      this.addAddressSelectionError();
      return false;
    }

    if (this.hasInternationalSelectionError()) {
      this.addInternationalSelectionError();
      return false;
    }

    if (this.formGroup.invalid) {
      this.addFormControlErrors();
      return false;
    }

    return true;
  }

  private hasAddressSelectionError(): boolean {
    return !this.addressChosen && !this.startedInternational;
  }

  private addAddressSelectionError(): void {
    this.addressErrors.push({
      id: this.addressSelectable ? 'selectAddress' : 'addressLookup',
      message: this.addressSelectable
        ? AddressMessageEnum.SELECT_ADDRESS
        : AddressMessageEnum.NO_POSTCODE_SELECTED
    });
  }

  private hasInternationalSelectionError(): boolean {
    return this.startedInternational && this.isInternational === undefined;
  }

  private addInternationalSelectionError(): void {
    this.addressErrors.push({
      id: 'govuk-radios',
      message: AddressMessageEnum.NO_OPTION_SELECTED
    });
  }

  private addFormControlErrors(): void {
    this.addErrorIfInvalid(
      'addressLine1',
      AddressMessageEnum.NO_STREET_SELECTED
    );

    this.addErrorIfInvalid(
      'postTown',
      AddressMessageEnum.NO_CITY_SELECTED
    );

    if (this.isInternational) {
      this.addErrorIfInvalid(
        'country',
        AddressMessageEnum.NO_COUNTRY_SELECTED
      );
    }

    if (!this.isInternational) {
      this.addErrorIfInvalid(
        'postCode',
        AddressMessageEnum.NO_POSTCODE_SELECTED
      );
      this.addInvalidPostcodeError();
    }
  }

  private addErrorIfInvalid(controlName: string, message: AddressMessageEnum): void {
    if (this.isControlInvalid(controlName)) {
      this.addressErrors.push({
        id: controlName,
        message
      });
    }
  }

  private addInvalidPostcodeError(): void {
    const postCodeControl = this.formGroup.get('address')?.get('postCode');

    if (postCodeControl?.hasError('invalidPostcode')) {
      this.addressErrors.push({
        id: 'postCode',
        message: AddressMessageEnum.INVALID_POSTCODE
      });
    }
  }

  private isControlInvalid(control: string): boolean {
    return !this.formGroup.get('address').get(control).value || this.formGroup.get('address').get(control).value === '';
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
    if (this.addressExists()) {
      this.setExistingFormGroup();
    } else {
      this.setAddressFormGroup();
    }
  }

  public onResetSubmission(): void {
    this.submissionAttempted = false;
  }

  public onOptionSelected(isInternational: boolean): void {
    this.isInternational = isInternational;
    this.submissionAttempted = false;
    this.formGroup.get('address').get('country').setValidators(this.isInternational ? [Validators.required] : null);
    this.formGroup.get('address').get('postCode').setValidators(this.isInternational ? null : [Validators.required, postcodeValidator()]);
    this.formGroup.get('address').get('country').updateValueAndValidity();
    this.formGroup.get('address').get('postCode').updateValueAndValidity();
    this.formGroup.setErrors(null);
    this.formGroup.get('address').get('country').patchValue(isInternational ? '' : 'UK');
  }

  public onAddressSelectable(addressSelectable: boolean): void {
    this.addressSelectable = addressSelectable;
  }

  private setAddressFormGroup(): void {
    if (!this.formGroup.get('address')) {
      this.setFormGroup();
      return;
    }
    const givenAddress = this.formGroup.get('address').value;
    if (givenAddress?.postCode && givenAddress.postCode !== '') {
      this.setFormGroup(givenAddress);
    } else {
      this.setFormGroup();
    }
  }

  private setFormGroup(givenAddress?: AddressModel) {
    let country: string | null;

    if (givenAddress) {
      country = givenAddress.country;
    } else if (this.isInternational) {
      country = null;
    } else {
      country = 'UK';
    }

    const countryValidator = this.isInternational
      ? Validators.required
      : null;

    this.formGroup = new FormGroup({
      address: new FormGroup({
        addressLine1: new FormControl(givenAddress ? givenAddress.addressLine1 : null, Validators.required),
        addressLine2: new FormControl(givenAddress ? givenAddress.addressLine2 : null, null),
        addressLine3: new FormControl(givenAddress ? givenAddress.addressLine3 : null, null),
        postTown: new FormControl(givenAddress ? givenAddress.postTown : null, Validators.required),
        county: new FormControl(givenAddress ? givenAddress.county : null, null),
        country: new FormControl(country, countryValidator),
        postCode: new FormControl(givenAddress ? givenAddress.postCode : null, this.isInternational ? null : [Validators.required, postcodeValidator()])
      })
    });
  }

  private addressExists(): boolean {
    return !!this.registrationData.address?.addressLine1;
  }
}
