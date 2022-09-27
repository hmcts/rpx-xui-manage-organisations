import { of } from 'rxjs';
import { CaaCasesFilterType, CaaCasesPageType } from '../models/caa-cases.enum';
import { CaaCasesService } from './caa-cases.service';

describe('CaaCasesService', () => {
  it('should getCaaAssignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases`, null);
  });

  it('should getCaaAssignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaUnassignedCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases`, null);
  });

  it('should getCaaUnassignedCases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaCaseTypes for assigned cases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes(CaaCasesPageType.AssignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=assigned-cases`, null);
  });

  it('should getCaaCaseTypes for assigned cases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes(CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=assigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaCaseTypes for unassigned cases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes(CaaCasesPageType.UnassignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=unassigned-cases`, null);
  });

  it('should getCaaCaseTypes for unassigned cases with filter value', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes(CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=unassigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });
});
