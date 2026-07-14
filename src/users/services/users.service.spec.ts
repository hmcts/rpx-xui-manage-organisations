import { of, throwError } from 'rxjs';
import { UsersService } from './users.service';

describe('Users service', () => {
  const mockedHttpClient = jasmine.createSpyObj('mockedHttpClient', ['get', 'put']);
  const apiError = { json: () => ({ message: 'service error' }) };

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
    service.suspendUser({ payload: { userIdentifier: 'dummy' } });
    expect(mockedHttpClient.put).toHaveBeenCalledWith('/api/user/dummy/suspend', { userIdentifier: 'dummy', idamStatus: 'SUSPENDED' });
  });

  it('should get userdetails', () => {
    const service = new UsersService(mockedHttpClient);
    const userId = 'dummy';
    mockedHttpClient.get.and.returnValue(of());
    service.getUserDetailsWithPermission(userId);
    expect(mockedHttpClient.get).toHaveBeenCalledWith(`/api/user-details?userId=${userId}`);
  });

  it('should surface getListOfUsers errors from the API json body', (done) => {
    const service = new UsersService(mockedHttpClient);
    mockedHttpClient.get.and.returnValue(throwError(() => apiError));

    service.getListOfUsers(2).subscribe({
      error: (error) => {
        expect(error).toEqual({ message: 'service error' });
        done();
      }
    });
  });

  it('should surface suspendUser errors from the API json body', (done) => {
    const service = new UsersService(mockedHttpClient);
    mockedHttpClient.put.and.returnValue(throwError(() => apiError));

    service.suspendUser({ payload: { userIdentifier: 'dummy' } }).subscribe({
      error: (error) => {
        expect(error).toEqual({ message: 'service error' });
        done();
      }
    });
  });
});
