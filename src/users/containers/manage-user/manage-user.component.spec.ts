import { ComponentFixture, TestBed, fakeAsync, flushMicrotasks } from '@angular/core/testing';

import { ManageUserComponent } from './manage-user.component';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of } from 'rxjs';
import { MockStore, provideMockStore } from '@ngrx/store/testing';

import * as fromRoot from '../../../app/store';
import * as fromStore from '../../store';
import { MemoizedSelector } from '@ngrx/store';
import { User } from '@hmcts/rpx-xui-common-lib';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ManageUserComponent', () => {
  let component: ManageUserComponent;
  let fixture: ComponentFixture<ManageUserComponent>;
  let mockRouterStore: MockStore<fromRoot.State>;
  let mockUserStore: MockStore<fromStore.UserState>;
  let actions$: Observable<any>;

  let defaultUser: User;
  let defaultRouterStateUrl;
  let mockGetSingleUserSelector: MemoizedSelector<fromStore.UserState, User>;
  let mockGetRouterState;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        provideMockStore(),
        provideMockActions(() => actions$)
      ],
      declarations: [ManageUserComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ManageUserComponent);

    mockRouterStore = TestBed.inject(MockStore);
    mockUserStore = TestBed.inject(MockStore);

    defaultRouterStateUrl = {
      state: {
        params: { userId: '123' },
        url: '',
        queryParams: {}
      },
      navigationId: 0
    };
    defaultUser = { email: 'john@doe.com', firstName: 'John', lastName: 'Doe', idamStatus: 'Active', idamStatusCode: 'A', roles: ['pui-case-manager', 'pui-user-manager'], id: '123' };

    mockGetRouterState = mockRouterStore.overrideSelector(fromRoot.getRouterState, defaultRouterStateUrl);
    mockGetSingleUserSelector = mockUserStore.overrideSelector(fromStore.getGetSingleUser, of(defaultUser));

    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
    mockRouterStore.resetSelectors();
    mockUserStore.resetSelectors();
  });

  describe('ngOnInit - user id found in route', () => {
    beforeEach(() => {
      mockGetRouterState.setResult(defaultRouterStateUrl);
      mockGetSingleUserSelector.setResult(defaultUser);
    });

    it('should retrieve user and setup subscribers', fakeAsync(() => {
      expect(component).toBeTruthy();
      flushMicrotasks();
      expect(component.backUrl).toBe('/users/user/123');
    }));
  });
});
