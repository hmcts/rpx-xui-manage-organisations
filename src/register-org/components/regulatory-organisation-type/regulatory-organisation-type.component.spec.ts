import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RegulatoryOrganisationTypeComponent } from './regulatory-organisation-type.component';
import { RegisterOrgModule } from '../../register-org.module';
import { buildMockStoreProviders } from '../../testing/mock-store-state';
import { ReactiveFormsModule } from '@angular/forms';
import { ExuiCommonLibModule } from '@hmcts/rpx-xui-common-lib';
import { RouterTestingModule } from '@angular/router/testing';

describe('RegulatoryOrganisationTypeComponent', () => {
  let component: RegulatoryOrganisationTypeComponent;
  let fixture: ComponentFixture<RegulatoryOrganisationTypeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [],
      imports: [RouterTestingModule, ReactiveFormsModule, ExuiCommonLibModule, RegisterOrgModule],
      providers: [
        ...buildMockStoreProviders()
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegulatoryOrganisationTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
