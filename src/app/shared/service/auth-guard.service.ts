import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class AuthGuardService implements CanActivate {
  isLogin = new BehaviorSubject(false);

  canActivate(): boolean | Observable<any> {
    let checked = localStorage.getItem('checked');
    if (checked == 'true') {
      this.isLogin.next(true);
      return true;
    }
    this._Router.navigateByUrl('/login');
    this.isLogin.next(false);
    return false;
  }
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('checked');
    this.isLogin.next(false);
    this._Router.navigateByUrl('/login');
  }

  constructor(private _Router: Router) {}
}
