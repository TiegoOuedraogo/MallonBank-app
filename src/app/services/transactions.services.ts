import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TransactionRequest, TransactionResponse } from '../models/transaction.model';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/transaction';

  constructor(private http: HttpClient) {}

  performTransaction(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}`, transactionData).pipe(
      catchError(error => { throw new Error('Error in performing transaction: ' + error); })
    );
  }

  getTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/all`).pipe(
      catchError(error => { throw new Error('Error in retrieving transactions: ' + error); })
    );
  }

  getTransactionsByAccount(accountNumber: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/account/${accountNumber}`).pipe(
      catchError(error => { throw new Error('Error in retrieving transactions for account: ' + error); })
    );
  }
}

// Export the TransactionResponse type correctly
export type { TransactionResponse };
