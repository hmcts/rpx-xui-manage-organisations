// import { Injectable } from '@angular/core';
// import {ActivatedRoute, CanActivate} from '@angular/router';
// import { select, Store } from '@ngrx/store';
// import { Observable, of } from 'rxjs';
// import {
//   catchError,
//   filter,
//   switchMap,
//   take,
//   tap
// } from 'rxjs/operators';
//
// import {pbaAccountSummaryLoaded} from '../store/selectors';
// import * as fromfeatureStore from '../store';
// import {map} from 'rxjs/internal/operators';
// import {SingleFeeAccountState} from '../store/reducers/single-fee-account.reducer';
//
// @Injectable()
// export class PbaSummaryGuard implements CanActivate {
//   constructor(
//     private store: Store<SingleFeeAccountState>) {}
//
//   canActivate(): Observable<boolean> {
//     return this.checkStore()
//       .pipe(
//         switchMap(() => of(true)),
//         catchError(() => of(false))
//       );
//   }
//
//   checkStore(): Observable<boolean> {
//     return this.store
//       .pipe(
//         select(pbaAccountSummaryLoaded),
//         tap(loaded => {
//           if (!loaded) {
//               console.log('GUARD IS KICKED IN:: PbaSummaryGuard ')
//             this.store.dispatch(new fromfeatureStore.LoadSingleFeeAccount());
//
//           }
//         }),
//         filter(loaded => loaded),
//         take(1)
//       );
//   }
// }
