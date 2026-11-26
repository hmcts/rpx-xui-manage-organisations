import { Component, Input, OnInit, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-hmcts-identity-bar',
  templateUrl: './hmcts-identity-bar.component.html',
  styleUrls: ['./hmcts-identity-bar.component.scss'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false
})
export class HmctsIdentityBarComponent {
    @Input() set content(value) {
    this.value = value.name;
  }

    value: string;

    constructor() {}
}
