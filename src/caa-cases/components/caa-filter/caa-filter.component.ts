import { Component, Input, OnInit } from '@angular/core';
import { CaaCasesFilterType, CaaCasesPageType, CAAShowHideFilterButtonText } from '../../models/caa-cases.enum';

@Component({
  selector: 'app-caa-filter-component',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent implements OnInit {

  @Input()
  assignedCasesFilterButtonText: string;

  public caaCasesPageType = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public selectedFilterType: string;
  public caaShowHideFilterButtonText = CAAShowHideFilterButtonText;

  constructor() {
  }

  public ngOnInit(): void {
  }

  public selectFilterOption(event: any): void {
    this.selectedFilterType = event.target.value;
  }
}
