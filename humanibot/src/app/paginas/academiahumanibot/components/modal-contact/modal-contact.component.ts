import { Component } from '@angular/core';
import { ModalService } from '../../../../servicios/services/modal.service';

@Component({
  selector: 'app-modal-contact',
  imports: [],
  templateUrl: './modal-contact.component.html',
  styleUrl: './modal-contact.component.scss'
})
export class ModalContactComponent {

  constructor(public modalService: ModalService) {}

}
