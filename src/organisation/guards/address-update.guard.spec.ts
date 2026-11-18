import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, Router, UrlTree } from '@angular/router';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { of, Subject } from 'rxjs';
import { OrganisationDetails } from '../../models';
import * as fromStore from '../store';
import { AddressUpdateGuard } from './address-update.guard';
import { OrganisationGuard } from './organisation.guard';

describe('AddressUpdateGuard', () => {
  let guard: AddressUpdateGuard;
  let store: MockStore;
  let organisationGuard: jasmine.SpyObj<OrganisationGuard>;
  let router: jasmine.SpyObj<Router>;
  let dispatchSpy: jasmine.Spy;
  const redirect = new UrlTree();

  beforeEach(() => {
    organisationGuard = jasmine.createSpyObj('OrganisationGuard', ['checkStore']);
    organisationGuard.checkStore.and.returnValue(of(true));
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.returnValue(redirect);
    TestBed.configureTestingModule({
      providers: [
        AddressUpdateGuard,
        { provide: OrganisationGuard, useValue: organisationGuard },
        { provide: Router, useValue: router },
        provideMockStore()
      ]
    });
    store = TestBed.inject(MockStore);
    store.overrideSelector(fromStore.getOrganisationSel, {
      organisationIdentifier: 'ORG-ADDRESS-TEST'
    } as OrganisationDetails);
    dispatchSpy = spyOn(store, 'dispatch');
    guard = TestBed.inject(AddressUpdateGuard);
  });

  afterEach(() => store.resetSelectors());

  it('starts a fresh draft on the address entry screen', () => {
    const route = { firstChild: { routeConfig: { path: '' } } } as ActivatedRouteSnapshot;
    const results: (boolean | UrlTree)[] = [];

    guard.canActivate(route).subscribe((result) => results.push(result));

    expect(results).toEqual([true]);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
    const action = dispatchSpy.calls.mostRecent().args[0] as fromStore.InitialiseOrganisationAddressUpdate;
    expect(action.type).toBe(fromStore.INITIALISE_ORGANISATION_ADDRESS_UPDATE);
    expect(action.payload.address.addressLine1).toBeNull();
    expect(action.payload.hasDxReference).toBeNull();
    expect(router.createUrlTree).not.toHaveBeenCalled();
  });

  for (const path of ['document-exchange-reference', 'document-exchange-reference-details', 'check']) {
    it(`redirects a cold ${path} entry to the start instead of exposing an empty later step`, () => {
      const route = { firstChild: { routeConfig: { path } } } as ActivatedRouteSnapshot;
      const results: (boolean | UrlTree)[] = [];

      guard.canActivate(route).subscribe((result) => results.push(result));

      expect(results).toEqual([redirect]);
      expect(router.createUrlTree).toHaveBeenCalledOnceWith(['/organisation/update-address']);
    });
  }

  it('waits for the organisation before initialising the draft', () => {
    const ready = new Subject<boolean>();
    organisationGuard.checkStore.and.returnValue(ready);
    const results: (boolean | UrlTree)[] = [];

    guard.canActivate({} as ActivatedRouteSnapshot).subscribe((result) => results.push(result));

    expect(results).toEqual([]);
    expect(dispatchSpy).not.toHaveBeenCalled();
    ready.next(true);
    ready.complete();
    expect(results).toEqual([true]);
    expect(dispatchSpy).toHaveBeenCalledTimes(1);
  });
});
