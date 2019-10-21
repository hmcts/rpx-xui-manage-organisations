import { UsersService } from './users.service';
import { of } from 'rxjs';

describe('Users service', () => {
    const mockedHttpClient = jasmine.createSpyObj('mockedHttpClient', ['get', 'put']);

    it('should call getListOfUsers', () => {
        const service = new UsersService(mockedHttpClient);
        mockedHttpClient.get.and.returnValue(of());
        service.getListOfUsers();
        expect(mockedHttpClient.get).toHaveBeenCalledWith('/api/userList');
    });

    it('should call getJurisdictions', () => {
        const service = new UsersService(mockedHttpClient);
        mockedHttpClient.put.and.returnValue(of());
        service.suspendUser({payload: { userIdentifier: 'dummy' }});
        expect(mockedHttpClient.put).toHaveBeenCalledWith('/api/user/dummy/suspend', { userIdentifier: 'dummy', idamStatus: 'Suspend' });
    });
});
