import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductResponse } from 'src/api/model/type';
import { OrderService } from 'src/api/order.service';
import { ProductService } from 'src/api/product.service';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  form: FormGroup;
  allProducts: ProductResponse[] = []; // Store all products locally
  filteredProductsList: ProductResponse[][] = []; // Separate filtered lists for each item
  isLoading = true;
  confirmDeleteIndex: Number | null = null;

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
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
    this.loadAllProducts();
  }

  private loadAllProducts(): void {
    this.productService.getAllProducts1().subscribe({
      next: (products) => {
        this.allProducts = products;
        this.isLoading = false;
        this.addOrderItem(); 
      },
      error: () => {
        this.isLoading = false;
        this.addOrderItem(); 
      }
    });
  }

  get orderItems(): FormArray {
    return this.form.get('orderItems') as FormArray;
  }

  createOrderItem(): FormGroup {
    const itemGroup = this.fb.group({
      productId: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.min(1)]],
      searchQuery: ['']
    });

    this.setupItemSearch(itemGroup);
    return itemGroup;
  }

  private setupItemSearch(itemGroup: FormGroup): void {
    const index = this.orderItems.length;
    // Initialize with all products
    this.filteredProductsList[index] = [...this.allProducts];

    itemGroup.get('searchQuery')?.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged()
      )
      .subscribe(query => {
        this.filterProducts(index, query || '');
      });
  }

  private filterProducts(itemIndex: number, query: string): void {
    if (!query) {
      this.filteredProductsList[itemIndex] = [...this.allProducts];
      return;
    }

    const searchTerm = query.toLowerCase();
    this.filteredProductsList[itemIndex] = this.allProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm)
    );
  }

  addOrderItem(): void {
    const newItem = this.createOrderItem();
    this.orderItems.push(newItem);
  }

  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
    this.filteredProductsList.splice(index, 1);
  }

  confirmDelete(id : number):void {
    this.confirmDeleteIndex = id;
  }

  cancelDelete():void {
    this.confirmDeleteIndex = null;
  }

  deleteConfirmed(index: number): void {
    this.removeOrderItem(index);
    this.confirmDeleteIndex = null;
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    // Prepare data without searchQuery fields
    const formData = {
      ...this.form.value,
      orderItems: this.form.value.orderItems.map((item: any) => {
        const { searchQuery, ...rest } = item;
        return rest;
      })
    };

    this.orderService.createOrder(formData).subscribe({
      next: () => {
        alert('Order created successfully');
        this.resetForm();
        this.router.navigate(['/order-list']);
      },
      error: (err) => {
        console.error('Error creating order:', err);
        alert('Failed to create order');
      }
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.orderItems.clear();
    this.filteredProductsList = [];
    this.addOrderItem();
  }
}