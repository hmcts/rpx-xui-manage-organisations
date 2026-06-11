import { of } from 'rxjs';
import { RoleGuard } from './user-role.guard';

describe('RoleGuard', () => {
  it('should return the CAA admin state from the store', (done) => {
    const store = jasmine.createSpyObj('Store', ['pipe']);
    store.pipe.and.returnValue(of(false));

    const guard = new RoleGuard(store);

    guard.canActivate().subscribe((result) => {
      expect(result).toBeFalse();
      expect(store.pipe).toHaveBeenCalled();
      done();
    });
  });
});
