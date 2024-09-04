// import { Component, Input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
// import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
// import { TransactionService } from '../services/transactions.services';
// import { TransactionRequest } from '../models/transaction.model';
// import { Account } from '../models/account.model';
// import { CommonModule } from '@angular/common';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-move-money',
//   standalone: true,
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   templateUrl: './move-money.component.html',
//   styleUrls: ['./move-money.component.scss']
// })
// export class MoveMoneyComponent implements OnInit, OnChanges {
//   @Input() accounts: Account[] = [];
  
//   transactionForm: FormGroup;

//   constructor(
//     private fb: FormBuilder,
//     private transactionService: TransactionService,
//     private router: Router
//   ) {
//     this.transactionForm = this.fb.group({
//       type: ['DEPOSIT', Validators.required],
//       fromAccount: [null, Validators.required],
//       fromAccountSortCode: [null, Validators.required],
//       toAccount: [null, Validators.required],
//       toAccountSortCode: [null, Validators.required],
//       amount: [null, [Validators.required, Validators.min(1)]]
//     });
//   }




//   ngOnInit(): void {
//     console.log('Accounts received in MoveMoneyComponent:', this.accounts); 
//     setTimeout(() => {
//       console.log('Accounts after setTimeout in MoveMoneyComponent:', this.accounts); 
//     }, 1000);
    
//     this.transactionForm.get('type')?.valueChanges.subscribe(type => {
//       this.updateFormFields(type);
//     });
//   }
  

//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['accounts'] && changes['accounts'].currentValue) {
//       console.log('Accounts updated in MoveMoneyComponent:', this.accounts);
//     }
//   }

//   updateFormFields(type: string): void {
//     const fromAccountControl = this.transactionForm.get('fromAccount');
//     const fromAccountSortCodeControl = this.transactionForm.get('fromAccountSortCode');
//     const toAccountControl = this.transactionForm.get('toAccount');
//     const toAccountSortCodeControl = this.transactionForm.get('toAccountSortCode');
//     const amountControl = this.transactionForm.get('amount');
//     if (type === 'DEPOSIT') {
//       fromAccountControl?.disable();
//       toAccountControl?.enable();
      
//     } else if (type === 'WITHDRAWAL') {
//       toAccountControl?.disable();
//       fromAccountControl?.enable();
//     } else {
//       fromAccountControl?.enable();
//       toAccountControl?.enable();
//     }
//   }

//   performTransaction(): void {
//     if (this.transactionForm.valid) {
//       const transactionType = this.transactionForm.get('type')?.value;
//       const transactionData: TransactionRequest = this.transactionForm.value;

//       switch (transactionType) {
//         case 'DEPOSIT':
//           transactionData.fromAccount = undefined;
//           break;
//         case 'WITHDRAWAL':
//           transactionData.toAccount = undefined;
//           break;
//         case 'TRANSFER':
//           break;
//       }

//       this.transactionService.performTransaction(transactionData).subscribe({
//         next: response => {
//           console.log(`${transactionData.type} successful:`, response);
//           alert(`${transactionData.type} successful!`);
//           this.router.navigate(['/accounts']);
//         },
//         error: error => {
//           console.error(`${transactionData.type} failed:`, error);
//           alert(`${transactionData.type} failed. Please try again.`);
//         }
//       });
//     } else {
//       console.error('Transaction form is invalid.');
//       console.log(this.transactionForm.errors); 
//     }
//   }

//   onAccountChange(event: any, type: 'deposit' | 'withdraw' | 'transfer'): void {
//     const selectedAccountNumber = parseInt(event.target.value, 10);
//     const selectedAccount = this.accounts.find(account => account.number === selectedAccountNumber);
//     if (!selectedAccount) return;

//     switch (type) {
//       case 'deposit':
//         this.transactionForm.patchValue({ toAccount: selectedAccountNumber });
//         break;
//       case 'withdraw':
//         this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
//         break;
//       case 'transfer':
//         this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
//         break;
//     }
//   }
// }



// import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
// import { FormBuilder, FormGroup, Validators,FormsModule, ReactiveFormsModule  } from '@angular/forms';
// import { TransactionService } from '../services/transactions.services';
// import { Router } from '@angular/router';
// import { Account } from '../models/account.model';
// import { TransactionRequest } from '../models/transaction.model';
// import { CommonModule } from '@angular/common';
// import { BankService } from '../services/bank.service';


// @Component({
//   selector: 'app-move-money',
//   templateUrl: './move-money.component.html',
//   styleUrls: ['./move-money.component.scss'],
//   imports: [CommonModule, FormsModule, ReactiveFormsModule],
//   standalone: true
// })
// export class MoveMoneyComponent implements OnInit, OnChanges {
  
//   transactionForm: FormGroup;
//   transactionTypes = ['DEPOSIT', 'WITHDRAWAL', 'TRANSFER'];
//   accounts:any[] = [];
//   constructor(
//     private fb: FormBuilder,
//     private transactionService: TransactionService,
//     private router: Router,
//     private changeRef: ChangeDetectorRef,
//     private bankService: BankService
//   ) {
//     // this.transactionForm = this.fb.group({
//     //   type: ['DEPOSIT', Validators.required],
//     //   fromAccount: [null, Validators.required],
//     //   fromAccountSortCode: [null, Validators.required],
//     //   toAccount: [null, Validators.required],
//     //   toAccountSortCode: [null, Validators.required],
//     //   amount: [null, [Validators.required, Validators.min(1)]]
//     // });

//     this.transactionForm = this.fb.group({
//       type: ['DEPOSIT' as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER', Validators.required],
//       fromAccount: [null, Validators.required],
//       fromAccountSortCode: [null, Validators.required],
//       toAccount: [null, Validators.required],
//       toAccountSortCode: [null, Validators.required],
//       amount: [null, [Validators.required, Validators.min(1)]]
//     });
    
//   }

//   ngOnInit(): void {
//     this.bankService.getAccounts().subscribe({
//       next: result => {
//         this.accounts = [...result];
//         console.log('Accounts loaded in AccountManagementComponent:', result); 
//         if (this.accounts.length > 0) {
//           this.transactionForm.get('type')?.valueChanges.subscribe(type => {
//             this.updateFormFields(type);
//           });
//           this.updateFormFields(this.transactionForm.get('type')?.value);
//         }
//       },
//       error: error => {
//         console.error('Failed to fetch account details', error);
//         alert('Failed to fetch account details. Please try again.');
//       }
//     });
    
//   }
  
//   ngOnChanges(changes: SimpleChanges): void {
//     if (changes['accounts']) {
//       this.updateFormFields(this.transactionForm.get('type')?.value);
//     }
//   }

//   updateFormFields(type: string): void {
//     const controls = this.transactionForm.controls;
    
//     if (type === 'DEPOSIT') {
//       controls['fromAccount'].disable();
//       controls['fromAccountSortCode'].disable();
//       controls['toAccount'].enable();
//       controls['toAccountSortCode'].enable();
//     } else if (type === 'WITHDRAWAL') {
//       controls['toAccount'].disable();
//       controls['toAccountSortCode'].disable();
//       controls['fromAccount'].enable();
//       controls['fromAccountSortCode'].enable();
//     } else {
//       controls['fromAccount'].enable();
//       controls['fromAccountSortCode'].enable();
//       controls['toAccount'].enable();
//       controls['toAccountSortCode'].enable();
//     }
//   }

//   // performTransaction(): void {
//   //   if (this.transactionForm.valid) {
//   //     const transactionType = this.transactionForm.get('type')?.value;
//   //     const transactionData: TransactionRequest = this.transactionForm.value;

//   //     switch (transactionType) {
//   //       case 'DEPOSIT':
//   //         transactionData.fromAccount = undefined;
//   //         break;
//   //       case 'WITHDRAWAL':
//   //         transactionData.toAccount = undefined;
//   //         break;
//   //       case 'TRANSFER':
//   //         break;
//   //     }

//   //     this.transactionService.performTransaction(transactionData).subscribe({
//   //       next: response => {
//   //         alert(`${transactionData.type} successful!`);
//   //         this.router.navigate(['/accounts']);
//   //       },
//   //       error: error => {
//   //         alert(`${transactionData.type} failed. Please try again.`);
//   //       }
//   //     });
//   //   } else {
//   //     console.error('Transaction form is invalid.');
//   //   }
//   // }

//   performTransaction(): void {
//     if (this.transactionForm.valid) {
//       const transactionType = this.transactionForm.get('type')?.value as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER';
//       let transactionData: TransactionRequest = this.transactionForm.value;
  
//       const typeMapping: { [key in 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER']: number } = {
//         'DEPOSIT': 1,       
//         'WITHDRAWAL': 2,    
//         'TRANSFER': 3       
//       };
  
//       transactionData.type = typeMapping[transactionType];
  
//       if (transactionType === 'DEPOSIT') {
//         transactionData.fromAccount = undefined; 
//         transactionData.fromAccountSortCode = undefined;
//       } else if (transactionType === 'WITHDRAWAL') {
//         transactionData.toAccount = undefined;
//         transactionData.toAccountSortCode = undefined;
//       }
  
//       console.log('Transaction data being sent:', transactionData); 
  
//       this.transactionService.performTransaction(transactionData).subscribe({
//         next: response => {
//           alert(`${transactionType} successful!`);
//           this.router.navigate(['/accounts']);
//         },
//         error: error => {
//           console.error('Transaction failed', error);
//           alert(`${transactionType} failed. Please try again.`);
//         }
//       });
//     } else {
//       console.error('Transaction form is invalid.', this.transactionForm.errors);
//     }
//   }

//   onAccountChange(event: any, type: 'deposit' | 'withdraw' | 'transfer'): void {
//     const selectedAccountNumber = parseInt(event.target.value, 10);
//     const selectedAccount = this.accounts.find(account => account.number === selectedAccountNumber);
//     if (!selectedAccount) return;

//     switch (type) {
//       case 'deposit':
//         this.transactionForm.patchValue({ toAccount: selectedAccountNumber });
//         break;
//       case 'withdraw':
//         this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
//         break;
//       case 'transfer':
//         this.transactionForm.patchValue({ fromAccount: selectedAccountNumber });
//         break;
//     }
//     this.changeRef.detectChanges();
//   }
// }


import { Component, Input, OnInit, OnChanges, SimpleChanges, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TransactionService } from '../services/transactions.services';
import { Router } from '@angular/router';
import { Account } from '../models/account.model';
import { TransactionRequest } from '../models/transaction.model';
import { CommonModule } from '@angular/common';
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
  accounts: Account[] = []; // Ensure proper typing here
  
  constructor(
    private fb: FormBuilder,
    private transactionService: TransactionService,
    private router: Router,
    private changeRef: ChangeDetectorRef,
    private bankService: BankService
  ) {
    this.transactionForm = this.fb.group({
      type: ['DEPOSIT' as 'DEPOSIT' | 'WITHDRAWAL' | 'TRANSFER', Validators.required],
      fromAccount: [null, Validators.required],
      fromAccountSortCode: [null, Validators.required],
      toAccount: [null, Validators.required],
      toAccountSortCode: [null, Validators.required],
      amount: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.bankService.getAccounts().subscribe({
      next: result => {
        this.accounts = [...result];
        console.log('Accounts loaded in MoveMoneyComponent:', result); 
        if (this.accounts.length > 0) {
          this.transactionForm.get('type')?.valueChanges.subscribe(type => {
            this.updateFormFields(type);
          });
          this.updateFormFields(this.transactionForm.get('type')?.value);
        }
      },
      error: error => {
        console.error('Failed to fetch account details', error);
        alert('Failed to fetch account details. Please try again.');
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['accounts']) {
      this.updateFormFields(this.transactionForm.get('type')?.value);
    }
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
  
      // Correctly map type to the expected number
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
          this.router.navigate(['/accounts']);
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
