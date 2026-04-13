import * as fromActions from '../actions/organisation.actions';
import * as fromOrganisation from './organisation.reducer';

describe('OrganisationReducer', () => {
  describe('undefined action', () => {
    it('should return the default state', () => {
      const { initialState } = fromOrganisation;
      const action = {} as any;
      const state = fromOrganisation.reducer(undefined, action);

      expect(state).toBe(initialState);
    });
  });

  describe('LOAD_ORGANISATION action', () => {
    it('should set loading to true', () => {
      const { initialState } = fromOrganisation;
      const action = new fromActions.LoadOrganisation();
      const state = fromOrganisation.reducer(initialState, action);

      expect(state.loading).toEqual(true);
      // untouched props, good to add regardless
      expect(state.loaded).toEqual(false);
      // expect(state.organisation).toEqual([]);
    });
  });

  // fail
  describe('LOAD_ORGANISATION action', () => {
    it('should return the previous state', () => {
      const { initialState } = fromOrganisation;
      const previousState = { ...initialState, loading: false };
      const action = new fromActions.LoadOrganisationFail({});
      const state = fromOrganisation.reducer(previousState, action);

      expect(state).toEqual(initialState);
    });
  });

  describe('LOAD_ORGANISATION_SUCCESS action', () => {
    it('should populate organisation details and mark the state as loaded', () => {
      const previousState = {
        ...fromOrganisation.initialState,
        organisationDetails: {
          organisationProfileIds: ['old-profile']
        } as any
      };
      const action = new fromActions.LoadOrganisationSuccess({
        organisationIdentifier: 'ORG1',
        name: 'Test Org',
        paymentAccount: ['PBA1234567']
      } as any);

      const state = fromOrganisation.reducer(previousState, action);

      expect(state.loaded).toBeTrue();
      expect(state.organisationDetails.organisationProfileIds).toEqual(['old-profile']);
      expect(state.organisationDetails.paymentAccount).toEqual([{ pbaNumber: 'PBA1234567' }]);
    });
  });

  describe('ORGANISATION_UPDATE_PROFILE_IDS action', () => {
    it('should merge and de-duplicate organisation profile ids', () => {
      const previousState = {
        ...fromOrganisation.initialState,
        organisationDetails: {
          organisationProfileIds: ['A', 'B']
        } as any
      };
      const action = new fromActions.OrganisationUpdateUpdateProfileIds(['B', 'C']);

      const state = fromOrganisation.reducer(previousState, action);

      expect(state.organisationDetails.organisationProfileIds).toEqual(['A', 'B', 'C']);
    });
  });

  /* TO DO - fix the unit test
  // success
  describe('LOAD_ORGANISATION_SUCCESS action', () => {
    it('should populate users from the array', () => {

      const org = new Organisation({

        organisationIdentifier: 'B13GT1M',
        name: 'dsfsfsdf',
        status: 'PENDING',
        superUser: {
        userIdentifier: '906a5157-01ad-493f-87e2-adde80dc439e',
          firstName: 'Test',
          lastName: 'dsfsdf',
          email: 'mail@mail.com'
        },
        paymentAccount: [],
        contactInformation: [
          {
            addressLine1: '22 wilberforce road',
            addressLine2: 'adffadfdfas',
            townCity: 'London',
            county: 'London',
            dxAddress: [
              {
                dxNumber: '1234567890123',
                dxExchange: '535345'
              }
            ]
          }
        ]

      });

      const { initialState } = fromOrganisation;
      const action = new fromActions.LoadOrganisationSuccess(org);
      const state = fromOrganisation.reducer(initialState, action);
console.log(`${initialState}`);
      expect(state.loaded).toEqual(true);
      expect(state.loading).toEqual(false);
      expect(state.organisationDetails).toEqual(org);
    });
  });
*/
});
