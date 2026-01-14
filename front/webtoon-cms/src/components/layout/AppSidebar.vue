<template>
  <!-- permanent를 삭제하고 v-model을 연결합니다 -->
  <v-navigation-drawer
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    color="#1E2B44"
    class="border-none"
    elevation="10"
  >
    <!-- 상단 로고 영역 -->
    <v-list-item title="Webtoon CMS" class="side-title pa-6 text-h6 font-weight-bold text-white">
      <template v-slot:prepend>
        <v-img :src="logo" width="28" class="mr-4" contain></v-img>
      </template>
    </v-list-item>

    <v-divider class="border-opacity-25"></v-divider>

    <v-list nav class="sidebar-list">
      <v-list-subheader class="text-white text-caption font-weight-bold opacity-70">
        CONTENT
      </v-list-subheader>

      <v-list-item
        prepend-icon="mdi-view-dashboard"
        title="작품 큐레이션"
        to="/"
        exact
      ></v-list-item>

      <v-list-item
        prepend-icon="mdi-format-list-bulleted"
        title="작품 목록 관리"
        to="/manage"
      ></v-list-item>

      <v-list-subheader class="text-white text-caption font-weight-bold mt-4 opacity-70">
        STATISTICS
      </v-list-subheader>

      <v-list-item prepend-icon="mdi-chart-bar" title="조회수 통계" to="/stats"></v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>

<script setup>
import logo from '@/assets/images/logo.png'

defineProps({
  modelValue: { type: Boolean, default: true },
})
defineEmits(['update:modelValue'])
</script>

<style scoped>
.side-title {
  height: 63.99px;
  color: white !important;
}

/* 기존 스타일 유지 */
.sidebar-list :deep(.v-list-item) {
  color: rgba(255, 255, 255, 0.7) !important;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.sidebar-list :deep(.v-list-item--active) {
  background-color: rgba(255, 255, 255, 0.15) !important;
  color: #ffffff !important;
  opacity: 1 !important;
}

.sidebar-list :deep(.v-list-item--active .v-icon) {
  color: #ffffff !important;
}

.sidebar-list :deep(.v-list-item--active .v-list-item-title) {
  font-weight: 700 !important;
}

.sidebar-list :deep(.v-list-item__overlay) {
  display: none !important;
}

.sidebar-list :deep(.v-list-item:not(.v-list-item--active):hover) {
  background-color: rgba(255, 255, 255, 0.08) !important;
  color: #ffffff !important;
}
</style>
