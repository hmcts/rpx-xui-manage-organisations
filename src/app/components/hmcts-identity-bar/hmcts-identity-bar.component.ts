import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'app-hmcts-identity-bar',
    templateUrl: './hmcts-identity-bar.component.html',
    styleUrls: ['./hmcts-identity-bar.component.scss']
})
export class HmctsIdentityBarComponent implements OnInit {

    @Input() content: Observable<any>;

    // @Input() set isLoading(value: boolean) {
    //   this.loading = value;
    // }


  value: string;

    constructor() { }
    // todo to fix
    // ngOnChanges(changes: SimpleChanges): void {
    //   if(changes['routes'] && changes['routes']['currentValue']) {
    //     this.url = changes.routes.currentValue.state.url;
    //   }
    // }

  ngOnInit() {
        this.content.subscribe(data => {
            this.value = data.name;
        });
    }
}
