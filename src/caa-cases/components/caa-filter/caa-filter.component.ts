import { Component, OnInit } from '@angular/core';
import { FilterConfig, FilterFieldConfig, FilterSetting } from '@hmcts/rpx-xui-common-lib/lib/models/filter.model';

@Component({
  selector: 'app-caa-filter-component',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent implements OnInit {

  private static readonly FILTER_NAME = 'case_cases';

  public fieldsConfig: FilterConfig = {
    persistence: 'local',
    id: CaaFilterComponent.FILTER_NAME,
    fields: [],
    cancelButtonText: 'Reset to default',
    applyButtonText: 'Apply filter',
    cancelSetting: null
  };
  public fieldsSettings: FilterSetting = {
    fields: [],
    id: CaaFilterComponent.FILTER_NAME
  };

  constructor() {
  }

  public ngOnInit(): void {
    this.setAssigneeConfig();
  }

  public setAssigneeConfig(): void {
    const field: FilterFieldConfig = {
      name: CaaFilterComponent.FILTER_NAME,
      options: [
        { key: 'all-assignees', label: 'All assignees' },
        { key: 'assignee-name', label: 'Assignee name' },
        { key: 'case-reference-number', label: 'Case reference number' }
      ],
      minSelected: 1,
      maxSelected: null,
      minSelectedError: 'At least one location is required',
      maxSelectedError: 'Maximum locations selected',
      subTitle: 'Type the name and select an available match option',
      type: 'find-person'
    };
    this.fieldsSettings.fields = [...this.fieldsSettings.fields, {
      name: CaaFilterComponent.FILTER_NAME,
      value: ['One', 'Two', 'Three']
    }];
    this.fieldsConfig.cancelSetting = JSON.parse(JSON.stringify(this.fieldsSettings));
    this.fieldsConfig.fields.push(field);
  }
}
