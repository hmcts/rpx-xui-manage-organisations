import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { checkboxesBeCheckedValidator } from 'src/custom-validators/checkboxes-be-checked.validator';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { Observable, Subscription, combineLatest } from 'rxjs';

@Component({
    selector: 'edit-user-permission',
    templateUrl: './edit-user-permission.component.html',
  })
  export class EditUserPermissionComponent  implements OnInit, OnDestroy {
    inviteUserForm: FormGroup;
    isInvalid;

    user$: Observable<any>;
    isLoading$: Observable<boolean>;
    user: any;
    isPuiCaseManager: boolean;
    isPuiOrganisationManager: boolean;
    isPuiUserManager: boolean;

    userSubscription: Subscription;
    dependanciesSubscription: Subscription;

    constructor(
      private userStore: Store<fromStore.UserState>,
      private routerStore: Store<fromRoot.State>,
    ) { }

    ngOnInit(): void {
      this.inviteUserForm = new FormGroup({
        roles: new FormGroup({
          'pui-case-manager': new FormControl(''),
          'pui-user-manager': new FormControl(''),
          'pui-organisation-manager': new FormControl('')
        }, checkboxesBeCheckedValidator())
      });
      this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

      this.dependanciesSubscription = combineLatest([
      this.routerStore.pipe(select(fromRoot.getRouterState)),
      this.userStore.pipe(select(fromStore.getGetUserLoaded))
    ]).subscribe(([route, users]) => {
      if (users === false) {
        this.userStore.dispatch(new fromStore.LoadUsers());
      }
      const userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: userId }));
    });

      this.userSubscription = this.user$.subscribe((user) => {
        this.user = user;
        this.isPuiCaseManager = this.getIsPuiCaseManager(user);
        this.isPuiOrganisationManager = this.getIsPuiOrganisationManager(user);
        this.isPuiUserManager = this.getIsPuiUserManager(user);
      });
    }

  getIsPuiCaseManager(user: any): boolean {
    return user && user.manageCases === 'Yes';
  }

  getIsPuiOrganisationManager(user: any): boolean {
    return user && user.manageOrganisations === 'Yes';
  }

  getIsPuiUserManager(user: any): boolean {
    return user && user.manageUsers === 'Yes';
  }

  unsubscribe(subscription: Subscription) {
    if (subscription) {
      subscription.unsubscribe();
    }
  }

    ngOnDestroy() {
      this.unsubscribe(this.userSubscription);
      this.unsubscribe(this.dependanciesSubscription);
    }

    onSubmit() {
    }
  }
