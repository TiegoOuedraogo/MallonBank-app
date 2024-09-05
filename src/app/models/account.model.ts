import { TransactionResponse } from "./transaction.model";

export interface Account {
  number: number;            
  sortCode: number;          
  name: string;              
  openingBalance: number;   
  balance: number;          
  transactions: TransactionResponse[]; 
}