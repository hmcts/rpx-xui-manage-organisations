import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromAppEffects from './app.effects';
import { AppEffects } from './app.effects';
import { SetPageTitleErrors } from '../actions/app.actions';
import * as usersActions from '../../../users/store/actions';
import * as appActions from '../../store/actions';
import { CookieService } from 'ngx-cookie';

describe('App Effects', () => {
  let actions$;
  let effects: AppEffects;

  const cookieService = {
    get: key => {
      return cookieService[key];
    },
    set: (key, value) => {
      cookieService[key] = value;
    },
    removeAll: () => { }
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        fromAppEffects.AppEffects,
        provideMockActions(() => actions$),
        { provide: CookieService, useValue: cookieService }
      ]
    });

    effects = TestBed.get(AppEffects);

  });

  describe('updateTitle$', () => {
    it('should update error headerTitle', () => {
      const action = new usersActions.UpdateErrorMessages({});
      const completion = new SetPageTitleErrors();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateTitle$).toBeObservable(expected);
    });
  });

});
