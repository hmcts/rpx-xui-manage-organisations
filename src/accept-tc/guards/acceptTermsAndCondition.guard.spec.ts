import { of, throwError } from 'rxjs';
import { AcceptTermsAndConditionGuard } from './acceptTermsAndCondition.guard';

describe('Accept terms guard', () => {
  let guard: AcceptTermsAndConditionGuard;
  let mockStore: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    guard = new AcceptTermsAndConditionGuard(mockStore);
  });

  it('is Truthy', () => {
    expect(guard).toBeTruthy();
  });

  it('can activate when TC has been accepted', () => {
    mockStore.pipe.and.returnValue(of(true));
    guard.canActivate().subscribe((v) => {
      expect(v).toBeTruthy();
    });
  });

  xit('cant activate when TC have not been accepted', () => {
    mockStore.pipe.and.returnValue(throwError('test'));
    guard.canActivate().subscribe((v) => {
      expect(v).toBeFalsy();
    });
  });
});
