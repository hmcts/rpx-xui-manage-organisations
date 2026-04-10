import { fakeAsync, tick } from '@angular/core/testing';
import { Observable, of, Subject } from 'rxjs';
import { featureToggleOdgInviteUserFlowGuard } from './feature-toggle-ogd-invite-user-flow.guard';

const applyOperators = <T>(source$: Observable<T>, operations: Array<(input$: Observable<any>) => Observable<any>>) => {
  return operations.reduce((stream$, operation) => operation(stream$), source$ as Observable<any>);
};

describe('featureToggleOdgInviteUserFlowGuard', () => {
  it('should allow activation when the feature becomes enabled', (done) => {
    const store = {
      pipe: (...operations) => applyOperators(of(true), operations)
    };

    const guard = new featureToggleOdgInviteUserFlowGuard(store as any);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should return false when the feature flag does not resolve before timeout', fakeAsync(() => {
    const source$ = new Subject<boolean>();
    const store = {
      pipe: (...operations) => applyOperators(source$, operations)
    };

    const guard = new featureToggleOdgInviteUserFlowGuard(store as any);
    let result: boolean | undefined;

    guard.canActivate().subscribe((value) => {
      result = value;
    });

    tick(2001);

    expect(result).toBeFalse();
  }));
});
