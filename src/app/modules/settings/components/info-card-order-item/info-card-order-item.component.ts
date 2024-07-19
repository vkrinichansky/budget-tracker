import { Component, Input, input } from '@angular/core';

@Component({
  selector: 'app-info-card-order-item',
  templateUrl: './info-card-order-item.component.html',
  styleUrl: './info-card-order-item.component.scss'
})
export class InfoCardOrderItemComponent {
  @Input() infoCardName: string;

}
