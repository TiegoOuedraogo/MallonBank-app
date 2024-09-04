import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { MatTableModule } from '@angular/material/table';
import { BankService } from '../services/bank.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './customer.component.html',
  styleUrls: ['./customer.component.scss']
})
export class CustomerComponent implements OnInit {
  customers: any[] = [];
  newCustomerName: string = '';

  constructor(private bankService: BankService, private router: Router) {}

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers(): void {
    this.bankService.getCustomer(0).subscribe(result => {
      this.customers = [result];
    });
  }

  createCustomer(customerName: string): void {
    const customerData = { name: customerName };
    this.bankService.createCustomer(customerData).subscribe(result => {
      this.customers.push(result);
      this.router.navigate(['accounts'], { queryParams: { customerId: result.id } }); 
    });
  }

  deleteCustomer(customerNumber: number): void {
    this.bankService.deleteCustomer(customerNumber).subscribe(() => {
      this.customers = this.customers.filter(c => c.id !== customerNumber);
    });
  }
}



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
//       fromAccount: [null, Validators.required], // Ensure these fields have validators
//       toAccount: [null, Validators.required],
//       toAccountSortCode: [null, Validators.required],
//       amount: [null, [Validators.required, Validators.min(1)]]
//     });
//   }

//   ngOnInit(): void {
//     console.log('Accounts received in MoveMoneyComponent:', this.accounts); // Debugging line
//     setTimeout(() => {
//       console.log('Accounts after setTimeout in MoveMoneyComponent:', this.accounts); // Debugging after a delay
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
//     const toAccountControl = this.transactionForm.get('toAccount');

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
//       console.log(this.transactionForm.errors); // Log the form errors to understand why it's invalid
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