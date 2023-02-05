import { Component, OnInit } from '@angular/core';
import { AuthFacadeService } from '@budget-tracker/auth';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent implements OnInit {
  constructor(private authFacade: AuthFacadeService) {}

  ngOnInit(): void {
    this.authFacade.initAuthState();
  }
}
