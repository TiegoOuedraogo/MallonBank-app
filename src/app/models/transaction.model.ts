export interface TransactionRequest {
  type?: number;               
  fromAccount?: number;       
  fromAccountSortCode?: number; 
  toAccount?: number;          
  toAccountSortCode?: number;  
  amount: number;             
}

export interface TransactionResponse {
  transactionId: number;
  transactionType: string;  
  timestamp: string; 
  fromAccountNumber?: number;  
  fromAccountSortCode?: number; 
  toAccountNumber?: number;  
  toAccountSortCode?: number; 
  amount: number; 
}