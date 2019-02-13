import { Component, Input, OnInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-hmcts-primary-navigation',
    templateUrl: './hmcts-primary-navigation.component.html',
    styleUrls: ['./hmcts-primary-navigation.component.scss']
})
export class HmctsPrimaryNavigationComponent implements OnInit {
    @Input()
    label = 'Primary navigation'
    @Input()
    items = [
        {
            text: 'Nav item 1',
            href: '#1',
            active: true
        },
        {
            text: 'Nav item 2',
            href: '#2'
        },
        {
            text: 'Nav item 3',
            href: '#3'
        }
    ]


    constructor(private route: ActivatedRoute) {

        console.log('1', this.route.url);
    }


    ngOnInit() {

        console.log(this.items[1].active = true)
        console.log(this.items[0].active = false)
        this.route.url.subscribe(url => console.log('@@@', url));
        console.log('2', this.route.url)
    }
}