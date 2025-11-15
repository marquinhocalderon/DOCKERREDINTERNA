import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

@Component({
  selector: 'app-portadaprincipal',
  imports: [],
  templateUrl: './portadaprincipal.component.html',
  styleUrl: './portadaprincipal.component.scss'
})
export class PortadaprincipalComponent implements OnInit, AfterViewInit {

  isMobile = false;

  @ViewChild('videoPlayer', { static: false }) 
  videoPlayer!: ElementRef<HTMLVideoElement>;

  ngOnInit(): void {
    this.checkDevice();
  }

  private checkDevice(): void {
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
      .test(navigator.userAgent);
    console.log('isMobile:', this.isMobile);
  }

  ngAfterViewInit(): void {
    const video = this.videoPlayer.nativeElement;

    // Forzamos muted en el DOM
    video.muted = true;

    // Intentamos reproducir
    video.play().catch(err => {
      console.warn('Autoplay bloqueado:', err);
    });
  }

  scrollTo(fragment: string): void {
    const element = document.getElementById(fragment);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }

}