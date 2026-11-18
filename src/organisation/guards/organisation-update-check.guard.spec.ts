import { ActivatedRouteSnapshot, Data } from '@angular/router';
import { of } from 'rxjs';
import { OrganisationDetailsUpdateType } from './organisation-details-update.guard';
import { OrganisationUpdateCheckGuard } from './organisation-update-check.guard';

describe('OrganisationUpdateCheckGuard', () => {
  let router;
  let store;
  let guard: OrganisationUpdateCheckGuard;
  let draftCompleted: boolean;

  const route = (updateType: OrganisationDetailsUpdateType): ActivatedRouteSnapshot => ({
    data: { updateType } as Data
  } as ActivatedRouteSnapshot);

  beforeEach(() => {
    router = jasmine.createSpyObj('Router', ['createUrlTree']);
    router.createUrlTree.and.callFake((commands) => commands[0]);
    store = jasmine.createSpyObj('Store', ['pipe']);
    store.pipe.and.callFake((...operators: any[]) => operators.slice(1).reduce(
      (source, operator) => operator(source),
      of(draftCompleted)
    ));
    guard = new OrganisationUpdateCheckGuard(store, router);
  });

  it('should allow check answers after the edit step has been completed', (done) => {
    draftCompleted = true;

    guard.canActivate(route('sra')).subscribe((result) => {
      expect(result).toBeTrue();
      expect(router.createUrlTree).not.toHaveBeenCalled();
      done();
    });
  });

  [
    { updateType: 'name' as const, path: '/organisation/update-org-name' },
    { updateType: 'sra' as const, path: '/organisation/update-sra' }
  ].forEach(({ updateType, path }) => {
    it(`should return to the ${updateType} edit step when check answers is opened directly`, (done) => {
      draftCompleted = false;

      guard.canActivate(route(updateType)).subscribe((result) => {
        expect(result).toBe(path as any);
        expect(router.createUrlTree).toHaveBeenCalledWith([path]);
        done();
      });
    });
  });
});
