import { SharedCase } from '@hmcts/rpx-xui-common-lib/lib/models/case-share.model';
import { of } from 'rxjs';
import { CaseShareService } from './share-case.service';

describe('CaseShareService', () => {
  describe('getUsersFromOrg()', () => {
    it('should make a get request to the user details end-point', () => {
      const mockHttp = jasmine.createSpyObj('http', ['get']);
      mockHttp.get.and.returnValue(of({}));
      const service = new CaseShareService(mockHttp);
      service.getUsersFromOrg();
      expect(mockHttp.get).toHaveBeenCalledWith('api/caseshare/users');
    });
  });

  describe('getShareCases()', () => {
    it('should get share cases with correct params', () => {
      const cases: SharedCase[] = [
        { caseId: '1', caseTitle: '1' },
        { caseId: '2', caseTitle: '2' }
      ];

      const mockHttp = jasmine.createSpyObj('http', ['get']);
      mockHttp.get.and.returnValue(of({}));
      const service = new CaseShareService(mockHttp);
      service.getShareCases(cases);

      const expectedOptions = {
        params: {
          case_ids: '1,2'
        }
      };
      expect(mockHttp.get).toHaveBeenCalledWith('api/caseshare/cases', expectedOptions);
    });

    it('should get share case with correct params', () => {
      const cases = [
        { caseId: '1' }
      ] as SharedCase[];

      const mockHttp = jasmine.createSpyObj('http', ['get']);
      mockHttp.get.and.returnValue(of({}));
      const service = new CaseShareService(mockHttp);
      service.getShareCases(cases);

      const expectedOptions = {
        params: {
          case_ids: '1'
        }
      };
      expect(mockHttp.get).toHaveBeenCalledWith('api/caseshare/cases', expectedOptions);
    });
  });
});
