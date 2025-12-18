<script setup lang="ts">
/**
 * Danger zone settings section component
 * Destructive actions like deleting all chats
 */

import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useChatStore } from '@/stores/chat'

import SettingsCard from './SettingsCard.vue'

const router = useRouter()
const chatStore = useChatStore()

// Local dialog state - isolated from parent
const showDeleteDialog = ref(false)

// Methods
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
    <div
      class="d-flex flex-column flex-sm-row align-start align-sm-center justify-space-between ga-4"
    >
      <div class="flex-grow-1">
        <div class="text-subtitle-1 font-weight-medium">
          {{ $t('settings.danger.deleteAllChats') }}
        </div>
        <div class="text-body-2 text-medium-emphasis mt-1">
          {{ $t('settings.danger.deleteAllChatsDescription') }}
        </div>
      </div>
      <v-btn
        color="error"
        variant="outlined"
        class="flex-shrink-0"
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
      <v-card-title class="text-h5 pa-6 pb-2 text-error">
        {{ $t('settings.danger.confirmDelete') }}
      </v-card-title>

      <v-card-text class="pa-6 pt-2">
        {{ $t('settings.danger.confirmDeleteDescription') }}
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
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
