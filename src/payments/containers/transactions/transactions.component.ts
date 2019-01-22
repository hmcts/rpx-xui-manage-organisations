import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Bootstraps the Transactions Components
 */

@Component({
  selector: 'app-prd-transactions-component',
  templateUrl: './transactions.component.html',
})
export class TransactionsComponent implements OnInit {

  id: string;
  navItems: Array<{}>;

  constructor(
    private activeRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activeRoute.params.subscribe(params => {
      if (params['id']) {
        this.id = params['id'];
      }
    });

    this.navItems = [
      {
        text: 'Summary',
        href: `../../summary/${this.id}`,
        active: false
      },
      {
        text: 'Transactions',
        href: `../../transactions/${this.id}`,
        active: true
      }
    ];
  }

}
