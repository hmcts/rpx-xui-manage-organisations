import {Component, EventEmitter, Input, Output} from '@angular/core';

/**
 * Terms and Condition Component
 * TODO - ADD TO NPM
 */
@Component({
  selector: 'app-accept-terms-conditions',
  templateUrl: './accept-tc.component.html'
})
export class AcceptTcComponent {
  @Input() uId: string;
  @Output() acceptTC = new EventEmitter<string>();
  constructor() {
  }

  onAcceptTandC() {
    this.acceptTC.emit(this.uId);
  }
}
