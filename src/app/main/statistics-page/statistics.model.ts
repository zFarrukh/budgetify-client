export interface IMonthlyStatistics {
  month: string;
  income: number;
  expense: number;
  economy: number;
  economy_percentage: number;
}

export interface ICategoryStatistics {
  category: string;
  amount: number;
  percentage: number;
}
