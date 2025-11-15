import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RippleModule } from 'primeng/ripple';
import { StyleClassModule } from 'primeng/styleclass';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { TopbarWidget } from './components/topbarwidget.component';
import { HeroWidget } from './components/herowidget';
import { FeaturesWidget } from './components/featureswidget';
import { HighlightsWidget } from './components/highlightswidget';
import { PricingWidget } from './components/pricingwidget';
import { FooterWidget } from './components/footerwidget';
import { VideoComponent } from '../../paginas/video/video.component';
import { PreciosComponent } from '../../paginas/precios/precios.component';
import { FooterComponent } from '../../paginas/footer/footer.component';
import { SobrenosotrosComponent } from '../../paginas/sobrenosotros/sobrenosotros.component';
import { PortadaprincipalComponent } from "../../paginas/portadaprincipal/portadaprincipal.component";

@Component({
    selector: 'app-landing',
    standalone: true,
    imports: [RouterModule, TopbarWidget, RippleModule, StyleClassModule, ButtonModule, DividerModule, PreciosComponent, FooterComponent, SobrenosotrosComponent, PortadaprincipalComponent],
    template: `
            <div class="bg-surface-0 dark:bg-black">
                <div id="home" class="landing-wrapper overflow-hidden">

                    <!-- navbar de la pagina principal -->
                    <topbar-widget class="py-5 px-6 mx-0 md:mx-12 lg:mx-20 lg:px-20 flex items-center justify-between relative lg:static" />
                    <!-- fin del navbar principal -->
                    <app-portadaprincipal></app-portadaprincipal>
<!--                     <app-video/>
 -->                    <app-sobrenosotros/>
                    <app-precios/>
                    <app-footer/>
                    </div>
                    </div>
                `
})
// <footer-widget />
export class Landing { }
