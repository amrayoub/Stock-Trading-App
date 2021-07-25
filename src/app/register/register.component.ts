import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/service/auth.service';
import { ToastrService } from 'ngx-toastr';
@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private _AuthService: AuthService,
    private _Router: Router,
    private _Toastr: ToastrService
  ) {}
  registerForm: FormGroup = new FormGroup({
    first_name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{3,10}$/),
    ]),
    last_name: new FormControl(null, [
      Validators.required,
      Validators.pattern(/^[A-Za-z]{3,10}$/),
    ]),
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [
      Validators.required,
      Validators.pattern(/[A-Za-z]{1,}[0-9]{1,}/),
      Validators.minLength(8),
    ]),
  });
  register() {
    if (this.registerForm.invalid) {
      return;
    }
    let data = this._AuthService.registerData();

    if (data == true) {
      this._Toastr.success('Registered successfully');
      this._Router.navigateByUrl('/login');
    } else {
      return;
    }
  }

  ngOnInit(): void {}
}
