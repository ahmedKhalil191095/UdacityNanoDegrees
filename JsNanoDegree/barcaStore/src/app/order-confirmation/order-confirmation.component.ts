import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CheckoutModule } from '../models/checkout/checkout.module';

@Component({
  selector: 'app-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.css']
})
export class OrderConfirmationComponent {
  fullName: string = '';
  orderTotal: number = 0;
  // order_total: any;
  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.route.queryParams.subscribe((data) => {
      this.fullName = data['user_name'];
      this.orderTotal = data['order_total'];
    });
  }
}
