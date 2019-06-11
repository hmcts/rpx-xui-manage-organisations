import {Component, Input} from '@angular/core';
import {FormGroup} from '@angular/forms';

@Component({
  selector: 'app-jui-form-elements',
  templateUrl: './jui-form-elements.component.html'
})
export class JuiFormElementsComponent {
    @Input() group: FormGroup;
    @Input() data;
    @Input() validate;
}
