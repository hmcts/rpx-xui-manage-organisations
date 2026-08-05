import { Component, Input } from '@angular/core';
import { buildIdOrIndexKey } from 'src/shared/utils/track-by.util';

@Component({
  selector: 'app-hmcts-sub-navigation',
  templateUrl: './hmcts-sub-navigation.component.html',
  styleUrls: ['./hmcts-sub-navigation.component.scss'],
  standalone: false
})
export class HmctsSubNavigationComponent {
    @Input() label: string;
    @Input() items: Array<SubNavigation>;

    constructor() {}

    public trackBySubNavItem(index: number, item: SubNavigation): string | number {
      return buildIdOrIndexKey(index, item as any, 'href', 'text');
    }
}

export interface SubNavigation {
    text: string;
    href: string;
    active: boolean;
}

