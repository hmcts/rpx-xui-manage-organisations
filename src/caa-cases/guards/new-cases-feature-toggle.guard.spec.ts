import { of } from 'rxjs';
import { NewCaseFeatureToggleGuard } from './new-cases-feature-toggle.guard';

describe('NewCaseFeatureToggleGuard', () => {
  it('should return the new cases feature-toggle state from the store', (done) => {
    const store = jasmine.createSpyObj('Store', ['pipe']);
    store.pipe.and.returnValue(of(true));

    const guard = new NewCaseFeatureToggleGuard(store);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeTrue();
      expect(store.pipe).toHaveBeenCalled();
      done();
    });
  });
});
