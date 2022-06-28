import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, TestBed } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { reducers} from 'src/app/store';
import * as fromAuth from '../../../user-profile/store';
import {RedirectComponent} from './redirect.component';

describe('AppRedirectComponent', () => {
  let store: Store<fromAuth.AuthState>;
  let app: any;

  beforeEach(async(() => {
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
    store = TestBed.get(Store);

    spyOn(store, 'dispatch').and.callThrough();

    const fixture = TestBed.createComponent(RedirectComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(app).toBeTruthy();
  });

  it('should have redirect property ', () => {
    expect(app.redirected).toBeDefined();
  });
});
