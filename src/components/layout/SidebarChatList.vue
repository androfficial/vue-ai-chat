<script setup lang="ts">
/**
 * Sidebar chat list component
 * Displays grouped chat list with collapse functionality
 */

import type { ChatListItem as ChatListItemType } from '@/types';

import { computed, ref } from 'vue';

import { useDateFormatter } from '@/composables';
import { getDateGroup } from '@/utils/date';

import ChatListItem from './ChatListItem.vue';

interface Props {
  chatList: ChatListItemType[];
  currentChatId: string;
  isMobile: boolean;
  rail: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'delete-chat': [chatId: string, event: Event];
  'open-chat': [chatId: string];
  'rename-chat': [chatId: string, newTitle: string];
}>();

const { formatDateGroup, getTimeDiffFormatted, locale } = useDateFormatter();

const collapsedGroups = ref<Set<string>>(new Set());

const groupedChats = computed(() => {
  const groups: Record<string, typeof props.chatList> = {};

  props.chatList.forEach(chat => {
    const group = getDateGroup(chat.updatedAt, locale.value);
    const groupKey = formatDateGroup(group);
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(chat);
  });

  return groups;
});

function toggleGroup(group: string) {
  if (collapsedGroups.value.has(group)) {
    collapsedGroups.value.delete(group);
  } else {
    collapsedGroups.value.add(group);
  }
}

function isGroupCollapsed(group: string): boolean {
  return collapsedGroups.value.has(group);
}
</script>

<template>
  <v-list
    density="compact"
    nav
    class="pa-2 sidebar-chat-list"
    :class="{ 'sidebar-list-hidden': !isMobile && rail }"
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
          @click="emit('open-chat', chat.id)"
          @delete="emit('delete-chat', chat.id, $event)"
          @rename="emit('rename-chat', chat.id, $event)"
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
</template>

<style scoped>
.sidebar-chat-list {
  flex: 1;
  min-height: 0;
  overflow-x: hidden;
  overflow-y: auto !important;
}

.sidebar-list-hidden {
  visibility: hidden;
  width: 0;
  overflow: hidden;
  pointer-events: none;
  opacity: 0;
}

.sidebar-group-header {
  display: flex;
  gap: 4px;
  align-items: center;
  min-height: 28px;
  padding: 4px 12px;
  margin-top: 8px;
  cursor: pointer;
  user-select: none;
  border-radius: 6px;
  transition: background-color 0.15s ease;
}

.sidebar-group-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: rgb(var(--v-theme-text-secondary));
  text-transform: uppercase;
  letter-spacing: 0.03em;
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

:deep(.v-list-item) {
  padding-top: 4px !important;
  padding-bottom: 4px !important;
  margin-bottom: 2px;
  border-radius: var(--radius-sm) !important;
}

:deep(.v-list-item--active) {
  font-weight: 500;
  background-color: rgb(var(--v-theme-sidebar-active)) !important;
}

:deep(.v-list-item:hover:not(.v-list-item--active)) {
  background-color: rgb(var(--v-theme-sidebar-hover)) !important;
}

@media (width <= 960px) {
  .sidebar-group-header {
    min-height: 36px;
    padding: 8px 16px;
  }
}
</style>
