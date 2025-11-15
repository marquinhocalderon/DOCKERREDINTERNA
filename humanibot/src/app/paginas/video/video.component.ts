import { Component, ElementRef, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';

@Component({
  selector: 'app-video',
  imports: [ButtonModule, RippleModule],
  templateUrl: './video.component.html',
  styleUrl: './video.component.scss'
})
export class VideoComponent {
@ViewChild('videoPlayer') videoPlayer!: ElementRef<HTMLVideoElement>;

  ngAfterViewInit(): void {
    const video = this.videoPlayer.nativeElement;
    
    // Forzamos muted en el DOM
    video.muted = true;

    // Intentamos reproducir
    video.play().catch(err => {
      console.warn('Autoplay bloqueado:', err);
    });
  }

      scrollTo(fragment: string) {
        const element = document.getElementById(fragment);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }
}
