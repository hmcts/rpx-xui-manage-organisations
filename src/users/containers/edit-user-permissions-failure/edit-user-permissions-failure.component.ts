import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Store} from '@ngrx/store';
import {UserState} from '../../store/reducers';
import {EditUserFailureReset} from '../../store/actions';

@Component({
  selector: 'app-edit-user-permissions-failure',
  templateUrl: './edit-user-permissions-failure.component.html'
})
export class EditUserPermissionsFailureComponent implements OnInit {

  public userId: string;

  constructor(private readonly userStore: Store<UserState>,
              private route: ActivatedRoute) {
  }

  /**
   * ngOnInit
   *
   * We reset the edit user failure state so that the User can Edit a user permissions again.
   *
   * We use the userId from the url parameters so that we are able to direct the User back
   * to the Edit Permissions page when they click on the User permissions link.
   */
  public ngOnInit(): void {
    this.userStore.dispatch(new EditUserFailureReset());

    this.route.paramMap.subscribe(params => {
      this.userId = params.get('userId');
    });
  }

  public getEditUserPermissionsLink(userId: string): string {
    return `/users/user/${userId}`;
  }
}
