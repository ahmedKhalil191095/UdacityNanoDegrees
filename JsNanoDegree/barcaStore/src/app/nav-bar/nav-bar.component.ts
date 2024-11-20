import { Component } from '@angular/core';
import { CartService } from '../services/cart.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.css']
})
export class NavBarComponent {
   itemsTotal: number = 0;

   constructor(private cartService: CartService){
    this.cartService.get_cart().subscribe(cart =>{
      this.itemsTotal = cart.length;
    })
   }
}
