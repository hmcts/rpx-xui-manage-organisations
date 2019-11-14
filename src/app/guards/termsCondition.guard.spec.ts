import { TermsConditionGuard } from './termsCondition.guard';

describe('Accept Tc Wrapper Component', () => {
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

  it('checkStore', () => {
    guard.checkStore();
    expect(mockStore.pipe).toHaveBeenCalled();
  });

});
