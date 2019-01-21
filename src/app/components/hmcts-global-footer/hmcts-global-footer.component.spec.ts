import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer.component';
import {helpData, navigationData} from './mock/hmcts-global-footer.mock';
import {Component, DebugElement, Input, ViewChild} from '@angular/core';
import {Helper, Navigation} from '../../../shared/components/footer/footer.model';

describe('HmctsGlobalFooterComponent', () => {
    @Component({
        selector: `app-host-dummy-component`,
        template: `<app-hmcts-global-footer  
                    [reference]="iconFallbackText"
                    [title]="type"
                    [items]="text"></app-hmcts-global-footer>`
    })
    class TestDummyHostComponent {
        @Input() help: Helper;
        @Input() navigation: Navigation;
        @ViewChild(HmctsGlobalFooterComponent)
        public hmctsGlobalFooterComponent: HmctsGlobalFooterComponent;
    }
    let testHostComponent: TestDummyHostComponent;
    let testHostFixture: ComponentFixture<TestDummyHostComponent>;
    let el: DebugElement;
    let de: any;
    let component: HmctsGlobalFooterComponent;
    let fixture: ComponentFixture<HmctsGlobalFooterComponent>;



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HmctsGlobalFooterComponent ]
    })
    .compileComponents();
  }));

    beforeEach(() => {
        fixture = TestBed.createComponent(HmctsGlobalFooterComponent);
        component = fixture.componentInstance;
        component.help = helpData;
        component.navigation = navigationData;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
    it('should be created by angular', () => {
        expect(fixture).not.toBeNull();
    });
});
