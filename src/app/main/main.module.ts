import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule, Routes } from '@angular/router';
import { MainPageComponent } from './main-page/main-page.component';
import { StatisticsPageComponent } from './statistics-page/statistics-page.component';
import { LayoutModule } from '../layout/layout.module';
import { AccountComponent } from './main-page/account/account.component';
import { TransactionsComponent } from './main-page/transactions/transactions.component';
import { SharedModule } from '../shared/shared.module';
import { TransactionDetailComponent } from './main-page/transactions/transaction-detail/transaction-detail.component';
import { TransactionEditComponent } from './main-page/transactions/transaction-edit/transaction-edit.component';
import { AccountDetailComponent } from './main-page/account/account-detail/account-detail.component';
import { AccountEditComponent } from './main-page/account/account-edit/account-edit.component';

const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    children: [
      {
        path: '',
        component: TransactionsComponent,
      },
      {
        path: 'statistics',
        component: StatisticsPageComponent,
      },
    ],
  },
];

@NgModule({
  declarations: [
    MainPageComponent,
    StatisticsPageComponent,
    AccountComponent,
    TransactionsComponent,
    TransactionDetailComponent,
    TransactionEditComponent,
    AccountDetailComponent,
    AccountEditComponent,
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    LayoutModule,
    SharedModule,
    ReactiveFormsModule,
    FormsModule,
  ],
})
export class MainModule {}
