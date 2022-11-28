import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { ICategory } from 'src/app/categories/category.model';
import { CategoryService } from 'src/app/categories/category.service';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { IAccount } from '../../account/account.model';
import { AccountService } from '../../account/account.service';
import { ITransaction } from '../transaction.model';
import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-transaction-edit',
  templateUrl: './transaction-edit.component.html',
  styleUrls: ['./transaction-edit.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class TransactionEditComponent implements OnInit {
  @Output() updateTransaction = new EventEmitter<ITransaction>();
  @Output() addTransaction = new EventEmitter<ITransaction>();
  subscription: Subscription = new Subscription();
  transaction!: ITransaction | null;
  categories: string[] = [];
  selectedCategories: string[] = [];
  expenseCategories!: ICategory[];
  incomeCategories!: ICategory[];
  selectedAccount!: IAccount;
  isEditMode = false;
  maxDate = new Date();
  open = false;
  transactionForm = new FormGroup({
    type: new FormControl(null, Validators.required),
    amount: new FormControl(null, [Validators.required, Validators.min(0.01)]),
    description: new FormControl(null),
    category: new FormControl(null, [Validators.required]),
    title: new FormControl(null, Validators.required),
    date_of_creation: new FormControl(null),
  });

  changeType(type: string) {
    if (type === 'expense') {
      this.categories = this.expenseCategories.map((category) => {
        return category.title;
      });
    } else {
      this.categories = this.incomeCategories.map((category) => {
        return category.title;
      });
    }
    this.selectedCategories = [];
  }

  checkValue() {
    const ctrl = this.transactionForm.get('category');
    if (this.selectedCategories.length >= 5) {
      ctrl?.disable();
    } else {
      ctrl?.enable();
    }
  }
  categorySelect(title: string) {
    if (this.categories) {
      this.categories = this.categories?.filter((category) => {
        if (category === title) {
          this.selectedCategories.push(title);
          return false;
        }
        return true;
      });
    }
    this.checkValue();
  }

  remove(title: string): void {
    const index = this.selectedCategories.indexOf(title);

    if (index >= 0) {
      this.selectedCategories.splice(index, 1);
      this.checkValue();
      if (this.categories) {
        this.categories.push(title);
      }
    }
  }

  onClose() {
    this.transaction = null;
    this.isEditMode = false;
    this.open = false;
    for (let i = 0; i < this.selectedCategories.length; i++) {
      this.categories.push(this.selectedCategories[i]);
    }
    this.selectedCategories = [];
    this.transactionForm.reset();
    this.transactionForm.markAsUntouched();
    this.drawerService.isOpen.next(false);
  }

  onSubmit() {
    if (this.isEditMode) {
      if (this.transaction) {
        const payload = this.transactionForm.value;
        payload._id = this.transaction._id;
        payload.category = this.selectedCategories;
        this.updateTransaction.emit(payload);
        this.onClose();
      }
    } else {
      const payload = this.transactionForm.value;
      payload.account_id = this.selectedAccount._id;
      payload.currency = this.selectedAccount.currency;
      payload.category = this.selectedCategories;
      this.addTransaction.emit(payload);
      this.onClose();
    }
  }

  constructor(
    private transactionsService: TransactionsService,
    private categoryService: CategoryService,
    private accountService: AccountService,
    private drawerService: DrawerService
  ) {
    this.selectedAccount = this.accountService.selectedAccount;
  }

  ngOnInit(): void {
    this.selectedCategories = [];
    this.subscription.add(
      this.transactionsService.editTransactionMode.subscribe({
        next: (transaction) => {
          this.transaction = transaction;
          this.selectedCategories = [...transaction.category];
          if (transaction.type === 'expense') {
            this.categories = this.expenseCategories.map((category) => {
              return category.title;
            });
          } else {
            this.categories = this.incomeCategories.map((category) => {
              return category.title;
            });
          }

          this.categories = this.categories.filter((title) => {
            if (this.selectedCategories.includes(title)) {
              return false;
            }
            return true;
          });

          this.isEditMode = true;
          this.transactionForm.patchValue({
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            category: transaction.category[0],
            title: transaction.title,
            date_of_creation: transaction.date_of_creation,
          });
          this.open = true;
        },
      })
    );

    this.subscription.add(
      this.transactionsService.addTransactionMode.subscribe({
        next: () => {
          this.isEditMode = false;
          this.open = true;
        },
      })
    );

    this.subscription.add(
      this.categoryService.getCategories().subscribe({
        next: (categories) => {
          this.categories = categories.map((category) => {
            return category.title;
          });
          this.expenseCategories = categories.filter(
            (category) => category.type === 'expense'
          );
          this.incomeCategories = categories.filter(
            (category) => category.type === 'income'
          );
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
