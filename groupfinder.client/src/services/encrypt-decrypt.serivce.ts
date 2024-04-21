import { Injectable } from "@angular/core";
import { environment } from "../environments/environment";
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })

export class EncryptDecryptService {
  private key = CryptoJS.enc.Utf8.parse(environment.encryptKey);
  private iv = CryptoJS.enc.Utf8.parse(environment.ivKey);
  constructor() { }
  // Methods for the encrypt and decrypt Using AES
  encryptUsingAES256(text: string): string {
    const encrypted = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(text), this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
  }
  decryptUsingAES256(decString: string) {
    const decrypted = CryptoJS.AES.decrypt(decString, this.key, {
      keySize: 128 / 8,
      iv: this.iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }
}
