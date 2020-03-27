import {Component, OnInit, OnDestroy} from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import {select, Store} from '@ngrx/store';
import * as fromStore from '../../store';

import {Observable, Subscription} from 'rxjs';
import {AppConstants} from '../../../app/app.constants';
import * as fromAppStore from '../../../app/store';
import {checkboxesBeCheckedValidator} from '../../../custom-validators/checkboxes-be-checked.validator';

/*
* User Form entry mediator component
* It holds the state
* */

@Component({
  selector: 'app-prd-invite-user-component',
  templateUrl: './invite-user.component.html',
})
export class InviteUserComponent implements OnInit, OnDestroy {

  constructor(private readonly store: Store<fromStore.UserState>) { }
  public inviteUserForm: FormGroup;

  public errors$: Observable<any>;
  public errorsArray$: Observable<{ isFromValid: boolean; items: { id: string; message: any; } []}>;

  public errorMessages = {
    firstName: ['Enter first name'],
    lastName: ['Enter last name'],
    email: ['Enter email address', 'Email must contain at least the @ character'],
    roles: ['You must select at least one action'],
  };
  public jurisdictions: any[];
  public juridictionSubscription: Subscription;
  public isReinvite: boolean = false;

  public ngOnInit(): void {
    this.store.dispatch(new fromStore.Reset());
    this.isReinvite = false;
    this.errors$ = this.store.pipe(select(fromStore.getInviteUserErrorMessage));
    this.errorsArray$ = this.store.pipe(select(fromStore.getGetInviteUserErrorsArray));

    this.inviteUserForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.email, Validators.required]),
      roles: new FormGroup({
        'pui-case-manager': new FormControl(''),
        'pui-user-manager': new FormControl(''),
        'pui-organisation-manager': new FormControl(''),
        'pui-finance-manager': new FormControl('')
      }, checkboxesBeCheckedValidator())
    });

    this.store.pipe(select(fromStore.getGetReinvitePendingUser)).subscribe(pendingUser => {
      if (pendingUser) {
        this.isReinvite = true;
        this.inviteUserForm.controls.firstName.setValue(pendingUser.firstName);
        this.inviteUserForm.controls.lastName.setValue(pendingUser.lastName);
        this.inviteUserForm.controls.email.setValue(pendingUser.email);

        this.inviteUserForm.controls.firstName.disable();
        this.inviteUserForm.controls.lastName.disable();
        this.inviteUserForm.controls.email.disable();
      }
    });

    this.juridictionSubscription = this.store.pipe(select(fromAppStore.getAllJurisdictions))
                                   .subscribe(value => this.jurisdictions = value,
                                   (error) => this.store.dispatch(new fromAppStore.LoadJurisdictionsFail(error)));
    this.store.dispatch(new fromAppStore.LoadJurisdictions());
  }

  // convenience getter for easy access to form fields
  public get f() { return this.inviteUserForm.controls; }

  public onSubmit() {
    this.dispatchValidationAction();
    if (this.inviteUserForm.valid) {
      let value = this.inviteUserForm.getRawValue();
      const permissions = Object.keys(value.roles).filter(key => {
        if (value.roles[key]) {
          return key;
        }
      });

      const ccdRoles = this.inviteUserForm.value.roles['pui-case-manager'] ? AppConstants.CCD_ROLES : [];

      const roles = [
        ...permissions,
        ...ccdRoles
      ];
      value = {
        ...value,
        roles,
        jurisdictions: this.jurisdictions,
        isReinvite: this.isReinvite
      };
      this.store.dispatch(new fromStore.SendInviteUser(value));
    }
  }

  public dispatchValidationAction() {
    // set form errors
    const formValidationData = {
      isInvalid: {
        firstName: [(this.f.firstName.errors && this.f.firstName.errors.required)],
        lastName: [(this.f.lastName.errors && this.f.lastName.errors.required)],
        email: [
          (this.f.email.errors && this.f.email.errors.required),
          (this.f.email.errors && this.f.email.errors.email),
        ],
        roles: [(this.f.roles.errors && this.f.roles.errors.requireOneCheckboxToBeChecked)],
      },
      errorMessages: this.errorMessages,
      isSubmitted: true
    };
    this.store.dispatch(new fromStore.UpdateErrorMessages(formValidationData));


  }

  public ngOnDestroy(): void {
    if (this.juridictionSubscription) {
      this.juridictionSubscription.unsubscribe();
    }
  }
}
