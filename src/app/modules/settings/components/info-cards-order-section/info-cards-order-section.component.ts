import { Component } from '@angular/core';

@Component({
  selector: 'app-info-cards-order-section',
  templateUrl: './info-cards-order-section.component.html',
  styleUrl: './info-cards-order-section.component.scss',
})
export class InfoCardsOrderSectionComponent {
  infoCards = ['income', 'expense', 'currentMonthBalance', 'fullBalance', 'accounts'];
}
