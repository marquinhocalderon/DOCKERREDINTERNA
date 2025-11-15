import { CommonModule } from '@angular/common';
import { Component, AfterViewInit, ElementRef, ViewChild, HostListener } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as THREE from 'three';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss'],
  imports: [CommonModule, FormsModule]
})
export class GalleryComponent implements AfterViewInit {
  @ViewChild('canvas', { static: true }) canvas!: ElementRef<any>;

  diapositivas: any[] = [
    {
      titulo: "Beneficio #1: Soluciones personalizadas",
      descripcion: "Creamos sitios web y aplicaciones adaptadas a las necesidades de tu negocio.",
      imagen: "/img/bene1.png"
    },
    {
      titulo: "Beneficio #2: Optimización y velocidad",
      descripcion: "Nuestros desarrollos son rápidos, modernos y optimizados.",
      imagen: "/img/cohete.png"
    },
    {
      titulo: "Beneficio #3: SEO y visibilidad",
      descripcion: "Diseñamos pensando en buscadores.",
      imagen: "/img/seo.png"
    },
    {
      titulo: "Beneficio #4: Soporte y confiabilidad",
      descripcion: "Siempre disponibles para mantener tu proyecto.",
      imagen: "/img/soportep.png"
    },
    {
      titulo: "Beneficio #5: Innovación y creatividad",
      descripcion: "Diseños innovadores y únicos.",
      imagen: "/img/inovacion.jpeg"
    }
  ];

  private scene: any;
  private camera: any;
  private renderer: any;
  private group: any;
  private meshes: any[] = [];
  private slideWidth = 4;
  private gap = 1;
  private scroll = 0;
  private targetScroll = 0;

  private dragging = false;
  private startX = 0;

  autoSpeed = 0.008;
  activeIndex = 0;

  ngAfterViewInit(): void {
    this.initScene();
    document.body.style.cursor = 'grab';
  }

  private async initScene() {
    const canvas: any = this.canvas.nativeElement;
    this.renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.1, 100);
    this.camera.position.z = 8;

    this.group = new THREE.Group();
    this.scene.add(this.group);

    const light = new THREE.AmbientLight(0xffffff, 1);
    this.scene.add(light);

    const slides = [...this.diapositivas, ...this.diapositivas]; // duplicado para loop
    const geometry = new THREE.PlaneGeometry(this.slideWidth, 2.5);

    // Fallback texture (gris)
    const fallbackTexture = new THREE.TextureLoader().load("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8Xw8AAmkBffNpP0wAAAAASUVORK5CYII=");

    const loader = new THREE.TextureLoader();

    for (let i = 0; i < slides.length; i++) {
      const slide = slides[i];
      const material: any = new THREE.MeshBasicMaterial({ transparent: true, map: fallbackTexture });
      const mesh: any = new THREE.Mesh(geometry, material);

      try {
        const texture = await loader.loadAsync(slide.imagen);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        material.map = texture;
        material.needsUpdate = true;
      } catch (err) {
        console.warn(`⚠️ No se pudo cargar la imagen: ${slide.imagen}`, err);
      }

      mesh.position.x = i * (this.slideWidth + this.gap);
      mesh.userData = { index: i % this.diapositivas.length };
      this.group.add(mesh);
      this.meshes.push(mesh);
    }

    this.animate();
  }

  private animate = () => {
    requestAnimationFrame(this.animate);

    // Auto-scroll
    this.targetScroll += this.autoSpeed;

    // Suavizado
    this.scroll += (this.targetScroll - this.scroll) * 0.08;
    this.group.position.x = -this.scroll;

    const totalWidth = this.diapositivas.length * (this.slideWidth + this.gap);

    // Loop infinito + escala dinámica
    this.meshes.forEach((mesh: any) => {
      if (mesh.position.x + this.group.position.x < -totalWidth) mesh.position.x += totalWidth * 2;
      if (mesh.position.x + this.group.position.x > totalWidth) mesh.position.x -= totalWidth * 2;

      const distanceToCenter = Math.abs(mesh.position.x + this.group.position.x);
      const scale = 1 - Math.min(distanceToCenter / 10, 0.5);
      mesh.scale.set(scale, scale, 1);
    });

    // Detectar índice activo
    let closestDist = Infinity;
    this.meshes.forEach((mesh: any) => {
      const dist = Math.abs(mesh.position.x + this.group.position.x);
      if (dist < closestDist) {
        closestDist = dist;
        this.activeIndex = mesh.userData.index;
      }
    });

    this.renderer.render(this.scene, this.camera);
  };

  /** ================= INTERACCIÓN ================= */
  @HostListener('mousedown', ['$event'])
  onMouseDown(event: any) {
    this.dragging = true;
    this.startX = event.clientX;
    document.body.style.cursor = 'grabbing';
  }

  @HostListener('mouseup')
  onMouseUp() {
    this.dragging = false;
    document.body.style.cursor = 'grab';
  }

  @HostListener('mousemove', ['$event'])
  onMouseMove(event: any) {
    if (this.dragging) {
      const deltaX = event.clientX - this.startX;
      this.targetScroll -= deltaX * 0.02;
      this.startX = event.clientX;
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
