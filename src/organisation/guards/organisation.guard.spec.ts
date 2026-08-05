import { TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { OrganisationDetails } from 'src/models/organisation.model';
import { OrganisationGuard } from './organisation.guard';
import * as fromStore from '../store';

describe('OrganisationGuard', () => {
  let guard: OrganisationGuard;
  let store: MockStore;
  let dispatchSpy: jasmine.Spy;

  const organisationDetails = {
    organisationIdentifier: 'ORG1',
    name: 'Test Organisation'
  } as OrganisationDetails;

  const loadOrganisationDispatchCount = (): number => dispatchSpy.calls.allArgs()
    .filter(([action]) => action.type === fromStore.LOAD_ORGANISATION).length;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OrganisationGuard,
        provideMockStore()
      ]
    });

    guard = TestBed.inject(OrganisationGuard);
    store = TestBed.inject(MockStore);
    dispatchSpy = spyOn(store, 'dispatch').and.callThrough();
  });

  afterEach(() => {
    store.resetSelectors();
  });

  it('should allow activation without loading organisation again when organisation is in the store', () => {
    store.overrideSelector(fromStore.getOrganisationSel, organisationDetails);

    let result: boolean;
    guard.checkStore().subscribe((canActivate) => result = canActivate);

    expect(result).toBeTrue();
    expect(loadOrganisationDispatchCount()).toBe(0);
  });

  it('should load organisation when organisation is missing from the store', () => {
    const organisationSelector = store.overrideSelector(fromStore.getOrganisationSel, null);
    const results: boolean[] = [];

    guard.checkStore().subscribe((canActivate) => results.push(canActivate));

    expect(loadOrganisationDispatchCount()).toBe(1);
    expect(results).toEqual([]);

    organisationSelector.setResult(organisationDetails);
    store.refreshState();

    expect(results).toEqual([true]);
  });
});
