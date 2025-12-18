<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useTheme } from 'vuetify'

import { useDateFormatter } from '@/composables'
import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'
import { getDateGroup } from '@/utils/date'

import ChatListItem from './ChatListItem.vue'

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const chatStore = useChatStore()
const userStore = useUserStore()

const { formatDateGroup, getTimeDiffFormatted, locale } = useDateFormatter()

const drawer = ref(true)
const rail = ref(userStore.preferences.sidebarCollapsed)
const collapsedGroups = ref<Set<string>>(new Set())

watch(rail, newValue => {
  userStore.updatePreferences({ sidebarCollapsed: newValue })
})

function toggleGroup(group: string) {
  if (collapsedGroups.value.has(group)) {
    collapsedGroups.value.delete(group)
  } else {
    collapsedGroups.value.add(group)
  }
}

function isGroupCollapsed(group: string): boolean {
  return collapsedGroups.value.has(group)
}

const chatList = computed(() => chatStore.persistentChatList)
const currentChatId = computed(() => route.params.id as string)

const groupedChats = computed(() => {
  const groups: Record<string, typeof chatList.value> = {}

  chatList.value.forEach(chat => {
    const group = getDateGroup(chat.updatedAt, locale.value)
    const groupKey = formatDateGroup(group)
    if (!groups[groupKey]) {
      groups[groupKey] = []
    }
    groups[groupKey].push(chat)
  })

  return groups
})

function createNewChat() {
  router.push('/chat/new')
}

function openChat(chatId: string) {
  router.push(`/chat/${chatId}`)
}

function openSettings() {
  router.push('/settings')
}

function deleteChat(chatId: string, event: Event) {
  event.stopPropagation()
  chatStore.deleteChat(chatId)
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="rail"
    :color="theme.current.value.colors['sidebar-bg']"
    permanent
    width="260"
    :rail-width="56"
    class="sidebar-drawer"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <div :class="['sidebar-header', { 'sidebar-header-railed': rail }]">
        <v-btn
          :icon="rail ? 'mdi-menu' : 'mdi-menu-open'"
          variant="text"
          density="comfortable"
          :aria-label="rail ? $t('sidebar.expandSidebar') : $t('sidebar.collapseSidebar')"
          :aria-expanded="!rail"
          @click="rail = !rail"
        />
        <span
          class="sidebar-title text-h6 font-weight-bold flex-grow-1 ml-2"
          :class="{ 'sidebar-title-hidden': rail }"
          style="cursor: pointer"
          @click="createNewChat"
        >
          AI Chat
        </span>
        <v-btn
          icon="mdi-square-edit-outline"
          variant="text"
          density="comfortable"
          :aria-label="$t('sidebar.newChat')"
          class="sidebar-new-chat-btn"
          :class="{ 'sidebar-new-chat-btn-hidden': rail }"
          @click="createNewChat"
        />
      </div>

      <v-divider />

      <!-- New Chat Button (when railed) -->
      <div
        class="sidebar-rail-new-chat d-flex justify-center pa-2"
        :class="{ 'sidebar-rail-new-chat-visible': rail }"
      >
        <v-btn
          icon="mdi-plus"
          variant="text"
          density="comfortable"
          :aria-label="$t('sidebar.newChat')"
          :tabindex="rail ? 0 : -1"
          @click="createNewChat"
        />
      </div>

      <!-- Chat List -->
      <v-list
        density="compact"
        nav
        class="pa-2 sidebar-list sidebar-chat-list"
        :class="{ 'sidebar-list-hidden': rail }"
      >
        <template
          v-for="(chats, group) in groupedChats"
          :key="group"
        >
          <div
            class="sidebar-group-header"
            :class="{ 'is-collapsed': isGroupCollapsed(group as string) }"
            @click="toggleGroup(group as string)"
          >
            <span class="sidebar-group-title">
              {{ group }}
            </span>
            <v-icon
              :icon="isGroupCollapsed(group as string) ? 'mdi-chevron-right' : 'mdi-chevron-down'"
              size="16"
              class="sidebar-group-icon"
            />
          </div>

          <template v-if="!isGroupCollapsed(group as string)">
            <ChatListItem
              v-for="chat in chats"
              :key="chat.id"
              :chat="chat"
              :is-active="currentChatId === chat.id"
              :timestamp="getTimeDiffFormatted(chat.updatedAt)"
              @click="openChat(chat.id)"
              @delete="deleteChat(chat.id, $event)"
            />
          </template>
        </template>

        <!-- Empty state -->
        <v-list-item v-if="chatList.length === 0">
          <v-list-item-title class="text-body-2 text-medium-emphasis text-center">
            {{ $t('sidebar.noChats') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </div>

    <template #append>
      <v-divider />

      <!-- Bottom actions -->
      <v-list
        density="compact"
        nav
        :class="['pa-2 sidebar-bottom', { 'sidebar-railed': rail }]"
      >
        <v-list-item
          prepend-icon="mdi-cog-outline"
          @click="openSettings"
        >
          <v-list-item-title
            class="sidebar-item-title"
            :class="{ 'sidebar-item-title-hidden': rail }"
          >
            {{ $t('common.settings') }}
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-drawer {
  border-right: 1px solid var(--border-subtle);
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
  overflow: hidden;
}

/* Make dividers less contrasting */
.sidebar-drawer :deep(.v-divider) {
  opacity: 0.4;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-chat-list {
  flex: 1;
  min-height: 0;
  overflow-y: auto !important;
  overflow-x: hidden;
}

/* Smooth transitions for the title */
.sidebar-title {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease,
    width 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
}

.sidebar-title-hidden {
  opacity: 0;
  width: 0;
  transform: translateX(-10px);
  pointer-events: none;
}

/* New chat button in the header */
.sidebar-new-chat-btn {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
  flex-shrink: 0;
}

.sidebar-new-chat-btn-hidden {
  opacity: 0;
  transform: scale(0.8);
  pointer-events: none;
  position: absolute;
  right: 0;
}

/* New chat button in rail mode */
.sidebar-rail-new-chat {
  opacity: 0;
  height: 0;
  overflow: hidden;
  transition:
    opacity 0.15s ease,
    height 0.15s ease;
  justify-content: flex-start !important;
  padding-left: 8px !important;
}

.sidebar-rail-new-chat-visible {
  opacity: 1;
  height: auto;
}

/* Smooth hiding of chat list */
.sidebar-list {
  transition: opacity 0.15s ease;
  width: 100%;
}

.sidebar-list-hidden {
  opacity: 0;
  pointer-events: none;
  visibility: hidden;
  width: 0;
  overflow: hidden;
}

/* Smooth hiding of text in bottom menu */
.sidebar-item-title {
  transition:
    opacity 0.15s ease,
    width 0.15s ease;
  white-space: nowrap;
  overflow: hidden;
  font-weight: 500;
  font-size: 0.9rem;
}

.sidebar-item-title-hidden {
  opacity: 0;
  width: 0;
  pointer-events: none;
}

.v-list-item--active {
  background-color: rgb(var(--v-theme-sidebar-active)) !important;
  font-weight: 500;
}

.v-list-item:hover:not(.v-list-item--active) {
  background-color: rgb(var(--v-theme-sidebar-hover)) !important;
}

.v-list-item {
  transition:
    background-color var(--transition-fast),
    margin 0.2s ease,
    padding 0.2s ease,
    min-width 0.2s ease,
    width 0.2s ease;
  margin-bottom: 2px;
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  border-radius: var(--radius-sm) !important;
}

/* Reduce spacing between icon and text */
:deep(.v-list-item__prepend) {
  margin-inline-end: 4px !important;
  transition:
    margin 0.2s ease,
    padding 0.2s ease;
}

:deep(.v-list-item__spacer) {
  width: 8px !important;
  transition:
    width 0.2s ease,
    display 0.2s ease;
}

:deep(.v-list-item__content) {
  transition:
    opacity 0.15s ease,
    width 0.2s ease;
  overflow: hidden;
}

/* Reduce padding in sidebar lists */
.sidebar-list :deep(.v-list-item),
.sidebar-bottom :deep(.v-list-item) {
  min-height: 40px !important;
  padding-inline: 12px !important;
}

/* Group header with collapse toggle */
.sidebar-group-header {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 12px;
  margin-top: 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  transition: background-color 0.15s ease;
  min-height: 28px;
}

.sidebar-group-title {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.03em;
  color: rgb(var(--v-theme-text-secondary));
  text-transform: uppercase;
}

.sidebar-group-header:hover {
  background-color: rgb(var(--v-theme-sidebar-hover));
}

.sidebar-group-icon {
  opacity: 0;
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}

.sidebar-group-header:hover .sidebar-group-icon,
.sidebar-group-header.is-collapsed .sidebar-group-icon {
  opacity: 0.6;
}

.sidebar-group-header:hover .sidebar-group-icon {
  opacity: 0.8;
}

.v-list-subheader {
  font-weight: 600;
  letter-spacing: 0.02em;
  margin-top: 8px;
  padding-left: 12px !important;
  padding-right: 12px !important;
  min-height: 28px !important;
}

:deep(.v-btn) {
  transition: background-color var(--transition-fast);
}

:deep(.v-btn:hover) {
  background-color: rgb(var(--v-theme-sidebar-hover));
}

.pa-3 {
  padding: 12px 16px !important;
}

/* Header styles */
.sidebar-header {
  display: flex;
  align-items: center;
  padding: 12px 12px;
  min-height: 48px;
  position: relative;
  transition: padding 0.2s ease;
  flex-shrink: 0;
}

.sidebar-header-railed {
  padding: 12px 8px;
}

/* Hidden elements should not take up space */
.sidebar-header-railed .sidebar-title-hidden,
.sidebar-header-railed .sidebar-new-chat-btn-hidden {
  position: absolute;
  width: 0;
  overflow: hidden;
}

/* Styles for collapsed sidebar (rail mode) */
.sidebar-railed {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 8px 8px !important;
}

.sidebar-railed :deep(.v-list-item) {
  display: flex !important;
  justify-content: flex-start !important;
  align-items: center !important;
  padding: 8px !important;
  min-width: 40px !important;
  width: 40px !important;
  margin: 0 0 2px 0 !important;
}

.sidebar-railed :deep(.v-list-item__prepend) {
  margin: 0 !important;
  padding: 0 !important;
  margin-inline-end: 0 !important;
}

.sidebar-railed :deep(.v-list-item__spacer) {
  width: 0 !important;
  min-width: 0 !important;
  opacity: 0;
}

.sidebar-railed :deep(.v-list-item__content) {
  opacity: 0;
  width: 0 !important;
  max-width: 0 !important;
  overflow: hidden;
  position: absolute;
}

.sidebar-railed :deep(.v-list-item .v-icon) {
  margin: 0 auto !important;
}
</style>
