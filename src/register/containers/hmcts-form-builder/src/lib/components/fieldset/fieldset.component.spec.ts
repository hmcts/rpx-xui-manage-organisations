import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { FieldsetComponent } from './fieldset.component';

describe('FieldsetComponent', () => {
    @Component({
      selector: 'app-host-dummy-component',
      template: `<app-fieldset
            [classes]="classes"
            [validate]="validate"
            [group]="group"
            [data]="data"
        ></app-fieldset>`,
      standalone: false
    })
  class TestDummyHostComponent {
      classes = '';
      validate = '';
      group = '';
      data: Array<any>;

        @ViewChild(FieldsetComponent, { static: true })
      public fieldsetComponent: FieldsetComponent;
    }

    let testHostComponent: TestDummyHostComponent;
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    let component: FieldsetComponent;
    let fixture: ComponentFixture<FieldsetComponent>;
    let element: DebugElement;

    beforeEach(waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [
          RouterTestingModule
        ],
        declarations: [FieldsetComponent, TestDummyHostComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      })
        .compileComponents();
    }));

    beforeEach(() => {
      testHostFixture = TestBed.createComponent(TestDummyHostComponent);
      testHostComponent = testHostFixture.componentInstance;
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(FieldsetComponent);
      component = fixture.componentInstance;
      element = fixture.debugElement;
    });

    it('should render one legend first and preserve subsequent section headings', () => {
      component.data = [
        { input: { id: 'name' } },
        { legend: { text: 'Organisation details' } },
        { legend: { text: 'Contact details' } }
      ];
      fixture.detectChanges();
      const fieldset: HTMLElement = fixture.nativeElement.querySelector('fieldset');
      expect(fieldset.firstElementChild.tagName).toBe('LEGEND');
      expect(fieldset.querySelectorAll('legend').length).toBe(1);
      expect(fieldset.querySelector('legend h2').textContent).toBe('Organisation details');
      expect(fieldset.querySelector('h3').textContent).toBe('Contact details');
      expect(fieldset.querySelector('h1')).toBeNull();
    });

    it('should use a page heading only when requested', () => {
      component.data = [{ legend: { text: 'Organisation details' } }];
      component.isPageHeading = true;
      fixture.detectChanges();
      expect(fixture.nativeElement.querySelector('legend h1.govuk-fieldset__heading').textContent)
        .toBe('Organisation details');
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should be created by angular', () => {
      expect(fixture).not.toBeNull();
    });

    it('should be all data undefined until detectChanges kicks in', () => {
      expect(testHostComponent.fieldsetComponent.classes).toBeUndefined();
      expect(testHostComponent.fieldsetComponent.data).toBeUndefined();
      expect(testHostComponent.fieldsetComponent.group).toBeUndefined();
      expect(testHostComponent.fieldsetComponent.validate).toBeUndefined();
    });

    it('should display the actionSecondaryButton', () => {
      testHostFixture.detectChanges();
      // expect(typeof testHostComponent.fieldsetComponent.classes === 'string').toBeTruthy();
      // expect(typeof testHostComponent.fieldsetComponent.validate === 'string').toBeFalsy();
    });
});
