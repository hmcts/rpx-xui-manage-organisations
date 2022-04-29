import { Component, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hmcts-primary-navigation',
  templateUrl: './hmcts-primary-navigation.component.html',
  styleUrls: ['./hmcts-primary-navigation.component.scss']
})
export class HmctsPrimaryNavigationComponent {

  @Input() public set userLoggedIn(value) {
    this.isUserLoggedIn = value;
  }

  @Input() public label: string;
  @Input() public items: object[];
  @Input() public isBrandedHeader: boolean;

  public isUserLoggedIn: boolean;
  constructor(private readonly route: ActivatedRoute) {}

}
