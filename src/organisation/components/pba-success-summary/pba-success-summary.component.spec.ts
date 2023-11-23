import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessIconComponent } from '../../../shared/components/icons';
import { PbaSuccessSummaryComponent } from './pba-success-summary.component';

describe('organisation.PbaSuccessSummaryComponent', () => {
  let fixture: ComponentFixture<PbaSuccessSummaryComponent>;
  let component: PbaSuccessSummaryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PbaSuccessSummaryComponent, SuccessIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PbaSuccessSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be appropriately initialised', () => {
    expect(component.message).toBeUndefined();
    const wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeNull();
  });

  it('should show an appropriate message for a 200 response status', () => {
    const RESPONSE = { code: 200 };
    component.response = RESPONSE;
    fixture.detectChanges();

    expect(component.message).toEqual(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[200]);
    const wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeTruthy();
    const message = fixture.nativeElement.querySelector('.hmcts-banner__message');
    expect(message.textContent).toContain(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[200]);
  });

  it('should show an appropriate message for a 202 response status', () => {
    const RESPONSE = { code: 202 };
    component.response = RESPONSE;
    fixture.detectChanges();

    expect(component.message).toEqual(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[202]);
    const wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeTruthy();
    const message = fixture.nativeElement.querySelector('.hmcts-banner__message');
    expect(message.textContent).toContain(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[202]);
  });

  it('should show no message for a response code other than 200 or 202', () => {
    const RESPONSE = { code: 400 };
    component.response = RESPONSE;
    fixture.detectChanges();

    expect(component.message).toBeUndefined();
    const wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeNull();
  });

  it('should show no message for a null response', () => {
    const RESPONSE = { code: 202 };
    component.response = RESPONSE;
    fixture.detectChanges();

    // Should display an appropriate message.
    expect(component.message).toEqual(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[202]);
    let wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeTruthy();

    component.response = null;
    fixture.detectChanges();

    expect(component.message).toBeUndefined();
    wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeNull();
  });

  it('should handle receiving the same response multiple times without changing the message', () => {
    const RESPONSE = { code: 202 };
    component.response = RESPONSE;
    fixture.detectChanges();

    expect(component.message).toEqual(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[202]);
    let wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeTruthy();

    component.response = RESPONSE;
    fixture.detectChanges();

    expect(component.message).toEqual(PbaSuccessSummaryComponent.SUCCESS_MESSAGES[202]);
    wrapper = fixture.nativeElement.querySelector('.hmcts-banner--success');
    expect(wrapper).toBeTruthy();
  });
});
