import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
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

export class UserTableComponent implements OnInit {
    @Input() users: User[] = [];
    @Input() moreItems: boolean;
    @Input() firstRecord: number;
    @Input() filterValues: FilterValues;

    @Output() userClick = new EventEmitter<User>();

    pagination: Pagination;
    currentPage = 0;
    filteredItems: any;

    ngOnInit() {
      this.filteredItems = this.users;
      this.pagination = { itemsPerPage: 50, currentPage: this.currentPage, totalItems: this.filteredItems.length };
    }

    ngOnChanges(changes: SimpleChanges) {
      if (changes.filterValues) {
        this.applyFilter();
      }
    }

    applyFilter() {
      this.filteredItems = this.users.filter((user) => {
        return (!this.filterValues.name || user.fullName.includes(this.filterValues.name)) &&
                (!this.filterValues.email || user.email.includes(this.filterValues.email)) &&
                (!this.filterValues.status || user.status.toLowerCase() === this.filterValues.status.toLowerCase());
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
