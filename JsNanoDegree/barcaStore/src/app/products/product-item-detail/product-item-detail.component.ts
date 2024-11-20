import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from 'src/app/services/product.service';
import { ProductModule as Product } from './../../models/product/product.module';
import { CartModule } from 'src/app/models/cart/cart.module';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item-detail',
  templateUrl: './product-item-detail.component.html',
  styleUrls: ['./product-item-detail.component.css']
})
export class ProductItemDetailComponent {
  product: Product = new Product;
  products: Product[] = [];
  quantity: number = 1;

  constructor(private productService: ProductService,private route: ActivatedRoute,private cartService: CartService){}

  ngOnInit() {
    this.productService.get_products().subscribe(prods => {
      this.products = prods;

      this.route.params.subscribe(params => {
        const id = params['productId'];
        console.log(params)
        let prod = this.getProductById(id);
        if(prod){
          this.product = prod;
        }
      });
    })
  }

  getProductById(id: number) {
    return this.products.find(product => product.id === +id);
  }

  addToCart(cart: CartModule) {
    cart.quantity = this.quantity
    cart.totalAmount = this.quantity * cart.price
    this.cartService.addToCart(cart);
  }
}
