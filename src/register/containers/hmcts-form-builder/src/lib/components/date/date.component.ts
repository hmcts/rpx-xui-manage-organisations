import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
    selector: 'app-date',
    templateUrl: './date.component.html',
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
