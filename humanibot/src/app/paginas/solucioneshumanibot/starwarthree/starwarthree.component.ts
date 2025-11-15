import { Component, ElementRef, OnDestroy, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import * as THREE from 'three';
import { ColladaLoader } from 'three/examples/jsm/loaders/ColladaLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-starwarthree',
  templateUrl: './starwarthree.component.html',
  styleUrls: ['./starwarthree.component.scss'],
  imports: [CommonModule]
})
export class StarwarthreeComponent implements OnInit, OnDestroy {

  @ViewChild('contenedorRenderer', { static: true }) contenedorRenderer!: ElementRef;

  public cargando: boolean = true;

  private escena!: THREE.Scene;
  private camara!: THREE.PerspectiveCamera;
  private renderizador!: THREE.WebGLRenderer;
  private controles!: OrbitControls;
  private mezcladorAnimacion!: THREE.AnimationMixer;
  private reloj = new THREE.Clock();

  constructor(private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.inicializarThree();
    this.animar();
  }

  ngOnDestroy(): void {
    this.renderizador.dispose();
    if (this.controles) this.controles.dispose();
  }

  private inicializarThree() {
    const contenedor = this.contenedorRenderer.nativeElement;
    const aspect = contenedor.clientWidth / contenedor.clientHeight;

    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    // Escena
    this.escena = new THREE.Scene();

    // Cámara adaptada a dispositivo
    this.camara = new THREE.PerspectiveCamera(isMobile ? 40 : 20, aspect, 1, 1000);
    if (isMobile) {
      this.camara.position.set(35, 30, -105);
    } else {
      this.camara.position.set(0, 30, -105);
    }

    // Renderizador
    this.renderizador = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderizador.setSize(contenedor.clientWidth, contenedor.clientHeight);
    contenedor.appendChild(this.renderizador.domElement);

    // Controles
    this.controles = new OrbitControls(this.camara, this.renderizador.domElement);
    this.controles.enableDamping = true;
    this.controles.enablePan = false;
    this.controles.maxPolarAngle = Math.PI / 2;
    this.controles.minDistance = isMobile ? 3 : 5;
    this.controles.maxDistance = isMobile ? 20 : 40;
    this.controles.target.set(0, 2, 0);
    this.controles.update();

    // Luces
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 0.6);
    this.escena.add(luzAmbiental);

    const luzDireccional = new THREE.DirectionalLight(0xffffff, 3);
    luzDireccional.position.set(1.5, 1, -1.5);
    this.escena.add(luzDireccional);

    // Opcional: cuadrícula
    const cuadrilla = new THREE.GridHelper(10, 20, 0xc1c1c1, 0x8d8d8d);
    this.escena.add(cuadrilla);

    // Cargar modelo Collada
    const cargador = new ColladaLoader();
    cargador.setResourcePath('/models/stormtrooper/');
    cargador.load(
      '/models/stormtrooper/stormtrooper.dae',
      (modelo: any) => {
        const avatar = modelo.scene;
        this.escena.add(avatar);

        if (modelo.animations && modelo.animations.length > 0) {
          this.mezcladorAnimacion = new THREE.AnimationMixer(avatar);
          this.mezcladorAnimacion.clipAction(modelo.animations[0]).play();
        }

        this.cargando = false;
        this.cdr.detectChanges();
      },
      undefined,
      (error) => {
        console.error('Error cargando el modelo:', error);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    );

    // Ajuste dinámico al cambiar tamaño / orientación
    window.addEventListener('resize', () => this.ajustarVentana());
  }

  private ajustarVentana() {
    const contenedor = this.contenedorRenderer.nativeElement;
    const width = contenedor.clientWidth;
    const height = contenedor.clientHeight;
    const aspect = width / height;

    const isMobile = window.innerWidth < 768 || aspect < 1;

    this.camara.aspect = aspect;
    this.camara.fov = isMobile ? 35 : 25;
    this.camara.updateProjectionMatrix();

    this.renderizador.setSize(width, height);
    this.renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  private animar = () => {
    requestAnimationFrame(this.animar);

    const delta = this.reloj.getDelta();
    if (this.mezcladorAnimacion) this.mezcladorAnimacion.update(delta);

    this.renderizador.render(this.escena, this.camara);
  }

      scrollTo(fragment: string) {
        const element = document.getElementById(fragment);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
