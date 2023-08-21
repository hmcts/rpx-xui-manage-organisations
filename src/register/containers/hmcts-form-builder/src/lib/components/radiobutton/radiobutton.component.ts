import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-radiobutton',
  templateUrl: './radiobutton.component.html'
})
export class RadiobuttonComponent {
  @Input() group: UntypedFormGroup;
  @Input() idPrefix = 'rb';
  @Input() name = 'rb';
  @Input() items;
  @Input() classes;
  @Input() control;
  @Input() validate;
  @Input() showValidation;
  @Input() validationError;
}
