import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UntilDestroy } from '@ngneat/until-destroy';
import { Subscription } from 'rxjs';
import { AccountService } from '../main-page/account/account.service';
import { ICategoryStatistics, IMonthlyStatistics } from './statistics.model';
import { StatisticsService } from './statistics.service';

import { dateValidator } from './statistics.validator';

@Component({
  selector: 'app-statistics-page',
  templateUrl: './statistics-page.component.html',
  styleUrls: ['./statistics-page.component.scss'],
})
@UntilDestroy({ checkProperties: true })
export class StatisticsPageComponent implements OnInit {
  monthlyStatistics: IMonthlyStatistics[] = [];
  categoryStatistics: ICategoryStatistics[] = [];
  account_id = '';
  isCategoryStatistics = false;
  total!: {
    income: number;
    expense: number;
    economy: number;
    economy_percentage: number;
  };
  average!: {
    income: number;
    expense: number;
    economy: number;
    economy_percentage: number;
  };
  subscription: Subscription = new Subscription();
  fetchData() {
    this.subscription.add(
      this.statisticsService
        .getCategoryStatistics(this.account_id, {
          fromDate: this.range.value.start,
          toDate: this.range.value.end,
        })
        .subscribe((data) => {
          this.categoryStatistics = data;
        })
    );

    this.subscription.add(
      this.statisticsService
        .getMonthlyStatistics(this.account_id, {
          fromDate: this.range.value.start,
          toDate: this.range.value.end,
        })
        .subscribe((data) => {
          this.monthlyStatistics = data;
          const { total, average } =
            this.statisticsService.getTotalAndAverageStatistics(data);
          this.total = total;
          this.average = average;
        })
    );
  }

  range = new FormGroup({
    start: new FormControl(null, [Validators.required, dateValidator()]),
    end: new FormControl(null, [Validators.required, dateValidator()]),
  });

  showCategoryStatistics() {
    this.isCategoryStatistics = true;
  }

  showMonthlyStatistics() {
    this.isCategoryStatistics = false;
  }

  constructor(
    private statisticsService: StatisticsService,
    private accountService: AccountService
  ) {
    if (
      this.accountService.selectedAccount &&
      this.accountService.selectedAccount._id
    ) {
      this.account_id = this.accountService.selectedAccount._id;
    }
  }

  ngOnInit(): void {
    this.subscription.add(
      this.accountService.selectAccount.subscribe((account) => {
        this.account_id = account._id;
        this.statisticsService
          .getMonthlyStatistics(this.account_id)
          .subscribe((statistics) => {
            this.monthlyStatistics = statistics;
            const { total, average } =
              this.statisticsService.getTotalAndAverageStatistics(statistics);
            this.total = total;
            this.average = average;
          });
        this.statisticsService
          .getCategoryStatistics(this.account_id)
          .subscribe((statistics) => {
            this.categoryStatistics = statistics;
          });
      })
    );
    if (this.account_id) {
      this.subscription.add(
        this.statisticsService
          .getMonthlyStatistics(this.account_id)
          .subscribe((statistics) => {
            this.monthlyStatistics = statistics;
            const { total, average } =
              this.statisticsService.getTotalAndAverageStatistics(statistics);
            this.total = total;
            this.average = average;
          })
      );
      this.subscription.add(
        this.statisticsService
          .getCategoryStatistics(this.account_id)
          .subscribe((statistics) => {
            this.categoryStatistics = statistics;
          })
      );
    }
  }
}
