import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';
import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input, ViewChild} from '@angular/core';
import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';

describe('CheckboxComponent', () => {
    @Component({
        selector: `app-host-dummy-component`,
        template: `<app-checkbox 
            [group]="group" 
            [idPrefix]="idPrefix"
            [name]="name"
            [items]="items"
            [classes]="classes"
            [labelClasses]="labelClasses"
            [validate]="validate"
        ></app-checkbox>`
    })
    class TestDummyHostComponent {
        group: FormGroup;
        idPrefix = 'waste';
        name = 'waste';
        items;
        classes;
        labelClasses;
        validate;
        @ViewChild(CheckboxComponent, /* TODO: add static flag */ {})
        public checkboxComponent: CheckboxComponent;
    }

    let testHostComponent: TestDummyHostComponent;
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    let el: DebugElement;
    let de: any;
    let component: CheckboxComponent;
    let fixture: ComponentFixture<CheckboxComponent>;
    let element: DebugElement;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                FormsModule
            ],
            declarations: [ CheckboxComponent, TestDummyHostComponent ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestDummyHostComponent);
        testHostComponent = testHostFixture.componentInstance;
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(CheckboxComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be created by angular', () => {
        expect(fixture).not.toBeNull();
    });
    it('should panelData not load', () => {
        expect(testHostComponent.checkboxComponent.group).toBeUndefined();
        expect(testHostComponent.checkboxComponent.classes).toBeUndefined();
        expect(testHostComponent.checkboxComponent.idPrefix).toBeUndefined();
        expect(testHostComponent.checkboxComponent.items).toBeUndefined();
        expect(testHostComponent.checkboxComponent.labelClasses).toBeUndefined();
        expect(testHostComponent.checkboxComponent.name).toBeUndefined();
        expect(testHostComponent.checkboxComponent.validate).toBeUndefined();
        testHostFixture.detectChanges();
        expect(testHostComponent.checkboxComponent.idPrefix).toEqual('waste');
        expect(testHostComponent.checkboxComponent.name).toEqual('waste');
    });

});
