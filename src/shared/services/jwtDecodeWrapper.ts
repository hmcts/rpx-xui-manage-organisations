import * as jwtDecode from 'jwt-decode';
import { Injectable } from '@angular/core';

@Injectable()
export class JwtDecodeWrapper {
    public decode(jwt: string): any {
        return jwtDecode(jwt);
    }
}
