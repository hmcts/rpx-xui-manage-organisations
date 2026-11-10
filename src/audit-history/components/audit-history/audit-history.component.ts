import { Component, OnInit } from '@angular/core';
import { AuditHistoryItem } from '../../models/audit-history-item.model';

@Component({
  selector: 'app-audit-history',
  templateUrl: './audit-history.component.html',
  standalone: false
})
export class AuditHistoryComponent implements OnInit {
  public fullHistory: AuditHistoryItem[] = [];

  ngOnInit(): void {
    this.fullHistory = [{
      user: 'John Doe',
      name: 'XUI MOO ROF',
      address: {
        addressLine1: '123 Example Street',
        addressLine2: '',
        addressLine3: '',
        postTown: 'Example City',
        county: 'Exampleshire',
        postCode: 'EX4 3PL',
        country: 'UK'
      },
      sraId: 'A123456',
      // Unsure if date will be given as date object or string
      createdUpdated: new Date(new Date().setDate(new Date().getDate() - 1))
    },
    {
      user: 'Jane Eyre',
      name: 'XUI MOO ROF',
      address: {
        addressLine1: '123 Example Street',
        addressLine2: '',
        addressLine3: '',
        postTown: 'Example Town',
        county: 'Exampleshire',
        postCode: 'EX4 3PL',
        country: 'UK'
      },
      sraId: 'A123456',
      createdUpdated: new Date()
    }];
    // TODO: Initialize fullHistory with data
    // Pagination may be required
  }
}
