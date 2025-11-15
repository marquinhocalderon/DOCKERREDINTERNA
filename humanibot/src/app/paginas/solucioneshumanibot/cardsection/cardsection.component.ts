import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, QueryList, ViewChildren, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-cardsection',
  templateUrl: './cardsection.component.html',
  styleUrls: ['./cardsection.component.scss'],
  imports: [CommonModule, RouterLink]
})
export class CardsectionComponent implements AfterViewInit {

  servicios = [
    {
      titulo: 'Desarrollo Web Personalizado',
      beneficio: 'Tu sitio web único y adaptado a tus necesidades',
      descripcion: 'Creamos páginas web modernas, rápidas y optimizadas para SEO que reflejan la identidad de tu marca.',
      imagen: 'https://datos.gob.es/sites/default/files/styles/blog_image/public/blog/image/04_0.jpg?itok=36mEqWM2',
      urlInternal: '/desarrollo-web'
    },
    {
      titulo: 'Software a Medida',
      beneficio: 'Soluciones digitales adaptadas a tu negocio',
      descripcion: 'Desarrollamos sistemas y aplicaciones personalizadas que optimizan tus procesos y mejoran la eficiencia.',
      imagen: 'https://dazzet.co/wp-content/uploads/2023/10/a4c6c90d890f91fef57d1e4f095d665d4f12f910-1024x536-1.webp',
      urlInternal: '/software-a-medida'
    },
    {
      titulo: 'Redacción de Tesis',
      beneficio: 'Tesis completas listas para presentar',
      descripcion: 'Elaboramos tu tesis desde la investigación hasta la redacción final, asegurando coherencia y calidad en cada sección.',
      imagen: 'https://www.unach.edu.ec/wp-content/uploads/2018/05/enfoques-de-investigacion-y-redaccion-de-tesis.jpg',
      urlInternal: '/redaccion-de-tesis'
    },
    {
      titulo: 'Aplicaciones Móviles Profesionales',
      beneficio: 'Apps funcionales y adaptadas a tus necesidades',
      descripcion: 'Desarrollamos aplicaciones móviles para iOS y Android que ofrecen una experiencia de usuario excepcional.',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRnsaKsyoa6-_EbCKLnL5Kwo5rkCf4WT8jsAg&s',
      urlInternal: '/aplicaciones-moviles'
    },
    {
      titulo: 'Diseño Gráfico Creativo',
      beneficio: 'Identidad visual que comunica y vende',
      descripcion: 'Creamos logos, material publicitario y branding que capturan la esencia de tu marca y atraen a tu público objetivo.',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT27v7Xl37XECCtSbDeVwFnKd_H87PE5Edatg&s',
      urlInternal: '/diseno-grafico'
    },
    {
      titulo: 'Consultoría Académica',
      beneficio: 'Asesoramiento experto para tu tesis',
      descripcion: 'Te guiamos en la investigación, redacción y presentación de tu tesis, asegurando calidad y cumplimiento de estándares académicos.',
      imagen: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRP-yKGSazPHP33C_yn7N8BUnUfMzUjGp9FGg&s',
      urlInternal: '/consultoria-academica'
    },
    {
      titulo: 'Estrategia Digital',
      beneficio: 'Impulsa tu presencia online',
      descripcion: 'Desarrollamos estrategias de marketing digital personalizadas que aumentan tu visibilidad y atraen a tu público objetivo.',
      imagen: 'https://img.innovaciondigital360.com/wp-content/uploads/2023/09/22143102/Estrategia-digital.jpg',
      urlInternal: '/estrategia-digital'
    }
  ];


  @ViewChildren('card') cards!: QueryList<ElementRef>;
  visibleCards: boolean[] = [];

  ngAfterViewInit(): void {
    // Inicializar todas como no visibles
    this.visibleCards = new Array(this.servicios.length).fill(false);

    // Mostrar las primeras 2 cards al cargar la vista
    for (let i = 0; i < 2 && i < this.servicios.length; i++) {
      this.visibleCards[i] = true;
    }

    // Observer para fade-in al scroll
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const index = this.cards.toArray().findIndex(c => c.nativeElement === entry.target);
        if (entry.isIntersecting && index !== -1) {
          this.visibleCards[index] = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    this.cards.forEach(card => observer.observe(card.nativeElement));
  }
}