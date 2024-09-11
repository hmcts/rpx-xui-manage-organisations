import { Injectable } from '@angular/core';
import { AES, enc, SHA256 } from 'crypto-js';

@Injectable()
export class CryptoWrapper {
  public encrypt(message: string, secret: string = 'secret'): string {
    const key = SHA256(secret).toString();
    return AES.encrypt(message, key).toString();
  }

  public decrypt(encrypted: string, secret: string = 'secret'): string {
    const key = SHA256(secret).toString();
    const bytes = AES.decrypt(encrypted, key);
    return bytes.toString(enc.Utf8);
  }
}
