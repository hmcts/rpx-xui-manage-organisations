import { Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '@hmcts/rpx-xui-common-lib';
import { Observable, Subscription, of } from 'rxjs';
import { catchError, debounceTime, switchMap, tap } from 'rxjs/operators';
import { CaaCasesUtil } from '../../../caa-cases/util/caa-cases.util';
import { ErrorMessage } from '../../../shared/models/error-message.model';
import {
  CaaCasesFilterErrorMessage,
  CaaCasesFilterHeading,
  CaaCasesFilterType,
  CaaCasesPageType
} from '../../models/caa-cases.enum';
import { CaaCasesSessionStateValue } from '../../models/caa-cases.model';

@Component({
  selector: 'app-caa-filter',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent implements OnInit, OnChanges, OnDestroy {
  @Input() public selectedFilterType: string;
  @Input() public sessionStateValue: CaaCasesSessionStateValue;
  @Input() public caaCasesPageType: string;
  @Input() public selectedOrganisationUsers: User[];

  @Output() public emitSelectedFilterType = new EventEmitter<string>();
  @Output() public emitSelectedFilterValue = new EventEmitter<string>();
  @Output() public emitErrorMessages = new EventEmitter<ErrorMessage[]>();

  public readonly ACTIVE_USER_GROUP_HEADING = 'Active users:';
  public readonly INACTIVE_USER_GROUP_HEADING = 'Inactive users:';
  public readonly ACTIVE_USER_STATUS = 'active';

  public caaFormGroup: FormGroup;
  public caaFilterHeading: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caseReferenceNumberErrorMessage = '';
  public assigneeNameErrorMessage = '';
  public errorMessages: ErrorMessage[];
  public filteredAndGroupedUsers = new Map<string, User[]>();
  public readonly caseRefFormControl = 'case-reference-number';
  public readonly caaFilterFormControl = 'caa-filter';
  public readonly assigneePersonFormControl = 'assignee-person';
  public showAutocomplete: boolean = false;
  public caaFilterFormControlSubscription: Subscription;
  public assigneePersonFormControlSubscription: Subscription;

  constructor(private readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.caaFormGroup = this.formBuilder.group({});
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.caaFormGroup.addControl(this.caseRefFormControl, new FormControl('', CaaCasesUtil.caseReferenceValidator()));
      this.caaFilterHeading = CaaCasesFilterHeading.UnassignedCases;
    } else {
      this.caaFormGroup.addControl(this.caaFilterFormControl, new FormControl('', Validators.required));
      this.caaFormGroup.addControl(this.caseRefFormControl, new FormControl(''));
      this.caaFormGroup.addControl(this.assigneePersonFormControl, new FormControl(''));

      this.caaFilterHeading = CaaCasesFilterHeading.AssignedCases;

      // Subscribe to changes of the selected radio button value and set the validator accordingly
      this.caaFilterFormControlSubscription = this.caaFormGroup.get(this.caaFilterFormControl).valueChanges.subscribe((value) => {
        this.caaFormGroup.get(this.caseRefFormControl).clearValidators();
        this.caaFormGroup.get(this.assigneePersonFormControl).clearValidators();
        if (value === this.caaCasesFilterType.CaseReferenceNumber) {
          this.caaFormGroup.get(this.caseRefFormControl).setValidators(CaaCasesUtil.caseReferenceValidator());
        }
        if (value === this.caaCasesFilterType.AssigneeName) {
          this.caaFormGroup.get(this.assigneePersonFormControl).setValidators(CaaCasesUtil.assigneeNameValidator());
        }
        this.caaFormGroup.get(this.caseRefFormControl).updateValueAndValidity();
        this.caaFormGroup.get(this.assigneePersonFormControl).updateValueAndValidity();
      });
      // Subscribe to assignee person form control to filter and display users based on user input
      this.assigneePersonFormControlSubscription = this.caaFormGroup.get(this.assigneePersonFormControl).valueChanges.pipe(
        tap(() => this.showAutocomplete = false),
        tap(() => this.filteredAndGroupedUsers = null),
        debounceTime(300),
        switchMap((searchTerm: any) => this.filterSelectedOrganisationUsers(searchTerm).pipe(
          tap(() => this.showAutocomplete = true),
          catchError(() => this.filteredAndGroupedUsers = null)
        ))
      ).subscribe((filteredAndGroupedUsers: Map<string, User[]>) => {
        this.filteredAndGroupedUsers = filteredAndGroupedUsers;
      });
    }
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.selectedOrganisationUsers &&
        changes.selectedOrganisationUsers.currentValue &&
        changes.selectedOrganisationUsers.currentValue.length > 0) {
      this.filterSelectedOrganisationUsers().subscribe((filteredAndGroupedUsers) => {
        this.filteredAndGroupedUsers = filteredAndGroupedUsers;
      });
      this.initialiseFilterValuesFromSessionState();
    }
  }

  public initialiseFilterValuesFromSessionState(): void {
    if (this.sessionStateValue) {
      // Set the case reference number input box value if present in session state
      const caseReferenceNumber = this.sessionStateValue.caseReferenceNumber && this.sessionStateValue.caseReferenceNumber;
      this.caaFormGroup.get(this.caseRefFormControl).setValue(caseReferenceNumber);
      // Set the assignee name input box value if present in session state
      if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
        const assigneeName = this.sessionStateValue.assigneeName && this.sessionStateValue.assigneeName;
        const selectedOrganisationUser = this.selectedOrganisationUsers && this.selectedOrganisationUsers.find(
          (user) => user.userIdentifier === assigneeName);
        if (selectedOrganisationUser) {
          const formattedOrganisationUser = this.getDisplayName(selectedOrganisationUser);
          this.caaFormGroup.get(this.assigneePersonFormControl).setValue(formattedOrganisationUser);
        }
      }
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

  public selectFilterOption(caaCasesFilterType: string): void {
    this.selectedFilterType = caaCasesFilterType;
    this.emitSelectedFilterType.emit(this.selectedFilterType);
  }

  public onSearch(): void {
    // Validate form
    if (this.validateForm()) {
      let selectedFilterValue: string;
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
        selectedFilterValue = this.caaFormGroup.get(this.caseRefFormControl).value;
      } else if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
        switch (this.selectedFilterType) {
          case CaaCasesFilterType.AssigneeName:
            const selectedUser = this.caaFormGroup.get(this.assigneePersonFormControl).value;
            const fullName = selectedUser.split(' - ')[0];
            const email = selectedUser.split(' - ')[1];
            selectedFilterValue = this.selectedOrganisationUsers && this.selectedOrganisationUsers.find(
              (user) => user.fullName === fullName && user.email === email).userIdentifier;
            break;
          case CaaCasesFilterType.CaseReferenceNumber:
            selectedFilterValue = this.caaFormGroup.get(this.caseRefFormControl).value;
            break;
          default:
            selectedFilterValue = null;
            break;
        }
      }
      this.emitSelectedFilterValue.emit(selectedFilterValue);
    }
  }

  public onReset(): void {
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.caaFormGroup.get(this.caseRefFormControl).reset();
      this.emitSelectedFilterValue.emit(null);
    }
  }

  public getDisplayName(selectedUser: User): string {
    return `${selectedUser.fullName} - ${selectedUser.email}`;
  }

  public onSelectionChange(selectedUser: User): void {
    this.caaFormGroup.get(this.assigneePersonFormControl).setValue(this.getDisplayName(selectedUser), { emitEvent: false, onlySelf: true });
  }

  public ngOnDestroy(): void {
    if (this.assigneePersonFormControlSubscription) {
      this.assigneePersonFormControlSubscription.unsubscribe();
    }
    if (this.caaFilterFormControlSubscription) {
      this.caaFilterFormControlSubscription.unsubscribe();
    }
  }

  private validateForm(): boolean {
    this.caseReferenceNumberErrorMessage = '';
    this.assigneeNameErrorMessage = '';
    this.errorMessages = [];

    if (this.caaFormGroup.invalid) {
      if (this.caaFormGroup.get(this.caseRefFormControl).invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidCaseReference, fieldId: this.caseRefFormControl });
        this.caseReferenceNumberErrorMessage = CaaCasesFilterErrorMessage.InvalidCaseReference;
      }
      if (this.caaCasesPageType === CaaCasesPageType.AssignedCases && this.caaFormGroup.get(this.assigneePersonFormControl).invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidAssigneeName, fieldId: this.assigneePersonFormControl });
        this.assigneeNameErrorMessage = CaaCasesFilterErrorMessage.InvalidAssigneeName;
      }

      // Emit error messages for display by a parent component
      this.emitErrorMessages.emit(this.errorMessages);

      // Validation failed, return false
      return false;
    }

    // Emit empty error messages array (to clear any existing errors)
    this.emitErrorMessages.emit(this.errorMessages);

    // Validation succeeded, return true
    return true;
  }
}
