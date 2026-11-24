import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-label',
  templateUrl: './label.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class LabelComponent {
  @Input() idPrefix = 'lb';
  @Input() name = 'lb';
  @Input() forElement;
  @Input() label: string;
}
