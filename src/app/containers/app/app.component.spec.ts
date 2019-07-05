import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { combineReducers, StoreModule, Store } from '@ngrx/store';
import {Logout, reducers} from 'src/app/store';
import { HeaderComponent } from '../header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { cold } from 'jasmine-marbles';

import { AppConstants } from '../../app.constants';
import * as fromAuth from '../../../user-profile/store';



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
        StoreModule.forRoot(
          {
            ...reducers,
            userProfile: combineReducers(fromAuth.reducer)
          })
      ]
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

    const expected = cold('a', { a: AppConstants.USER_NAV });
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
    const expected = cold('a', { a: [] });
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
