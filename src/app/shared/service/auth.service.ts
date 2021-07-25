import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor() {}
  registerData(): boolean {
    return true;
  }
  loginData(): boolean {
    return true;
  }
}
