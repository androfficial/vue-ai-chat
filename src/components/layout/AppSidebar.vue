<script setup lang="ts">
/**
 * Application sidebar component
 * Contains navigation, chat list, and theme controls
 */

import { computed, onMounted, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useDisplay, useTheme } from 'vuetify'

import { useChatStore } from '@/stores/chat'
import { useUserStore } from '@/stores/user'

import SidebarChatList from './SidebarChatList.vue'
import SidebarFooter from './SidebarFooter.vue'
import SidebarHeader from './SidebarHeader.vue'

const route = useRoute()
const router = useRouter()
const theme = useTheme()
const chatStore = useChatStore()
const userStore = useUserStore()
const display = useDisplay()

const drawer = ref(true)
const rail = ref(userStore.preferences.sidebarCollapsed)

const isMobile = computed(() => display.smAndDown.value)
const chatList = computed(() => chatStore.persistentChatList)
const currentChatId = computed(() => route.params.id as string)

watch(rail, newValue => {
  if (!isMobile.value) {
    userStore.updatePreferences({ sidebarCollapsed: newValue })
  }
})

watch(isMobile, mobile => {
  if (mobile) {
    drawer.value = false
    rail.value = false
  } else {
    drawer.value = true
    rail.value = userStore.preferences.sidebarCollapsed
  }
})

onMounted(() => {
  if (isMobile.value) {
    drawer.value = false
    rail.value = false
  }
})

function toggleDrawer() {
  drawer.value = !drawer.value
}

defineExpose({ drawer, toggleDrawer })

function toggleRail() {
  rail.value = !rail.value
}

function closeDrawer() {
  drawer.value = false
}

function createNewChat() {
  if (isMobile.value) drawer.value = false
  router.push('/chat/new')
}

function openChat(chatId: string) {
  if (isMobile.value) drawer.value = false
  router.push(`/chat/${chatId}`)
}

function openSettings() {
  if (isMobile.value) drawer.value = false
  router.push('/settings')
}

function deleteChat(chatId: string, event: Event) {
  event.stopPropagation()
  const isCurrentChat = currentChatId.value === chatId
  chatStore.deleteChat(chatId)

  if (isCurrentChat) {
    const nextChat = chatStore.chatList[0]
    if (nextChat) {
      router.push(`/chat/${nextChat.id}`)
    } else {
      router.push('/chat/new')
    }
  }
}

function renameChat(chatId: string, newTitle: string) {
  chatStore.updateChat(chatId, { title: newTitle })
}
</script>

<template>
  <v-navigation-drawer
    v-model="drawer"
    :rail="!isMobile && rail"
    :color="theme.current.value.colors['sidebar-bg']"
    :permanent="!isMobile"
    :temporary="isMobile"
    width="280"
    :rail-width="56"
    class="sidebar-drawer"
    :class="{ 'sidebar-drawer--mobile': isMobile }"
  >
    <div class="sidebar-content">
      <!-- Header -->
      <SidebarHeader
        :is-mobile="isMobile"
        :rail="rail"
        @toggle-rail="toggleRail"
        @close-drawer="closeDrawer"
        @new-chat="createNewChat"
      />

      <v-divider />

      <!-- New Chat Button (when railed - desktop only) -->
      <div
        v-if="!isMobile"
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
      <SidebarChatList
        :chat-list="chatList"
        :current-chat-id="currentChatId"
        :is-mobile="isMobile"
        :rail="rail"
        @open-chat="openChat"
        @delete-chat="deleteChat"
        @rename-chat="renameChat"
      />
    </div>

    <template #append>
      <v-divider />

      <!-- Footer -->
      <SidebarFooter
        :is-mobile="isMobile"
        :rail="rail"
        @open-settings="openSettings"
      />
    </template>
  </v-navigation-drawer>
</template>

<style scoped>
.sidebar-drawer {
  overflow: hidden;
  border-right: 1px solid var(--border-subtle);
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.sidebar-drawer :deep(.v-divider) {
  opacity: 0.4;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
}

.sidebar-rail-new-chat {
  justify-content: flex-start !important;
  height: 0;
  padding-left: 8px !important;
  overflow: hidden;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    height 0.15s ease;
}

.sidebar-rail-new-chat-visible {
  height: auto;
  opacity: 1;
}

:deep(.v-btn) {
  transition: background-color var(--transition-fast);
}

:deep(.v-btn:hover) {
  background-color: rgb(var(--v-theme-sidebar-hover));
}

/* Mobile styles */
.sidebar-drawer--mobile {
  z-index: 1100 !important;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) !important;
}

.sidebar-drawer--mobile :deep(.v-navigation-drawer__content) {
  transition: none !important;
}
</style>
