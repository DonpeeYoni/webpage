import { Injectable } from '@angular/core';
import { LocalStorageService } from 'ngx-localstorage';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class DataService {
    token = "";
    constructor(
        private router: Router, 
        private storage: LocalStorageService) {
            this.setToken();
         }

    public setUser(data: any) {
        this.token = data['access_token'];
        this.storage.set('USER', data);
    }

    public setData(key:any,value:any) {
        this.storage.set(key, value);
    }
    public getData(key:any) {
        return this.storage.get(key);
    }
    
    public setToken() {
        var user = this.storage.get('USER');
        if(user)
        {
            this.token = user['access_token'];
        }
    }
    
    public getToken() {
        var user = this.storage.get('USER');
        if(user)
        {
            return this.token = user['access_token'];
        }
        else
        {
            this.router.navigate(['']);
        }
    }
    
    public clearStorage()
    {
        this.token = "";
        this.storage.clear();
    }
}
