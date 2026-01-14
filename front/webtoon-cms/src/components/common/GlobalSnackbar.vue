<template>
  <v-snackbar
    v-model="snackbar.show"
    :color="snackbar.color"
    :timeout="snackbar.timeout"
    elevation="24"
    rounded="lg"
    location="top"
  >
    <div class="d-flex align-center">
      <v-icon
        :icon="snackbar.color === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'"
        class="mr-2"
      ></v-icon>
      <span class="font-weight-bold">{{ snackbar.message }}</span>
    </div>

    <template v-slot:actions>
      <v-btn variant="text" @click="snackbar.show = false" icon="mdi-close" size="small"></v-btn>
    </template>
  </v-snackbar>
</template>

<script setup>
import { useSnackbarStore } from '@/stores/snackbar'
const snackbar = useSnackbarStore()
</script>
