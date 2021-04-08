import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { StoreModule } from '@ngrx/store';

import { metaReducers } from '../../../app/app.module';
import { reducers } from '../../../app/store';
import { HmctsGlobalHeaderComponent } from './hmcts-global-header.component';

describe('HmctsGlobalHeaderComponent', () => {
  let component: HmctsGlobalHeaderComponent;
  let fixture: ComponentFixture<HmctsGlobalHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HmctsGlobalHeaderComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot(reducers, { metaReducers }),
        RouterTestingModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HmctsGlobalHeaderComponent);
    component = fixture.componentInstance;
    component.headerTitle = {
      name: 'Service name',
      url: '#'
    };
    component.navigation = {
      label: 'Account navigation',
      items: [{
        text: 'Nav item 1',
        href: '#1',
        emit: 'emit1'
      }, {
        text: 'Nav item 2',
        href: '#2',
        emit: 'emit2'
      }]
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit onEmit', () => {
    spyOn(component.navigate, 'emit');
    component.onEmitEvent(1);
    expect(component.navigate.emit).toHaveBeenCalledWith('emit2');
  });

  // ISHITA: Added this test for the isBrandedHeader property, which is what we were missing.
  it('should NOT show MyHMCTS text in register org if isBrandedHeader is false', () => {
    component.isBrandedHeader = false;
    component.headerTitle = { ...component.headerTitle, hideBranding: false };
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.nativeElement.querySelector('.govuk-header__logotype-text');
    expect(headerTitle).toBeNull();
  });

  it('should show MyHMCTS text if hideBranding false', () => {
    // ISHITA: This wasn't being set, which is the first part of that *ngIf in the template.
    component.isBrandedHeader = true;
    // ISHITA: Sorry, wasn't quite clear enough - this one should have been hideBranding: false.
    component.headerTitle = { ...component.headerTitle, hideBranding: false };
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.nativeElement.querySelector('.govuk-header__logotype-text');
    expect(headerTitle).toBeDefined();
    expect(headerTitle).not.toBeNull();
    expect(headerTitle.textContent).toContain('MyHMCTS'); // ISHITA: Made this toContain because of the template structure.
    expect(component.headerTitle.hideBranding).toBeFalsy();
  });

  it('should NOT show MyHMCTS text in register org if hideBranding true', () => {
    component.isBrandedHeader = true;
    // ISHITA: This one needed to do the same thing for setting the headerTitle.
    component.headerTitle = { ...component.headerTitle, hideBranding: true };
    fixture.detectChanges();
    const headerTitle = fixture.debugElement.nativeElement.querySelector('.govuk-header__logotype-text');
    expect(headerTitle).toBeNull();
  });
});
