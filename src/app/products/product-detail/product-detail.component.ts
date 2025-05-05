// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-product-detail',
//   templateUrl: './product-detail.component.html',
//   styleUrls: ['./product-detail.component.css']
// })
// export class ProductDetailComponent {

// }
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductResponse } from 'src/api/model/type';
import { ProductService } from 'src/api/product.service';


@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  product!: ProductResponse;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.productService.getProductById(+id).subscribe((data) => {
        this.product = data;
      });
    }
  }

  onDelete(): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productService.deleteProduct(this.product.id).subscribe({
        next: () => {
          alert('Product deleted successfully');
          this.router.navigate(['/products']);
        },
        error: (err) => console.error(err)
      });
    }
  }

  onUpdate(): void {
    this.router.navigate(['/products/edit', this.product.id]);
  }
}
