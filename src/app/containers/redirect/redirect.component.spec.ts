import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import { combineReducers, Store, StoreModule } from '@ngrx/store';
import { reducers } from '../../../app/store/reducers';
import * as fromAuth from '../../../user-profile/store';
import { RedirectComponent } from './redirect.component';

describe('AppRedirectComponent', () => {
  let store: Store<fromAuth.AuthState>;
  let app: any;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RedirectComponent
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

    const fixture = TestBed.createComponent(RedirectComponent);
    app = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  }));

  it('should create the component', () => {
    expect(app).toBeTruthy();
  });

  it('should have redirect property ', () => {
    expect(app.redirected).toBe(false);
  });
});
