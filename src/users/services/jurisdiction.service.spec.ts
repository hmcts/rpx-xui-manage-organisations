import { JurisdictionService } from './jurisdiction.service';

describe('Jurisdiction service', () => {
    const mockedHttpClient = jasmine.createSpyObj('mockedHttpClient', ['get']);

    it('should be Truthy', () => {
        const service = new JurisdictionService(mockedHttpClient);
        expect(service).toBeTruthy();
    });

    it('should call logOut', () => {
        const service = new JurisdictionService(mockedHttpClient);
        service.getJurisdictions();
        expect(mockedHttpClient.get).toHaveBeenCalledWith('api/jurisdictions');
    });
});
