import { Component, OnInit } from '@angular/core';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { IAccount } from './account.model';
import { AccountService } from './account.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class AccountComponent implements OnInit {
  accounts: IAccount[] = [];
  selectedAccount: IAccount | undefined;
  subscription: Subscription = new Subscription();

  selectAccount(account: IAccount) {
    if (this.selectedAccount !== account) {
      this.accountService.selectAccount.next(account);
      this.accountService.selectedAccount = account;
    }
    this.selectedAccount = account;
  }
  constructor(private accountService: AccountService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.accountService.getAccounts().subscribe({
        next: (accounts) => {
          this.accounts = accounts;
          this.selectedAccount = accounts[0];
        },
      })
    );

    this.subscription.add(
      this.accountService.selectAccount.subscribe({
        next: (res) => {
          this.selectedAccount = res;
        },
      })
    );

    this.subscription.add(
      this.accountService.deleteAccount.subscribe({
        next: (res) => {
          this.accounts = this.accounts.filter((acc) => acc._id !== res._id);
          this.selectedAccount = this.accounts[0];
        },
      })
    );

    this.subscription.add(
      this.accountService.updateAccount.subscribe({
        next: (res) => {
          const index = this.accounts.findIndex((acc) => acc._id === res._id);
          this.accounts[index] = res;
        },
      })
    );
  }
}
