import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { dateValidator } from '../main/statistics-page/statistics.validator';
import { AdminService } from './admin.service';
import {
  ICategoryAdminStatistics,
  IMonthlyAdminStatistics,
} from './adminStats.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
})
export class AdminComponent implements OnInit {
  monthlyAdminStatistics!: IMonthlyAdminStatistics;
  categoryAdminStatistics!: ICategoryAdminStatistics;
  isCategoryStatistics = false;
  total: {
    [key: string]: {
      income: number;
      expense: number;
      economy: number;
      economy_percentage: number;
    };
  } = {};
  average: {
    [key: string]: {
      income: number;
      expense: number;
      economy: number;
      economy_percentage: number;
    };
  } = {};
  subscription: Subscription = new Subscription();
  fetchData() {
    this.subscription.add(
      this.statisticsService
        .getCategoryStatistics({
          fromDate: this.range.value.start,
          toDate: this.range.value.end,
        })
        .subscribe((data) => {
          this.categoryAdminStatistics = data;
        })
    );

    this.subscription.add(
      this.statisticsService
        .getMonthlyStatistics({
          fromDate: this.range.value.start,
          toDate: this.range.value.end,
        })
        .subscribe((data) => {
          this.monthlyAdminStatistics = data;
          const keys = Object.keys(data);
          for (let i = 0; i < keys.length; i++) {
            const key = keys[i];
            const { total, average } =
              this.statisticsService.getTotalAndAverageStatistics(data[key]);
            this.total[key] = total;
            this.average[key] = average;
          }
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

  constructor(private statisticsService: AdminService) {}

  ngOnInit(): void {
    this.subscription.add(
      this.statisticsService.getMonthlyStatistics().subscribe((statistics) => {
        this.monthlyAdminStatistics = statistics;
        const keys = Object.keys(statistics);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          const { total, average } =
            this.statisticsService.getTotalAndAverageStatistics(
              statistics[key]
            );
          this.total[key] = total;
          this.average[key] = average;
        }
      })
    );
    this.subscription.add(
      this.statisticsService.getCategoryStatistics().subscribe((statistics) => {
        this.categoryAdminStatistics = statistics;
      })
    );
  }
}
