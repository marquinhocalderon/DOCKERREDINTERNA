import { Component } from '@angular/core';
import { ModalService } from '../../../../servicios/services/modal.service';

@Component({
  selector: 'app-cta',
  imports: [],
  templateUrl: './cta.component.html',
  styleUrl: './cta.component.scss'
})
export class CTAComponent {
  constructor(public modalService: ModalService) { }
}
