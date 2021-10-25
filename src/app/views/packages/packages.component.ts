import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { Browser } from '@capacitor/browser';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-packages',
  templateUrl: './packages.component.html',
  styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
  showLoading = true;
  formData:any = [];
  rootUrl = environment.trackingEndpoint;
  constructor(
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
    this.loadData();
  }

  loadData() {
    var obj = {
      "page": 1,
      "page_size": 10,
      "search_string": "",
      "sort_by": "created_at",
      "sorting_order": "desc",
      "status":-1
    }
    this.apiService.post('customer/getpackagelist',obj).subscribe((response: any) => {
      this.showLoading = false;
      if (response) {
        this.formData = response['data'];
      }
    }, (error: any) => {
      this.showLoading = false;
    }
    )
  }

  openUrl(url: string) {
    Browser.open({ url: url });
  }
}
