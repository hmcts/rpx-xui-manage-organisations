import { Injectable } from '@angular/core';

import {Idle, DocumentInterruptSource } from '@ng-idle/core';
import {select, Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import * as fromUserProfile from '../../user-profile/store';
import {
  delay,
  distinctUntilChanged,
  filter,
  first,
  map,
  switchMap,
  take,
  takeWhile,
  tap
} from 'rxjs/operators';
import {Keepalive} from '@ng-idle/keepalive';
import {combineLatest, fromEvent, interval, timer} from 'rxjs';

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
    // use this to extend node session every 30 minutes
    // this.keepAlive();

    // time is set in seconds
    this.timeout = 5; // set to 10 minutes

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
      // check time remain and set new
      // this.idle.setIdle(idleInSeconds);
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out!');
      this.dispatchSignedOut();
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

  dispatchModal(countdown = 0, isVisible): void {
    const modalConfig: any = {
      session: {
        countdown,
        isVisible
      }
    };
    this.store.dispatch(new fromRoot.SetModal(modalConfig));
  }

  // setJwtTimeOut() {
  //   // set 7.50hr countdown
  //   const jwtTime = 5 * 60 * 60 * 1000;
  //   this.startCountDown(jwtTime);
  // }

  // startCountDown(jwtTime) {
  //   const timeout = 10 * 60;
  //   const jwtSessionCountdown = timer(jwtTime, 1000);
  //   jwtSessionCountdown.pipe(
  //     mapTo(-1),
  //     scan((accumulator, current) => {
  //       return accumulator + current;
  //     }, timeout),
  //     // tap((value) => localStorage.setItem('jwtSession', JSON.stringify(value))),
  //     takeWhile(value => value >= 0),
  //     map(sec =>  (sec > 10) ? Math.ceil(sec / 60) + ' minutes' : sec + ' seconds'),
  //     distinctUntilChanged(),
  //     finalize(() => {
  //       this.dispatchSignedOut();
  //     })
  //   ).subscribe((tout: any) => {
  //     this.dispatchModal(tout, true);
  //     console.log('Dispatch Warning');
  //   });
  // }

  keepAlive() {
    const thirtyMinutes = 20 * 1000;
    const thirtyMinInterval$ = timer(thirtyMinutes, thirtyMinutes);
    thirtyMinInterval$.subscribe(() => {
      console.log('Keep alive');
      this.store.dispatch(new fromRoot.KeepAlive());
    });
  }

  dispatchSignedOut() {
    this.dispatchModal(undefined, false);
    this.store.dispatch(new fromRoot.SignedOut()); // sing out BE
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
        const idleInSeconds = Math.floor((idle / 1000)) - this.timeout;
        console.log('idleInSeconds', idleInSeconds / 60);
        this.idle.setIdle(idleInSeconds);
        this.idle.watch();
      }
    });
  }

}
