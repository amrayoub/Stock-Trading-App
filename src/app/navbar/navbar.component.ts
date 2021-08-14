import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthGuardService } from '../shared/service/auth-guard.service';
@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  showMenuItem: any;
  constructor(
    private _Router: Router,
    private _AuthGuardService: AuthGuardService
  ) {
    this._AuthGuardService.isLogin.subscribe((flag) => {
      this.showMenuItem = flag;
    });
  }

  logout() {
    this._AuthGuardService.logout();
  }

  ngOnInit(): void {}
}
