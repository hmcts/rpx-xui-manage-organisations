import { TestBed, async } from '@angular/core/testing';
import { HeaderComponent } from './header.component';

xdescribe('HeaderComponent', () => {
    let fixture;
    let app;
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderComponent
            ],
        }).compileComponents();
        fixture = TestBed.createComponent(HeaderComponent);
        app = fixture.debugElement.componentInstance;
    }));

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

});
