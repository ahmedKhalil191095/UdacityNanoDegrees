import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ProductListComponent } from './products/product-list/product-list.component';
import { CartComponent } from './cart/cart.component';
import { ProductItemDetailComponent } from './products/product-item-detail/product-item-detail.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { OrderConfirmationComponent } from './order-confirmation/order-confirmation.component';

const routes: Routes = [
  { title: 'Home', path: '', component: ProductListComponent },
  { title: 'Products', path: 'products', component: ProductListComponent },
  { title: 'Product Item', path: 'product/:productId', component: ProductItemDetailComponent },
  { title: 'Cart', path: 'cart', component: CartComponent },
  { title: 'Checkout', path: 'checkout', component: CheckoutFormComponent },
  { title: 'Order Confirmation', path: 'order-confirmation', component: OrderConfirmationComponent }
];

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
