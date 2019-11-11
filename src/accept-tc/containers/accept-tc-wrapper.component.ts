import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromUserProfile from '../../user-profile/store/';
import {Observable} from 'rxjs';
/**
 * Terms And Condition smart component wrapper
 * absorbs Terms and Condition dumb component
 */
@Component({
  selector: 'app-accept-terms-conditions-wrapper',
  templateUrl: './accept-tc-wrapper.component.html'
})
export class AcceptTcWrapperComponent implements OnInit {
  uId: Observable<string>;
  constructor(private store: Store<fromStore.TCState>) {
  }

  ngOnInit(): void {
    this.uId = this.store.pipe(select(fromUserProfile.getUid));
  }

  onAcceptTandC(uid) {
    this.store.dispatch(new fromStore.AcceptTandC(uid));
  }
}
