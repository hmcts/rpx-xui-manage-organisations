import { of } from 'rxjs';
import { CaaCasesPageType } from '../models/caa-cases.enum';
import { CaaCasesService } from './caa-cases.service';

describe('CaaCasesService', () => {
  it('getCaaAssignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases`, null);
  });

  it('getCaaAssignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases&caaCasesFilterValue=1111222233334444`, null);
  });

  it('getCaaUnassignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases`, null);
  });

  it('getCaaUnassignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases&caaCasesFilterValue=1111222233334444`, null);
  });

  it('getCaaCaseTypes', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes();
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}`, null);
  });
});
