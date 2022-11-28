import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { ITransaction } from './transaction.model';
import { environment } from 'src/environments/environment';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { AccountService } from '../account/account.service';

@Injectable({
  providedIn: 'root',
})
export class TransactionsService {
  public transactions: ITransaction[] = [];
  public onChangeTransactions = new Subject<ITransaction[]>();
  public selectedTransaction = new Subject<ITransaction>();
  public editTransactionMode = new Subject<ITransaction>();
  public addTransactionMode = new Subject<boolean>();
  public deleteTransaction = new Subject<ITransaction>();

  addTransaction(transaction: ITransaction): Observable<ITransaction> {
    this.loaderService.isVisible.next(true);
    return this.http
      .post<ITransaction>(`${environment.API_URL}/transactions`, transaction)
      .pipe(
        tap({
          next: (transaction: ITransaction) => {
            this.transactions.push(transaction);
            this.onChangeTransactions.next(this.transactions);
            if (transaction.type === 'expense') {
              this.accountService.selectedAccount.amount -= transaction.amount;
            } else {
              this.accountService.selectedAccount.amount += transaction.amount;
            }
          },
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: () => {
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  updateTransaction(
    id: string,
    transaction: ITransaction
  ): Observable<ITransaction> {
    return this.http
      .put<ITransaction>(
        `${environment.API_URL}/transactions/${id}`,
        transaction
      )
      .pipe(
        tap({
          next: (res) => {
            this.transactions = this.transactions.map((item) => {
              if (item._id === id) {
                if (item.type === 'expense') {
                  if (transaction.type === 'expense') {
                    this.accountService.selectedAccount.amount =
                      this.accountService.selectedAccount.amount -
                      transaction.amount +
                      item.amount;
                  } else {
                    this.accountService.selectedAccount.amount =
                      this.accountService.selectedAccount.amount +
                      transaction.amount +
                      item.amount;
                  }
                } else if (item.type === 'income') {
                  if (transaction.type === 'income') {
                    this.accountService.selectedAccount.amount =
                      this.accountService.selectedAccount.amount -
                      item.amount +
                      transaction.amount;
                  } else {
                    this.accountService.selectedAccount.amount =
                      this.accountService.selectedAccount.amount -
                      transaction.amount -
                      item.amount;
                  }
                }

                return res;
              }
              return item;
            });
            this.onChangeTransactions.next(this.transactions);
          },
        })
      );
  }

  getTransactions(account_id: string): Observable<ITransaction[]> {
    this.loaderService.isVisible.next(true);
    return this.http
      .get<ITransaction[]>(`${environment.API_URL}/transactions`, {
        params: {
          account_id: account_id,
        },
      })
      .pipe(
        tap({
          next: (res: ITransaction[]) => {
            this.transactions = res;
          },
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: () => {
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  deleteTransactionById(id: string): Observable<ITransaction> {
    this.loaderService.isVisible.next(true);
    return this.http
      .delete<ITransaction>(`${environment.API_URL}/transactions/${id}`)
      .pipe(
        tap({
          next: (transaction) => {
            this.transactions = this.transactions.filter((item) => {
              return item._id !== transaction._id;
            });
            this.onChangeTransactions.next(this.transactions);
            if (transaction.type === 'expense') {
              this.accountService.selectedAccount.amount += transaction.amount;
            }
            this.deleteTransaction.next(transaction);
          },
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: () => {
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  getTransactionsByType(type: string): ITransaction[] {
    return this.transactions.filter((transaction) => {
      return transaction.type === type;
    });
  }

  constructor(
    private http: HttpClient,
    private loaderService: LoaderService,
    private accountService: AccountService
  ) {}
}
