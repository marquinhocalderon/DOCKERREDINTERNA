import { CommonModule } from '@angular/common';
import { Component, ElementRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-nuestrobot',
  imports: [CommonModule, FormsModule],
  templateUrl: './nuestrobot.component.html',
  styleUrl: './nuestrobot.component.scss'
})
export class NuestrobotComponent {
constructor(private el: ElementRef) {}

@Input({ required: true }) titulo!: string;
@Input({ required: true }) descripcion!: string;
get formattedMessage(): string {
  return this.descripcion.replace(/\n/g, '<br/>');
}
  isMobile = false;

  ngAfterViewInit(): void {
    const evaHead = this.el.nativeElement.querySelector('#evaHead');
    const eyeChamber = this.el.nativeElement.querySelector('#eyeChamber');
    const leftEye = this.el.nativeElement.querySelector('#leftEye');
    const rightEye = this.el.nativeElement.querySelector('#rightEye');
    const evaRobot = this.el.nativeElement.querySelector('#evaRobot');

    let isFollowingMouse = true;

    document.addEventListener('mousemove', (e) => {
      if (!isFollowingMouse) return;

      const fabRect = evaRobot.getBoundingClientRect();
      const robotCenterX = fabRect.left + fabRect.width / 2;
      const robotCenterY = fabRect.top + fabRect.height / 2;

      const deltaX = e.clientX - robotCenterX;
      const deltaY = e.clientY - robotCenterY;

      const maxRotation = 15;
      const maxDistance = 300;

      const rotationX = Math.max(-maxRotation, Math.min(maxRotation, (deltaY / maxDistance) * maxRotation));
      const rotationY = Math.max(-maxRotation, Math.min(maxRotation, (deltaX / maxDistance) * maxRotation));

      evaHead.style.transform = `rotateX(${-rotationX}deg) rotateY(${rotationY}deg)`;

      const eyeMovementX = Math.max(-5, Math.min(5, (deltaX / maxDistance) * 5));
      const eyeMovementY = Math.max(-3, Math.min(3, (deltaY / maxDistance) * 3));
      eyeChamber.style.transform = `translate(${-50 + eyeMovementX}%, ${-50 + eyeMovementY}%)`;
    });

    // Parpadeo
    const blink = () => {
      if (Math.random() < 0.3) {
        leftEye.classList.add('blink');
        rightEye.classList.add('blink');
        setTimeout(() => {
          leftEye.classList.remove('blink');
          rightEye.classList.remove('blink');
        }, 150);
      }
    };

    const scheduleBlink = () => {
      const delay = Math.random() * 3000 + 2000;
      setTimeout(() => {
        blink();
        scheduleBlink();
      }, delay);
    };
    scheduleBlink();

    evaRobot.addEventListener('mouseenter', () => {
      isFollowingMouse = false;
      evaHead.style.transform = 'rotateX(0deg) rotateY(0deg)';
      eyeChamber.style.transform = 'translate(-50%, -50%)';
    });

    evaRobot.addEventListener('mouseleave', () => {
      setTimeout(() => { isFollowingMouse = true; }, 500);
    });
  }

  tooltipVisible: boolean = false;

  // Detecta si es móvil según el ancho de pantalla
  checkDevice() {
   this.isMobile =
              /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
              );
    console.log('isMobile:', this.isMobile);
  }

  toggleTooltip() {
  if (this.isMobile) {
    this.tooltipVisible = !this.tooltipVisible;
  }
}

  ngOnInit(): void {
    this.checkDevice();
  }

}
