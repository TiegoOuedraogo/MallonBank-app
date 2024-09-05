import { Component, OnInit, Input } from '@angular/core';
import { TransactionService, TransactionResponse } from '../services/transactions.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Account } from '../models/account.model'; 

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @Input() accounts: Account[] = []; 
  transactions: TransactionResponse[] = [];
  customerId!: number;
  accountNumber!: number;
  selectedAccount: Account | undefined = undefined; 

  constructor(private transactionService: TransactionService, public router: Router, private route: ActivatedRoute) {} 

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerId = +params['customerId'];
      this.accountNumber = +params['accountNumber'];

      if (!this.customerId) {
        this.router.navigate(['/login']);
      } else {
        this.loadTransactions(this.accountNumber);
      }
    });
  }

  loadTransactions(accountNumber: number): void {
    this.transactionService.getAccountByNumber(accountNumber).subscribe({
      next: (account: Account) => {
        this.selectedAccount = account; 
        this.transactions = account.transactions; 
        console.log("Transactions loaded:", this.transactions);

        if (this.transactions.length === 0) {
          console.log('No transactions found for this account.');
        } else {
          console.log('Transactions loaded:', this.transactions);
        }
      },
      error: (error: any) => { 
        console.error('Failed to fetch transactions', error);
        alert('Failed to fetch transactions. Please try again.');
      }
    });
  }

  getTransactionType(type: string): string {
    switch(type) {
      case 'TRANSFER': return 'Transfer';
      case 'WITHDRAWAL': return 'Withdrawal';
      case 'DEPOSIT': return 'Deposit';
      default: return 'UNKNOWN';
    }
  }

}
