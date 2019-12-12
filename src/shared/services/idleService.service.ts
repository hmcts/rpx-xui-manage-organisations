import { Injectable } from '@angular/core';

import {Idle, DocumentInterruptSource } from '@ng-idle/core';
import {select, Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';
import {delay, distinctUntilChanged, filter, first, map, take, tap} from 'rxjs/operators';
import {Keepalive} from '@ng-idle/keepalive';
import {combineLatest} from 'rxjs';

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
    this.timeout = 600; // set to 10 minutes

    this.idle.setIdleName('idleSession');
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
    // not sure if this is going to be used
    // this.keepalive.interval(20);
    // this.keepalive.onPing.pipe(delay(250)).subscribe(() => {
    //   console.log('Keep alive');
    //   // this.store.dispatch(new fromRoot.KeepAlive());
    // });

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
    const route$ = this.store.pipe(select(fromRoot.getRouterUrl));
    const userIdleSession$ =  this.store.pipe(select(fromUserProfile.getUserTimeOut));

    combineLatest(
      route$.pipe(first(value => typeof value === 'string' )),
      userIdleSession$.pipe(filter(value => !isNaN(value)), take(1))
    ).subscribe(([routes, idle]) => {

      const isRegisterOrg: boolean = routes.indexOf('register-org') !== -1;
      const isSignedOut: boolean = routes.indexOf('signed-out') !== -1;

      if (routes && !(isRegisterOrg || isSignedOut) && idle) {
        const idleInSeconds = (idle / 1000) - this.timeout;
        console.log('idleInSeconds', idleInSeconds / 60);
        this.idle.setIdle(idleInSeconds);
        this.idle.watch();
      }
    })
  }

}
