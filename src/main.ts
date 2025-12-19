/**
 * Application entry point
 * Initializes Vue app with plugins
 */

import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import i18n from './plugins/i18n'
import router from './plugins/router'
import vuetify from './plugins/vuetify'
// Global styles
import './assets/styles/global.css'
// Highlight.js theme for code blocks
import './assets/styles/hljs-theme.css'

// Create Vue application instance
const app = createApp(App)

// Register plugins
app.use(createPinia())
app.use(router)
app.use(i18n)
app.use(vuetify)

// Mount application
app.mount('#app')
