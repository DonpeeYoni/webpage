import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  	providedIn: 'root'
})
export class EventService {

	private event = new Subject<any>();

	constructor() { }

	sendEvent(message: string) {
        this.event.next({ event: message });
    }

    sendEventWithParam(message: string, data: any) {
        this.event.next({ event: message, data: data });
    }
 
    clearEvent() {
        this.event.next();
    }
 
    getEvent(): Observable<any> {
        return this.event.asObservable();
    }
}
