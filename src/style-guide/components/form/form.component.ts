import {Component, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

  @Output() submitForm = new EventEmitter();
  @Input() inviteUserForm: FormGroup;
  @Input() set errorMessages(value) {
    this.isInvalid = value || {} ;
  }

  isInvalid

  onSubmit() {
    this.submitForm.emit();
  }
}
