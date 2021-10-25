import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { EventService } from 'src/app/services/event.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output()
  toggleSidebar = new EventEmitter<void>();

  public showMenuButtons = false;

  constructor(
    private router: Router,
    private eventService: EventService,
    private dataService: DataService
  ) {
    if (dataService.getToken()) {
      this.showMenuButtons = true;
    }
  }

  ngOnInit(): void {
    this.subscribeLogoutEvent();
  }

  logoutClick() {
    this.ToggleNavBar();
    this.showMenuButtons = false;
    this.dataService.clearStorage();
    this.router.navigate(['']);
  }
  loginClick()
  {
    this.ToggleNavBar();
    this.dataService.clearStorage();
    this.router.navigate(['']);
  }

  redirect(url: string) {
    this.router.navigate([url]);
  }

  subscribeLogoutEvent() {
    this.eventService.getEvent().subscribe((event) => {
      if (event.event === 'logout') {
        this.showMenuButtons = false;
      }
      else {
        this.showMenuButtons = true;
      }
    })
  }

  ToggleNavBar() {
    let element: HTMLElement = document.getElementsByClassName('navbar-toggler')[0] as HTMLElement;
    if (element.getAttribute('aria-expanded') == 'true') {
      element.click();
    }
  }

}
