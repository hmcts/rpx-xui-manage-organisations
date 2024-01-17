import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDetails } from '@hmcts/rpx-xui-common-lib';
import { Subject } from 'rxjs';
import { PersonalDetails } from '../../models/personal-details.model';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html'
})
export class UserPersonalDetailsComponent implements OnInit, OnDestroy {
  public get user(): UserDetails {
    return this._existingUser;
  }

  @Input()
  public set user(value: UserDetails) {
    this._existingUser = value;
    this.inviteMode = !value;
    this.createFormAndPopulate();
  }

  @Output() public personalDetailsChanged = new EventEmitter<PersonalDetails>();

  public personalDetailForm: FormGroup<PersonalDetailsForm>;
  // edit mode is currently read only
  public inviteMode: boolean;
  public errors: {firstName: string[], lastName: string[], email: string[]} = {
    firstName: [],
    lastName: [],
    email: []
  };

  private _existingUser: UserDetails;

  private onDestory$ = new Subject<void>();
  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createFormAndPopulate();
  }

  createFormAndPopulate() {
    this.personalDetailForm = this.fb.nonNullable.group<PersonalDetailsForm>({
      email: this.fb.nonNullable.control<string>({ value: this._existingUser?.email, disabled: !this.inviteMode }, [Validators.required, Validators.email]),
      firstName: this.fb.nonNullable.control<string>({ value: this._existingUser?.firstName, disabled: !this.inviteMode }, [Validators.required]),
      lastName: this.fb.nonNullable.control<string>({ value: this._existingUser?.lastName, disabled: !this.inviteMode }, [Validators.required])
    });
    this.personalDetailForm.valueChanges.subscribe((personalDetails) => {
      if (this.personalDetailForm.invalid){
        this.updateCurrentErrors();
      }

      if (this.personalDetailForm.untouched) {
        // wait until the whole form is complete before emitting
        return;
      }

      if (this.personalDetailForm.valid) {
        this.personalDetailsChanged.emit({
          email: personalDetails.email,
          firstName: personalDetails.firstName,
          lastName: personalDetails.lastName });
      } else {
        this.personalDetailsChanged.emit({
          email: null,
          firstName: null,
          lastName: null
        });
      }
    });
  }

  updateCurrentErrors(){
    this.errors.firstName = this.getErrorForControl('firstName', 'Enter first name');
    this.errors.lastName = this.getErrorForControl('lastName', 'Enter last name');
    this.errors.email = this.getErrorForControl('email', 'Enter a valid email address');
  }

  getErrorForControl(controlName: string, defaultMessage: string){
    if (!this.personalDetailForm.controls[controlName].touched){
      return [];
    }
    const errors = this.personalDetailForm.controls[controlName].errors;
    if (errors){
      return [defaultMessage];
    }
    return [];
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }
}

interface PersonalDetailsForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}
