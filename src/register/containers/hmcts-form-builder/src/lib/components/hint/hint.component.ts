import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-hint',
    templateUrl: './hint.component.html',
    styleUrls: ['./hint.component.scss'],
    standalone: false
})
export class HintComponent {
    @Input() classes;
}
