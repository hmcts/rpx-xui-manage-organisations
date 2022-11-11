import { Location } from '@angular/common';
import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { provideMockActions } from '@ngrx/effects/testing';
import { hot } from 'jasmine-marbles';
import * as RouterActions from '../actions/router.action';
import { RouterEffects } from './router.effect';

describe('App Effects', () => {
    let actions$;
    let effects: RouterEffects;

    const routerMock = jasmine.createSpyObj('Router', [
        'navigate',
    ]);

    const locationMock = jasmine.createSpyObj('Location', [
        'back',
        'forward',
    ]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Location, useValue: locationMock },
                { provide: Router, useValue: routerMock },
                RouterEffects,
                provideMockActions(() => actions$)
            ]
        });

        effects = TestBed.get(RouterEffects);

    });

    describe('navigate$', () => {
        it('should navigate', () => {
            const action = new RouterActions.Go({ path: [] });

            actions$ = hot('-a', { a: action });
            effects.navigate$.subscribe(() => {
                expect(routerMock.navigate).toHaveBeenCalled();
            });
        });
    });

    describe('navigateBack$', () => {
        it('should navigate back', () => {
            const action = new RouterActions.Back();

            actions$ = hot('-a', { a: action });
            effects.navigateBack$.subscribe(() => {
                expect(locationMock.back).toHaveBeenCalled();
            });
        });
    });

    describe('navigateForward$', () => {
        it('should navigate forward', () => {
            const action = new RouterActions.Forward();

            actions$ = hot('-a', { a: action });
            effects.navigateForward$.subscribe(() => {
                expect(locationMock.forward).toHaveBeenCalled();
            });
        });
    });

});
