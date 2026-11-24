import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-jurisdiction-access-options',
  templateUrl: './jurisdiction-access-options.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class JurisdictionAccessOptionsComponent {
  @Input() jurisdictions?;
}
