import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
// import { EventService } from './event.service';
import { Observable } from 'rxjs';
import { DataService } from './data.service';

@Injectable({
  	providedIn: 'root'
})
export class ApiService {

	private token: any;

	constructor(private http: HttpClient, private dataService: DataService) { 
	}

	login(method: string, params: any) {
		return this.http.post( this.prepareApiLink(method), params );
	}

	post(method: string, params: any) {
		this.token = this.dataService.getToken();
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token}`);
			params['access_token'] = this.token;
			this.http.post( this.prepareApiLink(method), params, { headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					// this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	postForm(method: string, params: any) {
		this.token = this.dataService.getToken();
		const observable = new Observable((observer) => {
			const formData = new FormData();
			let httpOptions = {
				headers: new HttpHeaders({
					'Content-Type': 'multipart/form-data; charset=UTF-8'
				})
			};
			var paramKeys = Object.keys(params);
			Object.keys(params).forEach(key=>{
				if(key!= 'destinations')
				{
					formData.append(key,params[key]);
				}
			})
			params.destinations.forEach((field:any,index:any) => {
				// formData.append(field,params[]);
				Object.keys(field).forEach((key:any)=>{
					formData.append('destinations['+index+']['+key+']',field[key]);
				});
			});
			console.log(formData);
			formData.append('access_token',this.token);
			// const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token}`);
			this.http.post( this.prepareApiLink(method), formData, httpOptions ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					// this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	postFile(method: string, file: any) {
		this.token = this.dataService.getToken();
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token}`);
			headers.append('Content-Type', 'multipart/form-data');

			let formData:FormData = new FormData();
			formData.append('file', file, file.name);

			this.http.post( this.prepareApiLink(method), formData, { headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					// this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	get(method: string, params: any) {
		this.token = this.dataService.getToken();
		const observable = new Observable((observer) => {
			const headers = new  HttpHeaders().set("Authorization", `Bearer ${this.token}`);
			this.http.get( this.prepareApiLink(method), { params: params, headers: headers } ).toPromise().then((response) => {
				observer.next(response);
			}).catch((error) => {
				if( error.status == 401 ) {
					// Invalid Token
					// this.eventService.sendEvent('logout');
				}
				observer.error(error);
			});
		});
		return observable;
	}

	prepareApiLink(method: string) {
		return environment.apiEndpoint + method;
	}
}
