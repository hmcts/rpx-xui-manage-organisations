import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../store';
import * as fromUserProfile from '../../user-profile/store/';
import {take} from 'rxjs/operators';
/**
 * Terms and Condition Component
 * TODO - ADD TO NPM
 */
@Component({
  selector: 'app-accept-terms-conditions',
  templateUrl: './accept-tc.component.html'
})
export class AcceptTcComponent implements OnInit {
  @Input() uId: string;
  @Output() acceptTC = new EventEmitter<string>();
  constructor(private store: Store<fromStore.TCState>) {
  }

  ngOnInit(): void {
    this.store.pipe(select(fromUserProfile.getUid), take(1)).subscribe((id) => {
      this.uId = id;
    });
  }

  onAcceptTandC() {
    this.store.dispatch(new fromStore.AcceptTandC(this.uId));
  }
}
