import { HttpParams } from '@angular/common/http';
import { LovRefDataService } from './lov-ref-data.service';

describe('Lov RefData service', () => {
  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['get']);

  describe('LovRefDataService', () => {
    it('getListOfValues should make correct api call', () => {
      const service = new LovRefDataService(mockHttpService);
      service.getListOfValues('OrgType', true);

      const options = {
        params: new HttpParams()
          .set('categoryId', 'OrgType')
          .set('isChildRequired', 'Y')
      };

      expect(mockHttpService.get).toHaveBeenCalledWith('external/getLovRefData', options);
    });

    it('getListOfValuesForService should make correct api call', () => {
      const service = new LovRefDataService(mockHttpService);
      service.getListOfValuesForService('OrgType', 'OrgSubType', true);

      const options = {
        params: new HttpParams()
          .set('categoryId', 'OrgType')
          .set('serviceId', 'OrgSubType')
          .set('isChildRequired', 'Y')
      };

      expect(mockHttpService.get).toHaveBeenCalledWith('external/getLovRefData', options);
    });
  });
});
