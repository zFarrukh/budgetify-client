import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { User } from '../auth.model';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { TransactionsService } from 'src/app/main/main-page/transactions/transactions.service';
import { AccountService } from 'src/app/main/main-page/account/account.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private http: HttpClient,
    private jwtHelper: JwtHelperService,
    private transactionsService: TransactionsService,
    private accountService: AccountService
  ) {}
  user: User | null = null;
  get myUser() {
    return this.user;
  }

  login(email: string, password: string): Observable<User> {
    return this.http
      .post<User>(environment.API_URL + '/user/login', {
        email,
        password,
      })
      .pipe(
        tap((res: User) => {
          this.setSession(res);
        })
      );
  }

  private setSession(data: User): void {
    localStorage.setItem('token', data.token);
    this.user = data;
  }

  public isLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      return false;
    }

    return !this.jwtHelper.isTokenExpired(token);
  }

  public logout(): void {
    localStorage.removeItem('token');
    this.user = null;
    this.transactionsService.transactions = [];
    this.accountService.selectedAccount = {
      title: '',
      currency: '',
      description: '',
      _id: '',
      amount: 0,
      user_id: '',
    };
  }
}
