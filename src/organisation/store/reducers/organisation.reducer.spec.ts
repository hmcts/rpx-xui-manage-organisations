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

  describe('name update actions', () => {
    it('should initialise and update the name draft', () => {
      const initialised = fromOrganisation.reducer(
        fromOrganisation.initialState,
        new fromActions.InitialiseOrganisationNameUpdate({ name: 'Current organisation' })
      );
      expect(initialised.nameUpdateDraftCompleted).toBeFalse();
      const updated = fromOrganisation.reducer(
        initialised,
        new fromActions.UpdateOrganisationNameDraft({ name: 'Updated organisation' })
      );

      expect(updated.nameUpdateDraft).toEqual({ name: 'Updated organisation' });
      expect(updated.nameUpdateDraftCompleted).toBeTrue();
    });

    it('should update the organisation name after a successful mock submission', () => {
      const previousState = {
        ...fromOrganisation.initialState,
        organisationDetails: {
          name: 'Current organisation'
        } as any,
        nameUpdateDraft: { name: 'Updated organisation' },
        nameUpdating: true
      };

      const state = fromOrganisation.reducer(
        previousState,
        new fromActions.OrganisationUpdateNameSuccess('Updated organisation')
      );

      expect(state.organisationDetails.name).toBe('Updated organisation');
      expect(state.nameUpdateDraft).toBeNull();
      expect(state.nameUpdateDraftCompleted).toBeFalse();
      expect(state.nameUpdating).toBeFalse();
    });

    it('should retain the draft when the update fails', () => {
      const error = new Error('failed');
      const previousState = {
        ...fromOrganisation.initialState,
        nameUpdateDraft: { name: 'Updated organisation' },
        nameUpdating: true
      };

      const state = fromOrganisation.reducer(
        previousState,
        new fromActions.OrganisationUpdateNameError(error)
      );

      expect(state.nameUpdateDraft).toEqual({ name: 'Updated organisation' });
      expect(state.nameUpdating).toBeFalse();
      expect(state.nameUpdateError).toBe(error);
    });
  });

  describe('SRA update actions', () => {
    it('should initialise and update the SRA draft', () => {
      const initialised = fromOrganisation.reducer(
        fromOrganisation.initialState,
        new fromActions.InitialiseOrganisationSraUpdate({ sraId: 'SRA123456' })
      );
      expect(initialised.sraUpdateDraftCompleted).toBeFalse();
      const updated = fromOrganisation.reducer(
        initialised,
        new fromActions.UpdateOrganisationSraDraft({ sraId: 'SRA654321' })
      );

      expect(updated.sraUpdateDraft).toEqual({ sraId: 'SRA654321' });
      expect(updated.sraUpdateDraftCompleted).toBeTrue();
    });

    it('should update the organisation SRA ID after a successful mock submission', () => {
      const previousState = {
        ...fromOrganisation.initialState,
        organisationDetails: { sraId: 'SRA123456' } as any,
        sraUpdateDraft: { sraId: 'SRA654321' },
        sraUpdating: true
      };

      const state = fromOrganisation.reducer(
        previousState,
        new fromActions.OrganisationUpdateSraSuccess('SRA654321')
      );

      expect(state.organisationDetails.sraId).toBe('SRA654321');
      expect(state.sraUpdateDraft).toBeNull();
      expect(state.sraUpdateDraftCompleted).toBeFalse();
      expect(state.sraUpdating).toBeFalse();
    });

    it('should retain the SRA draft when the update fails', () => {
      const error = new Error('failed');
      const previousState = {
        ...fromOrganisation.initialState,
        sraUpdateDraft: { sraId: 'SRA654321' },
        sraUpdating: true
      };

      const state = fromOrganisation.reducer(
        previousState,
        new fromActions.OrganisationUpdateSraError(error)
      );

      expect(state.sraUpdateDraft).toEqual({ sraId: 'SRA654321' });
      expect(state.sraUpdating).toBeFalse();
      expect(state.sraUpdateError).toBe(error);
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
