import {UserModel} from './user.model';

export interface AuthInterface {
    jti: string;
    sub: string;
    iat: number;
    exp: number;
    data: string;
    type: string;
    id: string;
    forename: string;
    surname: string;
    'default-service': string;
    loa: number;
    'default-url': string;
    group: string;
 }
