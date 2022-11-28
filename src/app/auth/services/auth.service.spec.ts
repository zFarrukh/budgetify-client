import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from '../../../environments/environment';
import { JwtModule } from '@auth0/angular-jwt';

describe('Authservice test', () => {
  let service: AuthService;
  let httpController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        JwtModule.forRoot({
          config: {
            tokenGetter: () => {
              return localStorage.getItem('token');
            },
            allowedDomains: ['localhost:3000'],
          },
        }),
      ],
    });

    service = TestBed.inject(AuthService);
    httpController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Login', () => {
    it('should return user data on success', (done: DoneFn) => {
      const expectedData = {
        id: 'id',
        email: 'email',
        name: 'name',
        role: 'role',
        token: 'token',
        expiresIn: 0,
      };

      service.login('email', 'psw').subscribe({
        next: (res) => {
          expect(res).toEqual(expectedData);
          done();
        },
      });

      const req = httpController.expectOne({
        method: 'POST',
        url: `${environment.API_URL}/user/login`,
      });
      req.flush(expectedData);
    });

    it('setSession has to been called on success', (done: DoneFn) => {
      spyOn(service as any, 'setSession');
      const expectedResult = {
        id: 'id',
        email: 'email',
        name: 'name',
        role: 'role',
        token: 'token',
        expiresIn: 0,
      };
      service.login('email', 'psw').subscribe(() => {
        expect((service as any).setSession).toHaveBeenCalledOnceWith(
          expectedResult
        );
        done();
      });
      const req = httpController.expectOne({
        method: 'POST',
        url: `${environment.API_URL}/user/login`,
      });
      req.flush(expectedResult);
    });

    it('setSession has not been called on error', (done: DoneFn) => {
      spyOn(service as any, 'setSession');
      service.login('email', 'psw').subscribe({
        error: (e) => {
          expect((service as any).setSession).not.toHaveBeenCalled();
          done();
        },
      });

      const req = httpController.expectOne({
        method: 'POST',
        url: `${environment.API_URL}/user/login`,
      });
      req.error(new ProgressEvent('401'));
    });

    it('should return error on error', (done: DoneFn) => {
      service.login('email', 'psw').subscribe({
        error: (e) => {
          expect(e).toBeTruthy();
          done();
        },
      });

      const req = httpController.expectOne({
        method: 'POST',
        url: `${environment.API_URL}/user/login`,
      });
      req.error(new ProgressEvent('401'));
    });
  });

  describe('Logout', () => {
    it('should remove token from localStorage', () => {
      localStorage.setItem('token', 'token.token.token');
      service.logout();
      expect(localStorage.getItem('token')).toBeNull();
    });

    it('should return null', () => {
      expect(service.user).toBeNull();
    });
  });

  describe('isLoggedIn', () => {
    it('should return true if token is valid', () => {
      localStorage.setItem(
        'token',
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c' // valid token
      );
      expect(service.isLoggedIn()).toEqual(true);
    });
  });
});
