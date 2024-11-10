import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutModule } from '../models/checkout/checkout.module';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-checkout-form',
  templateUrl: './checkout-form.component.html',
  styleUrls: ['./checkout-form.component.css'],
})
export class CheckoutFormComponent {
  @Input() orderTotal: number = 0;
  @Output() orderPlaced = new EventEmitter<CheckoutModule>(); // Output to send data back to parent

  name = '';
  address = '';
  card_number = '';

  constructor(private cartService: CartService, private router: Router) {}

  form_submit(): void {
    let order: CheckoutModule = {
      name: this.name,
      address: this.address,
      card_number: this.card_number,
      order_total: this.orderTotal,
    };

    // Emit the order to the parent component
    this.orderPlaced.emit(order);

    // Clear the form
    this.name = '';
    this.address = '';
    this.card_number = '';

    // Clear cart
    this.cartService.clearCart();

    // Navigate to order confirmation page
    this.router.navigate(['/order-confirmation'], { queryParams: { user_name: order.name, order_total: this.orderTotal } });
  }
}
