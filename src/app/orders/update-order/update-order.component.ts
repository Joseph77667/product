import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from 'src/api/order.service';

@Component({
  selector: 'app-update-order',
  templateUrl: './update-order.component.html',
  styleUrls: ['./update-order.component.css']
})
export class UpdateOrderComponent implements OnInit {
  form!: FormGroup;
  orderId!: number;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (!idParam) {
      alert('Order ID not found in URL.');
      this.router.navigate(['/order-list']);
      return;
    }
  
    this.orderId = Number(idParam);
  
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      address: ['', Validators.required],
      orderItems: this.fb.array([])
    });
  
    this.loadOrder();
  }
  

  get orderItems() {
    return this.form.get('orderItems') as FormArray;
  }

  loadOrder() {
    this.orderService.getOrderById(this.orderId).subscribe(order => {
      this.form.patchValue({
        customerName: order.customerName,
        customerPhoneNumber: order.customerPhone,
        address: order.address
      });
      this.orderItems.clear();
      console.log(order.orderItems);
      order.orderItems.forEach((item: any) => {
        this.orderItems.push(this.fb.group({
          productId: [item.productId, Validators.required],
          quantity: [item.quantity, [Validators.required, Validators.min(1)]]
        }));
      });
    });
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
    if (this.form.invalid) return;

    const updatedOrder = this.form.value;
    this.orderService.updateOrder(this.orderId, updatedOrder).subscribe(() => {
      this.router.navigate(['/order-list']);
    });
  }
}
