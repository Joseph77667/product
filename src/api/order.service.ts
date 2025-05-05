import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from './model/order-model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/Product/assignment/order';

  constructor(private http: HttpClient) {}

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/create`, order);
  }
  
  // updateOrder(id: number, order: OrderRequest): Observable<OrderResponse> {
  //   return this.http.put<OrderResponse>(`${this.apiUrl}/update/${id}`, order);
  // }
  
  // getOrderById(id: number): Observable<OrderResponse> {
  //   return this.http.get<OrderResponse>(`${this.apiUrl}/details/${id}`);
  // }

  deleteOrder(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/deleteOrder/${id}`);
  }

  getOrderById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/details/${id}`);
  }
  
  updateOrder(orderId: number, updatedOrder: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/update/${orderId}`, updatedOrder);
  }
  
  getAllOrders(
    page: number = 0,
    limit: number = 10,
    search: string = ''
  ): Observable<{
    items: OrderResponse[]; totalCount: number, totalPages: number 
}> {
    return this.http.get<{ items: OrderResponse[], totalCount: number, totalPages: number }>(
      `${this.apiUrl}/findAll`,
      {
        params: {
          page: page.toString(),
          limit: limit.toString(),
          search,
        },
      }
    );
  }
  
  
  importOrders(formData: FormData ): Observable<any> {
    return this.http.post(`${this.apiUrl}/import`, formData);
  }

  exportToExcel() {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
      observe: 'response'
    });
  }

  downloadExcel() {
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
      observe: 'response'
    });
  }
  
}
