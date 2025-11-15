import { Component, computed, effect, inject } from '@angular/core';
import { StyleClassModule } from 'primeng/styleclass';
import { Router, RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { AppFloatingConfigurator } from '../../../layout/component/app.floatingconfigurator';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../../layout/service/layout.service';

@Component({
    selector: 'topbar-widget',
    standalone: true,
    imports: [RouterModule, StyleClassModule, ButtonModule, RippleModule, AppFloatingConfigurator, CommonModule],
    template: `
      <div class="flex items-center space-x-4 mt-1">
          <div class="w-14 h-14 bg-primary rounded-2xl flex items-center justify-center shadow-lg">
            <a class="flex items-center" href="/">
              <ng-container *ngIf="darkTheme(); else lightLogo">
                <img src="img/negro.png" alt="humanibot" class="w-12" />
              </ng-container>
              <ng-template #lightLogo>
                <img src="img/blanco.png" alt="humanibot" class="w-10" />
              </ng-template>
            </a>
          </div>
          <a href="/" class="text-3xl font-extrabold text-primary  titulo transition-colors">HumaniBot</a>
        </div>

    <a pButton [text]="true" severity="secondary" [rounded]="true" pRipple class="lg:!hidden"
        pStyleClass="@next" enterClass="hidden" leaveToClass="hidden" [hideOnOutsideClick]="true">
        <i class="pi pi-bars !text-2xl"></i>
    </a>

    <div
        class="items-center ml-16 bg-surface-0 mt-1  dark:bg-black grow justify-between hidden lg:flex absolute lg:static w-full left-0 top-full px-12 lg:px-0 z-20 rounded-border">
        <ul
            class="list-none p-0 m-0 flex lg:items-center select-none flex-col lg:flex-row cursor-pointer gap-8">
            <li>
                <a (click)="scrollTo('sobrenosotros')"  pRipple
                    class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Sobre HumaniBot</span>
                </a>
            </li>
            <li>
                <a (click)="scrollTo('contacto')"  pRipple
                    class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Contacto</span>
                </a>
            </li>
            <li>
                <a (click)="scrollTo('pricing')"  pRipple
                    class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl">
                    <span>Precios</span>
                </a>
            </li>
                        <li>
  <a href="/solutions"
     pRipple
     class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl 
            relative group overflow-hidden transition-all duration-300">
    <span>Humanibot Solutions</span>

    <span class="absolute top-0 right-0 mt-[-5px]  bg-red-500 text-white
                 text-xs font-bold px-2 py-1 rounded-full
                 transform -rotate-12 group-hover:scale-110 transition-all animate-bounce">
    Nuevo
    </span>
  </a>
</li>
            <li>
  <a href="/academico"
     pRipple
     class="px-0 py-4 text-surface-900 dark:text-surface-0 font-medium text-xl 
            relative group overflow-hidden transition-all duration-300">
    <span>Humanibot Académico</span>

    <span class="absolute top-0 right-0 mt-[-5px]  bg-red-500 text-white
                 text-xs font-bold px-2 py-1 rounded-full
                 transform -rotate-12 group-hover:scale-110 transition-all">
    Nuevo
    </span>
  </a>
</li>
        </ul>
        <div class="flex border-t lg:border-t-0 border-surface py-4 lg:py-0 mt-4 lg:mt-0 gap-2">
<a href="/login"
   class="inline-block px-6 py-3 font-semibold text-primary bg-white dark:bg-gray-900 
          border-2 border-primary rounded-xl shadow-lg 
          transition-all duration-300 ease-in-out
          hover:bg-primary dark:hover:text-black hover:text-white hover:shadow-2xl
          focus:outline-none focus:ring-4 focus:ring-primary/40
          active:scale-95">
  Login
</a>
            <app-floating-configurator />
        </div>
    </div>`,
    styles: [`

   

`]
})


export class TopbarWidget {
    private layoutService = inject(LayoutService);

    // Computed que se actualiza automáticamente cuando el tema cambia
    darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

    constructor(public router: Router) {
        effect(() => {
            console.log('🌓 Tema actual (darkTheme):', this.darkTheme());
        });
    }

    scrollTo(fragment: string) {
        const element = document.getElementById(fragment);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    }

}
