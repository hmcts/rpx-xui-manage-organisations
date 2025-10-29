import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-jurisdiction-access-options',
  templateUrl: './jurisdiction-access-options.component.html',
  standalone: false
})
export class JurisdictionAccessOptionsComponent {
  @Input() jurisdictions?;
}
