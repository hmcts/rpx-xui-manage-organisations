import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { cold } from 'jasmine-marbles';
import {Logout, reducers} from 'src/app/store';
import { HeaderComponent } from '../header/header.component';
import { AppComponent } from './app.component';

import {HttpClientTestingModule} from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FeatureToggleService, windowToken} from '@hmcts/rpx-xui-common-lib';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import { ENVIRONMENT_CONFIG } from 'src/models/environmentConfig.model';
import * as fromAuth from '../../../user-profile/store';
import { AppConstants } from '../../app.constants';


const windowMock: Window = { gtag: () => {}} as any;
const featureMock: FeatureToggleService = {
  initialize: () => {},
  isEnabled: () => of(false),
  getValue: () => of(),
};

describe('AppComponent', () => {
  let store: Store<fromAuth.AuthState>;
  beforeEach(async(() => {
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
        }
      ],
    }).compileComponents();
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);

    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  }));

  it('should have pageTitle$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: '' });
    expect(app.pageTitle$).toBeObservable(expected);

  }));


  it('should have appHeaderTitle$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: undefined });
    expect(app.appHeaderTitle$).toBeObservable(expected);

  }));

  it('should have userNav$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: [] });
    expect(app.userNav$).toBeObservable(expected);

  }));


  it('should have navItems$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();
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
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    app.onNavigate('sign-out');
    fixture.detectChanges();

    expect(store.dispatch).toHaveBeenCalledWith(new Logout());

  }));

});
