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
        ></app-fieldset>`
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
