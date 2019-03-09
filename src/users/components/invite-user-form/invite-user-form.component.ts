import {Component, Input, Output, EventEmitter} from '@angular/core';
import {UserFromModel} from '../../models/userFrom.model';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-invite-user-form',
  templateUrl: './invite-user-form.component.html',
})
export class InviteUserFormComponent {

  @Output() submitForm = new EventEmitter();

  @Input() inviteUserForm: FormGroup;

  @Input() set errorMessages(value) {
    this.isInvalid = value || {};
  }

  isInvalid: UserFromModel;

  onSubmit() {
    this.submitForm.emit();
  }
}
