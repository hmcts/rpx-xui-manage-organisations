
import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromAppEffects from './app.effects';
import { AppEffects } from './app.effects';
import { SetPageTitleErrors } from '../actions/app.actions';
import * as usersActions from '../../../users/store/actions';

describe('App Effects', () => {
  let actions$;
  let effects: AppEffects;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        fromAppEffects.AppEffects,
        provideMockActions(() => actions$)
      ]
    });

    effects = TestBed.get(AppEffects);

  });

  describe('updateTitle$', () => {
    it('should update error titles', () => {
      const action = new usersActions.UpdateErrorMessages({});
      const completion = new SetPageTitleErrors();
      actions$ = hot('-a', { a: action });
      const expected = cold('-b', { b: completion });
      expect(effects.updateTitle$).toBeObservable(expected);
    });
  });

});
