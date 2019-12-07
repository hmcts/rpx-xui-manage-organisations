import { Injectable } from '@angular/core';

import {DEFAULT_INTERRUPTSOURCES, Idle} from '@ng-idle/core';
import {Keepalive} from '@ng-idle/keepalive';

@Injectable({
  providedIn: 'root'
})

export class IdleService {

  constructor(private idle: Idle, private keepalive: Keepalive) {}

  public init(): void {
    this.idle.setIdleName('manageSession');
    // sets an idle timeout of 5 seconds, for testing purposes.
    // todo set based on user role
    this.idle.setIdle(5);
    // sets a timeout period of 5 seconds. after 10 seconds of inactivity, the user will be considered timed out.
    this.idle.setTimeout(20);
    // sets the default interrupts, in this case, things like clicks, scrolls, touches to the document
    this.idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    this.idle.onIdleEnd.subscribe(() => {
      console.log('No longer idle.')
    });
    this.idle.onTimeout.subscribe(() => {
      // todo redirect to logout page
      console.log('Timed out!');

    });
    this.idle.onIdleStart.subscribe(() => {
      console.log('You\'ve gone idle!')
    });
    this.idle.onTimeoutWarning.subscribe((countdown) => {
      // todo dispatch countdown
      console.log('You will time out in ' + countdown + ' seconds!')
    });

    // sets the ping interval to 15 seconds
    this.keepalive.interval(15);

    this.keepalive.onPing.subscribe(() => {
      console.log('Ping');
      // this.lastPing = new Date()
    });
    this.idle.watch();
  }

}
