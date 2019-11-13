import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { of, throwError } from 'rxjs';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromUserEffects from './user-profile.effects';
import { UserProfileEffects } from './user-profile.effects';
import {
  GetUserDetails,
  GetUserDetailsFailure,
  GetUserDetailsSuccess,
  LoadHasAcceptedTC,
  LoadHasAcceptedTCFail, LoadHasAcceptedTCSuccess
} from '../actions';
import { UserService } from '../../services/user.service';
import { HttpErrorResponse } from '@angular/common/http';
import { AcceptTcService } from '../../../accept-tc/services/accept-tc.service';

describe('Fee accounts Effects', () => {
  let actions$;
  let effects: UserProfileEffects;
  const UserServiceMock = jasmine.createSpyObj('UserService', [
      'getUserDetails',
  ]);
  const AcceptTandCSrviceMock = jasmine.createSpyObj('AcceptTcService', [
    'getHasUserAccepted',
    'acceptTandC'
  ]);

  beforeEach(() => {
      TestBed.configureTestingModule({
          imports: [HttpClientTestingModule],
          providers: [
              {
                  provide: UserService,
                  useValue: UserServiceMock,
              },
              {
                provide: AcceptTcService,
                useValue: AcceptTandCSrviceMock,
              },
              fromUserEffects.UserProfileEffects,
              provideMockActions(() => actions$)
          ]
      });

      effects = TestBed.get(UserProfileEffects);

  });

  describe('getUser$', () => {
      it('should return a UserInterface - GetUserDetailsSuccess', () => {
          const returnValue = {
              userId: 'something',
              email: 'something',
              orgId: 'something',
              roles: []
          };
          UserServiceMock.getUserDetails.and.returnValue(of(returnValue));
          const action = new GetUserDetails();
          const completion = new GetUserDetailsSuccess(returnValue);
          actions$ = hot('-a', { a: action });
          const expected = cold('-b', { b: completion });
          expect(effects.getUser$).toBeObservable(expected);
      });
  });

  describe('getUser$ error', () => {
      it('should return GetUserDetailsFailure', () => {
          UserServiceMock.getUserDetails.and.returnValue(throwError(new HttpErrorResponse({})));
          const action = new GetUserDetails();
          const completion = new GetUserDetailsFailure(new HttpErrorResponse({}));
          actions$ = hot('-a', { a: action });
          const expected = cold('-b', { b: completion });

          expect(effects.getUser$).toBeObservable(expected);
      });
  });

  describe('loadHasAccepted$', () => {
    it('should return a hasUserAccepted Object - LoadHasAcceptedTCSuccess', () => {
      const returnValue = 'true';
      AcceptTandCSrviceMock.getHasUserAccepted.and.returnValue(of(returnValue));
      const action = new LoadHasAcceptedTC('1234');
      const completion = new LoadHasAcceptedTCSuccess(returnValue);
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHasAccepted$).toBeObservable(expected);
    });
  });

  describe('loadHasAccepted$ error', () => {
    it('should return LoadHasAcceptedFail', () => {
      AcceptTandCSrviceMock.getHasUserAccepted.and.returnValue(throwError(new HttpErrorResponse({})));
      const action = new LoadHasAcceptedTC('1234');
      const completion = new LoadHasAcceptedTCFail(new HttpErrorResponse({}));
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.loadHasAccepted$).toBeObservable(expected);
    });
  });

});
