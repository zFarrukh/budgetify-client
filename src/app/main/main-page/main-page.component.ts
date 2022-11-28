import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../shared/services/drawer.service';
import { IAccount } from './account/account.model';
import { AccountService } from './account/account.service';
import { ITransaction } from './transactions/transaction.model';
import { TransactionsService } from './transactions/transactions.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class MainPageComponent implements OnInit {
  currency = '';
  isOpen = false;
  subscription: Subscription = new Subscription();

  openChange(open: boolean) {
    this.isOpen = open;
  }

  onDeleteTransaction(transaction: ITransaction) {
    this.subscription.add(
      this.transactionsService
        .deleteTransactionById(transaction._id)
        .subscribe()
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

  addTransaction(transaction: ITransaction) {
    this.subscription.add(
      this.transactionsService.addTransaction(transaction).subscribe()
    );
  }

  updateTransaction(transaction: ITransaction) {
    this.subscription.add(
      this.transactionsService
        .updateTransaction(transaction._id, transaction)
        .subscribe()
    );
  }

  constructor(
    private accountService: AccountService,
    private transactionsService: TransactionsService,
    private drawerService: DrawerService
  ) {}
  ngOnInit() {
    this.subscription.add(
      this.accountService.selectAccount.subscribe({
        next: (account) => {
          this.currency = account.currency;
        },
      })
    );

    this.subscription.add(
      this.drawerService.isOpen.subscribe({
        next: (open) => {
          this.isOpen = open;
        },
      })
    );
  }
}
