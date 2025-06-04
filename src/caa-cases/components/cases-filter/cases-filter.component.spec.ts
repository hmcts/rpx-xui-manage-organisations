import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CasesFilterComponent } from './cases-filter.component';
import { CaaCasesService } from 'src/caa-cases/services';
import { provideMockStore } from '@ngrx/store/testing';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

describe('CasesFilterComponent', () => {
  let component: CasesFilterComponent;
  let fixture: ComponentFixture<CasesFilterComponent>;
  let caaCasesService: jasmine.SpyObj<CaaCasesService>;

  beforeEach(async () => {
    caaCasesService = jasmine.createSpyObj<CaaCasesService>(
      'caaCasesService',
      [
        'getCaaCases',
        'getCaaCaseTypes',
        'storeSessionState',
        'retrieveSessionState',
        'removeSessionState'
      ]
    );
    await TestBed.configureTestingModule({
      declarations: [ CasesFilterComponent ],
      providers: [provideMockStore(),
        { provide: CaaCasesService, useValue: caaCasesService }
      ],
      imports: [
        MatAutocompleteModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(CasesFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
