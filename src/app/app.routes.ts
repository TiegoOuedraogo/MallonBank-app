import { Routes } from '@angular/router';
import { CustomerComponent } from './customer/customer.component'; 
import { AccountManagementComponent } from './account/account-management-component';
import { LoginComponent } from './login/login-component';
import { TransactionComponent } from './transaction/transaction.component';
import { MoveMoneyComponent } from './move-money/move-money.component'; 

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'customers', component: CustomerComponent }, // Corrected this line
  { path: 'accounts', component: AccountManagementComponent },
  { path: 'moveMoney', component: MoveMoneyComponent },
  { path: 'transactions', component: TransactionComponent },
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
