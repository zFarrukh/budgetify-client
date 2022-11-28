import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IMonthlyStatistics } from '../main/statistics-page/statistics.model';
import { LoaderService } from '../shared/services/loader.service';
import {
  ICategoryAdminStatistics,
  IMonthlyAdminStatistics,
} from './adminStats.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  getMonthlyStatistics(options?: {
    fromDate: Date;
    toDate: Date;
  }): Observable<IMonthlyAdminStatistics> {
    this.loaderService.isVisible.next(true);
    if (options?.fromDate || options?.toDate) {
      const result = new Date();
      result.setDate(options.toDate.getDate() + 1);
      return this.http
        .get<IMonthlyAdminStatistics>(
          `${environment.API_URL}/admin/monthly?fromDate=${options.fromDate}&toDate=${result}`
        )
        .pipe(
          tap({
            complete: () => {
              this.loaderService.isVisible.next(false);
            },
            error: () => {
              this.loaderService.isVisible.next(false);
            },
          })
        );
    }
    return this.http
      .get<IMonthlyAdminStatistics>(`${environment.API_URL}/admin/monthly`)
      .pipe(
        tap({
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: () => {
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  getCategoryStatistics(options?: {
    fromDate: Date;
    toDate: Date;
  }): Observable<ICategoryAdminStatistics> {
    this.loaderService.isVisible.next(true);
    if (options) {
      const result = new Date();
      result.setDate(options.toDate.getDate() + 1);
      return this.http
        .get<ICategoryAdminStatistics>(
          `${environment.API_URL}/admin/category?fromDate=${options.fromDate}&toDate=${result}`
        )
        .pipe(
          tap({
            complete: () => {
              this.loaderService.isVisible.next(false);
            },
            error: () => {
              this.loaderService.isVisible.next(false);
            },
          })
        );
    }
    return this.http
      .get<ICategoryAdminStatistics>(`${environment.API_URL}/admin/category`)
      .pipe(
        tap({
          complete: () => {
            this.loaderService.isVisible.next(false);
          },
          error: () => {
            this.loaderService.isVisible.next(false);
          },
        })
      );
  }

  getTotalAndAverageStatistics(statistics: IMonthlyStatistics[]): {
    total: {
      income: number;
      expense: number;
      economy: number;
      economy_percentage: number;
    };
    average: {
      income: number;
      expense: number;
      economy: number;
      economy_percentage: number;
    };
  } {
    const incomeTotal = statistics.reduce((acc, cur) => {
      return acc + cur.income;
    }, 0);
    const expenseTotal = statistics.reduce((acc, cur) => {
      return acc + cur.expense;
    }, 0);
    const economyTotal = incomeTotal - expenseTotal;
    const economy_percentageTotal = (economyTotal / incomeTotal) * 100;
    const average = {
      income: incomeTotal / statistics.length,
      expense: expenseTotal / statistics.length,
      economy: economyTotal / statistics.length,
      economy_percentage: economy_percentageTotal / statistics.length,
    };
    return {
      total: {
        income: incomeTotal,
        expense: expenseTotal,
        economy: economyTotal,
        economy_percentage: economy_percentageTotal,
      },
      average,
    };
  }

  constructor(private http: HttpClient, private loaderService: LoaderService) {}
}
