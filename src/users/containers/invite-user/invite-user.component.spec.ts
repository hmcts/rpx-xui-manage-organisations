import { of } from 'rxjs';
import { InviteUserComponent } from './invite-user.component';

describe('User Details Component', () => {
  let component: InviteUserComponent;
  let userStoreSpyObject;
  let actionSpy;

  beforeEach(() => {
    userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    actionSpy = jasmine.createSpyObj('actionSpy', ['pipe']);
    component = new InviteUserComponent(userStoreSpyObject, actionSpy);
  });

  it('Is Truthy', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize the form', () => {
    const user = {
      userList: [],
      loaded: true,
      loading: false,
      reinvitePendingUser: {},
      editUserFailure: false
    };

    userStoreSpyObject.pipe.and.returnValue(of(user));
    actionSpy.pipe.and.returnValue(of(true));
    component.ngOnInit();
    expect(component.errorMessages.firstName).toEqual(['Enter first name']);
  });

  it('unsubscribe', () => {
    const mockSubscription = jasmine.createSpyObj(['unsubscribe']);
    component.juridictionSubscription = mockSubscription;
    component.pendingUserSubscription = mockSubscription;
    component.unSubscribe(mockSubscription);
    expect(mockSubscription.unsubscribe).toHaveBeenCalled();
  });

  it('getBackLink', () => {
    let link = component.getBackLink(null);
    expect(link).toEqual('/users');

    const user = {
      routerLink: '',
      fullName: 'name',
      email: 'someemail',
      status: 'active',
      resendInvite: false,
      userIdentifier: 'id1234'
    };
    link = component.getBackLink(user);
    expect(link).toEqual('/users/user/id1234');
  });

  it('dispathAction', () => {
    const mockAction = jasmine.createSpyObj('action', ['payload']);
    const mockStore = jasmine.createSpyObj('store', ['dispatch']);
    component.dispathAction(mockAction, mockStore);
    expect(mockStore.dispatch).toHaveBeenCalledWith(mockAction);
  });

  it('global error 400', () => {
    const globalError = component.getGlobalError(400);
    expect(globalError.header).toEqual('Sorry, there is a problem');
  });

  it('global error 404', () => {
    const globalError = component.getGlobalError(404);
    expect(globalError.header).toEqual('Sorry, there is a problem with this account');
  });

  it('global error 500', () => {
    const globalError = component.getGlobalError(500);
    expect(globalError.header).toEqual('Sorry, there is a problem with the service');
  });

  it('global error 999', () => {
    const globalError = component.getGlobalError(999);
    expect(globalError).toEqual(undefined);
  });
});
