import { HttpClientModule } from '@angular/common/http';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Action, Store } from '@ngrx/store';
import { of } from 'rxjs';
import { TermsConditionsService } from 'src/shared/services/termsConditions.service';
import { TermsAndConditionsComponent } from './terms-and-conditions.component';

const storeMock = {
    pipe: () => of(null),
    dispatch: (action: Action) => {}
};
let pipeSpy: jasmine.Spy;
let dispatchSpy: jasmine.Spy;

describe('TermsAndConditionsComponent', () => {
    @Component({
        selector: `app-exui-app-host-dummy-component`,
        template: `<exui-terms-and-conditions></exui-terms-and-conditions>`
    })
    class TestDummyHostComponent {
        @ViewChild(TermsAndConditionsComponent)
        public footerComponent: TermsAndConditionsComponent;
    }

    let testHostComponent: TestDummyHostComponent;
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    // tslint:disable-next-line
    let el: DebugElement;
    // tslint:disable-next-line
    let de: any;
    let component: TermsAndConditionsComponent;
    let fixture: ComponentFixture<TermsAndConditionsComponent>;
    let element: DebugElement;
    let termsConditionsService: TermsConditionsService;

    beforeEach(async(() => {
        pipeSpy = spyOn(storeMock, 'pipe');
        dispatchSpy = spyOn(storeMock, 'dispatch');
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientModule
            ],
            declarations: [ TermsAndConditionsComponent, TestDummyHostComponent ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
            providers: [
              {
                provide: Store,
                useValue: storeMock
              },
              TermsConditionsService
          ]
        })
            .compileComponents();
    }));
    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestDummyHostComponent);
        testHostComponent = testHostFixture.componentInstance;
    });
    beforeEach(() => {
        fixture = TestBed.createComponent(TermsAndConditionsComponent);
        component = fixture.componentInstance;
        element = fixture.debugElement;
        termsConditionsService = fixture.debugElement.injector.get(TermsConditionsService);
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('should be created by angular', () => {
        expect(fixture).not.toBeNull();
    });

    it('should display old legacy terms and conditions when feature is not enabled', () => {
      spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(false));
      component.ngOnInit();
      fixture.detectChanges();
      const legacy = fixture.debugElement.query(By.css('#main-content'));
      expect(legacy).toBeTruthy();
    });

    it('should dispatch LoadTermsConditions', () => {
        spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
        pipeSpy.and.returnValue(of(null));
        component.ngOnInit();
        expect(pipeSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).toHaveBeenCalledTimes(1);
    });

    it('should not dispatch when document is available', () => {
        spyOn(termsConditionsService, 'isTermsConditionsFeatureEnabled').and.returnValue(of(true));
        pipeSpy.and.returnValue(of(true));
        component.ngOnInit();
        expect(pipeSpy).toHaveBeenCalledTimes(1);
        expect(dispatchSpy).not.toHaveBeenCalled();
    });
});
