import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html'
})
export class LegendComponent {
    @Input() classes:  string;
}
