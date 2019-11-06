import { Component } from '@angular/core';
import {Store} from '@ngrx/store';
import * as fromStore from '../store';

@Component({
  selector: 'app-acceptterms-and-conditions',
  templateUrl: './accept-tc.component.html'
})
export class AcceptTcComponent {
  constructor(private store: Store<fromStore.TCState>) {
  }

  onAcceptTandC() {
    this.store.dispatch(new fromStore.AcceptTandC({}));
  }
}
