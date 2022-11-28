import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ICategory } from 'src/app/categories/category.model';
import { IAccount } from '../account.model';
import { AccountService } from '../account.service';

import { currency_list } from '../../../../data/currency';
import { Subscription } from 'rxjs';
import { UntilDestroy } from '@ngneat/until-destroy';
import { DrawerService } from '../../../../shared/services/drawer.service';

@Component({
  selector: 'app-account-edit',
  templateUrl: './account-edit.component.html',
  styleUrls: ['./account-edit.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class AccountEditComponent implements OnInit {
  @Output() addAccount = new EventEmitter<IAccount>();
  subscription: Subscription = new Subscription();
  currencies = currency_list;
  categories!: ICategory[] | null;
  selectedAccount!: IAccount;
  account: IAccount | null = null;
  isEditMode = false;
  open = false;
  accountForm = new FormGroup({
    amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    description: new FormControl(''),
    title: new FormControl(null, Validators.required),
    currency: new FormControl(null, Validators.required),
  });

  onClose() {
    this.account = null;
    this.isEditMode = false;
    this.open = false;
    this.accountForm.reset();
    this.accountForm.markAsUntouched();
    this.drawerService.isOpen.next(false);
  }

  onSubmit() {
    if (this.isEditMode) {
      if (this.account) {
        const payload = this.accountForm.value;
        this.subscription.add(
          this.accountService.updateAccountById(payload).subscribe({
            next: (res) => {
              this.accountService.selectAccount.next(res);
            },
          })
        );
        this.onClose();
      }
    } else {
      const payload = this.accountForm.value;
      this.addAccount.emit(payload);
      this.onClose();
    }
  }

  constructor(
    private accountService: AccountService,
    private drawerService: DrawerService
  ) {
    this.selectedAccount = this.accountService.selectedAccount;
  }

  ngOnInit(): void {
    this.subscription.add(
      this.accountService.editAccountMode.subscribe({
        next: (account) => {
          this.account = account;
          this.isEditMode = true;
          this.accountForm.patchValue({
            amount: account.amount,
            description: account.description,
            title: account.title,
            currency: account.currency,
          });
          this.open = true;
        },
      })
    );

    this.subscription.add(
      this.accountService.addAccountMode.subscribe({
        next: () => {
          this.accountForm.reset();
          this.isEditMode = false;
          this.open = true;
        },
      })
    );

    this.subscription.add(
      this.accountService.selectAccount.subscribe({
        next: (account) => {
          this.selectedAccount = account;
        },
      })
    );
  }
}
