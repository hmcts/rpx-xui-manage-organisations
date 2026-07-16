import { of, Subscription } from 'rxjs';
import { UsersComponent } from './users.component';
import * as fromStore from '../../store';
import * as fromUsersReducer from '../../store/reducers/users.reducer';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let store: jasmine.SpyObj<any>;
  let routerStore: jasmine.SpyObj<any>;
  const users = [
    { idamId: 'user-1', fullName: 'Test User' }
  ];
  const applyOperators = (source$, operators) => operators.reduce((stream, operator) => stream.pipe(operator), source$);
  const usersState = {
    users: {
      invitedUsers: {
        ...fromUsersReducer.initialState,
        userList: users as any,
        loading: false
      },
      inviteUser: {}
    }
  };

  beforeEach(() => {
    store = jasmine.createSpyObj('store', ['dispatch', 'pipe']);
    routerStore = jasmine.createSpyObj('routerStore', ['pipe']);
    component = new UsersComponent(store, routerStore);
  });

  it('should load users and feature toggle state on init', (done) => {
    store.pipe.and.callFake((...operators) => applyOperators(of(usersState), operators));
    routerStore.pipe.and.returnValue(of(true));

    component.ngOnInit();

    expect(store.dispatch.calls.mostRecent().args[0].type).toBe(fromStore.CHECK_USER_LIST_LOADED);
    expect(component.searchFiltersEnabled$).toBeTruthy();
    component.tableUsersData$.subscribe((result) => {
      expect(result).toEqual(users as any);
      expect(component.pageTotalSize).toBe(1);
      done();
    });
  });

  it('should dispatch invite new user', () => {
    component.inviteNewUser();

    expect(store.dispatch).toHaveBeenCalledWith(new fromStore.InviteNewUser());
  });

  it('should update filter values and observable sources', () => {
    store.pipe.and.callFake((...operators) => applyOperators(of(usersState), operators));

    component.handleFilterUpdates('smith');

    expect(component.filterValues).toBe('smith');
    expect(component.tableUsersData$).toBeTruthy();
    expect(component.isLoading$).toBeTruthy();
  });

  it('should change page and reload users', () => {
    store.pipe.and.callFake((...operators) => applyOperators(of(usersState), operators));

    component.pageChange(3);

    expect(component.currentPageNumber).toBe(3);
    expect(store.dispatch.calls.mostRecent().args[0].type).toBe(fromStore.CHECK_USER_LIST_LOADED);
  });

  it('should unsubscribe from the user list on destroy', () => {
    const subscription = new Subscription();
    const unsubscribeSpy = spyOn(subscription, 'unsubscribe');
    component.allUsersList$ = subscription;

    component.ngOnDestroy();

    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
