import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { BankService } from '../services/bank.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-customer',
  standalone: true,
  imports: [CommonModule, FormsModule, MatTableModule],
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
      this.router.navigate(['accounts'], { queryParams: { customerId: result.id } }); // Redirect after creating a customer
    });
  }

  deleteCustomer(customerNumber: number): void {
    this.bankService.deleteCustomer(customerNumber).subscribe(() => {
      this.customers = this.customers.filter(c => c.id !== customerNumber);
    });
  }
}
