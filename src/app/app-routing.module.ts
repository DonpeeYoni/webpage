import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DeliveryOrderComponent } from './views/delivery-order/delivery-order.component';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { ClientSearchComponent } from './views/client-search/client-search.component';
import { PackagesComponent } from './views/packages/packages.component';
import { AuthGuard } from './guards/auth.guard';
import { RegisterFormComponent } from './views/register-form/register-form.component';


const routes: Routes = [
  { path: '', component: LoginFormComponent, canActivate: [AuthGuard] },
  { path: 'register', component: RegisterFormComponent },
  { path: 'delivery-order', component: DeliveryOrderComponent, canActivate: [AuthGuard] },
  { path: 'client-search', component: ClientSearchComponent, canActivate: [AuthGuard] },
  { path: 'packages', component: PackagesComponent, canActivate: [AuthGuard] }
];
@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
