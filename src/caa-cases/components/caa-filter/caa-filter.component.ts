import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  CaaCasesFilterHeading,
  CaaCasesFilterType,
  CaaCasesPageType,
  CaaShowHideFilterButtonText
} from '../../models/caa-cases.enum';

@Component({
  selector: 'app-caa-filter',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent implements OnInit {

  @Input() public selectedFilterType: string;
  @Input() public caaCasesPageType: string;

  @Output() public emitSelectedFilterType = new EventEmitter<string>();
  @Output() public emitSelectedFilterValue = new EventEmitter<string>();

  public caaFormGroup: FormGroup;
  public caaFilterHeading: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caaShowHideFilterButtonText = CaaShowHideFilterButtonText;

  constructor(private readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.caaFormGroup = this.formBuilder.group({
      'case-reference-number': new FormControl('')
    });
    if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
      this.caaFormGroup.addControl('caa-filter', new FormControl(''));
      this.caaFormGroup.addControl('assignee-person', new FormControl(''));
    }
    this.caaFilterHeading = this.caaCasesPageType === CaaCasesPageType.AssignedCases
      ? CaaCasesFilterHeading.AssignedCases
      : CaaCasesFilterHeading.UnassignedCases;
  }

  public selectFilterOption(caaCasesFilterType: string): void {
    this.selectedFilterType = caaCasesFilterType;
    this.emitSelectedFilterType.emit(this.selectedFilterType);
  }

  public search(): void {
    let selectedFilterValue: string;
    switch (this.selectedFilterType) {
      case CaaCasesFilterType.AssigneeName:
        selectedFilterValue = this.caaFormGroup.get('assignee-person').value;
        break;
      case CaaCasesFilterType.CaseReferenceNumber:
        selectedFilterValue = this.caaFormGroup.get('case-reference-number').value;
        break;
      default:
        selectedFilterValue = null;
        break;
    }
    this.emitSelectedFilterValue.emit(selectedFilterValue);
  }
}
