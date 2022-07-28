import { CaaCasesFilterType } from 'api/caaCases/enums';
import { of } from 'rxjs';
import { CaaCasesPageType } from '../models/caa-cases.enum';
import { CaaCasesService } from './caa-cases.service';

describe('CaaCasesService', () => {
  it('getCaaAssignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesFilterType.none, null, CaaCasesPageType.assignedCases);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases`, null);
  });

  it('getCaaUnassignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesFilterType.none, null, CaaCasesPageType.unassignedCases);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases`, null);
  });

  it('getCaaCaseTypes', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes();
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}`, null);
  });
});
