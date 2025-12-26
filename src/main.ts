/**
 * Application entry point
 * Initializes Vue app with plugins
 */

import { createPinia } from 'pinia';
import { createApp } from 'vue';

import i18n from '@/plugins/i18n';
import router from '@/plugins/router';
import vuetify from '@/plugins/vuetify';
import { setupGlobalErrorHandler, setupWindowErrorHandlers } from '@/utils';

import App from './App.vue';
// Global styles
import '@/assets/styles/global.css';
// Highlight.js theme for code blocks
import '@/assets/styles/hljs-theme.css';

// Create Vue application instance
const app = createApp(App);

// Register plugins
app.use(createPinia());
app.use(router);
app.use(i18n);
app.use(vuetify);

// Setup global error handlers
const errorHandlerOptions = { i18n };
setupGlobalErrorHandler(app, errorHandlerOptions);
setupWindowErrorHandlers(errorHandlerOptions);

// Mount application
app.mount('#app');
