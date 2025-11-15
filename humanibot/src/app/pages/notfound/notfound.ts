import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';

@Component({
    selector: 'app-notfound',
    standalone: true,
    imports: [RouterModule, ButtonModule, CommonModule],
   template: `
    <div class="error-container">
      <!-- Estrellas de fondo -->
      <div class="stars">
        <div class="star" *ngFor="let star of stars; let i = index" 
             [style.left.%]="star.left" 
             [style.top.%]="star.top"
             [style.animation-delay.s]="star.delay">
        </div>
      </div>

      <div class="content">
        <!-- Robot SVG -->
        <div class="robot-container">
          <svg class="robot" viewBox="0 0 200 240" xmlns="http://www.w3.org/2000/svg">
            <!-- Antena -->
            <line x1="100" y1="20" x2="100" y2="5" stroke="#64748b" stroke-width="3" stroke-linecap="round"/>
            <circle cx="100" cy="5" r="4" fill="#ef4444" class="antenna-light"/>
            
            <!-- Cabeza -->
            <rect x="70" y="20" width="60" height="50" rx="15" fill="#475569" class="robot-head"/>
            
            <!-- Ojos -->
            <circle cx="85" cy="40" r="8" fill="#1e293b" class="eye-socket"/>
            <circle cx="115" cy="40" r="8" fill="#1e293b" class="eye-socket"/>
            <circle cx="85" cy="40" r="5" fill="#3b82f6" class="eye"/>
            <circle cx="115" cy="40" r="5" fill="#3b82f6" class="eye"/>
            <circle cx="87" cy="38" r="2" fill="#60a5fa" class="eye-shine"/>
            <circle cx="117" cy="38" r="2" fill="#60a5fa" class="eye-shine"/>
            
            <!-- Boca -->
            <rect x="90" y="55" width="20" height="8" rx="4" fill="#1e293b"/>
            <rect x="92" y="57" width="4" height="4" rx="1" fill="#22c55e"/>
            <rect x="98" y="57" width="4" height="4" rx="1" fill="#22c55e"/>
            <rect x="104" y="57" width="4" height="4" rx="1" fill="#22c55e"/>
            <rect x="110" y="57" width="4" height="4" rx="1" fill="#22c55e"/>
            
            <!-- Cuerpo -->
            <rect x="60" y="80" width="80" height="100" rx="20" fill="#64748b" class="robot-body"/>
            
            <!-- Panel del pecho -->
            <rect x="75" y="95" width="50" height="35" rx="8" fill="#1e293b"/>
            <circle cx="85" cy="105" r="3" fill="#ef4444"/>
            <circle cx="100" cy="105" r="3" fill="#eab308"/>
            <circle cx="115" cy="105" r="3" fill="#22c55e"/>
            <rect x="80" y="115" width="40" height="3" rx="1" fill="#475569"/>
            <rect x="80" y="120" width="30" height="3" rx="1" fill="#475569"/>
            <rect x="80" y="125" width="35" height="3" rx="1" fill="#475569"/>
            
            <!-- Brazos -->
            <rect x="35" y="90" width="20" height="60" rx="10" fill="#64748b" class="arm-left"/>
            <rect x="145" y="90" width="20" height="60" rx="10" fill="#64748b" class="arm-right"/>
            
            <!-- Manos -->
            <circle cx="45" cy="160" r="12" fill="#475569" class="hand-left"/>
            <circle cx="155" cy="160" r="12" fill="#475569" class="hand-right"/>
            
            <!-- Piernas -->
            <rect x="75" y="180" width="18" height="40" rx="9" fill="#64748b"/>
            <rect x="107" y="180" width="18" height="40" rx="9" fill="#64748b"/>
            
            <!-- Pies -->
            <ellipse cx="84" cy="230" rx="15" ry="8" fill="#475569"/>
            <ellipse cx="116" cy="230" rx="15" ry="8" fill="#475569"/>
          </svg>
        </div>

        <!-- Texto 404 -->
        <div class="error-code">
          <span class="four">4</span>
          <span class="zero">0</span>
          <span class="four">4</span>
        </div>

        <!-- Mensaje -->
        <h1 class="error-title text-white">¡Oops! Página no encontrada</h1>
        <p class="error-message">
          El robot explorador no pudo encontrar la página que buscas. 
          Parece que se perdió en el ciberespacio.
        </p>

        <!-- Botones -->
        <div class="buttons">
          <button class="btn-primary" routerLink="/">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9,22 9,12 15,12 15,22"/>
            </svg>
            Volver al Inicio
          </button>
          <button class="btn-secondary" (click)="goBack()">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="m12 19-7-7 7-7"/>
              <path d="M19 12H5"/>
            </svg>
            Página Anterior
          </button>
        </div>

        <!-- Enlaces de ayuda -->
        <div class="help-links">
          <a routerLink="/contact" class="help-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Contactar Soporte
          </a>
          <a routerLink="/help" class="help-link">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
              <path d="M12 17h.01"/>
            </svg>
            Centro de Ayuda
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
    .error-container {
      min-height: 100vh;
      background: black;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem;
      position: relative;
      overflow: hidden;
    }

    .stars {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
    }

    .star {
      position: absolute;
      width: 2px;
      height: 2px;
      background: white;
      border-radius: 50%;
      animation: twinkle 2s infinite;
    }

    @keyframes twinkle {
      0%, 100% { opacity: 0.3; transform: scale(1); }
      50% { opacity: 1; transform: scale(1.2); }
    }

    .content {
      text-align: center;
      color: white;
      max-width: 600px;
      z-index: 1;
    }

    .robot-container {
      margin-bottom: 2rem;
      display: flex;
      justify-content: center;
    }

    .robot {
      width: 200px;
      height: 240px;
      filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
      animation: float 3s ease-in-out infinite;
    }

    @keyframes float {
      0%, 100% { transform: translateY(0px); }
      50% { transform: translateY(-10px); }
    }

    .antenna-light {
      animation: blink 1.5s infinite;
    }

    @keyframes blink {
      0%, 50% { opacity: 1; }
      51%, 100% { opacity: 0.3; }
    }

    .robot-head {
      animation: headBob 4s ease-in-out infinite;
    }

    @keyframes headBob {
      0%, 100% { transform: rotate(0deg); }
      25% { transform: rotate(-2deg); }
      75% { transform: rotate(2deg); }
    }

    .eye {
      animation: eyeGlow 2s ease-in-out infinite alternate;
    }

    @keyframes eyeGlow {
      from { fill: #3b82f6; }
      to { fill: #60a5fa; }
    }

    .arm-left {
      animation: armWave 3s ease-in-out infinite;
      transform-origin: 45px 100px;
    }

    .arm-right {
      animation: armWave 3s ease-in-out infinite reverse;
      transform-origin: 155px 100px;
    }

    @keyframes armWave {
      0%, 100% { transform: rotate(0deg); }
      50% { transform: rotate(15deg); }
    }

    .error-code {
      font-size: 8rem;
      font-weight: 900;
      margin: 2rem 0;
      text-shadow: 0 0 20px rgba(255,255,255,0.5);
      line-height: 1;
    }

    .error-code span {
      display: inline-block;
      animation: bounce 2s infinite;
    }

    .error-code .zero {
      animation-delay: 0.1s;
      color: #fbbf24;
    }

    .error-code .four:first-child {
      animation-delay: 0s;
      color: #60a5fa;
    }

    .error-code .four:last-child {
      animation-delay: 0.2s;
      color: #34d399;
    }

    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
      40% { transform: translateY(-10px); }
      60% { transform: translateY(-5px); }
    }

    .error-title {
      font-size: 2.5rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-shadow: 0 2px 4px rgba(0,0,0,0.3);
    }

    .error-message {
      font-size: 1.2rem;
      margin-bottom: 3rem;
      opacity: 0.9;
      line-height: 1.6;
    }

    .buttons {
      display: flex;
      gap: 1rem;
      justify-content: center;
      flex-wrap: wrap;
      margin-bottom: 3rem;
    }

    .btn-primary, .btn-secondary {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      padding: 1rem 2rem;
      border-radius: 50px;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.3s ease;
      border: none;
      cursor: pointer;
      font-size: 1rem;
    }

    .btn-primary {
      background: linear-gradient(45deg, #3b82f6, #1d4ed8);
      color: white;
      box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);
    }

    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
    }

    .btn-secondary {
      background: rgba(255, 255, 255, 0.1);
      color: white;
      border: 2px solid rgba(255, 255, 255, 0.3);
      backdrop-filter: blur(10px);
    }

    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }

    .help-links {
      display: flex;
      gap: 2rem;
      justify-content: center;
      flex-wrap: wrap;
    }

    .help-link {
      display: inline-flex;
      align-items: center;
      gap: 0.5rem;
      color: rgba(255, 255, 255, 0.8);
      text-decoration: none;
      font-size: 0.9rem;
      transition: all 0.3s ease;
    }

    .help-link:hover {
      color: white;
      transform: translateY(-1px);
    }

    @media (max-width: 768px) {
      .error-code {
        font-size: 6rem;
      }

      .error-title {
        font-size: 2rem;
      }

      .error-message {
        font-size: 1rem;
      }

      .robot {
        width: 150px;
        height: 180px;
      }

      .buttons {
        flex-direction: column;
        align-items: center;
      }

      .btn-primary, .btn-secondary {
        width: 100%;
        max-width: 300px;
      }

      .help-links {
        flex-direction: column;
        gap: 1rem;
      }
    }
  `,
  ],
})
export class Notfound {
  stars = Array.from({ length: 50 }, () => ({
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2,
  }))

  goBack() {
    window.history.back()
  }
}