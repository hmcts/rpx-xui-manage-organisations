import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { OfficeAddressesComponent } from './office-addresses.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: OfficeAddressesComponent;
  let fixture: ComponentFixture<OfficeAddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeAddressesComponent],
      imports: [HttpClientTestingModule, RouterTestingModule]
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
