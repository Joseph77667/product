import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ProductComponent } from './products/product/product.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { MenuComponent } from './menu/menu.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { CurrencyPipe } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { UpdateOrderComponent } from './orders/update-order/update-order.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';
import { ImportOrderComponent } from './orders/import-order/import-order.component';

@NgModule({
  declarations: [
    AppComponent,
    ProductComponent,
    ProductDetailComponent,
    MenuComponent,
    ProductFormComponent,
    CreateOrderComponent,
    OrderListComponent,
    OrderDetailComponent,
    UpdateOrderComponent,
    ConfirmDialogComponent,
    ImportOrderComponent,
    
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [CurrencyPipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
