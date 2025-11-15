import { Component, computed, inject } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { MainComponent } from './components/main/main.component';
import { AbautComponent } from "./components/abaut/abaut.component";
import { SectionServiciosComponent } from './components/section-servicios/section-servicios.component';
import { SectionElergirnosComponent } from "./components/section-elergirnos/section-elergirnos.component";
import { SectionBeneficiosComponent } from "./components/section-beneficios/section-beneficios.component";
import { CTAComponent } from "./components/cta/cta.component";
import { ModalService } from '../../servicios/services/modal.service';
import { ModalContactComponent } from "./components/modal-contact/modal-contact.component";
import { FooterComponent } from '../../paginas/footer/footer.component';

@Component({
  selector: 'app-academiahumanibot',
  imports: [HeaderComponent, MainComponent, AbautComponent, SectionServiciosComponent, SectionElergirnosComponent, SectionBeneficiosComponent, CTAComponent, FooterComponent, ModalContactComponent],
  templateUrl: './academiahumanibot.component.html',
  styleUrl: './academiahumanibot.component.scss'
})
export class AcademiahumanibotComponent {
  constructor(public modalService: ModalService) { }

}
