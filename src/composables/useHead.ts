/**
 * Composable for managing document head (title, meta tags)
 * Supports localization and reacts to locale changes
 */

import { watchEffect } from 'vue'
import { useI18n } from 'vue-i18n'

export function useHead() {
  const { locale, t } = useI18n({ useScope: 'global' })

  // Update document title and meta tags when locale changes
  watchEffect(() => {
    // Update html lang attribute
    document.documentElement.lang = locale.value

    // Update title
    document.title = t('meta.title')

    // Update meta description
    const metaDescription = document.querySelector('meta[name="description"]')
    if (metaDescription) {
      metaDescription.setAttribute('content', t('meta.description'))
    }
  })
}
