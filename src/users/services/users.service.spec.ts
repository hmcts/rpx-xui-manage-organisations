import { of } from 'rxjs';
import { UsersService } from './users.service';

describe('Users service', () => {
    const mockedHttpClient = jasmine.createSpyObj('mockedHttpClient', ['get', 'put']);

    it('should call getListOfUsers', () => {
        const service = new UsersService(mockedHttpClient);
        mockedHttpClient.get.and.returnValue(of());
        service.getListOfUsers(1);
        expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/userList?pageNumber=1');
    });

    it('should call getAllUsersList with roles', () => {
      const service = new UsersService(mockedHttpClient);
      mockedHttpClient.get.and.returnValue(of());
      service.getAllUsersListwithReturnRoles();
      expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/allUserList');
  });

    it('should call getAllUsersList without roles', () => {
      const service = new UsersService(mockedHttpClient);
      mockedHttpClient.get.and.returnValue(of());
      service.getAllUsersList();
      expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/allUserListWithoutRoles');
  });

    it('should suspend account', () => {
        const service = new UsersService(mockedHttpClient);
        mockedHttpClient.put.and.returnValue(of());
        service.suspendUser({payload: { userIdentifier: 'dummy' }});
        expect(mockedHttpClient.put).toHaveBeenCalledWith('/api/user/dummy/suspend', { userIdentifier: 'dummy', idamStatus: 'SUSPENDED' });
    });
});
