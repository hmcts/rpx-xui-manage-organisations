import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class DateComponent {
    @Input() group: FormGroup;
    @Input() id;
    @Input() data;
    @Input() validate;
    @Input() showValidation;
    @Input() validationError;
}
