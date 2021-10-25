import { Component, OnInit, ViewChild, ElementRef, NgZone, ViewChildren, QueryList } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';
import * as intlTelInput from 'intl-tel-input';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-delivery-order',
  templateUrl: './delivery-order.component.html',
  styleUrls: ['./delivery-order.component.scss']
})
export class DeliveryOrderComponent implements OnInit {
  public latitude: number = 0;
  public longitude: number = 0;
  public zoom: number;
  public selectedAddressIndex = 0;
  // public address: string;
  private geoCoder!: google.maps.Geocoder;
  public formData: any = {};
  selectedRadio = 'trajet-simple';
  selectedDateTimeRadio = 'no-date-time';
  @ViewChild('single_address_search')
  public single_address_searchElementRef!: ElementRef;
  @ViewChildren('multiple_address_search')
  public multiple_address_searchElementRef!: QueryList<ElementRef>;
  @ViewChild('single_phone_no')
  public single_phone_noElementRef!: ElementRef;
  @ViewChildren('multiple_phone_no')
  public multiple_phone_no!: QueryList<ElementRef>;
  showLoading = false;
  showSearchLoading = false;
  // responseMessage = "";
  amountResponseMessage = "";
  searchClientResponseMessage = "";
  loadingIndex = 0;
  userObj: any = {};
  deliveryDate: any = {};
  deliveryTime: any = {};
  showPrice = true;
  minDeliveryDate = {year: new Date().getFullYear(), month: (new Date().getMonth()+1), day: new Date().getDate()};
  currentTimeStamp = new Date().getTime();

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private apiService: ApiService,
    private dataService: DataService,
    private modalService: NgbModal
  ) {
    this.setDestinationsDefaultArray();
    this.zoom = 0;
  }

  setDestinationsDefaultArray() {
    this.formData['package_type'] = '';
    this.formData['description'] = '';
    this.formData['destinations'] = [
      {
        'customer_name': '',
        'customer_phone_no': '',
        'customer_phone_code': '',
        'customer_address': '',
        'customer_email': '',
        'address_type': '',
        'latitude': 0,
        'longitude': 0,
      }
    ]
  }

  ngOnInit() {
    this.userObj = this.dataService.getData('USER');
    //load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      // this.setCurrentLocation();
      this.geoCoder = new google.maps.Geocoder;
      this.getCustomerLocation();
      this.initializeSingleAddressSearch();
      this.initializeSinglePhone();
    });



  }

  getCustomerLocation() {
    this.apiService.post('customer/getcustomergeolocation', {}).subscribe((response: any) => {
      if (response && response['data']) {
        this.latitude = response['data']['coordinates'][1];
        this.longitude = response['data']['coordinates'][0];
        this.formData['source_geolocation_latitude'] = this.latitude;
        this.formData['source_geolocation_longitude'] = this.longitude;
        this.getAddress(this.latitude, this.longitude, null, 'source');
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  getPackageAmount(clientLat: number, cientLng: number, index = 0) {
    var obj = {
      "source_geolocation_latitude": this.formData['source_geolocation_latitude'],
      "source_geolocation_longitude": this.formData['source_geolocation_longitude'],
      "destination_geolocation_latitude": clientLat,
      "destination_geolocation_longitude": cientLng,
      "weight_class": ""
    }
    this.apiService.post('customer/getpackageamount', obj).subscribe((response: any) => {
      if (response && response['data']) {
        this.amountResponseMessage = "";
        this.formData['destinations'][index]['amount'] = response['data']['amount'];
        this.formData['destinations'][index]['currency'] = response['data']['currency'];
      }
      else {
        this.amountResponseMessage = response['message'];
      }
    }, (error: any) => {
      console.log(error);
    });
  }

  initializeSinglePhone() {
    setTimeout(() => {
      intlTelInput(this.single_phone_noElementRef.nativeElement, {
        separateDialCode: true
      });
      var phoneNumberInstance = window.intlTelInputGlobals.getInstance(this.single_phone_noElementRef.nativeElement);
      phoneNumberInstance.setCountry("sn");
    })
  }

  initializeSingleAddressSearch() {
    var options = {
      componentRestrictions: { country: "sn" }
    };
    let autocomplete = new google.maps.places.Autocomplete(this.single_address_searchElementRef.nativeElement, options);
    autocomplete.addListener("place_changed", () => {
      this.ngZone.run(() => {
        //get the place result
        let place: google.maps.places.PlaceResult = autocomplete.getPlace();

        //verify result
        if (place.geometry === undefined || place.geometry === null) {
          return;
        }

        // if (this.findCity(place.address_components) != 'dakar') {
        //   window.alert("L'emplacement sélectionné est hors de la ville de Dakar.");
        //   return;
        // }

        //set latitude, longitude and zoom
        this.latitude = place.geometry.location.lat();
        this.longitude = place.geometry.location.lng();
        this.getPackageAmount(this.latitude, this.longitude, 0);
        this.formData['destinations'][0]['latitude'] = this.latitude;
        this.formData['destinations'][0]['longitude'] = this.longitude;
        this.formData['destinations'][0]['customer_address'] = place.formatted_address;
        this.zoom = 12;
      });
    });
  }

  initializeMultiplePhone() {
    setTimeout(() => {
      var elementsArray = this.multiple_phone_no.toArray();
      elementsArray.forEach((element, index) => {
        var phoneNumberInstance = window.intlTelInputGlobals.getInstance(element.nativeElement);
        if (!phoneNumberInstance) {
          intlTelInput(element.nativeElement, {
            separateDialCode: true
          });
          window.intlTelInputGlobals.getInstance(element.nativeElement).setCountry("sn");
        }
      });
    })
  }

  initializeMultipleAddressSearch() {
    var options = {
      componentRestrictions: { country: "sn" }
    };
    var elementsArray = this.multiple_address_searchElementRef.toArray();
    elementsArray.forEach(element => {
      let autocomplete = new google.maps.places.Autocomplete(element.nativeElement, options);
      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          //get the place result
          let place: google.maps.places.PlaceResult = autocomplete.getPlace();

          //verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          // if (this.findCity(place.address_components) != 'dakar') {
          //   window.alert("L'emplacement sélectionné est hors de la ville de Dakar.");
          //   return;
          // }

          //set latitude, longitude and zoom
          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          this.getPackageAmount(this.latitude, this.longitude, this.selectedAddressIndex);
          this.formData['destinations'][this.selectedAddressIndex]['latitude'] = this.latitude;
          this.formData['destinations'][this.selectedAddressIndex]['longitude'] = this.longitude;
          this.formData['destinations'][this.selectedAddressIndex]['customer_address'] = place.formatted_address;
          this.zoom = 12;
        });
      });
    })
  }

  findCity(address_components: any) {
    var cityName = "";
    address_components.forEach((item: any) => {
      if (item['types'].indexOf("locality") > -1) {
        cityName = item.long_name.toLowerCase();
      }
    })
    return cityName;
  }

  private setCurrentLocation() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 8;
        this.formData['source_geolocation_latitude'] = this.latitude;
        this.formData['source_geolocation_longitude'] = this.longitude;
        this.getAddress(this.latitude, this.longitude, 0, 'source');
      });
    }
  }

  getAddress(latitude: number, longitude: number, index: any = 0, type = 'destination') {
    this.geoCoder.geocode({ 'location': { lat: latitude, lng: longitude } }, (results, status) => {
      if (status === 'OK') {
        if (results[0]) {
          if (type == 'source') {
            setTimeout(() => {
              this.formData['source_customer_address'] = results[0].formatted_address;
            });
          }
          else {
            this.zoom = 12;
            setTimeout(() => {
              this.formData['destinations'][index]['customer_address'] = results[0].formatted_address;
            });
          }
        } else {
          window.alert('No results found');
        }
      } else {
        window.alert('Geocoder failed due to: ' + status);
      }

    });
  }

  submitDeliveryOrder(type: string) {
    var obj = JSON.parse(JSON.stringify(this.formData));
    obj = this.jsonFormatting(obj, type);
    obj['source_customer_name'] = this.userObj['user_name'];

    obj['destination_geolocation_latitude'] = obj['destinations'][0]['latitude'];
    obj['destination_geolocation_longitude'] = obj['destinations'][0]['longitude'];
    obj['destination_customer_name'] = obj['destinations'][0]['customer_name'];
    obj['destination_customer_phone'] = obj['destinations'][0]['customer_phone'];
    obj['destination_customer_address'] = obj['destinations'][0]['customer_address'];
    obj['package_type'] = '605ce4f1e4a3190e4c5a0702';
    // obj['destinations'].splice(0,1);

    this.currentTimeStamp = new Date().getTime();
    if(obj['package_delivery_time'] && (obj['package_delivery_time'] > 0) && (obj['package_delivery_time'] <= this.currentTimeStamp)){
      alert("Please select time greater than the current time");
      return;
    }
    this.showLoading = true;
    // this.responseMessage = "";
    this.apiService.post('customer/createpackage', obj).subscribe((response: any) => {
      this.showLoading = false;
      if (response && response['response_code'] != 400) {
        this.showAlert('ALERTE',response['message']);
        // this.responseMessage = response['message'];
        this.formData['description'] = '';
        this.setDestinationsDefaultArray();
        this.selectedDateTimeRadio = 'no-date-time';
        setTimeout(() => {
          if (type == 'single') {
            this.initializeSingleAddressSearch();
            this.initializeSinglePhone();
          }
          else {
            this.initializeMultipleAddressSearch();
            this.initializeMultiplePhone();
          }
        });
      }
      else {
        this.showAlert('ALERTE',response['message']);
        // this.responseMessage = response['message'];
      }
    }, (error: any) => {
      this.showLoading = false;
      console.log(error);
    })
  }

  jsonFormatting(obj: any, type: string) {

    if (this.selectedDateTimeRadio == 'date-time') {
      obj['package_delivery_time_type'] = 1;
      obj['timezone'] = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (this.deliveryDate && this.deliveryTime) {
        let seconds = this.deliveryTime['seconds'];
        if(this.deliveryTime.hasOwnProperty('second')){
          seconds = this.deliveryTime['second'];
        }
        obj['package_delivery_time'] = new Date(this.deliveryDate['year'], this.deliveryDate['month'] - 1, this.deliveryDate['day'], this.deliveryTime['hour'], this.deliveryTime['minute'], seconds).getTime();
      }
    }
    else {
      obj['package_delivery_time_type'] = 0;
    }

    obj['destinations'].forEach((item: any, index: any) => {
      if (type == 'single') {
        item['customer_phone_code'] = window.intlTelInputGlobals.getInstance(document.querySelector("#customer_single_phone_no" + index)).getSelectedCountryData()['dialCode'];
      }
      else if (type == 'multiple') {
        item['customer_phone_code'] = window.intlTelInputGlobals.getInstance(document.querySelector("#customer_multiple_phone_no" + index)).getSelectedCountryData()['dialCode'];
      }
      item['customer_phone'] = "+" + item['customer_phone_code'] + item['customer_phone_no'];
      delete item['customer_phone_code'];
      delete item['customer_phone_no'];
    });
    return obj;
  }


  radioChange(event: any, value: string) {
    // this.responseMessage = "";
    this.amountResponseMessage = "";
    this.searchClientResponseMessage = "";
    this.selectedDateTimeRadio = 'no-date-time';
    if (value == 'trajet-simple') {
      this.formData['multidestination'] = 0;
      this.setDestinationsDefaultArray();
      setTimeout(() => {
        this.initializeSinglePhone();
        this.initializeSingleAddressSearch();
      });
    }
    else {
      this.formData['multidestination'] = 1;
      this.setDestinationsDefaultArray();
      setTimeout(() => {
        this.initializeMultipleAddressSearch();
        this.initializeMultiplePhone();
      });
    }
  }
  dateTimeRadioChange(event: any, value: string) {
    this.selectedDateTimeRadio = value;
    if (value == 'date-time') {
      this.deliveryTime['hour'] = new Date().getHours();
      this.deliveryTime['minute'] = new Date().getMinutes();
      this.deliveryTime['seconds'] = 0;

      this.deliveryDate['day'] = new Date().getDate();
      this.deliveryDate['month'] = new Date().getMonth() + 1;
      this.deliveryDate['year'] = new Date().getFullYear();
    }
  }

  selectedAddress(item: any, index: number) {
    this.selectedAddressIndex = index;
  }

  addClient() {
    this.formData['destinations'].push({
      'customer_name': '',
      'customer_phone_no': '',
      'customer_phone_code': '',
      'customer_address': '',
      'customer_email': '',
      'address_type': '',
      'latitude': 0,
      'longitude': 0,
    });
    setTimeout(() => {                           //<<<---using ()=> syntax
      this.initializeMultipleAddressSearch();
      this.initializeMultiplePhone();
    });
  }
  removeClient(index: number) {
    this.formData['destinations'].splice(index, 1);
    setTimeout(() => {                           //<<<---using ()=> syntax
      this.initializeMultipleAddressSearch();
    });
  }

  searchClick(type: string, searched_customer_phone_no: any, index: number) {
    if (!searched_customer_phone_no) {
      return;
    }
    var searched_customer_phone_code = "";
    if (type == 'single') {
      searched_customer_phone_code = window.intlTelInputGlobals.getInstance(document.querySelector("#customer_single_phone_no" + index)).getSelectedCountryData()['dialCode'];
    }
    else if (type == 'multiple') {
      searched_customer_phone_code = window.intlTelInputGlobals.getInstance(document.querySelector("#customer_multiple_phone_no" + index)).getSelectedCountryData()['dialCode'];
    }
    this.loadingIndex = index;
    this.showSearchLoading = true;
    var obj = {
      "page": 1,
      "page_size": 1,
      "phone_number": "+" + searched_customer_phone_code + searched_customer_phone_no,
      "sort_by": "created_at",
      "sorting_order": "desc"
    }
    this.apiService.post('customer/getdestinationaddressesusingphonenumber', obj).subscribe((response: any) => {
      this.showSearchLoading = false;
      if (response && response['data'] && response['data'][0]) {
        var clientData = response['data'][0];
        this.latitude = clientData['destination_geolocation_latitude'];
        this.longitude = clientData['destination_geoloation_longitude'];
        this.formData['destinations'][index]['customer_name'] = clientData['destination_customer_name'];
        this.formData['destinations'][index]['latitude'] = clientData['destination_geolocation_latitude'];
        this.formData['destinations'][index]['longitude'] = clientData['destination_geoloation_longitude'];
        this.getAddress(clientData['destination_geolocation_latitude'], clientData['destination_geoloation_longitude'], index);
        this.getPackageAmount(this.latitude, this.longitude, index);
        // this.formData['destinations'][index]['customer_address'] = clientData['destination_customer_address'];
        // this.responseMessage = "";
        this.amountResponseMessage = "";
        this.searchClientResponseMessage = "";
      }
      else {
        // this.responseMessage = "";
        this.amountResponseMessage = "";
        this.searchClientResponseMessage = "Le client n'existe pas.";
        this.formData['destinations'][index]['customer_name'] = "";
        this.formData['destinations'][index]['customer_address'] = "";
        this.formData['destinations'][index]['latitude'] = 0;
        this.formData['destinations'][index]['longitude'] = 0;
        this.formData['destinations'][index]['amount'] = null;
        this.formData['destinations'][index]['currency'] = null;
      }
    }, (error: any) => {
      this.showSearchLoading = false;
    }
    )
  }

  resetAmount(item: any, index: number) {
    item['amount'] = null;
  }

  amountValid() {
    var flag = true;
    this.formData['destinations'].forEach((item: any) => {
      if (!item['amount']) {
        flag = false;
      }
    });
    return flag;
  }

  showAlert(title:string,message:string)
  {
    const modalRef = this.modalService.open(AlertComponent, { centered: true });
    modalRef.componentInstance.alert_title = title;
    modalRef.componentInstance.alert_content = message;
  }
}
