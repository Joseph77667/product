import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductResponse } from 'src/api/model/type';
import { OrderService } from 'src/api/order.service';
import { ProductService } from 'src/api/product.service';
import { OrderItemRequest, OrderItemResponse, OrderResponse } from 'src/api/model/order-model';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.css']
})
export class CreateOrderComponent implements OnInit {
  form: FormGroup;
  allProducts: ProductResponse[] = []; 
  filteredProductsList: ProductResponse[][] = []; 
  productQuantities: {[key: number]: number} = {};
  isLoading = true;
  confirmDeleteIndex: number | null = null;
  isEdit: boolean = false;
  existingOrder: OrderResponse | null = null;
  selectedProductIds: Set<number> = new Set();

  constructor(
    private fb: FormBuilder,
    private orderService: OrderService,
    private productService: ProductService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      customerName: ['', Validators.required],
      customerPhoneNumber: ['', [Validators.required, Validators.pattern(/^\d{11}$/)]],
      address: ['', Validators.required],
      orderItems: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEdit = true;
        this.loadOrderForEdit(params['id']);
      } else {
        this.loadAllProducts();
      }
    });
  }

  private loadOrderForEdit(orderId: string): void {
    this.orderService.getOrderById(+orderId).subscribe({
      next: (order) => {
        this.existingOrder = order;
        this.form.patchValue({
          customerName: order.customerName,
          customerPhoneNumber: order.customerPhone,
          address: order.address
        });
        
        // Load products first
        this.productService.getAllProducts1().subscribe(products => {
          this.allProducts = products;
          products.forEach(product => {
            this.productQuantities[product.id] = product.quantity || 0;
          });
          
          // Then add order items
          order.orderItems.forEach((item: OrderItemRequest) => {
            this.addOrderItem(item.productId, item.quantity);
            this.selectedProductIds.add(item.productId);
          });
          
          this.isLoading = false;
        });
      },
      error: () => {
        this.router.navigate(['/orders']);
      }
    });
  }

  private loadAllProducts(): void {
    this.productService.getAllProducts1().subscribe({
      next: (products) => {
        this.allProducts = products;
        products.forEach(product => {
          this.productQuantities[product.id] = product.quantity || 0;
        });
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

  createOrderItem(productId?: number, quantity?: number): FormGroup {
    const itemGroup = this.fb.group({
      productId: [productId || '', [Validators.required, this.duplicateValidator.bind(this)]],
      quantity: [quantity || '', [
        Validators.required, 
        Validators.min(1),
        this.quantityValidator.bind(this)
      ]],
      searchQuery: ['']
    });

    itemGroup.get('productId')?.valueChanges.subscribe(productId => {
      itemGroup.get('quantity')?.updateValueAndValidity();
      if (typeof productId === 'number') {
        this.selectedProductIds.add(productId);
      }
    });

    this.setupItemSearch(itemGroup);
    return itemGroup;
  }

  private duplicateValidator(control: FormControl) {
    const itemGroup = control.parent;
    if (!control.value) return null;
      const count = this.orderItems.controls
      .filter(item => item.get('productId')?.value === control.value)
      .length;
    
    return count > 1 ? { duplicate: true } : null;
  }

  private quantityValidator(control: FormControl) {
    const itemGroup = control.parent;
    if (!itemGroup) return null;
    
    const productId = itemGroup.get('productId')?.value;
    const requestedQuantity = control.value;
    const availableQuantity = this.productQuantities[productId];

    if (availableQuantity === 0) {
      return { outOfStock: true };
    }
    if (requestedQuantity > availableQuantity) {
      return { exceedsAvailable: true };
    }
    return null;
  }

  private setupItemSearch(itemGroup: FormGroup): void {
    const index = this.orderItems.length - 1;
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
    this.filteredProductsList[itemIndex] = query 
      ? this.allProducts.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase()))
      : [...this.allProducts];
  }

  addOrderItem(productId?: number, quantity?: number): void {
    const newItem = this.createOrderItem(productId, quantity);
    this.orderItems.push(newItem);
    const index = this.orderItems.length - 1;
  
    // Always assign initial list of all products
    this.filteredProductsList[index] = [...this.allProducts];
  
    if (productId) {
      this.selectedProductIds.add(productId);
    }
  }
  
  removeOrderItem(index: number): void {
    this.orderItems.removeAt(index);
    this.filteredProductsList.splice(index, 1);
  }

  getAvailableQuantity(productId: number): number {
    return this.productQuantities[productId] || 0;
  }

  onSubmit(): void {
    if (this.form.invalid || this.orderItems.length === 0) {
      this.form.markAllAsTouched();
      return;
    }

    const formData = {
      ...this.form.value,
      orderItems: this.form.value.orderItems.map((item: any) => {
        const { searchQuery, ...rest } = item;
        return rest;
      })
    };

    if (this.isEdit && this.existingOrder) {
      this.orderService.updateOrder(this.existingOrder.id, formData).subscribe({
        next: () => {
          alert('Order updated successfully');
          this.router.navigate(['/order-list']);
        },
        error: (err) => {
          console.error('Error updating order:', err);
          alert('Failed to update order');
        }
      });
    } else {
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
  }

  private resetForm(): void {
    this.form.reset();
    this.orderItems.clear();
    this.filteredProductsList = [];
    this.selectedProductIds.clear();
    this.addOrderItem();
  }

  @ViewChild('fileInput') fileInput!: ElementRef;

  importOrderExcel() {
    this.fileInput.nativeElement.click(); 
  }

//   onFileSelected(event: any) {
//     const file: File = event.target.files[0];
//     if (file) {
//       const formData = new FormData();
//       formData.append('file', file);

//       this.orderService.importOrders(formData).subscribe({
//         next: (response) => { // Handle the successful response
//           console.log('Import successful:', response);
//           this.router.navigate(['/order-list']);
//         },
//         error: (err) => {
//           console.error('Import failed:', err);
//           let errorMessage = 'Import failed.';
//           if (err.error instanceof Object && err.error.message) {
//             errorMessage += ' ' + err.error.message
//           } else if (typeof err.error === 'string') {
//             errorMessage += ' ' + err.error; 
//           } else if (err.message) {
//             errorMessage += ' ' + err.message;
//           }
//           alert(errorMessage);
//         },
//       });
//     }
//   }
}