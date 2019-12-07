import { Injectable } from '@angular/core';

import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';
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
    private keepalive: Keepalive,
    private store: Store<fromRoot.State>
  ) {}

  public init(): void {
    this.timeout = 120;

    this.idle.setIdleName('manageSession');

    // sets an idle timeout of 5 seconds, for testing purposes.
    // todo set based on user role
    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(this.timeout);

    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.')
    });

    this.idle.onTimeout.subscribe(() => {
      // todo redirect to logout page
      console.log('Timed out!');
      this.store.dispatch(new fromRoot.Logout());

    });
    this.idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!')
    });

    this.idle.onTimeoutWarning.pipe(
      map(sec => {
        return (sec > 60) ? Math.ceil(sec / 60) + ' minutes' : sec + ' seconds';
      }),
      tap(console.log),
      distinctUntilChanged()
    ).subscribe((countdown) => {
    console.log('You will time out in ' + countdown)

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
