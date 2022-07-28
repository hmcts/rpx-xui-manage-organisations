import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CaaCasesFilterType, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';

@Component({
  selector: 'app-caa-filter-assigned-component',
  templateUrl: './caa-filter-assigned.component.html',
  styleUrls: ['./caa-filter-assigned.component.scss']
})
export class CaaFilterAssignedComponent implements OnInit {

  @Input() public selectedFilterType: string;

  @Output() public emitSelectedFilterType = new EventEmitter<string>();
  @Output() public emitSelectedFilterValue = new EventEmitter<string>();

  public caaFormGroup: FormGroup;
  public caaCasesPageType = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caaShowHideFilterButtonText = CaaShowHideFilterButtonText;

  constructor(private readonly formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.caaFormGroup = this.formBuilder.group({
      'caa-filter': new FormControl(''),
      'assignee-person': new FormControl(''),
      'case-reference-number': new FormControl('')
    });
  }

  public selectFilterOption(caaCasesFilterType: string): void {
    this.selectedFilterType = caaCasesFilterType;
    this.emitSelectedFilterType.emit(this.selectedFilterType);
  }

  public search(): void {
    let selectedFilterValue: string;
    switch (this.selectedFilterType) {
      case CaaCasesFilterType.assigneeName:
        selectedFilterValue = this.caaFormGroup.get('assignee-person').value;
        break;
      case CaaCasesFilterType.caseReferenceNumber:
        selectedFilterValue = this.caaFormGroup.get('case-reference-number').value;
        break;
      default:
        selectedFilterValue = null;
        break;
    }
    this.emitSelectedFilterValue.emit(selectedFilterValue);
  }
}
