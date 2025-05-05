import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderResponse } from 'src/api/model/order-model';
import { OrderService } from 'src/api/order.service';

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
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam !== null) {
      const orderId = Number(idParam);
      this.orderService.getOrderById(orderId).subscribe({
        next: (data) => {
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

  exportOrders(): void {
      const csvData = this.convertOrdersToCSV(this.orderDetails);
      const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `order-${this.orderDetails.id}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  
    private convertOrdersToCSV(orderDetail: OrderResponse): string {
      const headers = ['ID', 'Customer Name', 'Phone Number', 'Address', 'Total Price', 'Order Items'];
      const rows =[
        orderDetail.id,
        orderDetail.customerName,
        orderDetail.customerPhone,
        orderDetail.address,
        orderDetail.totalPrice,
        orderDetail.orderItems.map(item => `${item.productName} (${item.quantity} x $${item.productPrice})`).join(', ')
      ];
      return [headers, rows].map(e => e.join(',')).join('\n');
    }
}
