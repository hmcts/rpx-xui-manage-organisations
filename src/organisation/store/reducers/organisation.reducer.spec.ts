import { OrganisationDetails } from '../../../models/organisation.model';
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

  describe('address update actions', () => {
    const draftAddress = {
      address: {
        addressLine1: '1 High Street',
        addressLine2: null,
        addressLine3: null,
        postTown: 'London',
        county: null,
        country: 'UK',
        postCode: 'SW1A 1AA'
      },
      hasDxReference: false,
      dxNumber: null,
      dxExchange: null,
      inInternationalMode: false,
      showExistingAddress: false
    };

    it('should initialise and update a separate address draft', () => {
      const initialised = fromOrganisation.reducer(
        fromOrganisation.initialState,
        new fromActions.InitialiseOrganisationAddressUpdate(draftAddress)
      );
      const updated = fromOrganisation.reducer(
        initialised,
        new fromActions.UpdateOrganisationAddressDraft({ hasDxReference: true, dxNumber: '123' })
      );

      expect(updated.addressUpdateDraft.address.addressLine1).toBe('1 High Street');
      expect(updated.addressUpdateDraft.hasDxReference).toBeTrue();
      expect(updated.addressUpdateDraft.dxNumber).toBe('123');
    });

    it('should update confirmed contact information only after a successful response', () => {
      const previousState = {
        ...fromOrganisation.initialState,
        organisationDetails: {
          contactInformation: [{ addressLine1: 'Old address' }]
        } as any,
        addressUpdateDraft: draftAddress,
        addressUpdating: true
      };
      const contactInformation = {
        addressLine1: '1 High Street',
        addressLine2: null,
        addressLine3: null,
        townCity: 'London',
        county: null,
        country: 'UK',
        postCode: 'SW1A 1AA',
        dxAddress: []
      };

      const state = fromOrganisation.reducer(
        previousState,
        new fromActions.OrganisationUpdateAddressSuccess(contactInformation)
      );

      expect(state.organisationDetails.contactInformation[0]).toEqual(contactInformation);
      expect(state.addressUpdateDraft).toBeNull();
      expect(state.addressUpdating).toBeFalse();
    });

    it('should keep the draft and confirmed organisation after an update fails', () => {
      const organisationDetails = {
        organisationIdentifier: 'ORG1',
        contactInformation: [{ addressLine1: 'Original address' }]
      } as OrganisationDetails;
      const error = new Error('Update failed');
      const state = fromOrganisation.reducer(
        {
          ...fromOrganisation.initialState,
          organisationDetails,
          addressUpdateDraft: draftAddress,
          addressUpdating: true
        },
        new fromActions.OrganisationUpdateAddressError(error)
      );

      expect(state.organisationDetails).toBe(organisationDetails);
      expect(state.addressUpdateDraft).toBe(draftAddress);
      expect(state.addressUpdating).toBeFalse();
      expect(state.addressUpdateError).toBe(error);
    });

    it('should clear an abandoned draft without changing the organisation', () => {
      const organisationDetails = { organisationIdentifier: 'ORG1' } as any;
      const state = fromOrganisation.reducer(
        { ...fromOrganisation.initialState, organisationDetails, addressUpdateDraft: draftAddress },
        new fromActions.ClearOrganisationAddressUpdate()
      );

      expect(state.organisationDetails).toBe(organisationDetails);
      expect(state.addressUpdateDraft).toBeNull();
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
