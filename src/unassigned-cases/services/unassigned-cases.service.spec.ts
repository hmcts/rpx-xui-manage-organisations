import { of } from 'rxjs';
import { UnassignedCasesService } from './unassigned-cases.service';

describe('UnassignedCasesService', () => {
    it('fetchUnassignedCases', () => {
        const mockHttp = jasmine.createSpyObj('http', ['post']);
        mockHttp.post.and.returnValue(of({}));
        const service = new UnassignedCasesService(mockHttp);
        service.fetchUnassignedCases('caseTypeId1');
        expect(mockHttp.post).toHaveBeenCalledWith(`${UnassignedCasesService.unassignedCasesUrl}?caseTypeId=caseTypeId1`, null);
    });
});
