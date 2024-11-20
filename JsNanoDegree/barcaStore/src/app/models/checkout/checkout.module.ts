import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [],
  imports: [CommonModule],
})
export class CheckoutModule {
  name: string;
  address: string;
  card_number: string;
  order_total: number;

  constructor() {
    this.name = '';
    this.address = '';
    this.card_number = '';
    this.order_total = 0;
  }
}
