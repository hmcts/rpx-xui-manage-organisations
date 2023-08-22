import { MatDialogConfig } from '@angular/material/dialog';
export function initDialog() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.ariaLabel = 'Label';
    dialogConfig.height = '245px';
    dialogConfig.width = '550px';
    dialogConfig.panelClass = 'dialog';
    dialogConfig.closeOnNavigation = false;
    dialogConfig.position = {
        top: `${window.innerHeight / 2 - 120}px`, left: `${window.innerWidth / 2 - 275}px`
    };
    return dialogConfig;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5pdC1kaWFsb2ctaGVscGVyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvY2NkLWNhc2UtdWktdG9vbGtpdC9zcmMvbGliL3NoYXJlZC9jb21wb25lbnRzL2hlbHBlcnMvaW5pdC1kaWFsb2ctaGVscGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxlQUFlLEVBQUUsTUFBTSwwQkFBMEIsQ0FBQztBQUUzRCxNQUFNLFVBQVUsVUFBVTtJQUN0QixNQUFNLFlBQVksR0FBRyxJQUFJLGVBQWUsRUFBRSxDQUFDO0lBRTNDLFlBQVksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDO0lBQ2pDLFlBQVksQ0FBQyxTQUFTLEdBQUcsSUFBSSxDQUFDO0lBQzlCLFlBQVksQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDO0lBQ2pDLFlBQVksQ0FBQyxNQUFNLEdBQUcsT0FBTyxDQUFDO0lBQzlCLFlBQVksQ0FBQyxLQUFLLEdBQUcsT0FBTyxDQUFDO0lBQzdCLFlBQVksQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDO0lBQ25DLFlBQVksQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUM7SUFDdkMsWUFBWSxDQUFDLFFBQVEsR0FBRztRQUN0QixHQUFHLEVBQUUsR0FBRyxNQUFNLENBQUMsV0FBVyxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUksRUFBRSxJQUFJLEVBQUUsR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLENBQUMsR0FBRyxHQUFHLElBQUk7S0FDbkYsQ0FBQztJQUVGLE9BQU8sWUFBWSxDQUFDO0FBQ3hCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBNYXREaWFsb2dDb25maWcgfSBmcm9tICdAYW5ndWxhci9tYXRlcmlhbC9kaWFsb2cnO1xuXG5leHBvcnQgZnVuY3Rpb24gaW5pdERpYWxvZygpOiBNYXREaWFsb2dDb25maWcge1xuICAgIGNvbnN0IGRpYWxvZ0NvbmZpZyA9IG5ldyBNYXREaWFsb2dDb25maWcoKTtcblxuICAgIGRpYWxvZ0NvbmZpZy5kaXNhYmxlQ2xvc2UgPSB0cnVlO1xuICAgIGRpYWxvZ0NvbmZpZy5hdXRvRm9jdXMgPSB0cnVlO1xuICAgIGRpYWxvZ0NvbmZpZy5hcmlhTGFiZWwgPSAnTGFiZWwnO1xuICAgIGRpYWxvZ0NvbmZpZy5oZWlnaHQgPSAnMjQ1cHgnO1xuICAgIGRpYWxvZ0NvbmZpZy53aWR0aCA9ICc1NTBweCc7XG4gICAgZGlhbG9nQ29uZmlnLnBhbmVsQ2xhc3MgPSAnZGlhbG9nJztcbiAgICBkaWFsb2dDb25maWcuY2xvc2VPbk5hdmlnYXRpb24gPSBmYWxzZTtcbiAgICBkaWFsb2dDb25maWcucG9zaXRpb24gPSB7XG4gICAgICB0b3A6IGAke3dpbmRvdy5pbm5lckhlaWdodCAvIDIgLSAxMjB9cHhgLCBsZWZ0OiBgJHt3aW5kb3cuaW5uZXJXaWR0aCAvIDIgLSAyNzV9cHhgXG4gICAgfTtcblxuICAgIHJldHVybiBkaWFsb2dDb25maWc7XG59XG4iXX0=