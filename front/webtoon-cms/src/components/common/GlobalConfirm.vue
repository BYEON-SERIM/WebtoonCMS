<template>
  <v-dialog v-model="dialog.isOpen" max-width="400" persistent>
    <v-card class="rounded-xl pa-4 text-center">
      <v-card-text class="pt-4">
        <v-avatar color="primary-lighten-4" size="70" class="mb-4">
          <v-icon color="primary" icon="mdi-help-circle-outline" size="40"></v-icon>
        </v-avatar>
        <h3 class="text-h6 font-weight-black mb-2">{{ dialog.title }}</h3>
        <p class="text-body-2 text-grey-darken-1" style="white-space: pre-line">
          {{ dialog.message }}
        </p>
      </v-card-text>
      <v-card-actions class="pb-4 px-4 ga-2">
        <v-btn
          variant="tonal"
          color="grey"
          class="flex-grow-1 rounded-lg font-weight-bold"
          @click="dialog.handleAction(false)"
          >취소</v-btn
        >
        <v-btn
          variant="flat"
          color="primary"
          class="flex-grow-1 rounded-lg font-weight-bold"
          @click="dialog.handleAction(true)"
          >확인</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { useDialogStore } from '@/stores/dialog'
const dialog = useDialogStore()
</script>
