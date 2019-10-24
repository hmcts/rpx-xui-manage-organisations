import { UserService } from './user.service';

describe('User service', () => {
    const mockHttpService = jasmine.createSpyObj('mockHttpService', ['put', 'get']);

    it('should be Truthy', () => {
        const userService = new UserService(mockHttpService);
        expect(userService).toBeTruthy();
    });

    it('editUser Permissions', () => {
        const userService = new UserService(mockHttpService);
        const editUser = {userId: '123', editUserRolesObj: {}};
        userService.editUserPermissions(editUser);
        expect(mockHttpService.put).toHaveBeenCalledWith('/api/editUserPermissions/users/123', {});
    });
});
