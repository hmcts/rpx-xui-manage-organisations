import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchFilterUserComponent } from './search-filter-users.component';
import { FormControl, FormGroup } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('SearchFilterUserComponent', () => {
  let component: SearchFilterUserComponent;
  let fixture: ComponentFixture<SearchFilterUserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule
      ],
      declarations: [SearchFilterUserComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchFilterUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.searchFilterUserForm instanceof FormGroup).toBe(true);
    expect(component.nameFilterControl instanceof FormControl).toBe(true);
    expect(component.statusFilterControl instanceof FormControl).toBe(true);
  });

  it('should emit filter values', () => {
    const filterParams = { name: 'John Doe', email: 'john@example.com', status: 'active' };
    spyOn(component.filterValues, 'emit');
    component.nameFilterControl.setValue({ firstName: 'John', lastName: 'Doe', email: 'john@example.com' });
    component.statusFilterControl.setValue('active');
    component.formatFiltersAndEmit();
    expect(component.filterValues.emit).toHaveBeenCalledWith(filterParams);
  });

  it('should filter judicial users based on search term', () => {
    const usersList = [
      { firstName: 'John', lastName: 'Doe', email: 'john@example.com' },
      { firstName: 'Jane', lastName: 'Doe', email: 'jane@example.com' }
    ];
    component.usersList = usersList;
    const searchTerm = 'john';
    const filteredUsers$ = component.filterJudicialUsers(searchTerm);
    filteredUsers$.subscribe((filteredUsers) => {
      expect(filteredUsers.length).toEqual(1);
      expect(filteredUsers[0].firstName).toEqual('John');
    });
  });

  it('should handle selection change and emit filter values', () => {
    const event = { isUserInput: true, source: { value: { firstName: 'John', lastName: 'Doe', email: 'john@example.com' } } };
    spyOn(component.filterValues, 'emit');
    component.onSelectionChange(event);
    expect(component.judicialUserSelected).toBe(true);
    expect(component.filterValues.emit).toHaveBeenCalled();
  });

  it('should handle blur event and emit filter values', () => {
    const event = { relatedTarget: { role: 'option' } };
    spyOn(component.filterValues, 'emit');
    component.onBlur(event);
    expect(component.nameFilterControl.value).toEqual('');
    expect(component.filterValues.emit).toHaveBeenCalled();
  });

  it('should unsubscribe from observables on component destruction', () => {
    spyOn(component.subscriptions$, 'next');
    spyOn(component.subscriptions$, 'complete');
    component.ngOnDestroy();
    expect(component.subscriptions$.next).toHaveBeenCalled();
    expect(component.subscriptions$.complete).toHaveBeenCalled();
  });
});
