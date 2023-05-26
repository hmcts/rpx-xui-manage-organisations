import { expect } from 'chai';
import { getRefdataUserCommonUrlUtil } from './refdataUserCommonUrlUtil';

describe('refdata all user list URL util', () => {
  it('should getRefdataUserCommonUrlUtil', () => {
    const url = getRefdataUserCommonUrlUtil('http://base');
    expect(url).to.equal('http://base/refdata/external/v1/organisations/users/');
  });
});
