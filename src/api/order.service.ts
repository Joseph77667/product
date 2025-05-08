import { Injectable } from '@angular/core';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderRequest, OrderResponse } from './model/order-model';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:8080/Product/assignment/order';

  constructor(private http: HttpClient) { }

  createOrder(order: OrderRequest): Observable<OrderResponse> {
    return this.http.post<OrderResponse>(`${this.apiUrl}/create`, order);
  }

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

  importOrders(formData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/import`, formData);
  }

  exportToExcel(search: string = ''): Observable<HttpResponse<Blob>> {
    let params = new HttpParams();
    if (search) {
      params = params.set('search', search);
    }
    return this.http.get(`${this.apiUrl}/export`, {
      responseType: 'blob',
      observe: 'response',
      params: params,
    });
  }

  exportToExcel1(search: string = ''): Observable<HttpResponse<Blob>>{
    let param = new HttpParams();
    if (search){
      param = param.set('search', search);
    }
    return this.http.get(`${this.apiUrl}/exportExcel`,{
      responseType: 'blob',
      observe: 'response',
      params : param
    })
  }

}
