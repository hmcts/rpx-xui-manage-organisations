import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { PrdUser } from 'src/users/models/prd-users.model';

interface User {
  firstName: string;
  lastName: string;
  email: string;
  idamStatus: string;
}

@Component({
  selector: 'app-search-filter-users',
  templateUrl: './search-filter-users.component.html',
  styleUrls: ['./search-filter-users.component.scss']
})
export class SearchFilterUserComponent implements OnInit, OnDestroy{
  @Output() filterValues = new EventEmitter<{ name: string; email: string; status: string }>();
  @Input() usersList: User[] = [];

  filteredJudicialUsers$: Observable<User[]>;
  searchFilterUserForm: FormGroup;
  nameFilterControl: FormControl<string | PrdUser>;
  statusFilterControl: FormControl<string>;
  subscriptions$ = new Subject<void>();
  minSearchCharacters = 3;
  statusFilterConfig: any;
  emitReset = false;
  noResults = false;
  searchTerm: string = '';
  showAutocomplete = false;
  judicialUserSelected = false;

  ngOnInit() {
    this.searchFilterUserForm = new FormGroup({
      nameFilter: new FormControl('', Validators.required),
      statusFilter: new FormControl('all', Validators.required)
    });

    this.nameFilterControl = this.searchFilterUserForm.get('nameFilter') as FormControl;
    this.statusFilterControl = this.searchFilterUserForm.get('statusFilter') as FormControl;
    this.statusFilterConfig = this.initialiseSearchFilters();

    this.filteredJudicialUsers$ = this.nameFilterControl.valueChanges.pipe(
      takeUntil(this.subscriptions$),
      tap(() => this.showAutocomplete = false),
      debounceTime(300),
      tap((searchTerm: string) => this.searchTerm = searchTerm),
      filter((searchTerm) => searchTerm?.length >= this.minSearchCharacters),
      switchMap((searchTerm) => this.filterJudicialUsers(searchTerm).pipe(
        tap((judicialUsers) => {
          this.showAutocomplete = true;
          this.noResults = judicialUsers.length === 0;
        })
      ))
    );

    this.statusFilterControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntil(this.subscriptions$)
    ).subscribe(() => this.formatFiltersAndEmit());
  }

  public formatFiltersAndEmit(){
    const nameFilterValue = this.nameFilterControl.value as PrdUser;
    const statusFilterValue = this.statusFilterControl.value;
    const filterParams = {
      name: nameFilterValue ? `${nameFilterValue.firstName} ${nameFilterValue.lastName}`.trim() : '',
      email: nameFilterValue ? nameFilterValue.email : '',
      status: statusFilterValue !== 'all' ? statusFilterValue : ''
    };
    this.filterValues.emit(filterParams);
  }

  public initialiseSearchFilters(){
    return {
      group: this.searchFilterUserForm,
      config: {
        hint: '',
        id: 'statusFilter',
        label: 'Filter by status',
        classes: 'govuk-label--m',
        isHeading: true
      },
      items: [
        {
          value: 'all',
          label: 'All',
          id: 'all'
        },
        {
          value: 'active',
          label: 'Active',
          id: 'active'
        },
        {
          value: 'pending',
          label: 'Pending',
          id: 'pending'
        },
        {
          value: 'suspended',
          label: 'Suspended',
          id: 'suspended'
        }
      ]
    };
  }

  public displayJudicialUser(user?: any): string | undefined {
    return user
      ? `${user.firstName ? user.firstName : ''} ${user.lastName ? user.lastName : ''} ${user.email ? ` (${user.email})` : ''}`
      : undefined;
  }

  public filterJudicialUsers(searchTerm: string): Observable<Array<any>> {
    return of(this.usersList.filter((item) => {
      const searchStr = searchTerm.toLowerCase();
      const fullName = `${item.firstName} ${item.lastName}`.toLowerCase();
      const statusOption = this.statusFilterControl.value.toUpperCase();

      const isSearchMatch = item.email.toLowerCase().includes(searchStr) ||
                            item.firstName.toLowerCase().includes(searchStr) ||
                            item.lastName.toLowerCase().includes(searchStr) ||
                            fullName.includes(searchStr);

      const isStatusMatch = statusOption === 'ALL' || item.idamStatus === statusOption;

      return isSearchMatch && isStatusMatch;
    }));
  }

  public onSelectionChange(event) {
    if (event.isUserInput){
      this.judicialUserSelected = true;
      this.searchFilterUserForm.get('nameFilter').setValue(event.source.value);
      this.formatFiltersAndEmit();
    }
  }

  public onBlur(event: any): void {
    if (!this.nameFilterControl.value) {
      this.nameFilterControl.setValue('');
      this.formatFiltersAndEmit();
    }
  }

  ngOnDestroy() {
    this.subscriptions$.next();
    this.subscriptions$.complete();
  }
}
