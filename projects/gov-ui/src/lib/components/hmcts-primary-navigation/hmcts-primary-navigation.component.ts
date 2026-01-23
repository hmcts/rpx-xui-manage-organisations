import { Component, Input } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-hmcts-primary-navigation',
  templateUrl: './hmcts-primary-navigation.component.html',
  styleUrls: ['./hmcts-primary-navigation.component.scss'],
  standalone: false
})
export class HmctsPrimaryNavigationComponent {
  @Input() set userLoggedIn(value) {
    this.isUserLoggedIn = value;
  }

  @Input() label: string;
  @Input() items: object[];
  @Input() isBrandedHeader: boolean;

  isUserLoggedIn: boolean;
  constructor(private route: ActivatedRoute) {
  }

  public trackByNavItem(index: number, item: any): string | number {
    return buildIdOrIndexKey(index, item, 'id', 'href', 'text');
  }
}
