import { Component, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { OrderService } from 'src/api/order.service'; // Make sure you have a service to handle orders.
import { Router } from '@angular/router';

@Component({
  selector: 'app-import-order',
  templateUrl: './import-order.component.html',
})
export class ImportOrderComponent {
  @ViewChild('fileInput') fileInput!: ElementRef;

  constructor(private http: HttpClient, private orderService: OrderService, private router: Router) {}

  importOrderExcel() {
    this.fileInput.nativeElement.click(); 
  }

  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      this.orderService.importOrders(formData).subscribe({
        next: (response) => { // Handle the successful response
          console.log('Import successful:', response);
          this.router.navigate(['/order-list']);
        },
        error: (err) => {
          console.error('Import failed:', err);
          let errorMessage = 'Import failed.';
          if (err.error instanceof Object && err.error.message) {
            errorMessage += ' ' + err.error.message
          } else if (typeof err.error === 'string') {
            errorMessage += ' ' + err.error; 
          } else if (err.message) {
            errorMessage += ' ' + err.message;
          }
          alert(errorMessage);
        },
      });
    }
  }
}
