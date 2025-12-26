/**
 * Vue Router configuration
 * Routes for AI Chat application
 */

import type { RouteRecordRaw } from 'vue-router';

import { createRouter, createWebHistory } from 'vue-router';

/**
 * Application route definitions
 */
const routes: RouteRecordRaw[] = [
  {
    // Root redirect to new chat
    path: '/',
    redirect: '/chat/new',
  },
  {
    component: () => import('@/pages/ChatPage.vue'),
    meta: {
      requiresApiKey: true,
      title: 'Chat',
    },
    name: 'chat',
    // Chat view with dynamic chat ID
    path: '/chat/:id',
  },
  {
    component: () => import('@/pages/SettingsPage.vue'),
    meta: {
      title: 'Settings',
    },
    name: 'settings',
    // Settings page
    path: '/settings',
  },
  {
    name: 'not-found',
    // Catch-all 404 route
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
];

/**
 * Create and configure router instance
 */
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

/**
 * Global navigation guard for page titles
 */
router.beforeEach((to, _from, next) => {
  // Update document title based on route meta
  const title = to.meta.title as string | undefined;
  document.title = title ? `${title} | AI Chat` : 'AI Chat';
  next();
});

export default router;
