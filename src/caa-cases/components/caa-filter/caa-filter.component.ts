import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { UserFromModel } from '../../../users/models/userFrom.model';
import { CaaCasesUtil } from '../../../caa-cases/util/caa-cases.util';
import {
  CaaCasesFilterErrorMessage,
  CaaCasesFilterHeading,
  CaaCasesFilterType,
  CaaCasesPageType,
  CaaShowHideFilterButtonText
} from '../../models/caa-cases.enum';
import { ErrorMessage } from '../../models/caa-cases.model';
import { Observable, Subscription } from 'rxjs';
import { catchError, debounceTime, filter, map, switchMap, tap } from 'rxjs/operators';
import { User } from '@hmcts/rpx-xui-common-lib';
import { select, Store } from '@ngrx/store';
import * as fromUserStore from '../../../users/store';

@Component({
  selector: 'app-caa-filter',
  templateUrl: './caa-filter.component.html',
  styleUrls: ['./caa-filter.component.scss']
})
export class CaaFilterComponent implements OnInit {

  @Input() public selectedFilterType: string;
  @Input() public caaCasesPageType: string;
  @Input() public selectedOrganisationUsers$: Observable<User[]>;

  @Output() public emitSelectedFilterType = new EventEmitter<string>();
  @Output() public emitSelectedFilterValue = new EventEmitter<string>();
  @Output() public emitErrorMessages = new EventEmitter<ErrorMessage[]>();

  public caaFormGroup: FormGroup;
  public caaFilterHeading: string;
  public caaCasesPageTypeLookup = CaaCasesPageType;
  public caaCasesFilterType = CaaCasesFilterType;
  public caaShowHideFilterButtonText = CaaShowHideFilterButtonText;
  public caseReferenceNumberErrorMessage = '';
  public errorMessages: ErrorMessage[];
  public personName: string;
  public assignedUser: string;
  public users: User[];
  public filteredUsers: User[];
  public readonly caseRefFormControl = 'case-reference-number';
  public readonly caaFilterFormControl = 'caa-filter';
  public readonly assigneePersonFormControlName = 'assignee-person';
  public assigneePersonFormControl: FormControl;
  public showAutocomplete: boolean = false;
  public sub: Subscription;

  constructor(private readonly userStore: Store<fromUserStore.UserState>,
    private readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.caaFormGroup = this.formBuilder.group({
      [this.caseRefFormControl]: new FormControl('')
    });
    if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
      this.caaFormGroup.addControl(this.caaFilterFormControl, new FormControl('', Validators.required));
      this.assigneePersonFormControl = new FormControl(this.assigneePersonFormControlName);
      this.caaFormGroup.addControl(this.assigneePersonFormControlName, this.assigneePersonFormControl);

      this.sub = this.assigneePersonFormControl.valueChanges.pipe(
        tap(() => this.showAutocomplete = false),
        tap(() => this.filteredUsers = []),
        debounceTime(300),
        switchMap((searchTerm: string) => this.filterSelectedOrganisationUsers(searchTerm).pipe(
          tap(() => this.showAutocomplete = true),
          catchError(() => this.filteredUsers = [])
        ))
      ).subscribe((users: User[]) => {
        this.filteredUsers = users;
      });
    }
    this.caaFilterHeading = this.caaCasesPageType === CaaCasesPageType.AssignedCases
      ? CaaCasesFilterHeading.AssignedCases
      : CaaCasesFilterHeading.UnassignedCases;
    // Set validator on case reference number field depending on whether this option has been chosen if the page type
    // is AssignedCases, or always if the page type is UnassignedCases
    if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
      this.caaFormGroup.get(this.caseRefFormControl).setValidators(CaaCasesUtil.caseReferenceValidator());
    } else if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
      // Subscribe to changes of the selected radio button value and set the validator accordingly
      this.caaFormGroup.get(this.caaFilterFormControl).valueChanges.subscribe(value => {
        if (value === this.caaCasesFilterType.CaseReferenceNumber) {
          this.caaFormGroup.get(this.caseRefFormControl).setValidators(CaaCasesUtil.caseReferenceValidator());
        } else {
          this.caaFormGroup.get(this.caseRefFormControl).clearValidators();
        }
        this.caaFormGroup.get(this.caseRefFormControl).updateValueAndValidity();
      });
    }
  }

  public filterSelectedOrganisationUsers(searchTerm: string): Observable<User[]> {
    if (!searchTerm) {
      return this.selectedOrganisationUsers$;  
    }
    return this.selectedOrganisationUsers$.pipe(map(users => {
      console.log('USERS', users);

      const filteredUsers = users.filter(x => x.fullName.includes(searchTerm));
      console.log('FILTERED USERS', filteredUsers);

      return users.filter(x => x.fullName.includes(searchTerm));
    }));
  }

  public selectFilterOption(caaCasesFilterType: string): void {
    this.selectedFilterType = caaCasesFilterType;
    this.emitSelectedFilterType.emit(this.selectedFilterType);
  }

  public search(): void {
    // Validate form
    if (this.validateForm()) {
      let selectedFilterValue: string;
      if (this.caaCasesPageType === CaaCasesPageType.UnassignedCases) {
        selectedFilterValue = this.caaFormGroup.get(this.caseRefFormControl).value;
      } else if (this.caaCasesPageType === CaaCasesPageType.AssignedCases) {
        switch (this.selectedFilterType) {
          case CaaCasesFilterType.AssigneeName:
            selectedFilterValue = this.caaFormGroup.get(this.assigneePersonFormControlName).value;
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

  public getDisplayName(selectedUser: User): string {
    return `${selectedUser.fullName} - ${selectedUser.email}`;
  }

  public onSelectionChange(selectedUser: User): void {
    this.assigneePersonFormControl.setValue(this.getDisplayName(selectedUser), { emitEvent: false, onlySelf: true });
  }

  private validateForm(): boolean {
    this.caseReferenceNumberErrorMessage = '';
    this.errorMessages = [];

    if (this.caaFormGroup.invalid) {
      if (this.caaFormGroup.get(this.caseRefFormControl).invalid) {
        this.errorMessages.push({ title: '', description: CaaCasesFilterErrorMessage.InvalidCaseReference, fieldId: this.caseRefFormControl });
        this.caseReferenceNumberErrorMessage = CaaCasesFilterErrorMessage.InvalidCaseReference;
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
