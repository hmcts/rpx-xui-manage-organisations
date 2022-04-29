import { TestBed, waitForAsync } from '@angular/core/testing';
import { combineReducers, StoreModule, Store } from '@ngrx/store';
import { reducers} from 'src/app/store';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { cold } from 'jasmine-marbles';
import * as fromAuth from '../../../user-profile/store';
import {RedirectComponent} from './redirect.component';

describe('AppRedirectComponent', () => {
  let store: Store<fromAuth.AuthState>;
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RedirectComponent,
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
    store = TestBed.inject(Store);

    spyOn(store, 'dispatch').and.callThrough();
  }));

  it('should create the component', waitForAsync(() => {
    const fixture = TestBed.createComponent(RedirectComponent);

    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app).toBeTruthy();
  }));

  it('should have redirect property ', waitForAsync(() => {
    const fixture = TestBed.createComponent(RedirectComponent);

    const app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
    expect(app.redirected).toBeDefined();
  }));



});
