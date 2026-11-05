import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
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
