import { CommonModule } from '@angular/common';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { AuditHistoryItem } from '../../models/audit-history-item.model';
import { AuditHistoryComponent } from './audit-history.component';

describe('AuditHistoryComponent', () => {
  let component: AuditHistoryComponent;
  let fixture: ComponentFixture<AuditHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AuditHistoryComponent],
      imports: [CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(AuditHistoryComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should render the audit history table headings', () => {
    fixture.detectChanges();

    const heading = fixture.debugElement.query(By.css('h1')).nativeElement as HTMLHeadingElement;
    const headers = fixture.debugElement.queryAll(By.css('.govuk-table__header'));

    expect(heading.textContent.trim()).toBe('Organisation history');
    expect(headers.map((header) => header.nativeElement.textContent.trim())).toEqual([
      'User',
      'Name',
      'Address',
      'SRA ID',
      'Created/Updated'
    ]);
  });

  it('should render an audit history row and format its date', () => {
    fixture.detectChanges();
    component.fullHistory = [createHistoryItem()];

    fixture.detectChanges();

    const cells = fixture.debugElement.queryAll(By.css('[data-selector="table-cell"]'));
    const cellText = cells.map((cell) => cell.nativeElement.textContent.trim());

    expect(cellText).toEqual([
      'Test user',
      'Test organisation',
      '1 Test StreetTest TownTest CountyTE1 1ST',
      'SRA123456',
      '02/01/2026 14:05'
    ]);
  });

  it('should render optional address lines when provided', () => {
    fixture.detectChanges();
    component.fullHistory = [createHistoryItem({
      addressLine2: 'Building 2',
      addressLine3: 'Test District'
    })];

    fixture.detectChanges();

    const addressLines = fixture.debugElement
      .queryAll(By.css('[data-selector="table-cell"]'))[2]
      .queryAll(By.css('div'))
      .map((line) => line.nativeElement.textContent.trim());

    expect(addressLines).toEqual([
      '1 Test Street',
      'Building 2',
      'Test District',
      'Test Town',
      'Test County',
      'TE1 1ST'
    ]);
  });

  it('should show the empty state when no audit history is available', () => {
    fixture.detectChanges();
    component.fullHistory = [];

    fixture.detectChanges();

    const historyRows = fixture.debugElement.queryAll(By.css('[data-selector="table-row"]'));
    const emptyState = fixture.debugElement.query(By.css('.govuk-table__body td'));

    expect(historyRows.length).toBe(0);
    expect(emptyState.nativeElement.textContent.trim()).toBe('No audit history available');
    expect(emptyState.nativeElement.getAttribute('colspan')).toBe('5');
  });

  function createHistoryItem(addressOverrides = {}): AuditHistoryItem {
    return {
      user: 'Test user',
      name: 'Test organisation',
      address: {
        addressLine1: '1 Test Street',
        addressLine2: '',
        addressLine3: '',
        postTown: 'Test Town',
        county: 'Test County',
        postCode: 'TE1 1ST',
        country: 'UK',
        ...addressOverrides
      },
      sraId: 'SRA123456',
      createdUpdated: new Date(2026, 0, 2, 14, 5)
    };
  }
});
