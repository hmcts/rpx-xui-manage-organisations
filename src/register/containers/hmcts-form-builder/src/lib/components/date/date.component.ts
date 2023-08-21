import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html'
})
export class DateComponent {
    @Input() group: UntypedFormGroup;
    @Input() id;
    @Input() data;
    @Input() validate;
    @Input() showValidation;
    @Input() validationError;
}
