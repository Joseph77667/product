import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProductRequest, ProductResponse, PaginationResponse } from './model/type'; // Make sure the path is correct

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/Product/assignment/product'; 

  constructor(private http: HttpClient) {}

  // Create product
  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.baseUrl}/create`, formData);
  }

  // Get all products
  // getAllProducts1(page: number = 0, size: number = 8): Observable<ProductResponse[]> {
  //   const params = { page: page.toString(), size: size.toString() };
  //   return this.http.get<ProductResponse[]>(`${this.baseUrl}/findAll`, { params });
  // }  
  getAllProducts(page: number, limit: number, searchValue: string = '') {
    return this.http.get<any>(`${this.baseUrl}/findWithPager`, {
      params: {
        page,
        limit,
        search: searchValue
      }
    });
  }
  

  getAllProducts1(page: number = 0, size: number = 6): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
      
    return this.http.get<any>(`${this.baseUrl}/findAll`, { params });
  }

  // Get product by ID
  getProductById(id: number): Observable<ProductResponse> {
    return this.http.get<ProductResponse>(`${this.baseUrl}/details/${id}`);
  }

  // Update product
  updateProduct(id: number, formData: FormData): Observable<ProductResponse> {
    return this.http.put<ProductResponse>(`${this.baseUrl}/update/${id}`, formData);
  }

  // Delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/deleteProduct/${id}`);
  }

  // Get products with pagination
  getProductsWithPager(page: number, limit: number, search?: string): Observable<PaginationResponse> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('limit', limit.toString());

    if (search) {
      params = params.set('search', search);
    }
    return this.http.get<PaginationResponse>(`${this.baseUrl}/findWithPager`, { params });
  }
}
