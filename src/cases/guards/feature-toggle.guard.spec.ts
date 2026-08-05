import { of } from 'rxjs';
import { FeatureToggleAccountGuard } from './feature-toggle.guard';

describe('FeatureToggleAccountGuard', () => {
  it('should return the feature-toggle state from the store', (done) => {
    const store = jasmine.createSpyObj('Store', ['pipe']);
    store.pipe.and.returnValue(of(true));

    const guard = new FeatureToggleAccountGuard(store);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeTrue();
      expect(store.pipe).toHaveBeenCalled();
      done();
    });
  });
});
