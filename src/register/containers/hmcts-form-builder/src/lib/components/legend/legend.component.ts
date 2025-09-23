import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-legend',
    templateUrl: './legend.component.html',
    standalone: false
})
export class LegendComponent {
    @Input() public classes: string;
}
