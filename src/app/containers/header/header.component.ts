import { Component, OnInit } from '@angular/core';
import { Store, select } from '@ngrx/store';
import * as fromLogInStore from '../../../login/store';
import { Observable } from 'rxjs';


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

    userLoggedIn$: Observable<any>

    constructor(private loginStore: Store<fromLogInStore.LoginState>) {
        this.logoutLink = `/api/logout`;

    }


    ngOnInit(): void {
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

        this.userLoggedIn$ = this.loginStore.pipe(select(fromLogInStore.getLoggedInUser));
    }





}
