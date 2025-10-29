import { provideMockStore } from '@ngrx/store/testing';

// Minimal aggregate app state slices accessed by noisy selectors in tests.
// Feature keys: 'registration', 'org', 'caaCases'. Each mirrors the feature selector root.

export function buildMockStoreProviders(overrides: Partial<any> = []) {
  const baseState = {
    registration: {
      registration: {
        pages: {},
        pagesValues: { haveDXNumber: 'dontHaveDX' },
        navigation: {},
        nextUrl: '',
        loaded: false,
        loading: false,
        submitted: false,
        errorMessage: '',
        errorMessageCode: ''
      }
    },
    org: {
      organisation: {
        organisationDetails: null,
        loaded: false,
        loading: false,
        error: null
      }
    },
    caaCases: {
      caaCases: { loaded: false, loading: false, error: null, cases: [] },
      caseShare: {
        shareAssignedCases: [],
        shareUnassignedCases: [],
        loading: false,
        error: undefined,
        users: []
      }
    }
  };
  const initialState = { ...baseState, ...overrides };
  return [provideMockStore({ initialState })];
}
