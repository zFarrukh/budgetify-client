import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { IAccount } from '../account.model';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-account-detail',
  templateUrl: './account-detail.component.html',
  styleUrls: ['./account-detail.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class AccountDetailComponent implements OnInit {
  @Input() currency!: string;
  account: IAccount | null = null;
  selectedAccount: IAccount | null = null;
  subscription: Subscription = new Subscription();
  onClose(): void {
    this.account = null;
    this.drawerService.isOpen.next(false);
  }

  onDeleteAccount(): void {
    if (this.account) {
      this.accountService.deleteAccount.next(this.account);
      this.drawerService.isOpen.next(false);
      this.subscription.add(
        this.accountService.deleteAccountById(this.account._id).subscribe()
      );
      this.account = null;
    }
  }

  openDialog() {
    if (this.account) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data: {
          title: 'Account',
          message: 'Are you sure you want to delete account?',
          id: this.account._id,
        },
      });

      this.subscription.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.onDeleteAccount();
          }
        })
      );
    }
  }

  onEditAccount(): void {
    if (this.account) {
      this.accountService.editAccountMode.next(this.account);
      this.account = null;
    }
  }

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.accountService.accountDetail.subscribe({
        next: () => {
          this.account = this.selectedAccount;
        },
      })
    );

    this.subscription.add(
      this.accountService.selectAccount.subscribe({
        next: (account: IAccount) => {
          this.selectedAccount = account;
        },
      })
    );
  }
}
