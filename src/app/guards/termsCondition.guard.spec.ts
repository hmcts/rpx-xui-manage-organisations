import { of } from 'rxjs';
import { TermsConditionGuard } from './termsCondition.guard';

describe('Accept Tc Component', () => {
  let guard: TermsConditionGuard;
  let mockStore: any;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let mockService: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockService = jasmine.createSpyObj('mockService', ['get']);
    const mockTermsService = jasmine.createSpyObj('mockTermsService', ['getTermsConditions']);
    guard = new TermsConditionGuard(mockStore, mockTermsService);
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
