import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromLogInStore from '../../../login/store';
import { Observable } from 'rxjs';
import { debug } from 'util';



/**
 * Bootstraps the Register Components
 */

@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  constructor(
    private store: Store<fromLogInStore.LoginState>
  ) { }


  ngOnInit(): void {
    // this.store.pipe(select(fromLogInStore.getGetUser)).subscribe(userdata => {
    //   console.log(userdata);
    // })
  }


}







