import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { HeaderComponent } from './header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { reducers } from 'src/app/store/reducers';

describe('HeaderComponent', () => {
    let fixture;
    let app;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                StoreModule.forRoot({}),
                StoreModule.forFeature('app', reducers),
            ],
            declarations: [
                HeaderComponent
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        app = fixture.debugElement.componentInstance;
    }));

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it('should emit navigate event', () => {
        spyOn(app.navigate, 'emit');
        app.onNavigate('dummy');
        expect(app.navigate.emit).toHaveBeenCalledWith('dummy');
    });

    it('should render the skip to content link', () => {
      const element = fixture.debugElement.query(By.css('.govuk-skip-link')).nativeElement;
      expect(element.innerHTML).toEqual('Skip to main content');
    });

});
