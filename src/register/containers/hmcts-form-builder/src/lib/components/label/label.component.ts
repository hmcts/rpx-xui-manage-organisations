import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html'
})
export class LabelComponent {
    @Input() idPrefix = 'lb';
    @Input() name = 'lb';
    @Input() forElement;
    @Input() label: string;

    constructor() {}
}
