import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { BankService } from '../services/bank.service';
import { Account } from '../models/account.model';
import { isPlatformBrowser } from '@angular/common';
import { MoveMoneyComponent } from "../move-money/move-money.component";

@Component({
  selector: 'app-account-management',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, MoveMoneyComponent],
  templateUrl: './account-management-component.html',
  styleUrls: ['./account-management-component.scss']
})
export class AccountManagementComponent implements OnInit {
  customerId!: string;
  accounts: Account[] = [];
  newAccountName: string = '';
  newOpeningBalance: number = 0;
  view: string = 'accounts';
  isBrowser: boolean;

  constructor(
    private bankService: BankService,
    private route: ActivatedRoute,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.customerId = params['customerId'];
      if (this.customerId) {
        this.handleCustomerId(this.customerId);
      } else {
        this.router.navigate(['/login']);
      }
    });

    this.route.url.subscribe(urlSegment => {
      this.view = urlSegment.toString().includes('moveMoney') ? 'moveMoney' : 'accounts';
    });
  }

  handleCustomerId(customerId: string): void {
    if (this.isBrowser) {
      localStorage.setItem('customerId', customerId);
    }
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.bankService.getAccounts().subscribe({
      next: accounts => {
        this.accounts = accounts;
        console.log('Accounts loaded in AccountManagementComponent:', this.accounts); 
        if (this.accounts.length > 0) {
          console.log('Accounts are available, switching view to "moveMoney"');
          this.view = 'moveMoney'; 
        }
      },
      error: error => {
        console.error('Failed to fetch account details', error);
        alert('Failed to fetch account details. Please try again.');
      }
    });
  }
  

  openAccount(): void {
    const accountData = {
      customerId: Number(this.customerId),
      accountName: this.newAccountName,
      openingBalance: this.newOpeningBalance
    };

    this.bankService.createAccount(accountData).subscribe({
      next: result => {
        console.log('Account opened:', result);
        this.loadAccounts(); 
      },
      error: error => {
        console.error('Failed to open account', error);
        alert('Failed to open account. Please try again.');
      }
    });
  }

  closeAccount(accountNumber: number): void {
    this.bankService.deleteAccount(accountNumber).subscribe({
      next: data => {
        console.log('Account closed:', data);
        this.loadAccounts(); 
      },
      error: error => {
        console.error('Failed to close account', error);
        alert('Failed to close account. Please try again.');
      }
    });
  }

  viewTransactions(accountNumber: number): void {
    if (this.customerId) {
      this.router.navigate(['/transactions'], { queryParams: { accountNumber, customerId: this.customerId } });
    } else {
      this.router.navigate(['/login']);
    }
  }
}
