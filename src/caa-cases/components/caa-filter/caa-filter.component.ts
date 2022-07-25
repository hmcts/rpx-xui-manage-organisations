import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { CaaCasesFilterType, CaaCasesPageType, CAAShowHideFilterButtonText } from '../../models/caa-cases.enum';

@Component({
  selector: 'app-caa-filter-component',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent {

  @Input() public caaFormGroup: FormGroup;
  @Input() public selectedFilterType: string;

  @Output() public emitSelectedFilterType = new EventEmitter<string>();

  public caaCasesPageType = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caaShowHideFilterButtonText = CAAShowHideFilterButtonText;

  constructor() {
  }

  public selectFilterOption(event: any): void {
    this.selectedFilterType = event.target.value;
    this.emitSelectedFilterType.emit(this.selectedFilterType);
  }
}
