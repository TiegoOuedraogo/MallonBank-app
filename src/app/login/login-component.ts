import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { BankService } from '../services/bank.service';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-login',
  templateUrl: './login-component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule]
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private bankService: BankService,
    private router: Router
  ) {
    this.form = this.fb.group({
      customerId: [''], 
      fullName: ['']
    });
  }

  ngOnInit(): void {}

  onFormSubmit(): void {
    if (this.form.invalid) {
      this.errorMessage = 'Please provide a valid Customer ID or Full Name.';
      return;
    }

    const customerId = this.form.get('customerId')?.value;
    localStorage.setItem('customerId', customerId.toString());

    const fullName = this.form.get('fullName')?.value;

    if (customerId) {
      this.bankService.getCustomer(customerId).subscribe({
        next: (customer) => {
          console.log(`logged in, navigating to /accounts/${customer.id}`)
          this.router.navigate(['/accounts', customer.id]);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.errorMessage = 'Customer ID not found. Please try again.';
        }
      });
    } else if (fullName) {
      this.bankService.createCustomer({ fullName }).subscribe({
        next: (customer) => {
          console.log(`created customer, navigating to /accounts/${customer.id}`)
          this.router.navigate(['/accounts', customer.id]);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          this.errorMessage = 'Failed to register. Please try again.';
        }
      });
    }
  }
}

