import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { catchError, debounceTime, distinctUntilChanged, Observable, of, switchMap } from 'rxjs';
import { ProductRequest, ProductResponse, PaginationResponse } from './model/type';
import { FormControl } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/Product/assignment/product'; 

  constructor(private http: HttpClient) {}

  createProduct(formData: FormData): Observable<ProductResponse> {
    return this.http.post<ProductResponse>(`${this.baseUrl}/create`, formData);
  }

  getAllProducts1(search: string = ''): Observable<ProductResponse[]> {
    const params = new HttpParams().set('query', search);
    return this.http.get<ProductResponse[]>(`${this.baseUrl}/findAll`, { params }).pipe(
      catchError(() => of([])) 
    );
  }

  createSearchStream(searchControl: FormControl): Observable<ProductResponse[]> {
    return searchControl.valueChanges.pipe(
      debounceTime(300),        // Wait 300ms after keystroke
      distinctUntilChanged(),    // Only emit if value changed
      switchMap(query => 
        this.getAllProducts1(query) // Call your existing service method
      )
    );
  }
  
  getAllProducts(page: number, limit: number, searchValue: string = '') {
    return this.http.get<any>(`${this.baseUrl}/findWithPager`, {
      params: {
        page,
        limit,
        search: searchValue
      }
    });
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
  // getProductsWithPager(page: number, limit: number, search?: string): Observable<PaginationResponse> {
  //   let params = new HttpParams()
  //     .set('page', page.toString())
  //     .set('limit', limit.toString());

  //   if (search) {
  //     params = params.set('search', search);
  //   }
  //   return this.http.get<PaginationResponse>(`${this.baseUrl}/findWithPager`, { params });
  // }
}

