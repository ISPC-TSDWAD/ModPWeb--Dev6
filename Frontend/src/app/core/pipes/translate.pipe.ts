import { Pipe, PipeTransform } from '@angular/core';
import { I18nService } from '../services/i18n.service';

/**
 * Pipe de traducción: {{ 'nav.home' | translate }}.
 * Es impuro a propósito para reflejar el cambio de idioma en caliente, sin
 * recargar la página.
 */
@Pipe({ name: 'translate', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(key: string): string {
    return this.i18n.t(key);
  }
}
