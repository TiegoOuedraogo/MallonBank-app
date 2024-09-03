import { Component, OnInit, Input } from '@angular/core';
import { TransactionService, TransactionResponse } from '../services/transactions.services';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-transaction',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './transaction.component.html',
  styleUrls: ['./transaction.component.scss']
})
export class TransactionComponent implements OnInit {
  @Input() accounts: any[] = []; 
  transactions: TransactionResponse[] = [];
  customerId!: number;
  accountNumber!: number;

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
    this.transactionService.getTransactionsByAccount(accountNumber).subscribe({
      next: (transactions) => {
        this.transactions = transactions;
        console.log('Transactions loaded:', this.transactions);
      },
      error: (error) => {
        console.error('Failed to fetch transactions', error);
        alert('Failed to fetch transactions. Please try again.');
      }
    });
  }
}
