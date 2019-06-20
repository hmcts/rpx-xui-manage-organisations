import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {combineReducers, StoreModule} from '@ngrx/store';
import { reducers } from 'src/app/store';
import { HeaderComponent } from '../header/header.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {cold} from 'jasmine-marbles';

import * as fromAuth from '../../../auth/store';
import {AppConstants} from '../../app.constants';


describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        HeaderComponent
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      imports: [
        StoreModule.forRoot({...reducers, auth: combineReducers(fromAuth.reducer)} )
      ]
    }).compileComponents();
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

  it('should have navItems$ Observable the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    fixture.detectChanges();

    const expected = cold('a', { a: AppConstants.NAV_ITEMS });
    expect(app.navItems$).toBeObservable(expected);

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
});
