import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../services/transactions.services';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { TransactionRequest } from '../models/transaction.model';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { BankService } from '../services/bank.service';

@Component({
  selector: 'app-move-money',
  templateUrl: './move-money.component.html',
  styleUrls: ['./move-money.component.scss'],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  standalone: true
})
export class MoveMoneyComponent implements OnInit, OnChanges {
  transactionForm: FormGroup;
  transactionTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
  accounts: Account[] = [];
  customerId: number | null = null;
  isBrowser: boolean;

  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private bankService: BankService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.transactionForm = this.fb.group({
      type: ['DEPOSIT' as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER', Validators.required],
      fromAccount: [null],
      fromAccountSortCode: [null],
      toAccount: [null],
      toAccountSortCode: [null],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    if (this.isBrowser) {
      const customerIdFromStorage = localStorage.getItem('customerId');
      if (customerIdFromStorage) {
        this.customerId = Number(customerIdFromStorage);
      } else {
        this.router.navigate(['/login']);
      }
    } else {
      // Fallback or handle non-browser environments
      this.router.navigate(['/login']);
    }

    this.loadAccounts();

    this.transactionForm.get('type')?.valueChanges.subscribe(type => {
      this.updateFormFields(type);
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accounts']) {
      this.updateFormFields(this.transactionForm.get('type')?.value);
    }
  }

  loadAccounts(): void {
    this.bankService.getAccounts().subscribe({
      next: result => {
        this.accounts = [...result];
        console.log('Accounts loaded in MoveMoneyComponent:', result); 
        if (this.accounts.length > 0) {
          this.updateFormFields(this.transactionForm.get('type')?.value);
        }
      },
      error: error => {
        console.error('Failed to fetch account details', error);
        alert('Failed to fetch account details. Please try again.');
      }
    });
  }

  updateFormFields(type: 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER'): void {
    const controls = this.transactionForm.controls;
    
    if (type === 'DEPOSIT') {
      controls['fromAccount'].disable();
      controls['fromAccountSortCode'].disable();
      controls['toAccount'].enable();
      controls['toAccountSortCode'].enable();
    } else if (type === 'WITHDRAWAL') {
      controls['toAccount'].disable();
      controls['toAccountSortCode'].disable();
      controls['fromAccount'].enable();
      controls['fromAccountSortCode'].enable();
    } else {
      controls['fromAccount'].enable();
      controls['fromAccountSortCode'].enable();
      controls['toAccount'].enable();
      controls['toAccountSortCode'].enable();
    }
  }

  performTransaction(): void {
    if (this.transactionForm.valid) {
      const transactionType = this.transactionForm.get('type')?.value as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
      let transactionData: TransactionRequest = { ...this.transactionForm.value };
  
      const typeMapping: { [key in 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER']: number } = {
        'DEPOSIT': 2,
        'WITHDRAWAL': 1,
        'TRANSFER': 0
      };
  
      transactionData.type = typeMapping[transactionType];
  
      if (transactionType === 'DEPOSIT') {
        transactionData.fromAccount = undefined; 
        transactionData.fromAccountSortCode = undefined;
      } else if (transactionType === 'WITHDRAWAL') {
        transactionData.toAccount = undefined;
        transactionData.toAccountSortCode = undefined;
      }
  
      console.log('Transaction data being sent:', transactionData);
  
      this.transactionService.performTransaction(transactionData).subscribe({
        next: response => {
          alert(`${transactionType} successful!`);
          this.loadUpdatedTransactions();
        },
        error: error => {
          console.error('Transaction failed', error);
          alert(`${transactionType} failed. Please try again.`);
        }
      });
    } else {
      console.error('Transaction form is invalid.', this.transactionForm.errors);
    }
  }

  loadUpdatedTransactions(): void {
    if (this.customerId) {
      this.bankService.getAccounts().subscribe({
        next: result => {
          this.accounts = [...result];
          console.log('Updated accounts after transaction:', result);
          this.router.navigate(['/accounts', this.customerId]); 
        },
        error: error => {
          console.error('Failed to fetch updated accounts', error);
          alert('Failed to fetch updated account details. Please try again.');
        }
      });
    }
  }

  cancelTransaction(): void {
    if (this.customerId) {
      this.router.navigate(['/accounts', this.customerId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  onAccountChange(event: any, type: 'deposit' | 'withdraw' | 'transfer'): void {
    const selectedAccountNumber = parseInt(event.target.value, 10);
    const selectedAccount = this.accounts.find(account => account.number === selectedAccountNumber);
    if (!selectedAccount) return;

    switch (type) {
      case 'deposit':
        this.transactionForm.patchValue({ toAccount: selectedAccountNumber });
        break;
      case 'withdraw':
        this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
        break;
      case 'transfer':
        this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
        break;
    }
    this.changeRef.detectChanges();
  }
}
