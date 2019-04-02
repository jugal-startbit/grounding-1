import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute} from '@angular/router';
import { Ng4LoadingSpinnerService} from 'ng4-loading-spinner';
import { AuthenticationService} from '../../containers/_services/authentication.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent implements OnInit{
  loginForm: FormGroup;
  showSpinner: boolean;
  returnUrl: string;
  showLoginForm = false;
  error = '';
  constructor(
    private router: Router,
    private authenticationService: AuthenticationService,
    private formBuilder: FormBuilder,
    private spinnerService: Ng4LoadingSpinnerService,
    private route: ActivatedRoute,
    ) {
    if (this.authenticationService.currentUserValue) {
      this.router.navigate(['/loginEvent']);
    } else {
      this.showLoginForm = true;
    }
    this.showSpinner = false;
    $('body').removeClass('sidebar-lg-show');
    $('body').removeClass('sidebar-show');
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      UserName: ['', Validators.required],
      Password: ['', Validators.required]
    });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/loginEvent';
  }

  registerPage() {
    this.router.navigate(['/register']);
  }

  get f() { return this.loginForm.controls; }

  onSubmit() {

    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    }
    this.showSpinner = true;
    this.authenticationService.login(this.loginForm.value.UserName, this.loginForm.value.Password)
      .pipe()
      .subscribe(
        data => {
          if (data['status']) {
            this.router.navigate([this.returnUrl]);
          } else {
            this.error = data['message'];
            this.showSpinner = false;
          }
        },
        error => {
          this.error = 'Server error';
          this.showSpinner = false;
        });
  }
}
