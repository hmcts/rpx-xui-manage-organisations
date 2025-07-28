import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-jurisdiction-access-options',
  templateUrl: './jurisdiction-access-options.component.html'
})
export class JurisdictionAccessOptionsComponent {
  @Input() jurisdictions?;
}
