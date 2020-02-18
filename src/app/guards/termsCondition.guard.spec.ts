import { TermsConditionGuard } from './termsCondition.guard';
import { of } from 'rxjs';

describe('Accept Tc Component', () => {
  let guard: TermsConditionGuard;
  let mockStore: any;
  let mockService: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockService = jasmine.createSpyObj('mockService', ['get']);
    guard = new TermsConditionGuard(mockStore);
  });

  it('is Truthy', () => {
    expect(guard).toBeTruthy();
  });

  it('can dispatchLoadHasAcceptedTC with userId', () => {
    guard.dispatchLoadHasAcceptedTC('userId', mockStore);
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('dispatchLoadHasAcceptedTC with invalid userId', () => {
    guard.dispatchLoadHasAcceptedTC(undefined, mockStore);
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });

  it('can loadTandCIfNotLoaded', () => {
    const tAndC = { hasUserAccepted: 'false', loaded: false };
    const observable = of({ hasUserAccepted: 'false', loaded: false });
    mockStore.pipe.and.returnValue(observable);
    guard.loadTandCIfNotLoaded(tAndC, mockStore);
    expect(mockStore.pipe).toHaveBeenCalled();
  });

  it('can loadTandCIfNotLoaded when not loaded', () => {
    const tAndC = { hasUserAccepted: 'false', loaded: true };
    const observable = of({ hasUserAccepted: 'false', loaded: true });
    mockStore.pipe.and.returnValue(observable);
    guard.loadTandCIfNotLoaded(tAndC, mockStore);
    expect(mockStore.pipe).not.toHaveBeenCalled();
  });

  it('can dispatchGoIfUserHasNotAccepted', () => {
    const tAndC = { hasUserAccepted: 'false', loaded: true };
    guard.dispatchGoIfUserHasNotAccepted(tAndC, mockStore, 'tAndC');
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('can dispatchGoIfUserHasNotAccepted', () => {
    const tAndC = { hasUserAccepted: 'true', loaded: true };
    guard.dispatchGoIfUserHasNotAccepted(tAndC, mockStore, 'tAndC');
    expect(mockStore.dispatch).not.toHaveBeenCalled();
  });
});
