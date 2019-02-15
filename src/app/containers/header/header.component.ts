import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import * as fromAuth from '../../../auth/store';
import {tap} from 'rxjs/operators';


@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

    logoutLink: string;
    navItems: Array<{}>;
    navigations;
    serviceName;

    isUserLoggedIn$: Observable<boolean>;

    constructor(public store: Store<fromAuth.AuthState>) {}


    ngOnInit(): void {
        this.isUserLoggedIn$ = this.store.pipe(select(fromAuth.getIsAuthenticated));

        this.logoutLink = `/api/logout`;

        this.navItems = [{
            text: 'Organisation',
            href: '/organisation',
            active: true
        },
        {
            text: 'Users',
            href: '/users',
            active: false
        },
        {
            text: 'Fee Accounts',
            href: '/fee-accounts',
            active: false
        },

        ];
        this.serviceName = {
            name: 'Manage organisation details for civil and family law cases',
            url: '/'
        };
        this.navigations = {
            label: 'Account navigation',
            items: [{
                text: 'Profile',
                href: '/profile'
            }, {
                text: 'Sign out',
                href: this.logoutLink
            }]
        };

    }
}
