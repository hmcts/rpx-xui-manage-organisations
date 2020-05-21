import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuth from '../../../user-profile/store';
import * as fromRoot from '../../store';
import {AppTitlesModel} from '../../models/app-titles.model';
import {UserNavModel} from '../../models/user-nav.model';

@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() navItems: {navItems: { active: boolean; href: string; }[]};
  @Input() title: AppTitlesModel;
  @Input() userNav: UserNavModel;
  @Output() navigate = new EventEmitter<string>();


  public isBrandedHeader = true;
  isUserLoggedIn$: Observable<boolean>;
  showHeaderItems$: Observable<boolean>;

  constructor(public store: Store<fromRoot.State>) {}

  ngOnInit(): void {
    this.isUserLoggedIn$ = this.store.pipe(select(fromAuth.getIsAuthenticated));
    this.showHeaderItems$ = this.store.pipe(select(fromAuth.getShowHeaderItems));
  }

  onNavigate(event) {
    this.navigate.emit(event);
  }
}
