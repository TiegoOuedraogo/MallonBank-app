export interface TransactionRequest {
    type: number;
    fromAccount?: number;
    fromAccountSortCode?: number;
    toAccount?: number;
    toAccountSortCode?: number;
    amount: number;
  }
  
  export interface TransactionResponse {
date: string|number|Date;
    time: string;
    type: number;
    fromAccount?: number;
    fromAccountSortCode?: number;
    toAccount?: number;
    toAccountSortCode?: number;
    amount: number;
  }
  