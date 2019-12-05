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
});
