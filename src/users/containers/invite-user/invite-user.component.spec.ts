import { of } from 'rxjs';
import { InviteUserComponent } from './invite-user.component';
import * as fromAppStore from '../../../app/store';
import * as fromStore from '../../store';
import { AppConstants } from '../../../app/app.constants';

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

  it('should populate and lock the form for a pending reinvite user', () => {
    const form = component.initialiseUserForm();
    const pendingUser = {
      firstName: 'Pending',
      lastName: 'User',
      email: 'pending@example.com',
      userIdentifier: 'user-1'
    } as any;

    component.populateFormControl(pendingUser, form);

    expect(component.resendInvite).toBeTrue();
    expect(form.controls.firstName.value).toEqual('Pending');
    expect(form.controls.lastName.value).toEqual('User');
    expect(form.controls.email.value).toEqual('pending@example.com');
    expect(form.controls.firstName.disabled).toBeTrue();
    expect(form.controls.lastName.disabled).toBeTrue();
    expect(form.controls.email.disabled).toBeTrue();
  });

  it('should dispatch global error and navigate for mapped errors', () => {
    component.handleError(userStoreSpyObject, 500);

    expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromAppStore.AddGlobalError));
    expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(new fromAppStore.Go({ path: ['service-down'] }));
  });

  it('should not dispatch global error for unmapped errors', () => {
    component.handleError(userStoreSpyObject, 999);

    expect(userStoreSpyObject.dispatch).not.toHaveBeenCalled();
  });

  it('should dispatch validation errors when the form is invalid', () => {
    component.inviteUserForm = component.initialiseUserForm();

    component.dispatchValidationAction();

    expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromStore.UpdateErrorMessages));
  });

  it('should submit invite user with selected permissions and CCD roles', () => {
    component.inviteUserForm = component.initialiseUserForm();
    component.inviteUserForm.controls.firstName.setValue('Test');
    component.inviteUserForm.controls.lastName.setValue('User');
    component.inviteUserForm.controls.email.setValue('test.user@example.com');
    component.inviteUserForm.get('roles.pui-case-manager').setValue(true);
    component.inviteUserForm.get('roles.pui-user-manager').setValue(true);

    component.onSubmit();

    const sendInviteAction = userStoreSpyObject.dispatch.calls.allArgs()
      .map(([action]) => action)
      .find((action) => action instanceof fromStore.SendInviteUser);
    expect(sendInviteAction.payload.roles).toContain('pui-case-manager');
    expect(sendInviteAction.payload.roles).toContain('pui-user-manager');
    AppConstants.CCD_ROLES.forEach((role) => expect(sendInviteAction.payload.roles).toContain(role));
    expect(sendInviteAction.payload.resendInvite).toBeFalse();
  });

  it('should not submit invite user when the form is invalid', () => {
    component.inviteUserForm = component.initialiseUserForm();

    component.onSubmit();

    expect(userStoreSpyObject.dispatch).not.toHaveBeenCalledWith(jasmine.any(fromStore.SendInviteUser));
  });

  it('should unsubscribe safely when subscription is missing', () => {
    expect(() => component.unSubscribe(null)).not.toThrow();
  });
});
