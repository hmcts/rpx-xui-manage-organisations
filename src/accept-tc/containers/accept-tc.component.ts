import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromUserProfile from '../../user-profile/store/';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-accept-terms-and-conditions',
  templateUrl: './accept-tc.component.html'
})
export class AcceptTcComponent implements OnInit {
  uId: object;
  constructor(private store: Store<fromStore.TCState>) {
  }

  ngOnInit(): void {
    this.store.pipe(select(fromUserProfile.getUsers), take(1)).subscribe((id) => {
      this.uId = id['userId'];
    })
  }

  onAcceptTandC() {
    this.store.dispatch(new fromStore.AcceptTandC(this.uId));
  }
}
