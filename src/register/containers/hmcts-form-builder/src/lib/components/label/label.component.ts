import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html'
})
export class LabelComponent {
    @Input() public idPrefix = 'lb';
    @Input() public name = 'lb';
    @Input() public forElement;
    @Input() public label: string;

    constructor() {}
}
