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
}
