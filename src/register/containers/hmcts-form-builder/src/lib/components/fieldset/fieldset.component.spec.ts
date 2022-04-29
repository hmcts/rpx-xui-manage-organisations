import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input, ViewChild} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';
import {FieldsetComponent} from './fieldset.component';

describe('FieldsetComponent', () => {
    @Component({
        selector: `app-host-dummy-component`,
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


        @ViewChild(FieldsetComponent)
        public fieldsetComponent: FieldsetComponent;
    }

    let testHostComponent: TestDummyHostComponent;
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    let el: DebugElement;
    let de: any;
    let component: FieldsetComponent;
    let fixture: ComponentFixture<FieldsetComponent>;
    let element: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule
            ],
            declarations: [ FieldsetComponent, TestDummyHostComponent ],
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
