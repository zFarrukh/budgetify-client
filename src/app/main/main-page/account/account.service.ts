import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IAccount } from './account.model';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  public accounts: IAccount[] = [];
  public selectAccount = new Subject<IAccount>();
  public selectedAccount!: IAccount;
  public addAccountMode = new Subject<boolean>();
  public editAccountMode = new Subject<IAccount>();
  public accountDetail = new Subject<IAccount>();
  public deleteAccount = new Subject<IAccount>();
  public updateAccount = new Subject<IAccount>();
  public onCurrencyChange = new Subject<string>();
  public currency!: string;

  getAccounts(): Observable<IAccount[]> {
    return this.http.get<IAccount[]>(`${environment.API_URL}/accounts`).pipe(
      tap({
        next: (res: IAccount[]) => {
          this.accounts = res;
          this.selectAccount.next(this.accounts[0]);
          this.onCurrencyChange.next(this.accounts[0].currency);
          this.selectedAccount = this.accounts[0];
          this.currency = this.accounts[0].currency;
        },
      })
    );
  }

  updateAccountById(payload?: {
    title?: string;
    currency: string;
    description: string;
  }): Observable<IAccount> {
    return this.http
      .put<IAccount>(
        `${environment.API_URL}/accounts/${this.selectedAccount._id}`,
        payload
      )
      .pipe(
        tap({
          next: (res: IAccount) => {
            this.updateAccount.next(res);
            this.onCurrencyChange.next(res.currency);
            this.currency = res.currency;
          },
        })
      );
  }

  deleteAccountById(account_id: string): Observable<IAccount> {
    return this.http
      .delete<IAccount>(`${environment.API_URL}/accounts/${account_id}`)
      .pipe(
        tap({
          next: (res: IAccount) => {
            this.accounts = this.accounts.filter(
              (acc) => acc._id !== account_id
            );
            this.selectAccount.next(this.accounts[0]);
            this.selectedAccount = this.accounts[0];
            this.onCurrencyChange.next(this.accounts[0].currency);
            this.currency = this.accounts[0].currency;
          },
        })
      );
  }

  addAccount(payload: {
    title: string;
    currency: string;
    description?: string;
    amount: number;
  }): Observable<IAccount> {
    return this.http
      .post<IAccount>(`${environment.API_URL}/accounts`, payload)
      .pipe(
        tap({
          next: (res: IAccount) => {
            this.accounts.push(res);
            this.selectAccount.next(res);
            this.selectedAccount = res;
            this.onCurrencyChange.next(res.currency);
            this.currency = res.currency;
          },
        })
      );
  }

  constructor(private http: HttpClient) {}
}
