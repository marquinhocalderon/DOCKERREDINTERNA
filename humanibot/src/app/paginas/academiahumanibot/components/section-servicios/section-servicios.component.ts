import { Component } from '@angular/core';
import { ModalContactComponent } from "../modal-contact/modal-contact.component";
import { ModalService } from '../../../../servicios/services/modal.service';

@Component({
  selector: 'app-section-servicios',
  imports: [],
  templateUrl: './section-servicios.component.html',
  styleUrl: './section-servicios.component.scss'
})
export class SectionServiciosComponent {
  constructor(public modalService: ModalService) {}
}
