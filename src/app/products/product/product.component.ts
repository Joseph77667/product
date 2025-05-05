// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product',
//   templateUrl: './product.component.html',
//   styleUrls: ['./product.component.css']
// })
// export class ProductComponent {

// }
import { Component, OnInit } from '@angular/core';
import { ProductResponse } from 'src/api/model/type';
import { ProductService } from 'src/api/product.service';


@Component({
  selector: 'app-product',
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.css']
})
export class ProductComponent implements OnInit {
  products: ProductResponse[] = [];
  currentPage = 0;
  pageSize = 8;
  totalItems = 0;
  totalPages = 0;
  isProductFound: Boolean = false;

  constructor(private productService: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // loadProducts(): void {
  //   this.productService.getAllProducts(this.currentPage, this.pageSize).subscribe({
  //     next: (response) => {
  //       this.products = response.content;
  //       this.totalItems = response.totalElements; 
  //       this.totalPages = response.totalPages || Math.ceil(this.totalItems / this.pageSize);
  //     },
  //     error: (err) => {
  //       console.error('Error loading products:', err);
  //     }
  //   });
  // }
  searchValue: string = '';

  loadProducts(): void {
    this.productService.getAllProducts(this.currentPage, this.pageSize, this.searchValue).subscribe({
      next: (response) => {
        this.products = response.items; 
        this.totalItems = response.totalCount;
        this.totalPages = response.totalPages;
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchValue = inputElement.value;
    this.currentPage = 0;
    this.loadProducts();
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.loadProducts();
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadProducts();
    }
  }

  prevPage(): void {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadProducts();
    }
  }
}
