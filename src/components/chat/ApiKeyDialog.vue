<script setup lang="ts">
/**
 * API Key Dialog component
 * Modal for entering Cerebras API key
 */

import { ref } from 'vue';

interface Props {
  modelValue: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  save: [apiKey: string];
  'update:modelValue': [value: boolean];
}>();

const tempApiKey = ref('');

function handleSave() {
  if (tempApiKey.value.trim()) {
    emit('save', tempApiKey.value.trim());
    tempApiKey.value = '';
  }
}

function handleClose() {
  emit('update:modelValue', false);
}
</script>

<template>
  <v-dialog
    :model-value="modelValue"
    max-width="500"
    persistent
    @update:model-value="emit('update:modelValue', $event)"
  >
    <v-card>
      <v-card-title class="text-h5 pa-6 pb-2">
        <v-icon
          icon="mdi-key"
          class="mr-2"
        />
        {{ $t('dialog.apiKey.title') }}
      </v-card-title>

      <v-card-text class="pa-6">
        <p class="text-body-1 mb-4">
          {{ $t('dialog.apiKey.description') }}
          <a
            href="https://cloud.cerebras.ai"
            target="_blank"
            class="text-primary"
          >
            {{ $t('dialog.apiKey.link') }}
          </a>
        </p>

        <v-text-field
          v-model="tempApiKey"
          :label="$t('settings.api.apiKey')"
          type="password"
          variant="outlined"
          :placeholder="$t('settings.api.apiKeyPlaceholder')"
          hide-details
        />
      </v-card-text>

      <v-card-actions class="pa-6 pt-0">
        <v-spacer />
        <v-btn
          variant="text"
          @click="handleClose"
        >
          {{ $t('common.cancel') }}
        </v-btn>
        <v-btn
          color="primary"
          :disabled="!tempApiKey.trim()"
          @click="handleSave"
        >
          {{ $t('common.save') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
