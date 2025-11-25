import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserService } from './user.service';
import * as fromRoot from '../../../src/app/store';

describe('User service', () => {
  let userService: UserService;
  let httpTestingController: HttpTestingController;
  let mockStore: MockStore;

  const initialState = { };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UserService,
        provideMockStore({ initialState })
      ]
    });

    userService = TestBed.inject(UserService);
    httpTestingController = TestBed.inject(HttpTestingController);
    mockStore = TestBed.inject(MockStore);

    mockStore.overrideSelector(fromRoot.getOgdInviteUserFlowFeatureIsEnabled, false);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should send a request to the correct URL based on the ogdEnabled flag', () => {
    const editUserMockOGD_True = { orgIdsPayload: ['SOLICITOR_PROFILE'], userPayload: { id: '123456' } };
    const editUserMockOGD_False = { id: '654321' };

    userService.editUserPermissions(editUserMockOGD_False).subscribe();
    const req = httpTestingController.expectOne('/api/editUserPermissions/users/654321');
    expect(req.request.method).toEqual('PUT');
    req.flush({});

    mockStore.overrideSelector(fromRoot.getOgdInviteUserFlowFeatureIsEnabled, true);

    userService.editUserPermissions(editUserMockOGD_True).subscribe();
    const reqOgd = httpTestingController.expectOne('/api/ogd-flow/update/123456');
    expect(reqOgd.request.method).toEqual('PUT');
    reqOgd.flush({});
  });
});
