import { expect } from 'chai';
import { getUserTermsAndConditionsUrl } from './userTermsAndConditionsUtil';

describe('terms And Conditions ', () => {
  it('should getUserTermsAndConditionsUrl', () => {
    const url = getUserTermsAndConditionsUrl('http://base', 'userId1234', 'xuiwebapp');
    expect(url).to.equal('http://base/api/v1/termsAndConditions/xuiwebapp/users/userId1234');
  });
});
