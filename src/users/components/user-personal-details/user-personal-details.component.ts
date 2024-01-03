import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserDetails } from '@hmcts/rpx-xui-common-lib';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-personal-details',
  templateUrl: './user-personal-details.component.html'
})
export class UserPersonalDetailsComponent implements OnInit, OnDestroy {
  private onDestory$ = new Subject<void>();

  @Input() public user: UserDetails;
  personalDetailForm: FormGroup<PersonalDetailsForm>;

  constructor(private fb: FormBuilder) {
  }

  ngOnInit(): void {
    this.createFormAndPopulate();
  }

  createFormAndPopulate() {
    this.personalDetailForm = this.fb.nonNullable.group<PersonalDetailsForm>({
      email: this.fb.nonNullable.control<string>(this.user?.email, [Validators.required, Validators.email]),
      firstName: this.fb.nonNullable.control<string>(this.user?.firstName, [Validators.required]),
      lastName: this.fb.nonNullable.control<string>(this.user?.lastName, [Validators.required])
    });
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
};