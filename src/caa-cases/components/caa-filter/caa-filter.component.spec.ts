import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CaaFilterComponent } from './caa-filter.component';

describe('CaaFilterComponent', () => {
  let component: CaaFilterComponent;
  let fixture: ComponentFixture<CaaFilterComponent>;
  let nativeElement: any;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [],
      declarations: [CaaFilterComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CaaFilterComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(nativeElement.querySelector('#caa-filter-all-assignees')).toBeDefined();
    expect(nativeElement.querySelector('#caa-filter-assignee-name')).toBeDefined();
    expect(nativeElement.querySelector('#caa-filter-case-reference-number')).toBeDefined();
  });

  it('should set selected filter type', () => {
    const event: any = {
      target: {
        value: 'assignee-name'
      }
    }
    component.selectFilterOption(event);
    expect(component.selectedFilterType).toEqual('assignee-name');
  });
});
