import { Component, Input } from '@angular/core';
import { ProductModule } from './../../models/product/product.module';
import { CartModule } from 'src/app/models/cart/cart.module';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.css'],
})
export class ProductItemComponent {
  @Input() product: ProductModule;
  quantity: number = 1;

  constructor(private cartService: CartService) {
    this.product = {
      id: 1,
      name: '',
      price: 0,
      url: '',
      description: '',
    };
  }

  addToCart(cart: CartModule) {
    cart.quantity = this.quantity
    cart.totalAmount = this.quantity * cart.price
    this.cartService.addToCart(cart);
  }
}
