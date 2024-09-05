import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  goToAccounts(): void {
    if (localStorage.getItem('customerId')) {
      this.router.navigate(['/accounts', localStorage.getItem('customerId')]);
    } else {
      this.router.navigate(['/login']);
    }
  }
}
