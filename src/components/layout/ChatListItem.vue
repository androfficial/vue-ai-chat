<script setup lang="ts">
import type { ChatListItem } from '@/types/chat'

import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  click: []
  delete: [event: Event]
}>()

const { t } = useI18n()

interface Props {
  chat: ChatListItem
  isActive: boolean
  timestamp: string
}

const showMenu = ref(false)
const showDeleteDialog = ref(false)
const deleteEvent = ref<Event | null>(null)

const chatTitle = computed(() => props.chat.title)

// Methods
function handleClick() {
  emit('click')
}

function openDeleteDialog(event: Event) {
  deleteEvent.value = event
  showMenu.value = false
  showDeleteDialog.value = true
}

function confirmDelete() {
  if (deleteEvent.value) {
    emit('delete', deleteEvent.value)
  }
  showDeleteDialog.value = false
  deleteEvent.value = null
}

function cancelDelete() {
  showDeleteDialog.value = false
  deleteEvent.value = null
}
</script>

<template>
  <v-list-item
    :active="isActive"
    :value="chat.id"
    class="chat-list-item mb-1"
    rounded="lg"
    @click="handleClick"
  >
    <v-list-item-title class="text-body-2">
      {{ chatTitle }}
    </v-list-item-title>
    <v-list-item-subtitle class="text-caption">
      {{ timestamp }}
    </v-list-item-subtitle>

    <template #append>
      <v-menu v-model="showMenu">
        <template #activator="{ props: menuProps }">
          <v-btn
            v-bind="menuProps"
            icon="mdi-dots-horizontal"
            variant="text"
            size="small"
            density="comfortable"
            class="chat-list-item__menu-btn"
            :aria-label="$t('sidebar.chatOptions')"
            @click.stop
          />
        </template>

        <v-list
          density="compact"
          class="dropdown-menu py-1"
        >
          <v-list-item
            prepend-icon="mdi-delete-outline"
            :title="$t('common.delete')"
            class="delete-item"
            @click="openDeleteDialog"
          />
        </v-list>
      </v-menu>
    </template>

    <!-- Delete Confirmation Dialog -->
    <v-dialog
      v-model="showDeleteDialog"
      max-width="400"
      persistent
    >
      <v-card class="delete-dialog">
        <v-card-title class="delete-dialog__title">
          {{ t('dialog.deleteChat.title') }}
        </v-card-title>
        <v-card-text class="delete-dialog__text">
          {{ t('dialog.deleteChat.descriptionStart') }}<strong>{{ chatTitle }}</strong
          >{{ t('dialog.deleteChat.descriptionEnd') }}
        </v-card-text>
        <v-card-actions class="delete-dialog__actions">
          <v-btn
            variant="text"
            @click="cancelDelete"
          >
            {{ t('common.cancel') }}
          </v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="confirmDelete"
          >
            {{ t('common.delete') }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-list-item>
</template>

<style scoped>
.chat-list-item {
  padding: 10px 12px !important;
  min-height: 52px !important;
  transition: all var(--transition-fast);
}

.chat-list-item :deep(.v-list-item__content) {
  padding-left: 0 !important;
}

.chat-list-item :deep(.v-list-item-title) {
  font-size: 0.875rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-list-item :deep(.v-list-item-subtitle) {
  font-size: 0.75rem;
  margin-top: 2px;
  opacity: 0.65;
}

.chat-list-item__menu-btn {
  opacity: 0;
  transition: all 0.2s ease;
}

.chat-list-item:hover .chat-list-item__menu-btn {
  opacity: 1;
}

.chat-list-item__menu-btn:hover {
  background-color: var(--border-subtle) !important;
}
</style>

<!-- Global styles for dropdown menu and dialog (teleported outside component) -->
<style>
.v-menu > .v-overlay__content > .v-list {
  padding: 4px 0 !important;
  min-width: 140px;
}

.v-menu .v-list-item {
  border-radius: 0 !important;
  min-height: 36px !important;
  padding: 0 12px !important;
  margin: 0 !important;
}

.v-menu .v-list-item__prepend {
  margin-inline-end: 8px !important;
}

.v-menu .v-list-item__spacer {
  width: 0 !important;
}

.v-menu .delete-item {
  color: rgb(var(--v-theme-error)) !important;
}

.v-menu .delete-item .v-icon {
  color: rgb(var(--v-theme-error)) !important;
}

/* Center all dialogs */
.v-overlay__content:has(.v-dialog) {
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
}

/* Delete confirmation dialog */
.delete-dialog {
  border-radius: 16px !important;
  padding: 8px !important;
}

.delete-dialog__title {
  font-size: 1.1rem !important;
  font-weight: 600 !important;
  padding: 16px 20px 8px !important;
}

.delete-dialog__text {
  font-size: 0.9rem !important;
  color: rgb(var(--v-theme-text-secondary)) !important;
  padding: 8px 20px 16px !important;
}

.delete-dialog__text strong {
  font-weight: 600;
  color: rgb(var(--v-theme-on-surface));
}

.delete-dialog__actions {
  padding: 8px 16px 16px !important;
  gap: 8px;
}
</style>
