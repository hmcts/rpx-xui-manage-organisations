import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessIconComponent } from '../../../shared/components/icons';
import { AddressSuccessSummaryComponent } from './address-success-summary.component';

describe('organisation.AddressSuccessSummaryComponent', () => {
  let fixture: ComponentFixture<AddressSuccessSummaryComponent>;
  let component: AddressSuccessSummaryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddressSuccessSummaryComponent, SuccessIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AddressSuccessSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be appropriately initialised', () => {
    expect(component.addressUpdated).toBeFalse();
    expect(component.message).toEqual(AddressSuccessSummaryComponent.ADDRESS_SUCCESS_MESSAGE);
    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeNull();
  });

  it('should display the success banner when the address has been updated', () => {
    component.addressUpdated = true;
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.hmcts-banner--success');
    const message = fixture.nativeElement.querySelector('.hmcts-banner__message');

    expect(banner).toBeTruthy();
    expect(message.textContent).toContain(AddressSuccessSummaryComponent.ADDRESS_SUCCESS_MESSAGE);
    expect(message.textContent).toContain('Success');
    expect(fixture.nativeElement.querySelector('app-hmcts-success-icon')).toBeTruthy();
  });

  it('should hide the success banner when the address update state is reset', () => {
    component.addressUpdated = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeTruthy();

    component.addressUpdated = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeNull();
  });
});
