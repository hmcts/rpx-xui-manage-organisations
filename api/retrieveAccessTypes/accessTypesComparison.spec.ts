import { expect } from 'chai';
import { processAccessTypes } from './accessTypesComparison';

describe('processAccessTypes', () => {
  it('keeps user selections only for displayed access types and applies mandatory/default selections', () => {
    const currentOrganisationAccessTypes = [
      {
        jurisdictionId: 'CIVIL',
        accessTypes: [
          {
            accessTypeId: 'CIVIL_STANDARD',
            accessDefault: false,
            accessMandatory: false,
            display: true,
            organisationProfileId: 'SOLICITOR_PROFILE'
          },
          {
            accessTypeId: 'CIVIL_MANDATORY',
            accessDefault: true,
            accessMandatory: true,
            display: true,
            organisationProfileId: 'SOLICITOR_PROFILE'
          },
          {
            accessTypeId: 'CIVIL_HIDDEN',
            accessDefault: true,
            accessMandatory: false,
            display: false,
            organisationProfileId: 'SOLICITOR_PROFILE'
          },
          {
            accessTypeId: 'CIVIL_DEFAULT',
            accessDefault: true,
            accessMandatory: false,
            display: true,
            organisationProfileId: 'SOLICITOR_PROFILE'
          }
        ]
      }
    ];

    const userAccessTypeOptions = {
      email: 'casey.invite@example.com',
      userAccessTypes: [
        {
          accessTypeId: 'CIVIL_STANDARD',
          enabled: false,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        },
        {
          accessTypeId: 'CIVIL_MANDATORY',
          enabled: false,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        },
        {
          accessTypeId: 'CIVIL_HIDDEN',
          enabled: true,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        },
        {
          accessTypeId: 'STALE_ACCESS',
          enabled: true,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        }
      ]
    };

    const result = processAccessTypes(currentOrganisationAccessTypes, userAccessTypeOptions);

    expect(result).to.deep.equal({
      email: 'casey.invite@example.com',
      userAccessTypes: [
        {
          accessTypeId: 'CIVIL_STANDARD',
          enabled: false,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        },
        {
          accessTypeId: 'CIVIL_MANDATORY',
          enabled: true,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        },
        {
          accessTypeId: 'CIVIL_DEFAULT',
          enabled: true,
          jurisdictionId: 'CIVIL',
          organisationProfileId: 'SOLICITOR_PROFILE'
        }
      ]
    });
  });

  it('preserves hyphenated access type identifiers when adding displayed defaults', () => {
    const currentOrganisationAccessTypes = [
      {
        jurisdictionId: 'CIVIL-FAMILY',
        accessTypes: [
          {
            accessTypeId: 'URGENT-APPLICATIONS-DEFAULT',
            accessDefault: true,
            accessMandatory: false,
            display: true,
            organisationProfileId: 'SOLICITOR-PROFILE'
          }
        ]
      }
    ];

    const userAccessTypeOptions = {
      email: 'casey.invite@example.com',
      userAccessTypes: []
    };

    const result = processAccessTypes(currentOrganisationAccessTypes, userAccessTypeOptions);

    expect(result).to.deep.equal({
      email: 'casey.invite@example.com',
      userAccessTypes: [
        {
          accessTypeId: 'URGENT-APPLICATIONS-DEFAULT',
          enabled: true,
          jurisdictionId: 'CIVIL-FAMILY',
          organisationProfileId: 'SOLICITOR-PROFILE'
        }
      ]
    });
  });
});
