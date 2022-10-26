import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-fieldset',
  templateUrl: './fieldset.component.html'
})
export class FieldsetComponent {
    @Input() public classes;
    @Input() public validate;
    @Input() public group;
    @Input() public data: any[];
}
