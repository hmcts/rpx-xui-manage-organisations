import { UserTableComponent, FilterValues } from './user-table.component';
import { User } from '@hmcts/rpx-xui-common-lib';

describe('UserTableComponent', () => {
  let component: UserTableComponent;

  beforeEach(() => {
    component = new UserTableComponent();
    component.users = [
      { fullName: 'John Doe', email: 'john@example.com', status: 'active' },
      { fullName: 'Jane Doe', email: 'jane@example.com', status: 'inactive' },
      { fullName: 'Bob Smith', email: 'bob@example.com', status: 'active' }
    ] as User[];
  });

  it('should initialize filteredItems and pagination on ngOnInit', () => {
    component.ngOnInit();
    expect(component.filteredItems).toEqual(component.users);
    expect(component.pagination).toEqual({ itemsPerPage: 50, currentPage: 0, totalItems: component.users.length });
  });

  it('should update pagination on updatePagination', () => {
    component.filteredItems = [component.users[0]];
    component.updatePagination();
    expect(component.pagination).toEqual({ itemsPerPage: 50, currentPage: 0, totalItems: 1 });
  });

  it('should filter by name', () => {
    component.filterValues = { name: 'John Doe' } as FilterValues;
    component.applyFilter();
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].fullName).toBe('John Doe');
  });

  it('should filter by email', () => {
    component.filterValues = { email: 'jane@example.com' } as FilterValues;
    component.applyFilter();
    expect(component.filteredItems.length).toBe(1);
    expect(component.filteredItems[0].email).toBe('jane@example.com');
  });

  it('should filter by status', () => {
    component.filterValues = { status: 'active' } as FilterValues;
    component.applyFilter();
    expect(component.filteredItems.length).toBe(2);
    expect(component.filteredItems.every((user) => user.status === 'active')).toBeTruthy();
  });

  it('should handle empty filter values', () => {
    component.filterValues = {} as FilterValues;
    component.applyFilter();
    expect(component.filteredItems.length).toBe(3);
  });
});
