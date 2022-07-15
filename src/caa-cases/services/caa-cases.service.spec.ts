import { of } from 'rxjs';
import { UnassignedCasesService } from './caa-cases.service';

describe('UnassignedCasesService', () => {
    it('fetchUnassignedCases', () => {
        const mockHttp = jasmine.createSpyObj('http', ['post']);
        mockHttp.post.and.returnValue(of({}));
        const service = new UnassignedCasesService(mockHttp);
        service.fetchUnassignedCases('caseTypeId1', 1, 10);
        expect(mockHttp.post).toHaveBeenCalledWith(`${UnassignedCasesService.unassignedCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10`, null);
    });
});
