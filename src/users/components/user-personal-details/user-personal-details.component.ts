import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { UserDetails } from '@hmcts/rpx-xui-common-lib';
import { Subject } from 'rxjs';

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
      if (this.personalDetailForm.valid) {
        this.personalDetailsChanged.emit({
          email: personalDetails.email,
          firstName: personalDetails.firstName,
          lastName: personalDetails.lastName });
      }
    });
  }

  getErrorAsText(errors: ValidationErrors): string[] {
    return Object.keys(errors || {}).map((key) => {
      switch (key) {
        case 'required':
          return 'This field is required.';
        case 'email':
          return 'Please enter a valid email address.';
        // Add more cases for other validation errors as needed
        default:
          return 'Unknown error.';
      }
    });
  }

  ngOnDestroy(): void {
    this.onDestory$.next();
    this.onDestory$.complete();
  }
}

export interface PersonalDetails {
  firstName: string;
  lastName: string;
  email: string;
}

interface PersonalDetailsForm {
  firstName: FormControl<string>;
  lastName: FormControl<string>;
  email: FormControl<string>;
}
