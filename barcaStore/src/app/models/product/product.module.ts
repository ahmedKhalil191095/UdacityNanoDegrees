import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class ProductModule {
  id: number;
  name: string;
  price: number;
  url: string;
  description: string;

  constructor() {
    this.id = 1;
    this.name = '';
    this.price = 0;
    this.url = '';
    this.description = '';
  }
 }
