import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from 'src/api/model/order-model';
import { OrderService } from 'src/api/order.service';
import * as XLSX from 'xlsx';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.css']
})
export class OrderDetailComponent implements OnInit {
  orderDetails: any;

  constructor(
    private route: ActivatedRoute,
    private orderService: OrderService
  ) { }

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const orderId = Number(idParam);
      this.orderService.getOrderById(orderId).subscribe({
        next: (data) => {
          console.log(data);
          this.orderDetails = data;
        },
        error: (err) => {
          console.error('Failed to load order details:', err);
        }
      });
    } else {
      console.error('Order ID parameter is missing in the route.');
    }
  }

  exportOrders() {
    this.orderService.exportToExcel().subscribe(response => {
      const blob = new Blob([response.body!], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });

      const contentDisposition = response.headers.get('Content-Disposition');
      const filename = contentDisposition
        ? contentDisposition.split('filename=')[1].replace(/"/g, '')
        : 'orders.xlsx';

      const link = document.createElement('a');
      const url = window.URL.createObjectURL(blob);
      link.href = url;
      link.download = filename;
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  // exportOrders2(): void {
  //   const worksheet = this.convertOrdersToWorksheet(this.orderDetails);
  //   const workbook: XLSX.WorkBook = {
  //     Sheets: { 'Order Details': worksheet },
  //     SheetNames: ['Order Details'],
  //   };
  //   const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

  //   const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', `order-${this.orderDetails.id}.xlsx`);
  //   link.style.visibility = 'hidden';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  // private convertOrdersToWorksheet(orderDetail: OrderResponse): XLSX.WorkSheet {
  //   const headers = ['ID', 'Customer Name', 'Phone Number', 'Address', 'Total Price', 'Order Items'];
  //   const values = [
  //     orderDetail.id,
  //     orderDetail.customerName,
  //     orderDetail.customerPhone,
  //     orderDetail.address,
  //     orderDetail.totalPrice,
  //     orderDetail.orderItems
  //       .map(item => `${item.productName} (${item.quantity} x $${item.productPrice})`)
  //       .join(', ')
  //   ];
  //   const data = [headers, values];

  //   return XLSX.utils.aoa_to_sheet(data);
  // }


  // exportOrders2(): void {
  //   const csvData = this.convertOrdersToCSV(this.orderDetails);
  //   const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  //   const link = document.createElement('a');
  //   const url = URL.createObjectURL(blob);
  //   link.setAttribute('href', url);
  //   link.setAttribute('download', `order-${this.orderDetails.id}.csv`);
  //   link.style.visibility = 'hidden';
  //   document.body.appendChild(link);
  //   link.click();
  //   document.body.removeChild(link);
  // }

  // private convertOrdersToCSV(orderDetail: OrderResponse): string {
  //   const headers = ['ID', 'Customer Name', 'Phone Number', 'Address', 'Total Price', 'Order Items'];
  //   const rows = [
  //     orderDetail.id,
  //     orderDetail.customerName,
  //     orderDetail.customerPhone,
  //     orderDetail.address,
  //     orderDetail.totalPrice,
  //     orderDetail.orderItems.map(item => `${item.productName} (${item.quantity} x $${item.productPrice})`).join(', ')
  //   ];
  //   return [headers, rows].map(e => e.join(',')).join('\n');
  // }
}
