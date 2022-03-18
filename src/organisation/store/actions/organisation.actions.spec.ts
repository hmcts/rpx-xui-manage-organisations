import { OrganisationDetails } from '../../../models';
import {
  LOAD_ORGANISATION,
  LOAD_ORGANISATION_FAIL,
  LOAD_ORGANISATION_SUCCESS,
  LoadOrganisation,
  LoadOrganisationFail,
  LoadOrganisationSuccess,
} from './organisation.actions';

describe('Load Organisation', () => {
  it('should create an action', () => {
    const action = new LoadOrganisation();
    expect({ ...action }).toEqual({ type: LOAD_ORGANISATION });
  });
});

describe('LoadOrganisationSuccess', () => {
  it('should create an action', () => {
    const payload: OrganisationDetails = {
      name: 'a@b.com',
      organisationIdentifier: 'A111111',
      contactInformation: [{
      addressLine1: '10  oxford street',
      addressLine2: 'A Town',
      addressLine3: null,
      townCity: 'London',
      county: null,
      country: 'UK',
      postCode: 'W1',
      dxAddress: [{
        dxNumber: 'dx11111',
        dxExchange: 'dxExchange'
      }]
    }],
      status: '',
      sraId: '',
      sraRegulated: true,
      superUser: {
      firstName: 'James',
        lastName: 'Chris',
        email: 'James.Chris@test.com'
    },
      paymentAccount: [{pbaNumber: 'PBA000000'}],
      pendingAddPaymentAccount: [],
      pendingRemovePaymentAccount: []
    };
    const action = new LoadOrganisationSuccess(payload);
    expect({ ...action }).toEqual({
      type: LOAD_ORGANISATION_SUCCESS,
      payload,
    });
  });
});

describe('LoadOrganisationFail', () => {
  it('should create an action', () => {
    const payload: any = 'fail';
    const action = new LoadOrganisationFail(payload);
    expect({ ...action }).toEqual({
      type: LOAD_ORGANISATION_FAIL,
      payload,
    });
  });
});
