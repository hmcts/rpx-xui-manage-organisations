import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@hmcts/rpx-xui-common-lib';
import { Observable, catchError, debounceTime, of, switchMap, tap } from 'rxjs';
import { CaaCasesFilterErrorMessage, CaaCasesFilterType } from 'src/caa-cases/models/caa-cases.enum';
import { CaaCasesSessionStateValue } from 'src/caa-cases/models/caa-cases.model';
import { SelectedCaseFilter } from 'src/caa-cases/models/selected-case-filter.model';
import { CaaCasesUtil } from 'src/caa-cases/util/caa-cases.util';
import { ErrorMessage } from 'src/shared/models/error-message.model';

@Component({
  selector: 'app-cases-filter',
  templateUrl: './cases-filter.component.html',
  styleUrls: ['./cases-filter.component.scss']
})
export class CasesFilterComponent implements OnInit, OnChanges{
  @Input() public selectedOrganisationUsers: User[];
  @Input() public sessionStateValue: CaaCasesSessionStateValue;

  @Output() public selectedFilter = new EventEmitter<SelectedCaseFilter>();
  @Output() public emitErrorMessages = new EventEmitter<ErrorMessage[]>();

  public readonly ACTIVE_USER_GROUP_HEADING = 'Active users:';
  public readonly INACTIVE_USER_GROUP_HEADING = 'Inactive users:';
  public readonly ACTIVE_USER_STATUS = 'active';

  public readonly assigneeNameErrorMessage = 'Enter a valid assignee name';
  public readonly caseReferenceNumberErrorMessage = 'Enter a valid HMCTS case reference number';

  public filteredAndGroupedUsers = new Map<string, User[]>();

  public caaCasesFilterType = CaaCasesFilterType; // used in the template
  public selectedFilterType = CaaCasesFilterType.None;

  public errorMessages: ErrorMessage[];

  public form: FormGroup<CasesFilterForm>;
  public showAutocomplete: boolean = false;

  public constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOrganisationUsers &&
      changes.selectedOrganisationUsers.currentValue &&
      changes.selectedOrganisationUsers.currentValue.length > 0) {
      this.filterSelectedOrganisationUsers().subscribe((filteredAndGroupedUsers) => {
        this.filteredAndGroupedUsers = filteredAndGroupedUsers;
      });
      this.populateFormFromSessionState();
    }
  }

  createForm() {
    this.form = this.formBuilder.group<CasesFilterForm>({
      filterOption: this.formBuilder.control(CaaCasesFilterType.None),
      assigneePerson: this.formBuilder.control(''),
      caseReferenceNumber: this.formBuilder.control('')
    });

    this.form.controls.filterOption.valueChanges.subscribe((value: CaaCasesFilterType) => {
      this.selectFilterOption(value);
      this.handleOnFilterOptionChange(value);
    });

    this.form.controls.assigneePerson.valueChanges.pipe(
      tap(() => {
        this.showAutocomplete = false;
        this.filteredAndGroupedUsers = null;
      },
      debounceTime(300)),
      switchMap((searchTerm: any) => this.filterSelectedOrganisationUsers(searchTerm).pipe(
        tap(() => this.showAutocomplete = true),
        catchError(() => this.filteredAndGroupedUsers = null)
      ))
    ).subscribe((filteredAndGroupedUsers: Map<string, User[]>) => {
      this.filteredAndGroupedUsers = filteredAndGroupedUsers;
    });
  }

  public populateFormFromSessionState(): void {
    if (this.sessionStateValue) {
      const filterOptionValue = this.sessionStateValue.filterType as CaaCasesFilterType;
      this.form.controls.filterOption.setValue(filterOptionValue, { emitEvent: false, onlySelf: true });

      this.selectFilterOption(filterOptionValue);
      if (filterOptionValue === CaaCasesFilterType.AssigneeName) {
        const assigneePersonValue = this.sessionStateValue.assigneeName;
        const user = this.selectedOrganisationUsers.find((user) => user.userIdentifier === assigneePersonValue);

        this.form.controls.assigneePerson.setValue(this.getDisplayName(user), { emitEvent: false, onlySelf: true });
      }

      if (filterOptionValue === CaaCasesFilterType.CaseReferenceNumber) {
        const caseReferenceNumberValue = this.sessionStateValue.caseReferenceNumber;
        this.form.controls.caseReferenceNumber.setValue(caseReferenceNumberValue, { emitEvent: false, onlySelf: true });
      }

      this.form.markAsDirty();
    }
  }

  public filterSelectedOrganisationUsers(searchTerm?: string | User): Observable<Map<string, User[]>> {
    const filteredUsers = searchTerm && searchTerm.length > 0
      ? typeof(searchTerm) === 'string'
        ? this.selectedOrganisationUsers.filter((user) => this.getDisplayName(user).toLowerCase().includes(searchTerm.toLowerCase()))
        : this.selectedOrganisationUsers.filter((user) => this.getDisplayName(user).toLowerCase().includes(this.getDisplayName(searchTerm).toLowerCase()))
      : this.selectedOrganisationUsers;
    const activeUsers = filteredUsers.filter((user) => user.status.toLowerCase() === this.ACTIVE_USER_STATUS);
    const inactiveUsers = filteredUsers.filter((user) => user.status.toLowerCase() !== this.ACTIVE_USER_STATUS);
    const groupedUsers = new Map<string, User[]>();
    groupedUsers.set(this.ACTIVE_USER_GROUP_HEADING, activeUsers);
    groupedUsers.set(this.INACTIVE_USER_GROUP_HEADING, inactiveUsers);
    return of(groupedUsers);
  }

  public getDisplayName(selectedUser: User): string {
    return `${selectedUser.fullName} - ${selectedUser.email}`;
  }

  public onSearch(): void {
    if (this.validateForm()) {
      let filterValue = null;
      if (this.form.controls.filterOption.value === CaaCasesFilterType.CaseReferenceNumber) {
        filterValue = this.form.controls.caseReferenceNumber.value;
      }

      if (this.form.controls.filterOption.value === CaaCasesFilterType.AssigneeName) {
        const selectedUser = this.form.controls.assigneePerson.value;
        const fullName = selectedUser.split(' - ')[0];
        const email = selectedUser.split(' - ')[1];
        filterValue = this.selectedOrganisationUsers && this.selectedOrganisationUsers.find(
          (user) => user.fullName === fullName && user.email === email).userIdentifier;
      }
      const selectedFilter: SelectedCaseFilter = {
        filterType: this.selectedFilterType,
        filterValue: filterValue
      };
      this.selectedFilter.emit(selectedFilter);
    }
  }

  public onReset(): void {
    this.form.reset({ filterOption: CaaCasesFilterType.None, assigneePerson: '', caseReferenceNumber: '' });
    this.selectedFilter.emit({ filterType: this.selectedFilterType, filterValue: '' });
  }

  public onUserSelectionChange(selectedUser: User) {
    this.form.controls.assigneePerson.clearValidators();
    this.form.controls.assigneePerson.updateValueAndValidity();
    this.form.controls.assigneePerson.setValue(this.getDisplayName(selectedUser), { emitEvent: false, onlySelf: true });
  }

  public selectFilterOption(caaCasesFilterType: CaaCasesFilterType): void {
    this.selectedFilterType = caaCasesFilterType;
  }

  private validateForm(): boolean {
    let isValid = true;
    this.errorMessages = [];
    if (this.form.controls.filterOption.value === CaaCasesFilterType.AssigneeName) {
      this.form.controls.assigneePerson.updateValueAndValidity({ emitEvent: false, onlySelf: true }); // ensure validation is run even if the field is empty
      if (this.form.controls.assigneePerson.invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidAssigneeName, fieldId: 'assigneePerson' });
        isValid = false;
      }
    }
    if (this.form.controls.filterOption.value === CaaCasesFilterType.CaseReferenceNumber) {
      this.form.controls.caseReferenceNumber.updateValueAndValidity({ emitEvent: false, onlySelf: true }); // ensure validation is run even if the field is empty
      if (this.form.controls.caseReferenceNumber.invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidCaseReference, fieldId: 'caseReferenceNumber' });
        isValid = false;
      }
    }
    this.emitErrorMessages.emit(this.errorMessages);
    return isValid;
  }

  private handleOnFilterOptionChange(value: CaaCasesFilterType): void {
    // clear validators for all forms
    this.form.controls.assigneePerson.clearValidators();
    this.form.controls.caseReferenceNumber.clearValidators();
    this.form.controls.assigneePerson.reset();
    this.form.controls.caseReferenceNumber.reset();
    switch (value) {
      case CaaCasesFilterType.AssigneeName:
        this.form.controls.assigneePerson.setValidators([Validators.required, CaaCasesUtil.assigneeNameValidator2()]);
        break;
      case CaaCasesFilterType.CaseReferenceNumber:
        this.form.controls.caseReferenceNumber.setValidators([Validators.required, CaaCasesUtil.caseReferenceValidator()]);
        break;
      case CaaCasesFilterType.AllAssignees:
      case CaaCasesFilterType.NewCasesToAccept:
      case CaaCasesFilterType.UnassignedCases:
        break;
    }
    this.form.updateValueAndValidity();
  }
}

interface CasesFilterForm {
  filterOption: FormControl<CaaCasesFilterType>;
  assigneePerson: FormControl<string>;
  caseReferenceNumber: FormControl<string>;
}
