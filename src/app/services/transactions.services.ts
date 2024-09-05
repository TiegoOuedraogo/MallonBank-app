import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TransactionRequest, TransactionResponse } from '../models/transaction.model';
import { Account } from '../models/account.model'; // Import the Account interface

@Injectable({
  providedIn: 'root'
})
export class TransactionService {
  private baseUrl = 'http://localhost:8080/transaction';
  private accountBaseUrl = 'http://localhost:8080/account';

  constructor(private http: HttpClient) {}

  performTransaction(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}`, transactionData).pipe(
      catchError(error => {
        console.error('HTTP Error', error);
        if (error.error instanceof ErrorEvent) {
          console.error('Client-side error:', error.error.message);
        } else {
          console.error(`Server-side error: ${error.status} - ${error.message}`);
          console.error('Error details:', error.error); 
        }
        return throwError(() => new Error('Error in performing transaction: ' + error.message));
      })
    );
  }

  getTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/all`).pipe(
      catchError(error => { throw new Error('Error in retrieving transactions: ' + error); })
    );
  }

  getTransactionsByAccount(accountNumber: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.accountBaseUrl}/${accountNumber}`).pipe(
      catchError(error => { throw new Error('Error in retrieving transactions for account: ' + error); })
    );
  }

  getAccountByNumber(accountNumber: number): Observable<Account> {
    return this.http.get<Account>(`${this.accountBaseUrl}/${accountNumber}`).pipe(
      catchError(error => { 
        console.error('Error retrieving account details', error);
        return throwError(() => new Error('Error in retrieving account details: ' + error.message)); 
      })
    );
  }
}

export type { TransactionResponse };
