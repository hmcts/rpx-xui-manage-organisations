import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { SimpleChange } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { AddressMessageEnum } from '@hmcts/rpx-xui-common-lib';
import { SharedModule } from '../../shared.module';
import { AddressEntryComponent } from './address-entry.component';

describe('AddressEntryComponent', () => {
  const address = {
    addressLine1: '1 High Street',
    addressLine2: null,
    addressLine3: null,
    postTown: 'London',
    county: null,
    country: 'UK',
    postCode: 'SW1A 1AA'
  };

  it('should initialise an existing UK address for editing', () => {
    const component = new AddressEntryComponent();
    component.initialAddress = address as any;
    component.showExistingAddress = true;

    component.ngOnInit();

    expect(component.addressChosen).toBeTrue();
    expect(component.formGroup.get('address').value.addressLine1).toBe('1 High Street');
  });

  it('should emit a valid address', () => {
    const component = new AddressEntryComponent();
    component.initialAddress = address as any;
    component.showExistingAddress = true;
    component.ngOnInit();
    spyOn(component.submitted, 'emit');

    component.onContinue();

    expect(component.submitted.emit).toHaveBeenCalledWith({
      address: address as any,
      inInternationalMode: false
    });
  });

  it('should show an error when no postcode address is selected', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();

    component.onContinue();

    expect(component.addressErrors).toEqual([{
      id: 'addressLookup',
      message: AddressMessageEnum.NO_POSTCODE_SELECTED
    }]);
    expect(component.submissionAttempted).toBeTrue();
  });

  it('should reset detail entry when back is requested', () => {
    const component = new AddressEntryComponent();
    component.initialAddress = address as any;
    component.showExistingAddress = true;
    component.ngOnInit();
    spyOn(component.backRequested, 'emit');

    component.onBack(true);

    expect(component.addressChosen).toBeFalse();
    expect(component.formGroup.get('address')).toBeTruthy();
    expect(component.backRequested.emit).toHaveBeenCalledWith(true);
  });

  it('should preserve the current entry when back is requested without a reset', () => {
    const component = new AddressEntryComponent();
    component.initialAddress = address as any;
    component.showExistingAddress = true;
    component.ngOnInit();
    spyOn(component.backRequested, 'emit');

    component.onBack(false);

    expect(component.addressChosen).toBeTrue();
    expect(component.formGroup.get('address')?.value.addressLine1).toBe('1 High Street');
    expect(component.backRequested.emit).toHaveBeenCalledWith(false);
  });

  it('should require the user to choose whether a manually entered address is international', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();
    spyOn(component.submitted, 'emit');

    component.onInternationalModeStart();
    component.onContinue();

    expect(component.isInternational).toBeUndefined();
    expect(component.addressErrors).toEqual([{
      id: 'govuk-radios',
      message: AddressMessageEnum.NO_OPTION_SELECTED
    }]);
    expect(component.submissionAttempted).toBeTrue();
    expect(component.submitted.emit).not.toHaveBeenCalled();
  });

  it('should emit a valid manually entered international address', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();
    spyOn(component.submitted, 'emit');

    component.onInternationalModeStart();
    component.onOptionSelected(true);
    component.formGroup.get('address')?.patchValue({
      addressLine1: '10 Rue de Rivoli',
      postTown: 'Paris',
      country: 'France',
      postCode: null
    });
    component.onContinue();

    expect(component.submitted.emit).toHaveBeenCalledWith({
      address: jasmine.objectContaining({
        addressLine1: '10 Rue de Rivoli',
        postTown: 'Paris',
        country: 'France',
        postCode: null
      }),
      inInternationalMode: true
    });
  });

  it('should validate the postcode for a manually entered UK address', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();

    component.onInternationalModeStart();
    component.onOptionSelected(false);
    component.formGroup.get('address')?.patchValue({
      addressLine1: '1 High Street',
      postTown: 'London',
      postCode: 'invalid'
    });
    component.onContinue();

    expect(component.addressErrors).toEqual([{
      id: 'postCode',
      message: AddressMessageEnum.INVALID_POSTCODE
    }]);
    expect(component.submissionAttempted).toBeTrue();
  });

  for (const field of [
    { name: 'addressLine1', international: false, message: AddressMessageEnum.NO_STREET_SELECTED },
    { name: 'postTown', international: false, message: AddressMessageEnum.NO_CITY_SELECTED },
    { name: 'country', international: true, message: AddressMessageEnum.NO_COUNTRY_SELECTED }
  ]) {
    it(`should reject whitespace-only ${field.name} without emitting an address`, () => {
      const component = new AddressEntryComponent();
      component.ngOnInit();
      component.onInternationalModeStart();
      component.onOptionSelected(field.international);
      component.formGroup.get('address')?.patchValue({
        ...address,
        country: field.international ? 'France' : 'UK',
        [field.name]: ' \t '
      });
      spyOn(component.submitted, 'emit');

      component.onContinue();

      expect(component.submitted.emit).not.toHaveBeenCalled();
      expect(component.addressErrors).toEqual([{ id: field.name, message: field.message }]);
    });
  }

  it('should ask the user to select an address when lookup results are available', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();

    component.onAddressSelectable(true);
    component.onContinue();

    expect(component.addressErrors).toEqual([{
      id: 'selectAddress',
      message: AddressMessageEnum.SELECT_ADDRESS
    }]);
  });

  it('should initialise an existing international address for editing', () => {
    const component = new AddressEntryComponent();
    component.initialAddress = {
      ...address,
      country: 'France',
      postCode: null
    } as any;
    component.initialInternationalMode = true;
    component.showExistingAddress = true;

    component.ngOnInit();

    expect(component.startedInternational).toBeTrue();
    expect(component.addressChosen).toBeFalse();
    expect(component.isInternational).toBeTrue();
    expect(component.headingText).toBe('Is this a UK address?');
    expect(component.formGroup.get('address')?.get('country')?.value).toBe('France');
    expect(component.formGroup.get('address')?.get('postCode')?.valid).toBeTrue();
  });

  it('should reinitialise the form when an input changes after initialisation', () => {
    const component = new AddressEntryComponent();
    component.ngOnInit();
    component.initialAddress = address as any;
    component.showExistingAddress = true;

    component.ngOnChanges({
      initialAddress: new SimpleChange(null, address, false),
      showExistingAddress: new SimpleChange(false, true, false)
    });

    expect(component.addressChosen).toBeTrue();
    expect(component.formGroup.get('address')?.value.addressLine1).toBe('1 High Street');
  });
});

describe('AddressEntryComponent template', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SharedModule],
      providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideHttpClientTesting()
      ]
    }).compileComponents();
  });

  it('should create the address lookup without a missing AddressService provider', () => {
    const fixture = TestBed.createComponent(AddressEntryComponent);

    fixture.detectChanges();

    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should render the main-wrapper back-link style when requested', () => {
    const fixture = TestBed.createComponent(AddressEntryComponent);
    fixture.componentInstance.useMainWrapperBackLink = true;

    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('a.govuk-back-link')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('button.govuk-js-back-link')).toBeNull();
  });
});
