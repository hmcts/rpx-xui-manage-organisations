import { Component, OnInit } from '@angular/core';
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
    constructor() {
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
            href: '/payments',
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
