import { Component, OnInit, OnDestroy } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { debug } from 'util';




@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit, OnDestroy {

  loginSubscription: Subscription;




  ngOnInit(): void {

  }

  ngOnDestroy() {
    this.loginSubscription.unsubscribe();
  }
}







