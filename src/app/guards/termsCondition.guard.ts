import { Injectable } from '@angular/core';
import {CanActivate, Router} from '@angular/router';

import {Observable, of} from 'rxjs';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../store';
import {catchError, filter, switchMap, take, tap} from 'rxjs/operators';
import {CookieService} from 'ngx-cookie';


@Injectable()
export class TermsConditionGuard implements CanActivate {
  constructor(
    private store: Store<fromStore.State>,
    private router: Router
  ) {
  }

  canActivate() {
    this.store.pipe(select(fromStore.getTCAccepted), take(1)).subscribe(flag => {
      if (flag) {
        this.store.dispatch(new fromStore.Go({path: ['/accept-t-and-c']}));
      } else {
        return true;
      }
    })
    return false;
  }




}
