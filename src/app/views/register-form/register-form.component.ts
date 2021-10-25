import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import * as intlTelInput from 'intl-tel-input';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AlertComponent } from 'src/app/components/alert/alert.component';
import { Platform, ActionSheetController } from '@ionic/angular';
import { Camera, CameraOptions } from '@ionic-native/Camera/ngx';
import { File, IWriteOptions, FileEntry } from '@ionic-native/file/ngx';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrls: ['./register-form.component.scss']
})
export class RegisterFormComponent implements OnInit {
  showLoading = false;
  // formData: any = {};
  nineaImage: any = false;
  companyRegistrationImage: any = false;
  customerIdentityDocumentImage: any = false;
  // ../../../assets/images/yoni-logo.png
  nineaFile: any = "";
  companyRegistrationFile: any;
  customerIdentityDocumentFile: any;
  isMobile = false;

  croppedImagepath = "";
  isLoading = false;

  @ViewChild('phone_no')
  public phone_noElementRef!: ElementRef;
  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email_id: new FormControl('', Validators.required),
    phone: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required),
    confirm_password: new FormControl('', Validators.required),
    ninea: new FormControl(null),
    company_registration: new FormControl(null),
    customer_identity_document: new FormControl(null),
    accept: new FormControl(0, Validators.required),
    customer_type: new FormControl('1'),
  });

  constructor(
    private router: Router,
    public apiService: ApiService,
    private modalService: NgbModal,
    public platform: Platform,
    private camera: Camera,
    public actionSheetController: ActionSheetController,
    private file: File,
    private zone: NgZone
  ) {
    if (this.platform.is('android') || this.platform.is('ios')) {
      this.isMobile = true;
    }
    const formData = new FormData();
  }

  ngOnInit(): void {
    this.initializePhoneNo();
  }

  onFileChange(event: any, type: string) {
    let files: FileList = event.target.files;
    let file = files[0];
    if (type == 'ninea') {
      this.nineaFile = files[0];
    }
    else if (type == 'company_registration') {
      this.companyRegistrationFile = files[0];
    }
    else if (type == 'customer_identity_document') {
      this.customerIdentityDocumentFile = files[0];
    }
  }

  readFile(file: any, fieldName: string) {
    let reader = getFileReader();
    reader.onloadend = () => {
      const imgBlob = new Blob([reader.result], {
        type: file.type
      });
      if (fieldName == "ninea") {
        this.nineaFile = imgBlob;
      }
      else if (fieldName == "company_registration") {
        this.companyRegistrationFile = imgBlob;
      }
      else if (fieldName == "customer_identity_document") {
        this.customerIdentityDocumentFile = imgBlob;
      }
    };
    reader.readAsArrayBuffer(file);
  }

  // readFileToBase64(file: any, fieldName: string) {
  //   let reader = getFileReader();
  //   reader.onloadend = () => {
  //     setTimeout(() => {
  //       if (fieldName == "ninea") {
  //         this.nineaImage = reader.result;
  //       }
  //       else if (fieldName == "company_registration") {
  //         this.companyRegistrationImage = reader.result;
  //       }
  //       else if (fieldName == "customer_identity_document") {
  //         this.customerIdentityDocumentImage = reader.result;
  //       }
  //     },100)
  //   };
  //   reader.readAsDataURL(file);
  // }

  selectImage(type: any) {
    const options: CameraOptions = {
      quality: 50,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      destinationType: this.camera.DestinationType.FILE_URI,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    }
    this.camera.getPicture(options).then((imageData) => {
      imageData = 'file://' + imageData;
      this.file.resolveLocalFilesystemUrl(imageData).then((entry: any) => {
        entry.file((receivedFile: any) => {
          if (type == 'ninea') {
            this.zone.run(() => {
              this.nineaImage = true;
            });

            this.readFile(receivedFile, 'ninea');
            // this.readFileToBase64(receivedFile, 'ninea');
          }
          else if (type == 'company_registration') {
            this.zone.run(() => {
              this.companyRegistrationImage = true;
            });
            this.readFile(receivedFile, 'company_registration');
            // this.readFileToBase64(receivedFile, 'company_registration');
          }
          else if (type == 'customer_identity_document') {
            this.zone.run(() => {
              this.customerIdentityDocumentImage = true;
            });
            this.readFile(receivedFile, 'customer_identity_document');
            // this.readFileToBase64(receivedFile, 'customer_identity_document');
          }
        });
      });
    }, (err) => {
      // Handle error
    });
  }

  // async selectImage(type: any) {
  //   const actionSheet = await this.actionSheetController.create({
  //     header: "Select Image source",
  //     buttons: [{
  //       text: 'Load from Library',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.PHOTOLIBRARY, type);
  //       }
  //     },
  //     {
  //       text: 'Use Camera',
  //       handler: () => {
  //         this.pickImage(this.camera.PictureSourceType.CAMERA, type);
  //       }
  //     },
  //     {
  //       text: 'Cancel',
  //       role: 'cancel'
  //     }
  //     ]
  //   });
  //   await actionSheet.present();
  // }

  removeImage(type: any) {
    if (type == 'ninea') {
      this.nineaFile = "";
      this.nineaImage = false;

    }
    else if (type == 'company_registration') {
      this.companyRegistrationFile = "";
      this.companyRegistrationImage = false;
    }
    else if (type == 'customer_identity_document') {
      this.customerIdentityDocumentFile = "";
      this.customerIdentityDocumentImage = false;
    }
  }

  registerClick() {
    const formData = new FormData();
    var countryCode = '+' + window.intlTelInputGlobals.getInstance(document.querySelector("#phone_no")).getSelectedCountryData()['dialCode'];
    this.registerForm.value['phone'] = countryCode + this.registerForm.value['phone'];
    Object.keys(this.registerForm.value).forEach((key) => { formData.append(key, this.registerForm.value[key]) });
    if (this.nineaFile) {
      formData.set("ninea", this.nineaFile);
    }
    else {
      formData.delete('ninea');
    }
    if (this.companyRegistrationFile) {
      formData.set("company_registration", this.companyRegistrationFile);
    }
    else {
      formData.delete('company_registration');
    }
    if (this.customerIdentityDocumentFile) {
      formData.set("customer_identity_document", this.customerIdentityDocumentFile);
    }
    else {
      formData.delete('customer_identity_document');
    }
    this.showLoading = true;
    this.apiService.login('customer/register', formData).subscribe((response: any) => {
      this.showLoading = false;
      this.showAlert('Alert', response['message']);
      if (response['response_code'] == 201) {
        this.registerForm.reset();
        this.nineaImage = false;
        this.companyRegistrationImage = false;
        this.customerIdentityDocumentImage = false;
      }
    })
  }

  showAlert(title: string, message: string) {
    const modalRef = this.modalService.open(AlertComponent, { centered: true });
    modalRef.componentInstance.alert_title = title;
    modalRef.componentInstance.alert_content = message;
  }

  goToLoginClick() {
    this.router.navigate(['']);
  }

  initializePhoneNo() {
    setTimeout(() => {
      intlTelInput(this.phone_noElementRef.nativeElement, {
        separateDialCode: true
      });
      var phoneNumberInstance = window.intlTelInputGlobals.getInstance(this.phone_noElementRef.nativeElement);
      phoneNumberInstance.setCountry("sn");
    })
  }

}

export function getFileReader(): FileReader {
  const fileReader = new FileReader();
  const zoneOriginalInstance = (fileReader as any)["__zone_symbol__originalInstance"];
  return zoneOriginalInstance || fileReader;
}

