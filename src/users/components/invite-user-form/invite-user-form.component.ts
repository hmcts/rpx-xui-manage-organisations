import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-invite-user-form',
    templateUrl: './invite-user-form.component.html',
    standalone: false
})
export class InviteUserFormComponent {
  @Output() public submitForm = new EventEmitter();
  @Input() public inviteUserForm: FormGroup;
  @Input() public set errorMessages(value) {
    this.isInvalid = value || {};
  }

  public isInvalid;

  public onSubmit() {
    this.submitForm.emit();
  }
}
