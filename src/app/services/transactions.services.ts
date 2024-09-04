import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/account/${accountNumber}`).pipe(
      catchError(error => { throw new Error('Error in retrieving transactions for account: ' + error); })
    );
  }
}

export type { TransactionResponse };

