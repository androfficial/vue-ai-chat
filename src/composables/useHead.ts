import { watchEffect } from 'vue';
import { useI18n } from 'vue-i18n';

/**
 * Manages document head (title, meta tags) with i18n support
 */
export function useHead() {
  const { locale, t } = useI18n({ useScope: 'global' });

  watchEffect(() => {
    document.documentElement.lang = locale.value;
    document.title = t('meta.title');

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'));
    }
  });
}
