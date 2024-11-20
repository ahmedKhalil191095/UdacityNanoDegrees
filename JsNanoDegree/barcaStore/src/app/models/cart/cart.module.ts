import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ]
})
export class CartModule {
  id: number
  name: string
  price: number
  url: string
  description: string
  quantity?: number
  totalAmount?: number

  constructor(){
    this.id = 1
    this.name = ''
    this.price = 0
    this.url = ''
    this.description = ''
    this.quantity = 0
    this.totalAmount = 0
  }
 }
