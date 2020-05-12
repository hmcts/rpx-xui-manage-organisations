import { UserRolesUtil } from './user-roles-util';

describe('UserRolesUtil class ', () => {
    it('should get rolesAdded', () => {
        const user = { roles: ['permission1', 'permission3']};
        const rolesAdded = UserRolesUtil.getRolesAdded(user, ['permission1', 'permission2']);
        expect(rolesAdded).toEqual([{name: 'permission2'}]);
    });

    it('should get rolesDeleted', () => {
        const user = { roles: ['permission1', 'permission2', 'permission3']};
        const rolesDeleted = UserRolesUtil.getRolesDeleted(user, ['permission1', 'permission2']);
        expect(rolesDeleted).toEqual([{name: 'permission3'}]);
    });

    it('should mapEditUserRoles', () => {
        const user = {
                        email: 'email',
                        lastName: 'last',
                        firstName: 'first',
                        idamStatus: 'idam',
                        roles: ['permission1', 'permission2']
                    };
        const userEditObj = UserRolesUtil.mapEditUserRoles(user, ['permission3', 'permission4'], ['permission1', 'permission2']);
        expect(userEditObj).toEqual({ email: 'email',
                                      lastName: 'last',
                                      firstName: 'first',
                                      idamStatus: 'idam',
                                      rolesAdd: ['permission3', 'permission4'],
                                      rolesDelete: ['permission1', 'permission2']
                                    }
                                    );
    });

    it('should get isAddingRoleSuccessful', () => {
        let response = {};
        let isAddingSuccessful = UserRolesUtil.isAddingRoleSuccessful(response);
        expect(isAddingSuccessful).toEqual(undefined);

        response = {roleAdditionResponse: {idamStatusCode: '201'}};
        isAddingSuccessful = UserRolesUtil.isAddingRoleSuccessful(response);
        expect(isAddingSuccessful).toEqual(true);
    });

    it('should get isDeletingRoleSuccessful', () => {
        let response = {};
        let isDeletingSuccessful = UserRolesUtil.isDeletingRoleSuccessful(response);
        expect(isDeletingSuccessful).toEqual(undefined);

        response = {roleDeletionResponse: [{idamStatusCode: '204'}]};
        isDeletingSuccessful = UserRolesUtil.isDeletingRoleSuccessful(response);
        expect(isDeletingSuccessful).toEqual(true);
    });

    it('should get deletable roles GetCCDRoles', () => {
      const user = {roles: ['Perm1', 'caseworker', 'caseworker-divorce']};
      const roles = ['caseworker', 'caseworker-divorce'];
      const result = UserRolesUtil.GetRemovableRolesForUser(user, roles);
      expect(result).toEqual([{ name: 'caseworker' }, {name: 'caseworker-divorce'}]);
    });

    it('should get roles ccd roles to add GetCCDRoles', () => {
      const user = {roles: ['role-1', 'role-2']};
      const roles = ['caseworker', 'caseworker-divorce'];
      const result = UserRolesUtil.GetRolesToBeAddedForUser(user, roles);
      expect(result).toEqual([{name: 'caseworker'}, {name: 'caseworker-divorce'}]);
    });

    describe('checkRoleDeletionsSuccess()', () => {

      it('should return false if any of the Idam status codes, are not a \'204\'. Anything other than a 204 symbolfies a deletion failure.', () => {
        const successfulRoleDeletion = [
          {
            roleName: 'pui-organisation-manager',
            idamStatusCode: '204',
            idamMessage: '20 User Role Deleted'
          },
          {
            roleName: 'pui-user-manager',
            idamStatusCode: '400',
            idamMessage: '20 User Role Deleted'
          },
          {
            roleName: 'pui-user-manager',
            idamStatusCode: '404',
            idamMessage: '20 User Role Deleted'
          }
        ];

        expect(UserRolesUtil.checkRoleDeletionsSuccess(successfulRoleDeletion)).toEqual(false);
      });

      it('should return true if all of the Idam status codes are \'204\'', () => {
        const successfulRoleDeletion = [
          {
            roleName: 'pui-organisation-manager',
            idamStatusCode: '204',
            idamMessage: '20 User Role Deleted'
          },
          {
            roleName: 'pui-user-manager',
            idamStatusCode: '204',
            idamMessage: '20 User Role Deleted'
          }
        ];

        expect(UserRolesUtil.checkRoleDeletionsSuccess(successfulRoleDeletion)).toEqual(true);
      });
    });
});
