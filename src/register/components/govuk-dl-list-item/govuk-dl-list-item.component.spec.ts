import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GovukDlListItemComponent } from './govuk-dl-list-item.component';

describe('GovukDlListItemComponent', () => {
  let component: GovukDlListItemComponent;
  let fixture: ComponentFixture<GovukDlListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GovukDlListItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GovukDlListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
