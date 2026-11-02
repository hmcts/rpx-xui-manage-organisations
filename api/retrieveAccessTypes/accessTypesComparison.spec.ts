import { expect } from 'chai';
import { processAccessTypes } from './accessTypesComparison';

describe('OGD access type comparison', () => {
  it('enforces mandatory defaults, keeps visible selections and removes unavailable access types', () => {
    const jurisdictions = [{
      jurisdictionId: 'civil-jurisdiction',
      accessTypes: [
        { organisationProfileId: 'profile-1', accessTypeId: 'mandatory-type', accessMandatory: true, accessDefault: true, display: true },
        { organisationProfileId: 'profile-1', accessTypeId: 'optional-type', accessMandatory: false, accessDefault: false, display: true },
        { organisationProfileId: 'profile-1', accessTypeId: 'hidden-type', accessMandatory: false, accessDefault: false, display: false }
      ]
    }];
    const userPayload = {
      email: 'user@example.invalid',
      userAccessTypes: [
        { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'mandatory-type', enabled: false },
        { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'optional-type', enabled: true },
        { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'hidden-type', enabled: true },
        { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'removed-type', enabled: true }
      ]
    };

    const result = processAccessTypes(jurisdictions, userPayload);

    expect(result.email).to.equal(userPayload.email);
    expect(result.userAccessTypes).to.deep.equal([
      { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'mandatory-type', enabled: true },
      { jurisdictionId: 'civil-jurisdiction', organisationProfileId: 'profile-1', accessTypeId: 'optional-type', enabled: true }
    ]);
  });

  it('adds newly available defaults without changing identifiers containing hyphens', () => {
    const result = processAccessTypes([{
      jurisdictionId: 'civil-jurisdiction',
      accessTypes: [{
        organisationProfileId: 'profile-1',
        accessTypeId: 'new-type',
        accessMandatory: false,
        accessDefault: true,
        display: true
      }]
    }], { userAccessTypes: [] });

    expect(result.userAccessTypes).to.deep.equal([{
      jurisdictionId: 'civil-jurisdiction',
      organisationProfileId: 'profile-1',
      accessTypeId: 'new-type',
      enabled: true
    }]);
  });
});
