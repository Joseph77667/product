import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductComponent } from './products/product/product.component';
import { ProductDetailComponent } from './products/product-detail/product-detail.component';
import { NewProductComponent } from './products/new-product/new-product.component';
import { ProductFormComponent } from './products/product-form/product-form.component';
import { CreateOrderComponent } from './orders/create-order/create-order.component';
import { OrderListComponent } from './orders/order-list/order-list.component';
import { OrderDetailComponent } from './orders/order-detail/order-detail.component';
import { UpdateOrderComponent } from './orders/update-order/update-order.component';

const routes: Routes = [
  {
    path : "",
    redirectTo : "products",
    pathMatch : "full"
  },
  {
    path : "products",
    component : ProductComponent
  },
  {
    path : "products/edit/:id",
    component : ProductFormComponent
  },
  {
    path : "detail/:id",
    component :ProductDetailComponent
  },
  {
    path : "product/create",
    component : ProductFormComponent
  },
  { path: 'create-order',
     component: CreateOrderComponent
  },
  { path: 'order-list',
     component: OrderListComponent
  },
  {
    path : 'order/:id',
    component : OrderDetailComponent
  },
  {
    path: 'edit-order/:id',
    component: UpdateOrderComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
