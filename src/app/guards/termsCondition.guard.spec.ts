import { TermsConditionGuard } from './termsCondition.guard';
import {LoadHasAcceptedTC, LoadHasAcceptedTCSuccess} from '../../user-profile/store/actions';
import {cold, hot} from 'jasmine-marbles';

describe('Accept Tc Component', () => {
  let guard: TermsConditionGuard;
  let mockStore: any;
  let mockService: any;
  // let actions$;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockService = jasmine.createSpyObj('mockService', ['get']);
    guard = new TermsConditionGuard(mockStore);
  });

  it('is Truthy', () => {
    expect(guard).toBeTruthy();
  });

  it('can checkStore', () => {
    guard.checkStore();
    expect(mockStore.pipe).toHaveBeenCalled();
  });

  it('can activate', () => {
    // const completion = guard.canActivate()
    // actions$ = hot('-a', { a: action });
    // const expected = cold('-b', { b: completion });
    // expect(expected).toBeObservable()
  });
});
