import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from 'src/api/product.service';

@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.css']
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  selectedFile: File | null = null;
  imagePreview: string = 'assets/default.jpg';
  isEdit: boolean = false;
  productId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private productService: ProductService,
    private router: Router
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      code: ['', Validators.required],
      description: [''],
      price: [0, [Validators.required, Validators.min(0)]],
      quantity: [1, [Validators.required, Validators.min(1)]],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id !== null) {
      this.isEdit = true;
      this.productId = +id;
      this.productService.getProductById(this.productId).subscribe(product => {
        this.form.patchValue(product);
        if (product.imageName) {
          this.imagePreview = `http://localhost:8080/Product/assignment/product/image/${product.imageName}`;
        }
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  triggerImageUpload(input: HTMLInputElement) {
    input.click();
  }

  onSubmit() {
    if (this.form.invalid) return;

    const formData = new FormData();
    Object.entries(this.form.value).forEach(([key, value]) => {
      formData.append(key, value as string);
    });

    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    const action = this.isEdit
      ? this.productService.updateProduct(this.productId!, formData)
      : this.productService.createProduct(formData);

    action.subscribe({
      next: () => {
        alert(`Product ${this.isEdit ? 'updated' : 'created'} successfully`);
        this.router.navigate(['products'])
      },
      error: (err) => console.error(err)
    });
  }
}
