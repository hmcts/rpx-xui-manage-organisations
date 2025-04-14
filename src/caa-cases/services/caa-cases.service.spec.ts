import { provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { CaaCasesFilterType, CaaCasesPageType } from '../models/caa-cases.enum';
import { CaaCasesSessionState, CaaCasesSessionStateValue } from '../models/caa-cases.model';
import { CaaCasesService } from './caa-cases.service';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

describe('CaaCasesService', () => {
  let service: CaaCasesService;
  let mockSessionStorage: any;
  let mockHttp: any;
  const sessionStateValue: CaaCasesSessionStateValue = {
    filterType: CaaCasesFilterType.AssigneeName,
    caseReferenceNumber: null,
    assigneeName: 'assignee123'
  };
  const sessionState: CaaCasesSessionState = {
    key: 'assigned-cases',
    value: sessionStateValue
  };

  beforeEach(() => {
    const store = {};
    mockSessionStorage = {
      getItem: (key: string): string => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      }
    };
    TestBed.configureTestingModule({
    imports: [],
    providers: [CaaCasesService, provideHttpClient(withInterceptorsFromDi()), provideHttpClientTesting()]
});
    mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    service = new CaaCasesService(mockHttp);
  });

  it('should getCaaAssignedCases', () => {
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases`, null);
  });

  it('should getCaaAssignedCases with filter value', () => {
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=assigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaUnassignedCases', () => {
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases`, null);
  });

  it('should getCaaUnassignedCases with filter value', () => {
    service.getCaaCases('caseTypeId1', 1, 10, CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10&caaCasesPageType=unassigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaCaseTypes for assigned cases', () => {
    service.getCaaCaseTypes(CaaCasesPageType.AssignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=assigned-cases`, null);
  });

  it('should getCaaCaseTypes for assigned cases with filter value', () => {
    service.getCaaCaseTypes(CaaCasesPageType.AssignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=assigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should getCaaCaseTypes for unassigned cases', () => {
    service.getCaaCaseTypes(CaaCasesPageType.UnassignedCases, null, null);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=unassigned-cases`, null);
  });

  it('should getCaaCaseTypes for unassigned cases with filter value', () => {
    service.getCaaCaseTypes(CaaCasesPageType.UnassignedCases, CaaCasesFilterType.CaseReferenceNumber, '1111222233334444');
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}?caaCasesPageType=unassigned-cases&caaCasesFilterType=case-reference-number&caaCasesFilterValue=1111222233334444`, null);
  });

  it('should store session state', () => {
    spyOn(window.sessionStorage, 'setItem');
    service.storeSessionState(sessionState);
    expect(window.sessionStorage.setItem).toHaveBeenCalledWith('assigned-cases', JSON.stringify(sessionState.value));
  });

  it('should retrieve session state', () => {
    mockSessionStorage.setItem('assigned-cases', JSON.stringify(sessionState.value));
    spyOn(window.sessionStorage, 'getItem').and.callFake(mockSessionStorage.getItem);
    const assignedCasesSessionStateValue = service.retrieveSessionState('assigned-cases');
    expect(assignedCasesSessionStateValue).toEqual(sessionState.value);
    expect(window.sessionStorage.getItem).toHaveBeenCalledWith('assigned-cases');
  });

  it('should remove session state', () => {
    spyOn(window.sessionStorage, 'removeItem');
    mockSessionStorage.setItem(sessionState.key, sessionState.value);
    service.removeSessionState('assigned-cases');
    expect(window.sessionStorage.removeItem).toHaveBeenCalledWith('assigned-cases');
  });
});
