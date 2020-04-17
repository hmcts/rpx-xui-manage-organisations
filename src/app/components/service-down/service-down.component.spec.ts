import { ServiceDownComponent } from './service-down.component';


describe('ServiceDownComponent', () => {
    it('Should create component', () => {
        const appStore = jasmine.createSpyObj('store', ['pipe']);
        const component = new ServiceDownComponent(appStore);
        expect(component).toBeTruthy();
    });

    it('showErrorLink', () => {
        const appStore = jasmine.createSpyObj('store', ['pipe']);
        const component = new ServiceDownComponent(appStore);
        let result = component.showErrorLink({
            bodyText: null,
            urlText: 'someText',
            url: 'someUrl',
            newTab: null
          });
        expect(result).toEqual(true);

        result = component.showErrorLink({
            bodyText: null,
            urlText: 'someText',
            url: 'someUrl',
            newTab: true
          });
        expect(result).toEqual(false);
    });

    it('showErrorLinkWithNewTab', () => {
        const appStore = jasmine.createSpyObj('store', ['pipe']);
        const component = new ServiceDownComponent(appStore);
        let result = component.showErrorLinkWithNewTab({
            bodyText: null,
            urlText: 'someText',
            url: 'someUrl',
            newTab: true
          });
        expect(result).toEqual(true);

        result = component.showErrorLinkWithNewTab({
            bodyText: null,
            urlText: 'someText',
            url: 'someUrl',
            newTab: null
          });
        expect(result).toEqual(false);
    });
});
