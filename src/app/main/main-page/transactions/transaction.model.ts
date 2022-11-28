export interface ITransaction {
  _id: string;
  type: string;
  account_id: string;
  description?: string;
  title: string;
  category: string[];
  amount: number;
  date_of_creation: string;
  currency?: string;
}
