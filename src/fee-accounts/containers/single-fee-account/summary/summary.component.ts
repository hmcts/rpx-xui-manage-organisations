import {Component, OnInit, Input} from '@angular/core';

/**
 * Bootstraps the Summary Components
 */

@Component({
  selector: 'app-prd-summary-component',
  templateUrl: './summary.component.html',
})
export class SummaryComponent implements OnInit {

  @Input() summary;

  constructor() {}

  ngOnInit(): void {
  }

}
