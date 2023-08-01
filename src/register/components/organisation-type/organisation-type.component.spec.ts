import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { LovRefDataModel } from '../../../shared/models/lovRefData.model';
import { LovRefDataService } from '../../../shared/services/lov-ref-data.service';
import { OrganisationTypeComponent } from './organisation-type.component';

describe('OrganisationTypeComponent', () => {
  let component: OrganisationTypeComponent;
  let fixture: ComponentFixture<OrganisationTypeComponent>;
  let mockLovRefDataService: any;
  let nativeElement: any;

  const OTHER_ORGANISATION_TYPES_REF_DATA: LovRefDataModel[] = [
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'AccommodationAndFood',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Accommodation & Food'
    },
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'AdminAndSupport',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Admin & Support'
    },
    {
      active_flag: 'Y',
      category_key: 'OtherOrgType',
      child_nodes: null,
      hint_text_cy: '',
      hint_text_en: '',
      key: 'Education',
      lov_order: null,
      parent_category: '',
      parent_key: '',
      value_cy: '',
      value_en: 'Education'
    }
  ];

  beforeEach(async () => {
    mockLovRefDataService = jasmine.createSpyObj('LovRefDataService', ['getListOfValues']);
    mockLovRefDataService.getListOfValues.and.returnValue(of(OTHER_ORGANISATION_TYPES_REF_DATA));
    await TestBed.configureTestingModule({
      declarations: [OrganisationTypeComponent],
      imports: [HttpClientTestingModule],
      providers: [
        { provide: LovRefDataService, useValue: mockLovRefDataService
        }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(OrganisationTypeComponent);
    component = fixture.componentInstance;
    nativeElement = fixture.debugElement.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(mockLovRefDataService.getListOfValues).toHaveBeenCalled();
  });

  it('should display other organisation types dropdown when other radio option is selected', () => {
    nativeElement.querySelector('#other').click();
    fixture.detectChanges();
    expect(nativeElement.querySelector('#other-organisation-type')).toBeDefined();
    expect(nativeElement.querySelector('#other-organisation-detail')).toBeDefined();
  });
});
