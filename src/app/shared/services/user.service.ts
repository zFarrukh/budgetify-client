import { Injectable } from '@angular/core';
import { IUser } from './user.model';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private myUser: IUser | null = null;
  get user(): IUser | null {
    return this.myUser;
  }

  set user(user: IUser | null) {
    this.myUser = user;
  }

  removeUser(): void {
    this.myUser = null;
  }

  isAdmin(): boolean {
    const helper = new JwtHelperService();

    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = helper.decodeToken(token);
      this.myUser = decodedToken;
    }
    if (this.myUser) {
      return this.myUser.role === 'admin';
    }
    return false;
  }

  constructor() {
    const helper = new JwtHelperService();

    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = helper.decodeToken(token);
      this.myUser = decodedToken;
    }
  }
}
