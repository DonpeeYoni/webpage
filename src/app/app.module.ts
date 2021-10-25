import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { LoginFormComponent } from './views/login-form/login-form.component';
import { RegisterFormComponent } from './views/register-form/register-form.component';
import { HeaderComponent } from './views/header/header.component';
import { DeliveryOrderComponent } from './views/delivery-order/delivery-order.component';
import { HttpClientModule } from '@angular/common/http';
import { ClientSearchComponent } from './views/client-search/client-search.component';
import { PackagesComponent } from './views/packages/packages.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { NoWhitespaceDirective } from './directives/no-white-space';
import { IonicModule } from '@ionic/angular';
import { AlertComponent } from './components/alert/alert.component';
import { Camera } from '@ionic-native/Camera/ngx';
import { File } from '@ionic-native/file/ngx';

@NgModule({
  declarations: [
    NoWhitespaceDirective,
    AppComponent,
    LoginFormComponent,
    HeaderComponent,
    DeliveryOrderComponent,
    ClientSearchComponent,
    PackagesComponent,
    AlertComponent,
    RegisterFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgxLocalStorageModule.forRoot(),
    NgbModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBJDu6GtO8DI8krngyctftDrvi23oBtPr4',
      libraries: ['places']
    }),
    IonicModule.forRoot()
  ],
  entryComponents: [
    AlertComponent
  ],
  providers: [
    Camera,
    File,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
