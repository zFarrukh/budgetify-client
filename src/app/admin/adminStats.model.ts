export interface IMonthlyAdminStatistics {
  [value: string]: [
    {
      month: string;
      income: number;
      expense: number;
      economy: number;
      economy_percentage: number;
    }
  ];
}

export interface ICategoryAdminStatistics {
  [value: string]: [
    {
      category: string;
      amount: number;
      percentage: number;
    }
  ];
}
