import { Component } from '@angular/core';
import { ProductModule as Product } from './../../models/product/product.module';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent {
  products: Product[] = [];

  constructor(private productService: ProductService){}

  ngOnInit(): void {
    this.productService.get_products().subscribe(data => {
      this.products = data;
    })
  }


}
