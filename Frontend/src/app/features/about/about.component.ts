import { Component, inject } from '@angular/core';
import { I18nService } from '../../core/services/i18n.service';
import { TranslatePipe } from '../../core/pipes/translate.pipe';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './about.component.html',
  styleUrl: './about.component.css',
})
export class AboutComponent {
  private i18n = inject(I18nService);

  // Getters reactivos: al cambiar el idioma, el texto se recalcula solo.
  get hero() {
    return { title: this.i18n.t('about.heroTitle'), text: this.i18n.t('about.heroText') };
  }

  get mision() {
    return {
      title: this.i18n.t('about.misionTitle'),
      icon: 'track_changes',
      text: this.i18n.t('about.misionText'),
    };
  }

  get vision() {
    return {
      title: this.i18n.t('about.visionTitle'),
      icon: 'visibility',
      text: this.i18n.t('about.visionText'),
    };
  }

  get valores() {
    return [
      { icon: 'lightbulb', title: this.i18n.t('about.val1Title'), text: this.i18n.t('about.val1Text') },
      { icon: 'accessibility', title: this.i18n.t('about.val2Title'), text: this.i18n.t('about.val2Text') },
      { icon: 'verified', title: this.i18n.t('about.val3Title'), text: this.i18n.t('about.val3Text') },
      { icon: 'groups', title: this.i18n.t('about.val4Title'), text: this.i18n.t('about.val4Text') },
    ];
  }
}
