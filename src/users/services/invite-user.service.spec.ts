import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { InviteUserService } from './invite-user.service';
import * as fromRoot from '../../../src/app/store';

describe('Invite User', () => {
  let inviteUserService: InviteUserService;
  let httpTestingController: HttpTestingController;
  let mockStore: MockStore;

  const initialState = {};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        InviteUserService,
        provideMockStore({ initialState })
      ]
    });

    inviteUserService = TestBed.inject(InviteUserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockStore = TestBed.inject(MockStore);

    mockStore.overrideSelector(fromRoot.getOgdInviteUserFlowFeatureIsEnabled, false);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a request to the correct URL based on the ogdEnabled flag', () => {
    const userData = { email: 'test@example.com' };

    // Test with ogdEnabled flag set to false
    inviteUserService.inviteUser(userData).subscribe();
    const req = httpTestingController.expectOne('/api/inviteUser');
    expect(req.request.method).toEqual('POST');
    req.flush({});

    // Change ogdEnabled flag to true and test again
    mockStore.overrideSelector(fromRoot.getOgdInviteUserFlowFeatureIsEnabled, true);

    inviteUserService.inviteUser(userData).subscribe();
    const reqOgd = httpTestingController.expectOne('/api/ogd-flow/invite');
    expect(reqOgd.request.method).toEqual('POST');
    reqOgd.flush({});
  });
});
