import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessIconComponent } from '../../../shared/components/icons';
import { OrgChangeSuccessSummaryComponent } from './org-change-success-summary.component';

describe('organisation.OrgChangeSuccessSummaryComponent', () => {
  let fixture: ComponentFixture<OrgChangeSuccessSummaryComponent>;
  let component: OrgChangeSuccessSummaryComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OrgChangeSuccessSummaryComponent, SuccessIconComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(OrgChangeSuccessSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be appropriately initialised', () => {
    expect(component.orgChangeUpdated).toBeFalse();
    expect(component.message).toEqual(OrgChangeSuccessSummaryComponent.ORG_CHANGE_SUCCESS_MESSAGE);
    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeNull();
  });

  it('should display the success banner when the organisation has been updated', () => {
    component.orgChangeUpdated = true;
    fixture.detectChanges();

    const banner = fixture.nativeElement.querySelector('.hmcts-banner--success');
    const message = fixture.nativeElement.querySelector('.hmcts-banner__message');

    expect(banner).toBeTruthy();
    expect(message.textContent).toContain(OrgChangeSuccessSummaryComponent.ORG_CHANGE_SUCCESS_MESSAGE);
    expect(message.textContent).toContain('Success');
    expect(fixture.nativeElement.querySelector('app-hmcts-success-icon')).toBeTruthy();
  });

  it('should hide the success banner when the organisation update state is reset', () => {
    component.orgChangeUpdated = true;
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeTruthy();

    component.orgChangeUpdated = false;
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.hmcts-banner--success')).toBeNull();
  });
});
