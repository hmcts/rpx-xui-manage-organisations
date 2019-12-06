import { Injectable } from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {environment} from '../../environments/environment';
import * as fromRoot from '../../app/store';


@Injectable()
export class SessionSocketServiceService extends Socket {
  liveSessionOff$ = this.fromEvent<boolean>(fromRoot.LIVE_SESSION);

  constructor() {
    super({
      url: `${environment.socketConfig.url}/sessions`,
      options: environment.socketConfig.opts
    });
  }
}
