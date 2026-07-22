import { Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@hmcts/rpx-xui-common-lib';
import { Observable, of, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CaaCasesFilterErrorMessage, CaaCasesFilterType } from 'src/cases/models/caa-cases.enum';
import { CaaCasesSessionStateValue } from 'src/cases/models/caa-cases.model';
import { SelectedCaseFilter } from 'src/cases/models/selected-case-filter.model';
import { CaaCasesUtil } from 'src/cases/util/caa-cases.util';
import { ErrorMessage } from 'src/shared/models/error-message.model';
import { ENVIRONMENT_CONFIG, EnvironmentConfig } from '../../../models/environmentConfig.model';

@Component({
  selector: 'app-cases-filter',
  templateUrl: './cases-filter.component.html',
  styleUrls: ['./cases-filter.component.scss'],
  standalone: false
})
export class CasesFilterComponent implements OnInit, OnChanges, OnDestroy {
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
  public caaCasesFilterType = CaaCasesFilterType;
  public selectedFilterType = CaaCasesFilterType.None;
  public errorMessages: ErrorMessage[];
  public form: FormGroup<CasesFilterForm>;
  public showAutocomplete: boolean = false;
  public filterApplied: boolean = false;
  public ogdUpdateRefreshUserEnabled = false;

  private readonly destroy$ = new Subject<void>();
  private hasAppliedSessionState = false;
  private lastSearchTerm: string = '';

  public constructor(
    private readonly formBuilder: FormBuilder,
    @Inject(ENVIRONMENT_CONFIG) private readonly environmentConfig: EnvironmentConfig
  ) { }

  ngOnInit(): void {
    this.ogdUpdateRefreshUserEnabled = !!this.environmentConfig.ogdUpdateRefreshUserEnabled;
    this.createForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOrganisationUsers?.currentValue &&
      changes.selectedOrganisationUsers.currentValue.length > 0) {
      this.filterSelectedOrganisationUsers().pipe(takeUntil(this.destroy$)).subscribe((filteredAndGroupedUsers) => {
        this.filteredAndGroupedUsers = filteredAndGroupedUsers;
      });
      this.populateFormFromSessionState(!this.hasAppliedSessionState);
    }
  }

  createForm() {
    this.form = this.formBuilder.group<CasesFilterForm>({
      filterOption: this.formBuilder.control(CaaCasesFilterType.None),
      assigneePerson: this.formBuilder.control(''),
      caseReferenceNumber: this.formBuilder.control('')
    });
    this.populateFormFromSessionState();

    this.form.controls.filterOption.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: CaaCasesFilterType) => {
        this.filterApplied = false;
        this.selectFilterOption(value);
        this.handleOnFilterOptionChange(value);
      });

    this.form.controls.assigneePerson.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((searchTerm: any) => {
        if (searchTerm === this.lastSearchTerm) {
          return of(this.filteredAndGroupedUsers);
        }
        this.lastSearchTerm = searchTerm;
        this.showAutocomplete = false;
        this.filteredAndGroupedUsers = null;
        return this.filterSelectedOrganisationUsers(searchTerm).pipe(
          tap({ next: () => this.showAutocomplete = true }),
          catchError(() => {
            this.filteredAndGroupedUsers = null;
            return of(new Map<string, User[]>());
          })
        );
      }),
      takeUntil(this.destroy$)
    ).subscribe((filteredAndGroupedUsers: Map<string, User[]>) => {
      this.filteredAndGroupedUsers = filteredAndGroupedUsers;
    });
  }

  public populateFormFromSessionState(emitSearch = true): void {
    if (this.sessionStateValue && this.form) {
      const filterOptionValue = this.getAvailableFilterType(this.sessionStateValue.filterType as CaaCasesFilterType);
      this.form.controls.filterOption.setValue(filterOptionValue, { emitEvent: false, onlySelf: true });

      this.selectFilterOption(filterOptionValue);
      if (filterOptionValue === CaaCasesFilterType.CasesAssignedToAUser) {
        const assigneePersonValue = this.sessionStateValue.assigneeName;
        if (!this.selectedOrganisationUsers || this.selectedOrganisationUsers.length === 0) {
          return;
        }
        const user = this.selectedOrganisationUsers.find((user) => user.userIdentifier === assigneePersonValue);
        this.form.controls.assigneePerson.setValue(this.getDisplayName(user), { emitEvent: false, onlySelf: true });
      }

      if (filterOptionValue === CaaCasesFilterType.CaseReferenceNumber) {
        const caseReferenceNumberValue = this.sessionStateValue.caseReferenceNumber;
        this.form.controls.caseReferenceNumber.setValue(caseReferenceNumberValue, { emitEvent: false, onlySelf: true });
      }
      this.filterApplied = true;
      this.form.markAsDirty();
      if (emitSearch) {
        this.hasAppliedSessionState = true;
        this.onSearch();
      }
    }
  }

  public filterSelectedOrganisationUsers(
    searchTerm?: string | User
  ): Observable<Map<string, User[]>> {
    const selectedOrganisationUsers = this.selectedOrganisationUsers ?? [];
    let filteredUsers = selectedOrganisationUsers;

    if (searchTerm) {
      const searchText =
        typeof searchTerm === 'string'
          ? searchTerm
          : this.getDisplayName(searchTerm);

      if (searchText.length > 0) {
        const normalizedSearchText = searchText.toLowerCase();

        filteredUsers = selectedOrganisationUsers.filter((user) =>
          this.getDisplayName(user)
            .toLowerCase()
            .includes(normalizedSearchText)
        );
      }
    }

    const activeUsers = filteredUsers.filter(
      (user) => user.status.toLowerCase() === this.ACTIVE_USER_STATUS
    );

    const inactiveUsers = filteredUsers.filter(
      (user) => user.status.toLowerCase() !== this.ACTIVE_USER_STATUS
    );

    const groupedUsers = new Map<string, User[]>();
    groupedUsers.set(this.ACTIVE_USER_GROUP_HEADING, activeUsers);
    groupedUsers.set(this.INACTIVE_USER_GROUP_HEADING, inactiveUsers);

    return of(groupedUsers);
  }

  public getDisplayName(selectedUser: User): string {
    if (!selectedUser) {
      return '';
    }
    return `${selectedUser.fullName} - ${selectedUser.email}`;
  }

  public onSearch(): void {
    if (this.validateForm()) {
      let filterValue = null;
      if (this.form.controls.filterOption.value === CaaCasesFilterType.CaseReferenceNumber) {
        filterValue = this.form.controls.caseReferenceNumber.value;
      }

      if (this.form.controls.filterOption.value === CaaCasesFilterType.CasesAssignedToAUser) {
        const selectedUser = this.form.controls.assigneePerson.value;
        const [fullName, email] = selectedUser.split(' - ');
        filterValue = this.selectedOrganisationUsers?.find(
          (user) => user.fullName === fullName && user.email === email)?.userIdentifier;
      }
      const selectedFilter: SelectedCaseFilter = {
        filterType: this.selectedFilterType,
        filterValue: filterValue
      };
      this.filterApplied = true;
      this.selectedFilter.emit(selectedFilter);
    }
  }

  public onReset(): void {
    this.form.reset({ filterOption: CaaCasesFilterType.UnassignedCases, assigneePerson: '', caseReferenceNumber: '' });
    this.selectedFilter.emit({ filterType: this.selectedFilterType, filterValue: '' });
    this.filterApplied = false;
  }

  public onUserSelectionChange(selectedUser: User) {
    this.form.controls.assigneePerson.clearValidators();
    this.form.controls.assigneePerson.updateValueAndValidity();
    this.form.controls.assigneePerson.setValue(this.getDisplayName(selectedUser), { emitEvent: false, onlySelf: true });
  }

  public selectFilterOption(caaCasesFilterType: CaaCasesFilterType): void {
    this.selectedFilterType = this.getAvailableFilterType(caaCasesFilterType);
  }

  private getAvailableFilterType(caaCasesFilterType: CaaCasesFilterType): CaaCasesFilterType {
    if (!this.ogdUpdateRefreshUserEnabled && caaCasesFilterType === CaaCasesFilterType.NewCasesToAccept) {
      return CaaCasesFilterType.UnassignedCases;
    }

    return caaCasesFilterType;
  }

  private validateForm(): boolean {
    let isValid = true;
    this.errorMessages = [];
    if (this.form.controls.filterOption.value === CaaCasesFilterType.CasesAssignedToAUser) {
      this.form.controls.assigneePerson.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      if (this.form.controls.assigneePerson.invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidAssigneeName, fieldId: 'assigneePerson' });
        isValid = false;
      }
    }
    if (this.form.controls.filterOption.value === CaaCasesFilterType.CaseReferenceNumber) {
      this.form.controls.caseReferenceNumber.updateValueAndValidity({ emitEvent: false, onlySelf: true });
      if (this.form.controls.caseReferenceNumber.invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidCaseReference, fieldId: 'caseReferenceNumber' });
        isValid = false;
      }
    }
    this.emitErrorMessages.emit(this.errorMessages);
    return isValid;
  }

  private handleOnFilterOptionChange(value: CaaCasesFilterType): void {
    this.form.controls.assigneePerson.clearValidators();
    this.form.controls.caseReferenceNumber.clearValidators();
    this.form.controls.assigneePerson.reset();
    this.form.controls.caseReferenceNumber.reset();
    switch (value) {
      case CaaCasesFilterType.CasesAssignedToAUser:
        this.form.controls.assigneePerson.setValidators([Validators.required, CaaCasesUtil.assigneeNameValidator2()]);
        break;
      case CaaCasesFilterType.CaseReferenceNumber:
        this.form.controls.caseReferenceNumber.setValidators([Validators.required, CaaCasesUtil.caseReferenceValidator()]);
        break;
    }
    this.form.updateValueAndValidity();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface CasesFilterForm {
  filterOption: FormControl<CaaCasesFilterType>;
  assigneePerson: FormControl<string>;
  caseReferenceNumber: FormControl<string>;
}
