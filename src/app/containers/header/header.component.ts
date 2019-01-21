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
            text: 'Your cases',
            href: '/',
            active: true
        }];
        this.serviceName = {
            name: 'Manage organisation details for civil and family law cases',
            url: '/'
        };
        this.navigations = {
            label: 'Account navigation',
            items: [{
                text: 'Sign out',
                href: this.logoutLink
            }]
        };
    }


}
