import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountTransactionsComponent } from './account-transactions.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { RouterModule } from '@angular/router';

describe('AccountTransactionsComponent', () => {
  let component: AccountTransactionsComponent;
  let fixture: ComponentFixture<AccountTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ RouterModule.forRoot([]), ],
      declarations: [ AccountTransactionsComponent ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
