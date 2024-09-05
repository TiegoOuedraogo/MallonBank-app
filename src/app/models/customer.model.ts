import { Account } from './account.model';

export interface Customer {
  id: number;
  fullName: string;
  accounts: Account[];
}
