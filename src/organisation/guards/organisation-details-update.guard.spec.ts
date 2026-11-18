import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { of } from 'rxjs';
import { InitialiseOrganisationNameUpdate, InitialiseOrganisationSraUpdate } from '../store';
import { OrganisationDetailsUpdateGuard } from './organisation-details-update.guard';

describe('OrganisationDetailsUpdateGuard', () => {
  let organisationGuard;
  let store;
  let guard: OrganisationDetailsUpdateGuard;

  beforeEach(() => {
    organisationGuard = jasmine.createSpyObj('OrganisationGuard', ['checkStore']);
    store = jasmine.createSpyObj('Store', ['pipe', 'dispatch']);
    organisationGuard.checkStore.and.returnValue(of(true));
    store.pipe.and.callFake((...operators: any[]) => operators.slice(1).reduce(
      (source, operator) => operator(source),
      of({ name: 'Current organisation', sraId: 'SRA123456' })
    ));
    guard = new OrganisationDetailsUpdateGuard(organisationGuard, store);
  });

  it('should initialise the name draft from the loaded organisation', (done) => {
    const route = { data: { updateType: 'name' } as Data } as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      const action = store.dispatch.calls.mostRecent().args[0] as InitialiseOrganisationNameUpdate;
      expect(action).toEqual(jasmine.any(InitialiseOrganisationNameUpdate));
      expect(action.payload).toEqual({ name: 'Current organisation' });
      done();
    });
  });

  it('should initialise the SRA draft from the loaded organisation', (done) => {
    const route = { data: { updateType: 'sra' } as Data } as ActivatedRouteSnapshot;

    guard.canActivate(route).subscribe((canActivate) => {
      expect(canActivate).toBeTrue();
      const action = store.dispatch.calls.mostRecent().args[0] as InitialiseOrganisationSraUpdate;
      expect(action).toEqual(jasmine.any(InitialiseOrganisationSraUpdate));
      expect(action.payload).toEqual({ sraId: 'SRA123456' });
      done();
    });
  });
});
