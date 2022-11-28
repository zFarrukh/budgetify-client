import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LoaderService } from 'src/app/shared/services/loader.service';
import { environment } from 'src/environments/environment';
import { ICategoryStatistics, IMonthlyStatistics } from './statistics.model';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  getMonthlyStatistics(
    account_id: string,
    options?: { fromDate: Date; toDate: Date }
  ): Observable<IMonthlyStatistics[]> {
    this.loaderService.isVisible.next(true);
    if (options) {
      const result = new Date();
      result.setDate(options.toDate.getDate() + 1);
      return this.http
        .get<IMonthlyStatistics[]>(
          `${environment.API_URL}/stats/monthly?account_id=${account_id}&fromDate=${options.fromDate}&toDate=${result}`
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
      .get<IMonthlyStatistics[]>(
        `${environment.API_URL}/stats/monthly?account_id=${account_id}`
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

  getCategoryStatistics(
    account_id: string,
    options?: { fromDate: Date; toDate: Date }
  ): Observable<ICategoryStatistics[]> {
    this.loaderService.isVisible.next(true);
    if (options) {
      const result = new Date();
      result.setDate(options.toDate.getDate() + 1);
      return this.http
        .get<ICategoryStatistics[]>(
          `${environment.API_URL}/stats/category?account_id=${account_id}&fromDate=${options.fromDate}&toDate=${result}`
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
      .get<ICategoryStatistics[]>(
        `${environment.API_URL}/stats/category?account_id=${account_id}`
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
