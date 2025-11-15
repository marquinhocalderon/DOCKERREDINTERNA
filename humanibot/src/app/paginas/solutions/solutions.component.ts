import { Component } from '@angular/core';
import { CabeceraComponent } from './componentes/cabecera/cabecera.component';
import { MainComponent } from './componentes/main/main.component';
import { ServiciossolutionsComponent } from "./componentes/serviciossolutions/serviciossolutions.component";
import { NuestrobotComponent } from '../../nuestrobot/nuestrobot.component';
import { PorqueelegirnosComponent } from './componentes/porqueelegirnos/porqueelegirnos.component';
import { BeneficiosComponent } from "./componentes/beneficios/beneficios.component";
import { FooterComponent } from '../../paginas/footer/footer.component';

@Component({
  selector: 'app-solutions',
  imports: [CabeceraComponent, MainComponent, ServiciossolutionsComponent, NuestrobotComponent, PorqueelegirnosComponent, BeneficiosComponent, FooterComponent],
  templateUrl: './solutions.component.html',
  styleUrl: './solutions.component.scss'
})
export class SolutionsComponent {

}
