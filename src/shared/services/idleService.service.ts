import { Injectable } from '@angular/core';

import {DEFAULT_INTERRUPTSOURCES, Idle, DocumentInterruptSource } from '@ng-idle/core';
import {select, Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import {delay, distinctUntilChanged, first, map, tap} from 'rxjs/operators';
import {Keepalive} from '@ng-idle/keepalive';

@Injectable({
  providedIn: 'root'
})

export class IdleService {
  timeout: number;
  constructor(
    private idle: Idle,
    private keepalive: Keepalive,
    private store: Store<fromRoot.State>
  ) {}

  public init(): void {
    this.timeout = 10; // set to 5 minutes

    this.idle.setIdleName('idleSession');
    // todo set based on user role
    this.idle.setIdle(5);

    this.idle.setTimeout(this.timeout);

    // console.log(DEFAULT_INTERRUPTSOURCES) // leave for comparison
    const interrupt =
      new DocumentInterruptSource('mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll');
    this.idle.setInterrupts([interrupt]);

    // adding delay so that user can click on sign out before the windows closes
    this.idle.onIdleEnd.pipe(delay(250)).subscribe(() => {
      console.log('No longer idle.');
      this.dispatchModal(undefined, false);
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out!');
      this.store.dispatch(new fromRoot.Go({path: ['/signed-out']}));
      this.store.dispatch(new fromRoot.SignedOut());
      this.dispatchModal(undefined, false);
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!');
    });

    this.idle.onTimeoutWarning.pipe(
      map(sec => (sec > 60) ? Math.ceil(sec / 60) + ' minutes' : sec + ' seconds'),
      tap(console.log), // remove when happy
      distinctUntilChanged()
    ).subscribe((countdown) => {
      this.dispatchModal(countdown, true);
    });

    // sets the ping interval to 600 seconds
    this.keepalive.interval(20);
    this.keepalive.onPing.subscribe(() => {
      console.log('Keep alive');
      this.store.dispatch(new fromRoot.KeepAlive());
    });

    this.initWatch();
  }

  dispatchModal(countdown = '0', isVisible): void {
    const modalConfig = {
      session: {
        countdown,
        isVisible
      }
    };
    this.store.dispatch(new fromRoot.SetModal(modalConfig));
  }

  initWatch(): void {
    this.store.pipe(
      select(fromRoot.getRouterUrl),
      first(value => typeof value === 'string' )).subscribe(route => {
      const isRegisterOrg: boolean = route.indexOf('register-org') !== -1;
      const isSignedOut: boolean = route.indexOf('signed-out') !== -1;
      if (route && !(isRegisterOrg || isSignedOut)) {
        this.idle.watch();
      }
    });
  }

}
