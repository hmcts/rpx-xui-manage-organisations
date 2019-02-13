import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromSingleFeeAccountStore from '../../../fee-accounts/store';
import * as fromLogInStore from '../../../login/store';
import { Observable } from 'rxjs';
import { Router, NavigationEnd, Event } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  title = 'PUI Manager';
  identityBar$: Observable<fromSingleFeeAccountStore.FeeAccountsState[]>;


  constructor(
    private store: Store<fromSingleFeeAccountStore.FeeAccountsState>,
    private router: Router
  ) {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const replacedTitles = this.replacedTitles(event.url);
        this.title = this.getTitle(replacedTitles);
      }
    });


  }

  ngOnInit() {
    this.identityBar$ = this.store.pipe(select(fromSingleFeeAccountStore.getSingleFeeAccountArray));

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
