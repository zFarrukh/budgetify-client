import { Component, OnDestroy } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-auth-form',
  templateUrl: './auth-form.component.html',
  styleUrls: ['./auth-form.component.scss'],
})
export class AuthFormComponent implements OnDestroy {
  subscription!: Subscription;
  public loginErrorMessage = '';
  public isPasswordShown = false;
  public loginForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [
      Validators.required,
      Validators.minLength(8),
    ]),
  });

  public togglePasswordShow(): void {
    this.isPasswordShown = !this.isPasswordShown;
  }

  public onFormSubmit(): void {
    const { email, password } = this.loginForm.value;
    this.loginErrorMessage = '';
    this.subscription = this.authService.login(email, password).subscribe({
      next: (userData) => {
        this.router.navigateByUrl('/');
      },
      error: (e) => {
        this.loginErrorMessage = e.error.error;
      },
    });
  }

  constructor(private authService: AuthService, private router: Router) {}

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
