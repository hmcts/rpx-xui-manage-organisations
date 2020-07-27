import { of } from 'rxjs';
import { UnassignedCasesService } from './unassigned-cases.service';

describe('UnassignedCasesService', () => {
    it('fetchUnassignedCases', () => {
        const mockHttp = jasmine.createSpyObj('http', ['get']);
        mockHttp.get.and.returnValue(of({}));
        const service = new UnassignedCasesService(mockHttp);
        service.fetchUnassignedCases();
        expect(mockHttp.get).toHaveBeenCalledWith(UnassignedCasesService.url);
    });
});
