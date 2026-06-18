import { EditUserPermissionComponent } from './edit-user-permission.component';
import * as fromStore from '../../store';

describe('Edit User Permission Component Component', () => {
  let component: EditUserPermissionComponent;
  let userStoreSpyObject;
  let routerStoreSpyObject;
  let actionsObject;

  beforeEach(() => {
    userStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    routerStoreSpyObject = jasmine.createSpyObj('Store', ['pipe', 'select', 'dispatch']);
    actionsObject = jasmine.createSpyObj('Actions', ['pipe']);
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
    it('unsubscribe', () => {
      const subscription = jasmine.createSpyObj('subscription', ['unsubscribe']);
      expect(component.unsubscribe(subscription));
      expect(subscription.unsubscribe).toHaveBeenCalled();
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

      expect(userStoreSpyObject.dispatch).toHaveBeenCalledWith(jasmine.any(fromStore.EditUserFailure));
      expect(component.permissionErrors?.isInvalid).toBeTrue();
    });
  });
});
