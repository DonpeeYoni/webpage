import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/services/data.service';
import { ApiService } from 'src/app/services/api.service';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { Browser } from '@capacitor/browser';
@Component({
  selector: 'app-login-form',
  templateUrl: './login-form.component.html',
  styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
  showLoading = false;
  responseMessage = "";
  formData: any = {};
  constructor(
    public dataService: DataService,
    public apiService: ApiService,
    private router: Router,
    private eventService: EventService) { }
  
  ngOnInit(): void {
    this.responseMessage = "";
  }

  loginClick() {
    this.showLoading = true;
    this.apiService.login('customer/login', this.formData).subscribe((response: any) => {
      this.showLoading = false;
      if (response && response['data']) {
        this.dataService.setUser(response['data']);
        this.router.navigate(['/delivery-order']);
        this.eventService.sendEvent('login');
      }
      else {
        this.responseMessage = response['message'];
      }
    }, (error: any) => {
      this.showLoading = false;
    })

  }
  goToRegisterClick()
  {
    this.router.navigate(['/register']);
  }
  openUrl(url: string) {
    Browser.open({ url: url });
  }
}
