<script setup lang="ts">
/**
 * Danger zone settings component
 * Destructive actions like clearing all chats
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatStore } from '@/stores/chat'

import SettingsCard from './SettingsCard.vue'

const router = useRouter()
const chatStore = useChatStore()

const showDeleteDialog = ref(false)

function confirmDeleteChats() {
  showDeleteDialog.value = true
}

function deleteAllChats() {
  chatStore.clearAllChats()
  showDeleteDialog.value = false
  router.push('/chat/new')
}
</script>

<template>
  <SettingsCard
    icon="mdi-alert-octagon"
    :title="$t('settings.danger.title')"
    variant="danger"
  >
    <div class="danger-action">
      <div class="danger-action__content">
        <div class="danger-action__title">
          {{ $t('settings.danger.deleteAllChats') }}
        </div>
        <div class="danger-action__description">
          {{ $t('settings.danger.deleteAllChatsDescription') }}
        </div>
      </div>
      <v-btn
        color="error"
        variant="outlined"
        @click="confirmDeleteChats"
      >
        {{ $t('settings.danger.deleteAllButton') }}
      </v-btn>
    </div>
  </SettingsCard>

  <!-- Delete Confirmation Dialog -->
  <v-dialog
    v-model="showDeleteDialog"
    max-width="400"
  >
    <v-card>
      <v-card-title class="text-h6 pa-5 pb-2 text-error">
        {{ $t('settings.danger.confirmDelete') }}
      </v-card-title>

      <v-card-text class="pa-5 pt-2 text-body-2">
        {{ $t('settings.danger.confirmDeleteDescription') }}
      </v-card-text>

      <v-card-actions class="pa-5 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="showDeleteDialog = false"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          color="error"
          @click="deleteAllChats"
        >
          {{ $t('settings.danger.deleteAllButton') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style scoped>
.danger-action {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.danger-action__content {
  flex: 1;
  min-width: 0;
}

.danger-action__title {
  font-size: 1rem;
  font-weight: 500;
  color: rgb(var(--v-theme-on-surface));
  margin-bottom: 4px;
}

.danger-action__description {
  font-size: 0.875rem;
  color: rgba(var(--v-theme-on-surface), 0.6);
}

@media (max-width: 480px) {
  .danger-action {
    flex-direction: column;
    align-items: flex-start;
  }
}
</style>
