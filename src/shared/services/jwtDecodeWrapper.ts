import { Injectable } from '@angular/core';
import jwtDecode from 'jwt-decode';

@Injectable()
export class JwtDecodeWrapper {
  public decode(jwt: string): any {
    return jwtDecode(jwt);
  }
}
