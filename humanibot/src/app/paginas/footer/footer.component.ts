import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { LayoutService } from '../../layout/service/layout.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-footer',
  imports: [RouterModule, CommonModule],
  templateUrl: './footer.component.html',
  styleUrl: './footer.component.scss'
})
export class FooterComponent {
 private layoutService = inject(LayoutService);

  darkTheme = computed(() => this.layoutService.layoutConfig().darkTheme);

  constructor(public router: Router) {
    effect(() => {
      console.log('🌓 Tema actual (darkTheme):', this.darkTheme());
    });
  }
}
