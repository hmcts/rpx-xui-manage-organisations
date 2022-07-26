import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { CaaCasesFilterType, CaaCasesPageType, CaaShowHideFilterButtonText } from '../../models/caa-cases.enum';

@Component({
  selector: 'app-caa-filter-unassigned-component',
  templateUrl: './caa-filter-unassigned.component.html',
  styleUrls: ['./caa-filter-unassigned.component.scss']
})
export class CaaFilterUnassignedComponent implements OnInit {

  public caaFormGroup: FormGroup;
  public caaCasesPageType = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caaShowHideFilterButtonText = CaaShowHideFilterButtonText;

  constructor(private readonly formBuilder: FormBuilder) {
  }

  public ngOnInit(): void {
    this.caaFormGroup = this.formBuilder.group({
      'case-reference-number': new FormControl('')
    });
  }
}
