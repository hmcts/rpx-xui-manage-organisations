import { Injectable } from '@angular/core';

import {DEFAULT_INTERRUPTSOURCES, Idle, DocumentInterruptSource } from '@ng-idle/core';
import {Store} from '@ngrx/store';
import * as fromRoot from '../../app/store';
import {distinctUntilChanged, map, tap} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})

export class IdleService {
  timeout: number;
  constructor(
    private idle: Idle,
    private store: Store<fromRoot.State>
  ) {}

  public init(): void {
    this.timeout = 120; // set to 5 minutes

    this.idle.setIdleName('idleSession');
    // todo set based on user role
    this.idle.setIdle(5);

    this.idle.setTimeout(this.timeout);
    console.log(DEFAULT_INTERRUPTSOURCES)
    const interrupt =  new DocumentInterruptSource('mousedown keydown DOMMouseScroll mousewheel touchstart touchmove scroll');
    this.idle.setInterrupts([interrupt]);

    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.');
    });

    this.idle.onTimeout.subscribe(() => {
      console.log('Timed out!');
      this.store.dispatch(new fromRoot.Logout());
    });

    this.idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!');
    });

    this.idle.onTimeoutWarning.pipe(
      map(sec => {
        return (sec > 60) ? Math.ceil(sec / 60) + ' minutes' : sec + ' seconds';
      }),
      tap(console.log),
      distinctUntilChanged()
    ).subscribe((countdown) => {
      console.log('You will time out in ' + countdown);
      const modalConfig = {
        session: {
          countdown,
          isVisible: true
        }
      };
      this.store.dispatch(new fromRoot.SetModal(modalConfig));
    });

    this.idle.watch();
  }

}
