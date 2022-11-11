import { Component } from '@angular/core';
import { AppConstants } from '../../app.constants';
import { Helper, Navigation } from './footer.model';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
    public helpData: Helper = AppConstants.FOOTER_DATA;
    public navigationData: Navigation = AppConstants.FOOTER_DATA_NAVIGATION;
}
