import { Component, AfterViewInit, ElementRef, ViewChild, OnDestroy, ChangeDetectorRef } from '@angular/core';
import * as THREE from 'three';
import { TweenMax, Power1 } from 'gsap';
import { Section1Component } from "./section1/section1.component";
import { CardsectionComponent } from './cardsection/cardsection.component';
import { StarwarthreeComponent } from "./starwarthree/starwarthree.component";
import { GalleryComponent } from "./gallery/gallery.component";
import { NuestrobotComponent } from '../../nuestrobot/nuestrobot.component';

@Component({
  selector: 'app-solucioneshumanibot',
  imports: [Section1Component, CardsectionComponent, NuestrobotComponent, StarwarthreeComponent, GalleryComponent],
  templateUrl: './solucioneshumanibot.component.html',
  styleUrl: './solucioneshumanibot.component.scss'
})
export class SolucioneshumanibotComponent implements AfterViewInit, OnDestroy {

  @ViewChild('canvasContainer', { static: true }) contenedorCanvas!: ElementRef;

  constructor(private cd: ChangeDetectorRef) { }

  renderer!: THREE.WebGLRenderer;
  camera!: THREE.PerspectiveCamera;
  escena!: THREE.Scene;
  ciudad!: THREE.Object3D;
  humo!: THREE.Object3D;
  barrio!: THREE.Object3D;

  raton = new THREE.Vector2();   // posición del mouse
  velocidadAnimacion = 0.001;
  crearAutoPos = true;

ngAfterViewInit() {
  this.iniciarThree();
  this.animar();

  // Overlay
  const overlay = document.getElementById('overlay');
  if(overlay){
    overlay.style.transition = 'opacity 1.5s ease';
    overlay.style.opacity = '0';
    setTimeout(() => overlay.remove(), 1600); 
  }

  // Event listeners
  window.addEventListener('resize', this.redimensionar.bind(this));
  window.addEventListener('mousemove', this.movimientoMouse.bind(this));

  // --- FORZAR DETECCIÓN PARA CARDS ---
  this.cd.detectChanges();
}



  ngOnDestroy(): void {
    window.removeEventListener('resize', this.redimensionar.bind(this));
    window.removeEventListener('mousemove', this.movimientoMouse.bind(this));
    this.renderer.dispose();
  }

  // ---------------- INICIALIZACIÓN ----------------
  iniciarThree() {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.contenedorCanvas.nativeElement.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(20, window.innerWidth / window.innerHeight, 1, 500);
    this.camera.position.set(0, 2, 14);

    this.escena = new THREE.Scene();
    this.ciudad = new THREE.Object3D();
    this.humo = new THREE.Object3D();
    this.barrio = new THREE.Object3D();

    // Fondo y niebla
    const colorFondo = 0x0a0a0a;
    this.escena.background = new THREE.Color(colorFondo);
    this.escena.fog = new THREE.Fog(colorFondo, 10, 16);

    this.inicializarCiudad();
    this.inicializarLuces();
    this.generarLineas();

    this.escena.add(this.ciudad);
    this.ciudad.add(this.humo);
    this.ciudad.add(this.barrio);
  }

  // ---------------- AJUSTE DE PANTALLA ----------------
  redimensionar() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  // ---------------- MOVIMIENTO DEL MOUSE ----------------
  movimientoMouse(event: MouseEvent) {
    this.raton.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.raton.y = -(event.clientY / window.innerHeight) * 2 + 1;
  }

  // ---------------- FUNCIONES AUXILIARES ----------------
  aleatorio(num = 8) { return -Math.random()*num + Math.random()*num; }

  // ---------------- CIUDAD ----------------
  inicializarCiudad() {
    const segmentos = 2;

    // Cubos del barrio
    for (let i = 0; i < 100; i++) {
      const geometria = new THREE.BoxGeometry(1, 0, 0, segmentos, segmentos, segmentos);
      const material = new THREE.MeshStandardMaterial({ color: 0xa78bfa, side: THREE.DoubleSide }); // amarillo
      const cubo = new THREE.Mesh(geometria, material);

      cubo.scale.y = 0.1 + Math.abs(this.aleatorio(8));
      cubo.scale.x = cubo.scale.z = 0.9 + this.aleatorio(0.1);
      cubo.position.x = Math.round(this.aleatorio());
      cubo.position.z = Math.round(this.aleatorio());
      cubo.position.y = 0.1;

      this.barrio.add(cubo);
    }

    // Suelo
    const materialSuelo = new THREE.MeshPhongMaterial({ color: 0x111111, side: THREE.DoubleSide, transparent: true, opacity: 0.9 });
    const geometriaSuelo = new THREE.PlaneGeometry(60, 60);
    const suelo = new THREE.Mesh(geometriaSuelo, materialSuelo);
    suelo.rotation.x = -Math.PI/2;
    suelo.position.y = -0.001;
    suelo.receiveShadow = true;
    this.ciudad.add(suelo);

    // Partículas de humo
    const materialHumo = new THREE.MeshToonMaterial({ color: 0xa78bfa, side: THREE.DoubleSide }); // amarillo
    const geometriaHumo = new THREE.CircleGeometry(0.01, 3);
    for (let h=0; h<300; h++){
      const particula = new THREE.Mesh(geometriaHumo, materialHumo);
      particula.position.set(this.aleatorio(5), this.aleatorio(5), this.aleatorio(5));
      particula.rotation.set(this.aleatorio(), this.aleatorio(), this.aleatorio());
      this.humo.add(particula);
    }
  }

  // ---------------- LUCES ----------------
  inicializarLuces() {
    const luzAmbiental = new THREE.AmbientLight(0xffffff, 2);
    const luzFrontal = new THREE.SpotLight(0xffffff, 5, 10);
    luzFrontal.position.set(5,5,5);
    luzFrontal.castShadow = true;

    const luzTrasera = new THREE.PointLight(0xffffff, 0.3);

    this.escena.add(luzAmbiental);
    this.ciudad.add(luzFrontal);
    this.escena.add(luzTrasera);
  }

  // ---------------- AUTOS ----------------
  crearAutos(tamano=2, posicion=20, color=0xa78bfa) { // amarillo
    const materialAuto = new THREE.MeshToonMaterial({ color, side: THREE.DoubleSide });
    const geometriaAuto = new THREE.BoxGeometry(1, tamano/40, tamano/40);
    const auto = new THREE.Mesh(geometriaAuto, materialAuto);

    const amplitud = 3;
    if(this.crearAutoPos){
      this.crearAutoPos=false;
      auto.position.x=-posicion;
      auto.position.z=this.aleatorio(amplitud);
      TweenMax.to(auto.position,3,{x:posicion,repeat:-1,yoyo:true,delay:this.aleatorio(3)});
    }else{
      this.crearAutoPos=true;
      auto.position.x=this.aleatorio(amplitud);
      auto.position.z=-posicion;
      auto.rotation.y=Math.PI/2;
      TweenMax.to(auto.position,5,{z:posicion,repeat:-1,yoyo:true,delay:this.aleatorio(3),ease:Power1.easeInOut});
    }

    auto.receiveShadow=true;
    auto.castShadow=true;
    auto.position.y=Math.abs(this.aleatorio(5));
    this.ciudad.add(auto);
  }

  generarLineas() { for(let i=0;i<60;i++){ this.crearAutos(0.1,20); } }

  // ---------------- ANIMACIÓN ----------------
  animar = () => {
    requestAnimationFrame(this.animar);

    this.ciudad.rotation.y -= ((this.raton.x*8)-this.camera.rotation.y)*this.velocidadAnimacion;
    this.ciudad.rotation.x -= ((-this.raton.y*2)-this.camera.rotation.x)*this.velocidadAnimacion;
    if(this.ciudad.rotation.x<-0.05) this.ciudad.rotation.x=-0.05;
    else if(this.ciudad.rotation.x>1) this.ciudad.rotation.x=1;

    this.humo.rotation.y +=0.01;
    this.humo.rotation.x +=0.01;

    this.camera.lookAt(this.ciudad.position);
    this.renderer.render(this.escena,this.camera);
  }

}

