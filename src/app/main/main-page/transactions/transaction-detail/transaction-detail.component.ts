import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { DrawerService } from '../../../../shared/services/drawer.service';
import { DialogComponent } from 'src/app/shared/dialog/dialog.component';
import { ITransaction } from '../transaction.model';
import { TransactionsService } from '../transactions.service';

@Component({
  selector: 'app-transaction-detail',
  templateUrl: './transaction-detail.component.html',
  styleUrls: ['./transaction-detail.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class TransactionDetailComponent implements OnInit {
  @Input() currency!: string;
  @Output() deletedTransaction = new EventEmitter<ITransaction>();
  transaction: ITransaction | null = null;
  subscription: Subscription = new Subscription();
  onClose(): void {
    this.transaction = null;
    this.drawerService.isOpen.next(false);
  }

  openDialog(): void {
    if (this.transaction) {
      const dialogRef = this.dialog.open(DialogComponent, {
        width: '300px',
        data: {
          title: 'transaction',
          message: 'Are you sure you want to delete transaction?',
          id: this.transaction._id,
        },
      });

      this.subscription.add(
        dialogRef.afterClosed().subscribe((result) => {
          if (result) {
            this.onDeleteTransaction();
          }
        })
      );
    }
  }

  onDeleteTransaction(): void {
    if (this.transaction) {
      this.deletedTransaction.emit(this.transaction);
      this.transaction = null;
      this.onClose();
    }
  }

  onEditTransaction(): void {
    if (this.transaction) {
      this.transactionsService.editTransactionMode.next(this.transaction);
      this.transaction = null;
    }
  }

  constructor(
    private transactionsService: TransactionsService,
    private dialog: MatDialog,
    private drawerService: DrawerService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.transactionsService.selectedTransaction.subscribe({
        next: (transaction: ITransaction) => {
          this.transaction = transaction;
        },
      })
    );
  }
}
