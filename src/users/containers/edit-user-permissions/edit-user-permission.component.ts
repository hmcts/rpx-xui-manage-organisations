import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { checkboxesBeCheckedValidator } from 'src/custom-validators/checkboxes-be-checked.validator';
import { Store, select } from '@ngrx/store';
import * as fromStore from '../../store';
import * as fromRoot from '../../../app/store';
import { Observable, Subscription, combineLatest } from 'rxjs';
import { UserRolesUtil } from '../utils/user-roles-util';

@Component({
    selector: 'edit-user-permission',
    templateUrl: './edit-user-permission.component.html',
  })
  export class EditUserPermissionComponent  implements OnInit, OnDestroy {
    editUserForm: FormGroup;
    isInvalid;
    errorMessages = {
      roles: ['Select at least one option'],
    };
    user$: Observable<any>;
    isLoading$: Observable<boolean>;
    user: any;
    isPuiCaseManager: boolean;
    isPuiOrganisationManager: boolean;
    isPuiUserManager: boolean;
    userId: string;

    userSubscription: Subscription;
    dependanciesSubscription: Subscription;

    constructor(
      private userStore: Store<fromStore.UserState>,
      private routerStore: Store<fromRoot.State>
    ) { }

    ngOnInit(): void {
      this.isLoading$ = this.userStore.pipe(select(fromStore.getGetUserLoading));

      this.dependanciesSubscription = combineLatest([
      this.routerStore.pipe(select(fromRoot.getRouterState)),
      this.userStore.pipe(select(fromStore.getGetUserLoaded))
    ]).subscribe(([route, users]) => {
      if (users === false) {
        this.userStore.dispatch(new fromStore.LoadUsers());
      }
      this.userId = route.state.params.userId;
      this.user$ = this.userStore.pipe(select(fromStore.getGetSingleUser, { userIdentifier: this.userId }));
    });

      this.userSubscription = this.user$.subscribe((user) => {
        this.user = user;
        this.isPuiCaseManager = this.getIsPuiCaseManager(user);
        this.isPuiOrganisationManager = this.getIsPuiOrganisationManager(user);
        this.isPuiUserManager = this.getIsPuiUserManager(user);

        this.editUserForm = new FormGroup({
          roles: new FormGroup({
            'pui-case-manager': new FormControl(this.isPuiCaseManager),
            'pui-user-manager': new FormControl(this.isPuiUserManager),
            'pui-organisation-manager': new FormControl(this.isPuiOrganisationManager)
          }, checkboxesBeCheckedValidator(1))
        });
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
    if (this.editUserForm.valid) {
      const {value} = this.editUserForm;
      const permissions = UserRolesUtil.mapPermissions(value);
      const rolesAdded = UserRolesUtil.getRolesAdded(this.user, permissions);
      const rolesDeleted = UserRolesUtil.getRolesDeleted(this.user, permissions);
      const editUserRolesObj = UserRolesUtil.mapEditUserRoles(this.user, rolesAdded, rolesDeleted);
      this.userStore.dispatch(new fromStore.EditUser({editUserRolesObj, userId: this.userId}));
      console.log(editUserRolesObj);
    } else {
      const formValidationData = {
        isInvalid: {
          roles: [(this.f.roles.errors && this.f.roles.errors.requireOneCheckboxToBeChecked)],
        },
        errorMessages: this.errorMessages,
        isSubmitted: true
      };
      this.userStore.dispatch(new fromStore.UpdateErrorMessages(formValidationData));
    }
  }

  get f() { return this.editUserForm.controls; }

}
