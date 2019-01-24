import {Component, OnInit} from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Bootstraps the Fee Summary Components
 */

@Component({
  selector: 'app-prd-summary-component',
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {

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
        active: true
      },
      {
        text: 'Transactions',
        href: `../../transactions/${this.id}`,
        active: false
      }
    ];
  }

}
