import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSingleFeeAccountStore from '../../../fee-accounts/store';
import * as fromRoot from '../../store'
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'PUI Manager';
  identityBar$: Observable<string[]>;


  constructor(
    private store: Store<fromRoot.State>
  ) {}

  ngOnInit() {
    this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountArray));
    this.store.pipe(select(fromRoot.getRouterState)).subscribe(rootState => {
      if (rootState) {
        const replacedTitles = this.replacedTitles(rootState.state.url);
        this.title = this.getTitle(replacedTitles);
      }
    });
  }


  private replacedTitles(url: string): string {
    if (url.indexOf('users') !== -1) {
      return 'users';
    }
    if (url.indexOf('organisation') !== -1) {
      return 'organisation';
    }
    if (url.indexOf('profile') !== -1) {
      return 'profile';
    }
    if (url.indexOf('fee-accounts') !== -1) {
      return 'feeaccounts';
    }
    if (url.indexOf('login') !== -1) {
      return 'login';
    }
    if (url.indexOf('userform') !== -1) {
      return 'userform';
    }

    return '/';
  }

  private getTitle(key): string {
    const titleMapping: { [id: string]: string } = {
      '/': 'Professional User Interface',
      'users': 'Users - Professional User Interface',
      'organisation': 'Organisation - Professional User Interface',
      'profile': 'Profile - Professional User Interface',
      'feeaccounts': 'Fee Accounts - Professional User Interface',
      'userform': 'Invite Users - Professional User Interface',
      'login': 'Login - Professional User Interface',
    };

    return titleMapping[key];
  }

}
