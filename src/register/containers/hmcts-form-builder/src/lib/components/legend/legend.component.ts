import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-legend',
  templateUrl: './legend.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class LegendComponent {
    @Input() public classes: string;
}
