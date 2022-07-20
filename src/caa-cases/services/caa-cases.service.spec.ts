import { of } from 'rxjs';
import { CaaCasesService } from './caa-cases.service';

describe('CaaCasesService', () => {
  it('getCaaCases', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCases('caseTypeId1', 1, 10);
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCasesUrl}?caseTypeId=caseTypeId1&pageNo=1&pageSize=10`, null);
  });

  it('getCaaCaseTypes', () => {
    const mockHttp = jasmine.createSpyObj('http', ['post']);
    mockHttp.post.and.returnValue(of({}));
    const service = new CaaCasesService(mockHttp);
    service.getCaaCaseTypes();
    expect(mockHttp.post).toHaveBeenCalledWith(`${CaaCasesService.caaCaseTypesUrl}`, null);
  });
});
