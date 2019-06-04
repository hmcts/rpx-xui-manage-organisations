import { TestBed } from '@angular/core/testing';
import { hot, cold } from 'jasmine-marbles';
import { provideMockActions } from '@ngrx/effects/testing';
import * as fromRouterEffects from './router.effect';
import { RouterEffects } from './router.effect';
import * as RouterActions from '../actions/router.action';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

describe('App Effects', () => {
    let actions$;
    let effects: RouterEffects;

    const RouterMock = jasmine.createSpyObj('Router', [
        'navigate',
    ]);

    const LocationMock = jasmine.createSpyObj('Location', [
        'back',
        'forward',
    ]);
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                { provide: Location, useValue: LocationMock },
                { provide: Router, useValue: RouterMock },
                fromRouterEffects.RouterEffects,
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
                expect(RouterMock.navigate).toHaveBeenCalled();
            });
        });
    });

    describe('navigateBack$', () => {
        it('should navigate back', () => {
            const action = new RouterActions.Back();

            actions$ = hot('-a', { a: action });
            effects.navigateBack$.subscribe(() => {
                expect(LocationMock.back).toHaveBeenCalled();
            });
        });
    });

    describe('navigateForward$', () => {
        it('should navigate forward', () => {
            const action = new RouterActions.Forward();

            actions$ = hot('-a', { a: action });
            effects.navigateForward$.subscribe(() => {
                expect(LocationMock.forward).toHaveBeenCalled();
            });
        });
    });

});
