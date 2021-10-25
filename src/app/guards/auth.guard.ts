import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { DataService } from '../services/data.service';
import { LocalStorageService } from 'ngx-localstorage';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
	nextPagePath:any;
	constructor(public router: Router, private storage: LocalStorageService) { }
	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		// Guard for user is login or not
		this.nextPagePath = next.routeConfig?.path;
		return this.storage.asPromisable().get('USER').then((user:any) => {
			if( !user && this.nextPagePath == "register") {
				this.router.navigate(['register']);
				return true;
			}
			else if( !user && this.nextPagePath != "") {
				this.router.navigate(['']);
				return true;
			}
			else if(user && this.nextPagePath == "")
			{
				this.router.navigate(['delivery-order']);
				return true;
			}
			return true;
		});
	}
  
}
