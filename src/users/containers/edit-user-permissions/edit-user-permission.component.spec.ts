import { EditUserPermissionComponent } from './edit-user-permission.component';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { Subject } from 'rxjs';

describe('Edit User Permission Component Component', () => {
  let component: EditUserPermissionComponent;
  let userStoreSpyObject;
  let routerStoreSpyObject;
  let actionsObject;
  let actionsSubject: Subject<any>;

  beforeEach(() => {
    userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    routerStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    actionsSubject = new Subject();
    actionsObject = { pipe: (...operators) => (actionsSubject.asObservable() as any).pipe(...operators) };
    component = new EditUserPermissionComponent(userStoreSpyObject, routerStoreSpyObject, actionsObject);
  });

  describe('EditUserPermissionComponent is Truthy', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getbackUrl', () => {
      expect(component.getBackurl('1234')).toEqual('/users/user/1234');
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsPuiCaseManager', () => {
      const user = { manageCases: 'Yes' };
      expect(component.getIsPuiCaseManager(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsPuiOrganisationManager', () => {
      const user = { manageOrganisations: 'Yes' };
      expect(component.getIsPuiOrganisationManager(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsPuiUserManager', () => {
      const user = { manageUsers: 'Yes' };
      expect(component.getIsPuiUserManager(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsPuiFinanceManager', () => {
      const user = { managePayments: 'Yes' };
      expect(component.getIsPuiFinanceManager(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsCaseAccessAdmin', () => {
      const user = { roles: ['pui-caa'] };
      expect(component.getIsCaseAccessAdmin(user)).toEqual(true);
    });
  });

  describe('getFormGroup', () => {
    it('should create a form group with supplied permission values', () => {
      const formGroup = component.getFormGroup(true, false, true, false, true, null);

      expect(formGroup.get('roles.pui-case-manager').value).toBeTrue();
      expect(formGroup.get('roles.pui-user-manager').value).toBeFalse();
      expect(formGroup.get('roles.pui-organisation-manager').value).toBeTrue();
      expect(formGroup.get('roles.pui-finance-manager').value).toBeFalse();
      expect(formGroup.get('roles.pui-caa').value).toBeTrue();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('unsubscribe', () => {
      const subscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      expect(component.unsubscribe(subscription));
      expect(subscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('ngOnInit', () => {
    let routerState$;
    let userLoaded$;
    let user$;
    let editUserFailure$;
    let userLoading$;

    beforeEach(() => {
      routerState$ = new Subject();
      userLoaded$ = new Subject();
      user$ = new Subject();
      editUserFailure$ = new Subject();
      userLoading$ = new Subject();

      routerStoreSpyObject.pipe.and.returnValue(routerState$.asObservable());
      userStoreSpyObject.pipe.and.returnValues(
        user$.asObservable(),
        userLoading$.asObservable(),
        userLoaded$.asObservable()
      );
      userStoreSpyObject.select.and.callFake((selector) => {
        if (selector === fromStore.editUserFailureSelector) {
          return editUserFailure$.asObservable();
        }
        return new Subject().asObservable();
      });
    });

    it('should load user details and set form values from the user', () => {
      component.ngOnInit();

      routerState$.next({ state: { params: { userId: '1234' } } });
      userLoaded$.next(true);
      user$.next({
        manageCases: 'Yes',
        manageOrganisations: 'No',
        manageUsers: 'Yes',
        managePayments: 'No',
        roles: ['pui-user-manager', 'pui-caa']
      });

      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromStore.LoadUserDetails));
      expect(component.userId).toBe('1234');
      expect(component.backUrl).toBe('/users/user/1234');
      expect(component.editUserForm.get('roles.pui-case-manager').value).toBeTrue();
      expect(component.editUserForm.get('roles.pui-user-manager').value).toBeTrue();
      expect(component.editUserForm.get('roles.pui-organisation-manager').value).toBeFalse();
      expect(component.editUserForm.get('roles.pui-finance-manager').value).toBeFalse();
      expect(component.editUserForm.get('roles.pui-caa').value).toBeTrue();
    });

    it('should dispatch load users when users are not loaded', () => {
      component.ngOnInit();

      routerState$.next({ state: { params: { userId: '1234' } } });
      userLoaded$.next(false);

      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromStore.LoadUsers));
      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromStore.LoadUserDetails));
    });

    it('should redirect to the failure page when editUserFailure becomes true', () => {
      component.ngOnInit();
      component.userId = '1234';

      editUserFailure$.next(true);

      expect(routerStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromRoot.Go));
      const action = routerStoreSpyObject.dispatch.calls.mostRecent().args[0];
      expect(action.payload.path).toEqual(['users/user/1234/editpermission-failure']);
    });

    it('should redirect to the user details page on edit success action', () => {
      component.ngOnInit();
      component.userId = '1234';

      actionsSubject.next({ type: fromStore.EDIT_USER_SUCCESS });

      expect(routerStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromRoot.Go));
      const action = routerStoreSpyObject.dispatch.calls.mostRecent().args[0];
      expect(action.payload.path).toEqual(['users/user/1234']);
    });

    it('should redirect to service down on server error action', () => {
      component.ngOnInit();

      actionsSubject.next({ type: fromStore.EDIT_USER_SERVER_ERROR });

      expect(routerStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromRoot.Go));
      const action = routerStoreSpyObject.dispatch.calls.mostRecent().args[0];
      expect(action.payload.path).toEqual(['service-down']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should unsubscribe from all tracked subscriptions', () => {
      component.userSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      component.dependanciesSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      component.editPermissionSuccessSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      component.editPermissionServerErrorSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      component.editUserFailureSubscription = jasmine.createSpyObj('subscription', ['unsubscribe']);

      component.ngOnDestroy();

      expect(component.userSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.dependanciesSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.editPermissionSuccessSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.editPermissionServerErrorSubscription.unsubscribe).toHaveBeenCalled();
      expect(component.editUserFailureSubscription.unsubscribe).toHaveBeenCalled();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsCaseAccessAdmin', () => {
      const user = { roles: ['pui-caa'] };
      expect(component.getIsCaseAccessAdmin(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getIsPuiFinanceManager', () => {
      const user = { managePayments: 'Yes' };
      expect(component.getIsPuiFinanceManager(user)).toEqual(true);
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('getFormGroup', () => {
      const form = component.getFormGroup(true, false, true, false, true, null);

      expect(form.get('roles.pui-case-manager')?.value).toBeTrue();
      expect(form.get('roles.pui-user-manager')?.value).toBeFalse();
      expect(form.get('roles.pui-organisation-manager')?.value).toBeTrue();
      expect(form.get('roles.pui-finance-manager')?.value).toBeFalse();
      expect(form.get('roles.pui-caa')?.value).toBeTrue();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('onSubmit should set validation errors when the form is invalid', () => {
      component.editUserForm = {
        valid: false
      } as any;

      component.onSubmit();

      expect(component.summaryErrors?.isFromValid).toBeFalse();
      expect(component.permissionErrors?.isInvalid).toBeTrue();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('onSubmit should dispatch EditUserFailure when no permission changes were made', () => {
      component.user = {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'Test',
        lastName: 'User',
        idamStatus: 'ACTIVE',
        roles: ['pui-user-manager']
      };
      component.userId = 'user-1';
      component.editUserForm = component.getFormGroup(false, true, false, false, false, null);

      component.onSubmit();

      const action = userStoreSpyObject.dispatch.calls.mostRecent().args[0];
      expect(action).toEqual(jasmine.any(fromStore.EditUserFailure));
      expect(action.payload).toBe('You need to make a change before submitting. If you don\'t make a change, these permissions will stay the same');
      expect(component.summaryErrors?.isFromValid).toBeFalse();
      expect(component.summaryErrors?.items[0].message).toBe(action.payload);
      expect(component.permissionErrors?.isInvalid).toBeTrue();
    });
  });

  describe('EditUserPermissionComponent', () => {
    it('should show validation errors when no checkboxes are selected', () => {
      component.editUserForm = component.getFormGroup(false, false, false, false, false, null);

      component.onSubmit();

      expect(component.summaryErrors.isFromValid).toBeFalse();
      expect(component.summaryErrors.items[0].message).toBe('You must select at least one action');
      expect(component.permissionErrors.isInvalid).toBeTrue();
      expect(userStoreSpyObject.dispatch).not.toHaveBeenCalled();
    });

    it('should include add and delete roles in the edit user payload', () => {
      component.user = {
        email: 'user@test.com',
        firstName: 'Test',
        lastName: 'User',
        idamStatus: 'ACTIVE',
        roles: ['pui-user-manager', 'pui-caa']
      };
      component.userId = '1234';
      component.editUserForm = component.getFormGroup(false, false, true, false, false, null);

      component.onSubmit();

      const action = userStoreSpyObject.dispatch.calls.mostRecent().args[0];
      expect(action).toEqual(jasmine.any(fromStore.EditUser));
      expect(action.payload.id).toBe('1234');
      expect(action.payload.rolesAdd).toEqual([{ name: 'pui-organisation-manager' }]);
      expect(action.payload.rolesDelete).toEqual([{ name: 'pui-user-manager' }, { name: 'pui-caa' }]);
    });
  });
});
