import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OfficeAddressesComponent } from './office-addresses.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: OfficeAddressesComponent;
  let fixture: ComponentFixture<OfficeAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeAddressesComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OfficeAddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
