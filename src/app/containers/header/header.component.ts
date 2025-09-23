import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { select, Store } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuth from '../../../user-profile/store';
import { AppTitlesModel } from '../../models/app-titles.model';
import { UserNavModel } from '../../models/user-nav.model';
import * as fromRoot from '../../store';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss'],
    standalone: false
})
export class HeaderComponent implements OnInit {
  @Input() public navItems: {navItems: { active: boolean; href: string; }[]};
  @Input() public title: AppTitlesModel;
  @Input() public userNav: UserNavModel;
  @Output() public navigate = new EventEmitter<string>();

  public isBrandedHeader = true;
  public isUserLoggedIn$: Observable<boolean>;
  public showHeaderItems$: Observable<boolean>;

  constructor(public store: Store<fromRoot.State>) {}

  public ngOnInit(): void {
    this.isUserLoggedIn$ = this.store.pipe(select(fromAuth.getIsAuthenticated));
    this.showHeaderItems$ = this.store.pipe(select(fromAuth.getShowHeaderItems));
  }

  public onNavigate(event: string): void {
    this.navigate.emit(event);
  }
}
