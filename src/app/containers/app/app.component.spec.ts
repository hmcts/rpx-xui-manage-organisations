import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import {Logout, reducers} from '../../store';
import { HeaderComponent } from '../header/header.component';
import { AppComponent } from './app.component';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CookieService, FeatureToggleService, GoogleAnalyticsService, ManageSessionServices, windowToken} from '@hmcts/rpx-xui-common-lib';

import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import { ENVIRONMENT_CONFIG } from '../../../models/environmentConfig.model';
import { LoggerService } from '../../../shared/services/logger.service';
import * as fromAuth from '../../../user-profile/store';

const windowMock: Window = { gtag: () => {}} as any;

const featureMock: FeatureToggleService = {
  initialize: () => {},
  isEnabled: () => of(true),
  getValue: () => of(),
  getValueOnce: () => of()
};

const idleServiceMock = {
  appStateChanges: () => of({
    countdown: 3,
    isVisible: true,
    type: 'modal'
  })
};

describe('AppComponent', () => {
  let store: Store<fromAuth.AuthState>;
  let googleAnalyticsService: any;
  let fixture;
  let app;
  let loggerService: any;
  let cookieService: any;
  beforeEach(async(() => {
    cookieService = jasmine.createSpyObj('CookieService', ['deleteCookieByPartialMatch']);
    loggerService = jasmine.createSpyObj('LoggerService', ['enableCookies']);
    googleAnalyticsService = jasmine.createSpyObj('googleAnalyticsService', ['init']);
    cookieService = jasmine.createSpyObj('CookieService', ['deleteCookieByPartialMatch']);
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        StoreModule.forRoot(
          {
            ...reducers,
            userProfile: combineReducers(fromAuth.reducer)
          }),
        CookieModule.forRoot()
      ],
      providers: [
        {
          provide: windowToken,
          useValue: windowMock
        },
        {
          provide: ENVIRONMENT_CONFIG,
          useValue: {}
        },
        {
          provide: FeatureToggleService,
          useValue: featureMock
        },
        {
          provide: ManageSessionServices,
          useValue: idleServiceMock
        },
        {
          provide: CookieService,
          useValue: cookieService
        },
        {
          provide: LoggerService,
          useValue: loggerService
        },
        {
          provide: GoogleAnalyticsService,
          useValue: googleAnalyticsService
        }
      ],
    }).compileComponents();
    store = TestBed.get(Store);
    spyOn(store, 'dispatch').and.callThrough();

    fixture = TestBed.createComponent(AppComponent);
    app = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should have pageTitle$ Observable the app', async(() => {
    const expected = cold('a', { a: '' });
    expect(app.pageTitle$).toBeObservable(expected);

  }));


  it('should have appHeaderTitle$ Observable the app', async(() => {
    const expected = cold('a', { a: undefined });
    expect(app.appHeaderTitle$).toBeObservable(expected);

  }));

  it('should have userNav$ Observable the app', async(() => {
    const expected = cold('a', { a: [] });
    expect(app.userNav$).toBeObservable(expected);

  }));


  it('should have navItems$ Observable the app', async(() => {
    const navItems = [
      {
        text: 'Organisation',
        href: '/organisation',
        active: true
      },
      {
        text: 'Users',
        href: '/users',
        active: false
      }];
    const expected = cold('a', { a: { navItems: [] } });
    expect(app.navItems$).toBeObservable(expected);

  }));

  it('should dispatch a logout action', async(() => {
    app.onNavigate('sign-out');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new Logout());

  }));


  describe('cookie actions', () => {

    describe('setCookieBannerVisibility()', () => {
        it('should set isCookieBannerVisible true when there is no cookie and there is a user and cookie banner is feature toggled on', () => {

          app.handleCookieBannerFeatureToggle();
          app.setUserAndCheckCookie('dummy');
          expect(app.isCookieBannerVisible).toBeTruthy();
        });

        it('should set isCookieBannerVisible false when there is no cookie and there is no user and cookie banner is feature toggled on', () => {
            app.handleCookieBannerFeatureToggle();
            expect(app.isCookieBannerVisible).toBeFalsy();
        });
    });

    describe('setUserAndCheckCookie()', () => {

        it('should call setCookieBannerVisibility', () => {
            const spy = spyOn(app, 'setCookieBannerVisibility');
            app.setUserAndCheckCookie('dummy');
            expect(spy).toHaveBeenCalled();
        });

    });

    describe('handleCookieBannerFeatureToggle()', () => {

        it('should make a call to setCookieBannerVisibility', () => {
            const spy = spyOn(app, 'setCookieBannerVisibility');
            app.handleCookieBannerFeatureToggle();
            expect(spy).toHaveBeenCalled();
        });

    });

    describe('notifyAcceptance()', () => {

      it('should make a call to googleAnalyticsService', () => {
          app.notifyAcceptance();
          expect(googleAnalyticsService.init).toHaveBeenCalled();
      });

      it('should make a call to loggerService', () => {
          app.notifyAcceptance();
          expect(loggerService.enableCookies).toHaveBeenCalled();
      });

  });

    describe('notifyRejection()', () => {

        it('should make a call to cookieService', () => {
            app.notifyRejection();
            expect(cookieService.deleteCookieByPartialMatch).toHaveBeenCalled();
        });

    });

});

});
