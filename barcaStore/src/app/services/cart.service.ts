import { Injectable } from '@angular/core';
import { CartModule } from '../models/cart/cart.module';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private items: CartModule[] = [];
  private cart = new Subject<CartModule[]>();

  constructor() { }

  addToCart(product: CartModule) {
    const existingProduct = this.items.find(item => item.id === product.id);
    if (!existingProduct) {
      this.items.push(product);
    } else {
      if(existingProduct.quantity !== undefined){
      existingProduct.quantity += product.quantity || 0;
      existingProduct.totalAmount = existingProduct.quantity * existingProduct.price;
    }
    }
    this.cart.next(this.items);
    alert('Item added to the Cart.');
  }

  remove_from_cart(product: CartModule) {
    const index = this.items.indexOf(product);
    if (index > -1) {
      this.items.splice(index, 1);
      this.cart.next(this.items);
      alert('Item removed from the Cart.');
    }
  }

  get_cart(): Observable<CartModule[]> {
    return this.cart.asObservable();
  }

  getTotal(): number {
    return this.items.reduce((sum, item) => sum + (item?.totalAmount || 0), 0);
  }

  getItems(): CartModule[] {
    return this.items
  }

  update_cart_info(items: CartModule[]) {
    items.map(item => { item.totalAmount = item.quantity ? item.quantity * item.price : 0; return item })
  }
  clearCart() {
    this.items = [];
    this.cart.next(this.items);
  }
}
