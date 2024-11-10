import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {HttpClient} from '@angular/common/http'
import { ProductModule as Product } from '../models/product/product.module';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  product: Product = new Product;

  constructor(private http: HttpClient) { }

  get_products(): Observable<Product[]> {
    return this.http.get<Product[]>('../../assets/data.json');
  }
}
