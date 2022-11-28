import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../../shared/services/drawer.service';
import { IAccount } from '../account/account.model';
import { AccountService } from '../account/account.service';
import { ITransaction } from './transaction.model';
import { TransactionsService } from './transactions.service';

@Component({
  selector: 'app-transactions',
  templateUrl: './transactions.component.html',
  styleUrls: ['./transactions.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class TransactionsComponent implements OnInit {
  transactions: ITransaction[] = [];
  transactionsForOutput: ITransaction[] = [];
  searchText = '';
  selectedAccount!: IAccount;
  currency = '';
  isDeletedTransaction = false;
  subscription: Subscription = new Subscription();

  onSelectTransaction(transaction: ITransaction) {
    this.transactionsService.selectedTransaction.next(transaction);
    this.drawerService.isOpen.next(true);
  }

  openAddTransaction() {
    this.transactionsService.addTransactionMode.next(true);
    this.drawerService.isOpen.next(true);
  }

  openAddAccount() {
    this.accountService.addAccountMode.next(true);
    this.drawerService.isOpen.next(true);
  }

  openAccountDetail() {
    this.accountService.accountDetail.next(this.selectedAccount);
    this.drawerService.isOpen.next(true);
  }

  addTransaction(transaction: ITransaction) {
    this.subscription.add(
      this.transactionsService.addTransaction(transaction).subscribe({
        next: (res: ITransaction) => {
          this.transactions.push(res);
          this.transactionsForOutput.push(res);
        },
      })
    );
  }

  addAccount(account: IAccount) {
    this.subscription.add(
      this.accountService.addAccount(account).subscribe({
        next: (res: IAccount) => {
          this.accountService.selectAccount.next(res);
        },
      })
    );
  }

  updateTransaction(transaction: ITransaction) {
    this.subscription.add(
      this.transactionsService
        .updateTransaction(transaction._id, transaction)
        .subscribe({
          next: (res: ITransaction) => {
            this.transactions = this.transactions.map((item) => {
              if (item._id === transaction._id) {
                return res;
              }
              return item;
            });
            this.transactionsForOutput = this.transactionsForOutput.map(
              (item) => {
                if (item._id === transaction._id) {
                  return res;
                }
                return item;
              }
            );
          },
        })
    );
  }

  searchKey(data: string) {
    this.searchText = data;
    this.search();
  }

  search() {
    this.transactionsForOutput = this.transactions.filter((transaction) => {
      return (
        transaction.title
          .toLowerCase()
          .indexOf(this.searchText.toLowerCase()) !== -1
      );
    });
  }

  onSelectTransactionsByType(type: string) {
    this.transactionsForOutput =
      this.transactionsService.getTransactionsByType(type);
  }

  sortTransactions(type: string) {
    if (type === 'latest') {
      this.transactionsForOutput.sort(function (a, b) {
        return (
          new Date(b.date_of_creation).getTime() -
          new Date(a.date_of_creation).getTime()
        );
      });
    } else if (type === 'oldest') {
      this.transactionsForOutput.sort(function (a, b) {
        return (
          new Date(a.date_of_creation).getTime() -
          new Date(b.date_of_creation).getTime()
        );
      });
    }
  }

  constructor(
    private transactionsService: TransactionsService,
    private accountService: AccountService,
    private drawerService: DrawerService
  ) {
    this.transactions = this.transactionsService.transactions;
    this.transactionsForOutput = this.transactions;
  }

  ngOnInit(): void {
    this.accountService.selectAccount.subscribe({
      next: (account: IAccount) => {
        if (account) {
          this.transactionsService.getTransactions(account._id).subscribe({
            next: (res: ITransaction[]) => {
              this.transactions = res;
              this.transactionsForOutput = this.transactions;
              this.currency = account.currency;
              this.selectedAccount = account;
            },
          });
        }
      },
    });

    this.subscription.add(
      this.transactionsService.deleteTransaction.subscribe({
        next: (transaction) => {
          if (transaction) {
            this.isDeletedTransaction = true;
            setTimeout(() => {
              this.isDeletedTransaction = false;
            }, 2000);
          }
        },
      })
    );

    this.subscription.add(
      this.transactionsService.onChangeTransactions.subscribe({
        next: (transactions: ITransaction[]) => {
          this.transactions = transactions;
          this.transactionsForOutput = transactions;
          this.searchText = '';
        },
      })
    );

    this.subscription.add(
      this.accountService.onCurrencyChange.subscribe({
        next: (currency: string) => {
          this.currency = currency;
        },
      })
    );

    if (this.accountService.currency) {
      this.currency = this.accountService.currency;
    }

    if (this.accountService.selectedAccount) {
      this.selectedAccount = this.accountService.selectedAccount;
    }
  }
}
