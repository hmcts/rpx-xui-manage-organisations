import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { EditUserFailureReset } from 'src/users/store';
import { UserState } from 'src/users/store/reducers';

@Component({
  selector: 'app-manage-user-failure',
  templateUrl: './manage-user-failure.component.html',
  standalone: false
})
export class ManageUserFailureComponent implements OnInit {
  public userId: string;
  public editUserUrl: string;

  constructor(
    private readonly userStore: Store<UserState>,
    private readonly route: ActivatedRoute
  ) {}

  public ngOnInit(): void {
    this.userStore.dispatch(new EditUserFailureReset());

    this.route.paramMap.subscribe((params) => {
      this.userId = params.get('userId');
      this.editUserUrl = this.getEditUserPermissionsLink(this.userId);
    });
  }

  public getEditUserPermissionsLink(userId: string): string {
    return `/users/user/${userId}`;
  }
}
