import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { OfficeAddressesComponent } from './office-addresses.component';

describe('DocumentExchangeReferenceComponent', () => {
  let component: OfficeAddressesComponent;
  let fixture: ComponentFixture<OfficeAddressesComponent>;

  const mockRouter = {
    navigate: jasmine.createSpy('navigate'),
    getCurrentNavigation: jasmine.createSpy('getCurrentNavigation')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [OfficeAddressesComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        { provide: Router, useValue: mockRouter }
      ]
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

  it('should back link navigate to the correct page', () => {
    spyOn(component, 'navigateToPreviousPage');
    component.onBack();
    expect(component.navigateToPreviousPage).toHaveBeenCalled();
  });

  it('should invoke the cancel registration journey when clicked on cancel link', () => {
    spyOn(component, 'cancelRegistrationJourney');
    component.onCancel();
    expect(component.cancelRegistrationJourney).toHaveBeenCalled();
  });
});
