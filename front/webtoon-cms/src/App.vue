<!-- @ts-nocheck -->
<template>
  <v-app>
    <!-- 1. 최상단 로딩 바 -->
    <v-progress-linear
      :active="webtoonStore.loading"
      :indeterminate="webtoonStore.loading"
      absolute
      top
      color="#3C68DD"
      height="3"
      style="z-index: 9999"
    ></v-progress-linear>

    <!-- 2. 사이드바 -->
    <AppSidebar v-model="drawer" />

    <!-- 3. 헤더 -->
    <AppHeader @toggle-drawer="drawer = !drawer" />

    <!-- 4. 메인 콘텐츠 영역 -->
    <v-main class="bg-grey-lighten-4">
      <v-container fluid class="pa-4 pa-sm-8">
        <router-view v-slot="{ Component }">
          <v-fade-transition mode="out-in">
            <div :key="$route.path">
              <component :is="Component" />
            </div>
          </v-fade-transition>
        </router-view>
      </v-container>
    </v-main>

    <!-- 5. 전역 공통 컴포넌트 (이름 확인!) -->
    <GlobalSnackbar />
    <GlobalConfirm />
  </v-app>
</template>

<script setup>
import { ref } from 'vue'
import { useWebtoonStore } from '@/stores/webtoonStore'

// 기존 레이아웃 컴포넌트
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'

// 우리가 새로 만든 공통 컴포넌트 (파일 경로와 이름을 정확히 맞췄습니다)
import GlobalSnackbar from '@/components/common/GlobalSnackbar.vue'
import GlobalConfirm from '@/components/common/GlobalConfirm.vue'

const webtoonStore = useWebtoonStore()
const drawer = ref(true)
</script>

<style>
body {
  font-family: 'Pretendard', sans-serif;
}
.v-application {
  font-family: 'Pretendard', sans-serif !important;
}
</style>
