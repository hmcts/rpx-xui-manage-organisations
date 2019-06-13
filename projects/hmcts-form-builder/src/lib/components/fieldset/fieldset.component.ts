import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html'
})
export class FieldsetComponent {
    @Input() classes;
    @Input() validate;
    @Input() group;
    @Input() data: Array<any>;
}
