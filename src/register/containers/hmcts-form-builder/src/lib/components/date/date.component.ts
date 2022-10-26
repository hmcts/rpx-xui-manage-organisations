import { Component, Input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-date',
  templateUrl: './date.component.html'
})
export class DateComponent {
    @Input() public group: FormGroup;
    @Input() public id;
    @Input() public data;
    @Input() public validate;
    @Input() public showValidation;
    @Input() public validationError;

}
