import { Component, OnInit } from '@angular/core';
import { RegisterComponent } from '../../containers/register/register-org.component';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-regulatory-organisation-type',
  templateUrl: './regulatory-organisation-type.component.html'
})
export class RegulatoryOrganisationTypeComponent extends RegisterComponent implements OnInit {
  public regulatoryOrganisationTypeFormGroup: FormGroup;
  ngOnInit(): void {
    this.regulatoryOrganisationTypeFormGroup = new FormGroup({
      organisationType: new FormControl(null)
    });
    this.regulatoryOrganisationTypeFormGroup.get('otherOrganisationType').setValue('none');
  }
}
