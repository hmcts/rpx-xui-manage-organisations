import { AuthGuard } from './auth.guard';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let mockStore: any;
  let mockService: any;

  beforeEach(() => {
    mockStore = jasmine.createSpyObj('mockStore', ['unsubscribe', 'dispatch', 'pipe']);
    mockService = jasmine.createSpyObj('mockService', ['get']);
    guard = new AuthGuard(mockStore, mockService, mockService);
  });

  describe('canActivate', () => {
    it('is Truthy', () => {
      expect(guard).toBeTruthy();
    });
  });

});
