import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { Pagination, User } from '@hmcts/rpx-xui-common-lib';

export interface FilterValues {
    name?: string;
    email?: string;
    status?: string;
}

@Component({
  selector: 'app-prd-users-table',
  templateUrl: './user-table.component.html',
  standalone: false
})

export class UserTableComponent implements OnChanges, OnInit {
    @Input() users: User[] = [];
    @Input() moreItems: boolean;
    @Input() firstRecord: number;
    @Input() filterValues: FilterValues = {};

    @Output() userClick = new EventEmitter<User>();

    pagination: Pagination;
    currentPage = 0;
    filteredItems: User[] = [];

    ngOnInit() {
      this.applyFilter();
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.users || changes.filterValues) {
        this.applyFilter();
      }
    }

    applyFilter() {
      const users = this.users ?? [];
      const filterValues = this.filterValues ?? {};

      this.filteredItems = users.filter((user) => {
        return (!filterValues.name || user.fullName.includes(filterValues.name)) &&
                (!filterValues.email || user.email.includes(filterValues.email)) &&
                (!filterValues.status || user.status.toLowerCase() === filterValues.status.toLowerCase());
      });
      this.currentPage = 0;
      this.updatePagination();
    }

    onUserClick = (user: User) => {
      this.userClick.emit(user);
    };

    updatePagination() {
      this.pagination = { itemsPerPage: 50, currentPage: this.currentPage, totalItems: this.filteredItems.length };
    }

    pageChange(pageNumber: number): void {
      this.currentPage = pageNumber;
    }
}
