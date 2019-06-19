import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HmctsGlobalFooterComponent } from './hmcts-global-footer.component';
import {Component, Input, ViewChild} from '@angular/core';
import {Helper, Navigation} from '../../containers/footer/footer.model';
import { AppConstants } from '../../app.constants';


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

    let component: HmctsGlobalFooterComponent;
    let fixture: ComponentFixture<HmctsGlobalFooterComponent>;


    const helpData: Helper = AppConstants.FOOTER_DATA;
    const navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;

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
