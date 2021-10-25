import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})

export class AlertComponent implements OnInit {
  @Input() alert_title:string;
  @Input() alert_content:string;
  constructor(public activeModal: NgbActiveModal) { }

  ngOnInit(): void {
  }

}
