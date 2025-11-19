import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { RegulatorType } from '../../../../register-org/models';
import { RegisterOrgService } from '../../../services/register-org.service';
import { RegulatorListComponent } from './regulator-list.component';

describe('RegulatorListComponent', () => {
  let component: RegulatorListComponent;
  let fixture: ComponentFixture<RegulatorListComponent>;
  let nativeElement: any;

  const mockSessionStorageService = jasmine.createSpyObj('SessionStorageService', [
    'getItem',
    'setItem',
    'removeItem'
  ]);

  const mockHttpService = jasmine.createSpyObj('mockHttpService', ['get', 'post']);
  const service = new RegisterOrgService(mockSessionStorageService, mockHttpService);

  const organisationRegulators = [
    {
      regulatorType: 'SRA',
      organisationRegistrationNumber: '12334565433'
    },
    {
      regulatorType: 'CILE',
      organisationRegistrationNumber: '123455434333'
    },
    {
      regulatorType: 'NA'
    }
  ];

  const individualRegulators = [
    {
      regulatorType: 'Other',
      regulatorName: 'qwerty',
      organisationRegistrationNumber: '12345'
    },
    {
      regulatorType: 'OISC',
      organisationRegistrationNumber: '76843'
    },
    {
      regulatorType: 'NA'
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegulatorListComponent],
      imports: [RouterTestingModule],
      providers: [{ provide: RegisterOrgService, useValue: service }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatorListComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should verify display of organisation regulators', () => {
    component.regulatorType = RegulatorType.Organisation;
    component.regulators = organisationRegulators;
    fixture.detectChanges();
    const columnHeadingElement = nativeElement.querySelector('.govuk-summary-list__key') as HTMLElement;
    expect(columnHeadingElement.innerText).toContain('Regulatory organisation type');
    const columnValueElement = nativeElement.querySelector('.govuk-summary-list__value') as HTMLElement;
    expect(columnValueElement.innerText).toContain('SRA ref: 12334565433');
    expect(columnValueElement.innerText).toContain('CILE ref: 123455434333');
    expect(columnValueElement.innerText).toContain('NA');
  });

  it('should verify display of individual regulators', () => {
    component.regulatorType = RegulatorType.Individual;
    component.regulators = individualRegulators;
    fixture.detectChanges();
    const columnHeadingElement = nativeElement.querySelector('.govuk-summary-list__key') as HTMLElement;
    expect(columnHeadingElement.innerText).toContain('Are you (as an individual) registered with a regulator?');
    const columnValueElement = nativeElement.querySelector('.govuk-summary-list__value') as HTMLElement;
    expect(columnValueElement.innerText).toContain('No');
  });
});
