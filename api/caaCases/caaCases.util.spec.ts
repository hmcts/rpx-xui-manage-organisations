import { expect } from 'chai';
import { caseAssignment } from './caaCases.constants';
import { getApiPath } from './caaCases.util';

describe('util', () => {
  it('getApiPath', () => {
    const fullPath = getApiPath('http://somePath', 'caseTypeId1');
    expect(fullPath).to.equal(`http://somePath${caseAssignment}?ctid=caseTypeId1&use_case=ORGCASES`);
  })
})
