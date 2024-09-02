import { Account } from './account.model';

export interface Customer {
  id: number;
  name: string;
  accounts: Account[];
}
