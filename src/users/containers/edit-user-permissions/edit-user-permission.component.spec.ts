import { EditUserPermissionComponent } from './edit-user-permission.component';

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
});
