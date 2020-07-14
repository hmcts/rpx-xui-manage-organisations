import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-unassigned-cases-component',
    templateUrl: './unassigned-cases.component.html',
  })

export class UnassignedCasesComponent implements OnInit {
    public ngOnInit(): void {
        console.log('UnassignedCasesComponent init');
    }

}
