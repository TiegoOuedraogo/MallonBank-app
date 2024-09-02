// src/app/services/bank.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Customer } from '../models/customer.model';
import { Account } from '../models/account.model';
import { TransactionRequest, TransactionResponse } from '../models/transaction.model'; 

@Injectable({
  providedIn: 'root'
})
export class BankService {
  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  getCustomer(customerNumber: number): Observable<Customer> {
    return this.http.get<Customer>(`${this.baseUrl}/customer/${customerNumber}`);
  }

  createCustomer(customerData: any): Observable<Customer> {
    return this.http.post<Customer>(`${this.baseUrl}/customer`, customerData);
  }

  deleteCustomer(customerNumber: number): Observable<number> {
    return this.http.delete<number>(`${this.baseUrl}/customer/${customerNumber}`);
  }

  getAccounts(): Observable<Account[]> {
    return this.http.get<Account[]>(`${this.baseUrl}/account`);
  }

  getAccount(accountNumber: number): Observable<Account> {
    return this.http.get<Account>(`${this.baseUrl}/account/${accountNumber}`);
  }

  createAccount(accountData: any): Observable<Account> {
    return this.http.post<Account>(`${this.baseUrl}/account`, accountData);
  }

  deleteAccount(accountNumber: number): Observable<number> {
    return this.http.delete<number>(`${this.baseUrl}/account/${accountNumber}`);
  }

  performTransaction(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/transaction`, transactionData);
  }

  getTransactions(): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/transactions`);
  }

  getTransactionsByAccount(accountNumber: number): Observable<TransactionResponse[]> {
    return this.http.get<TransactionResponse[]>(`${this.baseUrl}/transaction/account/${accountNumber}`);
  }

  createTransaction(transactionData: TransactionRequest): Observable<TransactionResponse> {
    return this.http.post<TransactionResponse>(`${this.baseUrl}/transaction`, transactionData);
  }
}

