import {Component, Input, Output, EventEmitter, OnInit} from '@angular/core';
import {FormGroup} from '@angular/forms';


@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
})
export class FormComponent {

  @Output() submitForm = new EventEmitter();
  @Input() styleGuideFromGroup: FormGroup;
  @Input() set errorMessages(value) {
    this.isInvalid = value || {};
  }

  isInvalid;

  onSubmit() {
    this.submitForm.emit();
  }

}
