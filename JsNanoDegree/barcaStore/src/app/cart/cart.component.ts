import { Component } from '@angular/core';
import { CartModule } from '../models/cart/cart.module';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  items: CartModule[] = this.cartService.getItems();
  orderTotal = this.cartService.getTotal();

  constructor(private cartService: CartService) { }

  remove_from_cart(item: CartModule) {
    this.cartService.remove_from_cart(item);
    this.orderTotal = this.cartService.getTotal();
  }

  update_quantity(qty: number, item: CartModule) {
    if(qty === 0) {
      this.remove_from_cart(item);
    }
    this.cartService.update_cart_info(this.items);
    this.orderTotal = this.cartService.getTotal();
  }
}
