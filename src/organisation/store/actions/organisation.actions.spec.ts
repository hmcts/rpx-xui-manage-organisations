
import { Organisation } from '../../../organisation/organisation.model';
import { LOAD_ORGANISATION, LoadOrganisation } from './organisation.actions';
import { LOAD_ORGANISATION_SUCCESS, LoadOrganisationSuccess } from './organisation.actions';
import { LOAD_ORGANISATION_FAIL, LoadOrganisationFail } from './organisation.actions';


describe('Load Organisation', () => {
  it('should create an action', () => {
    const action = new LoadOrganisation();
    expect({ ...action }).toEqual({ type: LOAD_ORGANISATION });
  });
});



describe('LoadOrganisationSuccess', () => {
  it('should create an action', () => {
    const payload: Organisation = {
      name: 'a@b.com',
      addressLine1: '10  oxford street',
      townCity: 'London',
      postcode: 'W1',
      addressLine2: '',
      country: 'UK',
      contactInformation: [],
      paymentAccount: []
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

