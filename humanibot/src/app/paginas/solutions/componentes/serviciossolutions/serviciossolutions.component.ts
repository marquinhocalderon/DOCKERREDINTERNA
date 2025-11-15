import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-serviciossolutions',
  imports: [CommonModule],
  templateUrl: './serviciossolutions.component.html',
  styleUrl: './serviciossolutions.component.scss'
})
export class ServiciossolutionsComponent {
  services = [
    {
      title: 'Inteligencia de negocios (Dashboards)',
      description: 'Power BI y reportes dinámicos para decisiones basadas en datos.',
      icon: '/icons/informes.png',
    },
    {
      title: 'Automatización de procesos (Bizagi)',
      description: 'Ingeniería de procesos y automatización RPA/Workflows.',
      icon: '/icons/procesos.png',
    },
    {
      title: 'Desarrollo de páginas estáticas',
      description: 'Landing pages y sitios estáticos optimizados y rápidos.',
      icon: '/icons/www.png',
    },
    {
      title: 'Desarrollo de software',
      description: 'Soluciones a medida: backend, APIs y sistemas empresariales.',
      icon: '/icons/api.png',
    },
    {
      title: 'Desarrollo de aplicaciones mobile',
      description: 'Apps nativas e híbridas con experiencia centrada en el usuario.',
      icon: '/icons/movil.png',
    },
    {
      title: 'Tesis y proyectos académicos de alto impacto',
      description: 'Transformamos tus ideas en investigaciones sólidas: desde la asesoría y redacción hasta el análisis de datos y desarrollo de software especializado.',
      icon: '/icons/tesis.png',
    }


  ];
}
