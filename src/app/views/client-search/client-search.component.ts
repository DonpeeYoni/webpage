import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-client-search',
  templateUrl: './client-search.component.html',
  styleUrls: ['./client-search.component.scss']
})
export class ClientSearchComponent implements OnInit {
  formData: any = {};
  searched_customer_phone: string = "";
  showLoading = false;
  responseMessage = "";
  constructor(
    public apiService: ApiService
  ) { }

  ngOnInit(): void {
  }

  searchClick() {
    this.showLoading = true;
    var obj = {
      "page": 1,
      "page_size": 10,
      "search_string": this.searched_customer_phone,
      "sort_by": "created_at",
      "sorting_order": "desc"
    }
    this.apiService.post('customer/searchcustomers', obj).subscribe((response: any) => {
      this.showLoading = false;
      if (response && response['data']) {
        this.formData = response['data'][0];
        this.responseMessage = "";
      }
      else
      {
        this.formData = {};
        this.responseMessage = response['message'];
      }
    }, (error: any) => {
      this.showLoading = false;
    }
    )
  }
}
