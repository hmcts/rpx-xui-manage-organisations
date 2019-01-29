import { Component, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';
import * as fromLogInStore from '../../../login/store';
import { Observable } from 'rxjs';
import { debug } from 'util';
import { LoggedUser } from 'src/login/loggedUser.model';




@Component({
  selector: 'app-prd-profile-component',
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

  userProfile: LoggedUser;
  constructor(
    private store: Store<fromLogInStore.LoginState>
  ) { }


  ngOnInit(): void {
    this.store.pipe(select(fromLogInStore.getLoggedInUser)).subscribe(userdata => {
      this.userProfile = userdata;
    });
  }


}







