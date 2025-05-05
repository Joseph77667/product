import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { OrderService } from 'src/api/order.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      address: ['', Validators.required],
      orderItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    if (!this.form.get('orderItems')) {
      this.form.setControl('orderItems', this.fb.array([]));
    }
  }

  get orderItems() {
    return this.form.get('orderItems') as FormArray;
  }

  addOrderItem() {
    this.orderItems.push(this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]]
    }));
  }

  removeOrderItem(index: number) {
    this.orderItems.removeAt(index);
  }

  onSubmit() {
    if (this.form.invalid) {
      return;
    }

    const orderData = this.form.value;
    this.orderService.createOrder(orderData).subscribe({
      next: (response) => {
        alert('Order created successfully');
        this.form.reset();
        this.router.navigate(['/order-list']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to create order');
      }
    });
  }
}
