import { of } from 'rxjs';
import { CaaCasesFilterType, CaaCasesPageType } from '../models/caa-cases.enum';
import { CaaCasesService } from './caa-cases.service';

describe('CaaCasesService', () => {
  it('getCaaAssignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases`, null);
  });

  it('getCaaAssignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('getCaaUnassignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases`, null);
  });

  it('getCaaUnassignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('getCaaCaseTypes', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes();
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}`, null);
  });
});
