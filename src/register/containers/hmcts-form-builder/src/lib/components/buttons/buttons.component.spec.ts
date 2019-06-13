// import { async, ComponentFixture, TestBed } from '@angular/core/testing';
// import {Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, Input, ViewChild} from '@angular/core';
// import {RouterTestingModule} from '@angular/router/testing';
// import {FormGroup, FormsModule, ReactiveFormsModule} from '@angular/forms';
// import {ButtonsComponent} from './buttons.component';
//
// describe('ButtonsComponent', () => {
//     @Component({
//         selector: `app-host-dummy-component`,
//         template: `<app-buttons
//             [idPrefix]="idPrefix"
//             [name]="name"
//             [group]="group"
//             [classes]="classes"
//             [typeBtn]="typeBtn"
//             [control]="control"
//             [value]="value"
//         ></app-buttons>`
//     })
//     class TestDummyHostComponent {
//         idPrefix = 'btn';
//         name = 'btn';
//         group: FormGroup;
//         classes;
//         typeBtn;
//         control;
//         value;
//         @ViewChild(ButtonsComponent)
//         public buttonsComponent: ButtonsComponent;
//     }
//
//     let testHostComponent: TestDummyHostComponent;
//     let testHostFixture: ComponentFixture<TestDummyHostComponent>;
//     let el: DebugElement;
//     let de: any;
//     let component: ButtonsComponent;
//     let fixture: ComponentFixture<ButtonsComponent>;
//     let element: DebugElement;
//
//     beforeEach(async(() => {
//         TestBed.configureTestingModule({
//             imports: [
//                 RouterTestingModule,
//                 FormsModule,
//                 ReactiveFormsModule
//             ],
//             declarations: [ ButtonsComponent, TestDummyHostComponent ],
//             schemas: [CUSTOM_ELEMENTS_SCHEMA]
//         })
//             .compileComponents();
//     }));
//     beforeEach(() => {
//         testHostFixture = TestBed.createComponent(TestDummyHostComponent);
//         testHostComponent = testHostFixture.componentInstance;
//     });
//     beforeEach(() => {
//         fixture = TestBed.createComponent(ButtonsComponent);
//         component = fixture.componentInstance;
//         element = fixture.debugElement;
//     });
//
//     it('should create', () => {
//         expect(component).toBeTruthy();
//     });
//     it('should be created by angular', () => {
//         expect(fixture).not.toBeNull();
//     });
//     it('should be all data undefined until detectChanges kicks in', () => {
//         expect(testHostComponent.buttonsComponent.classes).toBeUndefined();
//         expect(testHostComponent.buttonsComponent.typeBtn).toBeUndefined();
//         expect(testHostComponent.buttonsComponent.control).toBeUndefined();
//     });
//     it('should load data', () => {
//         testHostFixture.detectChanges();
//         expect(testHostComponent.buttonsComponent.idPrefix).toEqual('btn');
//         expect(testHostComponent.buttonsComponent.name).toEqual( 'btn');
//     });
//     it('test data type', () => {
//         testHostFixture.detectChanges();
//         expect(typeof testHostComponent.buttonsComponent.idPrefix === 'string').toBeTruthy();
//         expect(typeof testHostComponent.buttonsComponent.name === 'string').toBeTruthy();
//     });
// });
