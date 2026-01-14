<template>
  <v-app-bar elevation="1" color="white" class="px-2 px-sm-4">
    <!-- 모바일에서만 보이는 햄버거 메뉴 버튼 -->
    <v-app-bar-nav-icon
      variant="text"
      color="grey-darken-1"
      @click="$emit('toggle-drawer')"
    ></v-app-bar-nav-icon>

    <v-app-bar-title class="font-weight-bold text-grey-darken-2 text-subtitle-1 text-sm-h6">
      {{ currentRouteName }}
    </v-app-bar-title>

    <v-spacer></v-spacer>

    <!-- 알림 버튼 (모바일에서도 유지) -->
    <v-btn
      icon="mdi-bell-outline"
      variant="text"
      color="grey-darken-1"
      size="small"
      class="mr-1 mr-sm-2"
    ></v-btn>

    <v-divider vertical inset class="mx-1 mx-sm-2"></v-divider>

    <!-- 프로필 영역 -->
    <div class="d-flex align-center ga-2 ga-sm-3 ml-1 ml-sm-2 mr-2">
      <!-- 이름과 파트는 모바일(sm 미만)에서 숨김 -->
      <div class="text-right d-none d-sm-block">
        <p class="text-body-2 font-weight-bold mb-0" style="line-height: 1.2">김네버 사원</p>
        <p class="text-caption text-grey mb-0">콘텐츠 전략파트</p>
      </div>

      <v-avatar color="primary" size="32" size-sm="36" class="elevation-1">
        <v-icon icon="mdi-account" size="20" size-sm="24"></v-icon>
      </v-avatar>
    </div>
  </v-app-bar>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const currentRouteName = computed(() => route.meta?.title || '대시보드')
defineEmits(['toggle-drawer'])
</script>
