export interface TransactionRequest {
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
    fromAccount?: number;
    fromAccountSortCode?: number;
    toAccount?: number;
    toAccountSortCode?: number;
    amount: number;
  }
  
  export interface TransactionResponse {
    time: string;
    type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
    fromAccount?: number;
    fromAccountSortCode?: number;
    toAccount?: number;
    toAccountSortCode?: number;
    amount: number;
  }
  