import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OrderResponse } from 'src/api/model/order-model';
import { OrderService } from 'src/api/order.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.css'],
})
export class OrderListComponent implements OnInit {
  orders: OrderResponse[] = [];
  page: number = 0;
  limit: number = 10;
  totalPages = 0;
  totalCount = 0;
  paginationRange: number[] = [];
  search: string = '';
  snackBar: any;
  deleteOrderId?: number;
  showConfirmDialog = false;

  constructor(private orderService: OrderService,
    private router: Router) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getAllOrders(this.page, this.limit, this.search).subscribe(res => {
      this.orders = res.items;
      console.log(res)
      this.totalPages = res.totalPages;
      this.totalCount = res.totalCount;
      this.generatePagination();
    });
  }
  
  onPageChange(newPage: number) {
    if (newPage >= 0 && newPage < this.totalPages) {
      this.page = newPage;
      this.loadOrders();
    }
  }
  
  generatePagination() {
    const range: number[] = [];
  
    const maxVisible = 5;
    const start = Math.max(0, this.page - Math.floor(maxVisible / 2));
    const end = Math.min(this.totalPages, start + maxVisible);
  
    for (let i = start; i < end; i++) {
      range.push(i);
    }
  
    this.paginationRange = range;
  }

  confirmDeleteOrder(id: number | undefined): void {
    if (id !== undefined) {
      this.deleteOrderId = id;
      this.showConfirmDialog = true;
    }
  }

  confirmDelete(): void {
    if (this.deleteOrderId !== undefined) {
      this.orderService.deleteOrder(this.deleteOrderId).subscribe(() => {
        this.loadOrders();
        this.resetDialog();
      });
    }
  }

  cancelDelete(): void {
    this.resetDialog();
  }

  private resetDialog(): void {
    this.showConfirmDialog = false;
    this.deleteOrderId = undefined;
  }


  createOrder(): void {
    this.router.navigate(['/create-order']);
  }

  editOrder(id: number | undefined): void {
    if (id !== undefined) {
      this.router.navigate(['/edit-order', id]);
    }
  }

  private parseCSVData(csvData: string): OrderResponse[] {
    const lines = csvData.split('\n');
    const result: OrderResponse[] = [];
    const headers = lines[0].split(',');
    for (let i = 1; i < lines.length; i++) {
      const obj: any = {};
      const currentline = lines[i].split(',');
      for (let j = 0; j < headers.length; j++) {
        obj[headers[j].trim()] = currentline[j].trim();
      }
      result.push(obj as OrderResponse);
    }
    return result;
  }

  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.search = inputElement.value;
    this.page = 0;
    this.loadOrders();
  }
}
