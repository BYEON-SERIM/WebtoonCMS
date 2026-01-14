<!-- @ts-nocheck -->
<template>
  <v-container fluid class="pa-2 pa-sm-6">
    <!-- 1. 상단 요약 통계 섹션 (기존 유지) -->
    <v-row class="mb-2 mb-sm-6">
      <v-col
        v-for="stat in summaryStats"
        :key="stat.title"
        cols="12"
        sm="6"
        md="3"
        class="py-1 py-sm-3"
      >
        <v-card
          flat
          border
          class="bg-white rounded-lg pa-2 shadow-sm"
          :style="`border-top: 4px solid ${stat.color} !important;`"
        >
          <v-list-item class="top-card">
            <template v-slot:prepend>
              <v-avatar :color="stat.color + '-lighten-4'" rounded="lg" size="40">
                <v-icon :color="stat.color" :icon="stat.icon" size="20"></v-icon>
              </v-avatar>
            </template>
            <v-list-item-title class="text-caption text-grey-darken-1 font-weight-bold">
              {{ stat.title }}
            </v-list-item-title>
            <div class="text-h5 font-weight-black text-grey-darken-4 mt-1" style="line-height: 1.2">
              {{ stat.value }}
            </div>
          </v-list-item>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- 2. 왼쪽 메인: 큐레이션 순서 관리 -->
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-lg overflow-hidden shadow-sm" :loading="isSaving">
          <v-toolbar
            color="white"
            flat
            border="bottom"
            class="px-2 px-sm-4 py-2 py-sm-0"
            height="auto"
            style="min-height: 80px"
          >
            <v-toolbar-title
              class="font-weight-black text-body-1 d-none d-lg-block"
              style="flex: none; width: 130px"
            >
              <v-icon icon="mdi-reorder-horizontal" size="small" class="mr-2"></v-icon>
              큐레이션 관리
            </v-toolbar-title>

            <v-spacer></v-spacer>

            <div
              class="d-flex flex-grow-1 flex-sm-grow-0 align-center ga-2 ga-sm-4 w-100 w-sm-auto"
            >
              <span
                v-if="isFiltered"
                class="text-caption text-warning font-weight-bold d-none d-sm-block"
              >
                *필터 해제 시 순서 변경 가능
              </span>

              <v-text-field
                v-model="searchQuery"
                prepend-inner-icon="mdi-magnify"
                placeholder="작품/작가 검색"
                variant="underlined"
                color="primary"
                hide-details
                class="flex-grow-1"
                style="min-width: 150px; max-width: 250px"
              ></v-text-field>

              <v-select
                v-model="selectedGenre"
                :items="[
                  '전체',
                  '로맨스판타지',
                  'BL',
                  '판타지',
                  '에피소드',
                  '로맨스',
                  '스릴러',
                  '스포츠',
                ]"
                variant="underlined"
                color="primary"
                hide-details
                style="width: 100px; flex: none"
              ></v-select>

              <v-btn
                color="primary"
                variant="flat"
                rounded="lg"
                class="font-weight-bold px-4"
                size="small"
                :loading="isSaving"
                :disabled="isFiltered"
                @click="saveOrder"
              >
                순서저장
              </v-btn>
            </div>
          </v-toolbar>

          <!-- [수정 포인트] 리스트 스크롤 영역 추가: 7개 높이 고정 -->
          <div class="list-scroll-area">
            <v-list lines="two" class="pa-0">
              <draggable
                v-model="displayWebtoons"
                item-key="id"
                handle=".drag-handle"
                ghost-class="ghost-card"
                :disabled="isFiltered"
                tag="div"
              >
                <template #item="{ element, index }">
                  <div class="draggable-item-wrapper">
                    <v-list-item
                      class="py-3 py-sm-4 border-bottom-light px-2 px-sm-4"
                      :class="{ 'top-ranking-item': index < 5 && !isFiltered }"
                    >
                      <template v-slot:prepend>
                        <v-icon
                          icon="mdi-drag"
                          class="drag-handle mr-2 mr-sm-4"
                          :color="isFiltered ? 'grey-lighten-3' : 'grey-lighten-1'"
                        ></v-icon>
                        <span
                          class="text-body-1 text-sm-h6 font-weight-black mr-2 mr-sm-6"
                          :class="index < 5 && !isFiltered ? 'text-primary' : 'text-grey-darken-1'"
                        >
                          {{ index + 1 }}
                        </span>
                        <v-avatar
                          rounded="lg"
                          size="56"
                          class="mr-3 mr-sm-4 border shadow-sm bg-white"
                        >
                          <v-img :src="element.thumbnail" cover></v-img>
                        </v-avatar>
                      </template>

                      <v-list-item-title
                        class="font-weight-black text-body-2 text-sm-subtitle-1 mb-1"
                      >
                        {{ element.title }}
                      </v-list-item-title>

                      <v-list-item-subtitle class="d-flex align-center ga-1 ga-sm-2">
                        <span
                          class="text-caption text-sm-body-2 font-weight-bold text-grey-darken-1"
                          >{{ element.author }}</span
                        >
                        <v-divider vertical inset class="mx-1 d-none d-sm-block"></v-divider>
                        <v-chip
                          size="x-small"
                          variant="flat"
                          :color="webtoonStore.getGenreColor(element.genre)"
                          class="text-white font-weight-bold"
                        >
                          {{ element.genre }}
                        </v-chip>
                      </v-list-item-subtitle>

                      <template v-slot:append>
                        <div class="text-right mr-6 d-none d-sm-block">
                          <div class="text-caption text-grey font-weight-bold">조회수</div>
                          <div class="text-body-2 font-weight-black">
                            {{ element.viewCount?.toLocaleString() }}
                          </div>
                        </div>
                        <v-chip
                          :color="element.status === '연재중' ? 'success' : 'grey-darken-1'"
                          size="small"
                          variant="flat"
                          class="font-weight-bold text-white mr-1 mr-sm-2"
                        >
                          {{ element.status }}
                        </v-chip>
                        <div class="d-flex align-center ga-1">
                          <v-btn
                            icon="mdi-chevron-double-up"
                            variant="text"
                            color="primary"
                            size="small"
                            :disabled="index === 0 || isFiltered"
                            @click="moveToTop(element)"
                          ></v-btn>
                          <v-btn
                            icon="mdi-pencil-outline"
                            variant="text"
                            color="grey"
                            size="small"
                            @click="openEditModal(element)"
                          ></v-btn>
                        </div>
                      </template>
                    </v-list-item>
                  </div>
                </template>
              </draggable>
              <v-list-item
                v-if="displayWebtoons.length === 0"
                class="pa-10 text-center text-grey font-weight-bold"
              >
                검색 결과가 없습니다.
              </v-list-item>
            </v-list>
          </div>
        </v-card>
      </v-col>

      <!-- 3. 오른쪽 사이드: 최근 변경 이력 (기존 유지) -->
      <v-col cols="12" md="4">
        <v-card border flat class="rounded-lg mb-6 shadow-sm overflow-hidden">
          <v-card-item title="최근 변경 이력"></v-card-item>
          <v-divider></v-divider>
          <div class="log-scroll-area pa-4">
            <v-timeline side="end" align="start" density="compact">
              <v-timeline-item
                v-for="log in recentLogs"
                :key="log.id"
                :dot-color="log.color || 'blue'"
                size="x-small"
              >
                <div class="text-caption font-weight-black">{{ log.displayTime }}</div>
                <div class="text-caption text-grey-darken-2">{{ log.message }}</div>
              </v-timeline-item>
            </v-timeline>
          </div>
        </v-card>

        <v-card color="blue-lighten-5" flat class="rounded-lg border-dashed">
          <v-card-item title="스마트 운영 가이드">
            <template v-slot:prepend>
              <v-icon icon="mdi-lightbulb-on-outline" color="blue-darken-2"></v-icon>
            </template>
          </v-card-item>
          <v-card-text class="text-caption text-blue-grey-darken-3">
            <div class="mb-2">
              <v-chip size="x-small" color="blue-darken-2" variant="flat" class="mr-1">AI</v-chip>
              <b>Gemini 엔진 활성화:</b> 줄거리를 기반으로 AI 태그 추천을 받을 수 있습니다.
            </div>
            <div>
              <v-chip size="x-small" color="grey-darken-2" variant="flat" class="mr-1">TIP</v-chip>
              <b>운영 팁:</b> 필터링 중에는 순서 변경이 제한됩니다. 순서를 바꾸려면 필터를 해제해
              주세요.
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <WebtoonEditDialog v-model="isModalOpen" :item="selectedToon" />
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from 'vue'
import draggable from 'vuedraggable'
import { useWebtoonStore } from '@/stores/webtoonStore'
import { useSnackbarStore } from '@/stores/snackbar'
import WebtoonEditDialog from '@/components/common/WebtoonEditDialog.vue'

const webtoonStore = useWebtoonStore()
const snackbar = useSnackbarStore()

const searchQuery = ref('')
const selectedGenre = ref('전체')
const isSaving = ref(false)
const isModalOpen = ref(false)
const selectedToon = ref(null)

const isFiltered = computed(() => searchQuery.value !== '' || selectedGenre.value !== '전체')

onMounted(async () => {
  await webtoonStore.fetchWebtoons()
  await webtoonStore.fetchLogs()
  await webtoonStore.fetchGenreCodes()
})

const summaryStats = computed(() => webtoonStore.statsSummary)
const recentLogs = computed(() => webtoonStore.recentLogs)

const displayWebtoons = computed({
  get() {
    return webtoonStore.webtoons.filter((toon) => {
      const matchSearch =
        toon.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        toon.author.toLowerCase().includes(searchQuery.value.toLowerCase())
      const matchGenre = selectedGenre.value === '전체' || toon.genre === selectedGenre.value
      return matchSearch && matchGenre
    })
  },
  set(newValue) {
    if (!isFiltered.value) {
      webtoonStore.updateWebtoonsOrder(newValue)
    }
  },
})

const saveOrder = async () => {
  if (isSaving.value) return
  isSaving.value = true
  try {
    await webtoonStore.saveFinalOrder()
    await nextTick()
    snackbar.showMessage('큐레이션 순서가 저장되었습니다.', 'success')
  } catch (error) {
    snackbar.showMessage('저장 중 오류 발생', 'error')
  } finally {
    isSaving.value = false
  }
}

const moveToTop = async (item) => {
  if (isFiltered.value) return
  const fullList = [...webtoonStore.webtoons]
  const index = fullList.findIndex((t) => t.id === item.id)
  if (index > 0) {
    const [targetItem] = fullList.splice(index, 1)
    fullList.unshift(targetItem)
    webtoonStore.updateWebtoonsOrder(fullList)
    await saveOrder()
  }
}

const openEditModal = (toon) => {
  selectedToon.value = toon
  isModalOpen.value = true
}
</script>

<style scoped>
.list-scroll-area {
  max-height: 650px;
  overflow-y: auto;
}

.border-bottom-light {
  border-bottom: 1px solid #f0f0f0;
}
.drag-handle {
  cursor: grab;
}
.drag-handle:active {
  cursor: grabbing;
}
.ghost-card {
  opacity: 0.4;
  background: #e3f2fd !important;
}
.top-card {
  height: 80px;
}
.top-ranking-item {
  background-color: #f8faff !important;
  border-left: 4px solid #3c68dd !important;
}

/* 로그 영역과 동일한 스크롤바 디자인 적용 */
.list-scroll-area::-webkit-scrollbar {
  width: 4px;
}
.list-scroll-area::-webkit-scrollbar-track {
  background: transparent;
}
.list-scroll-area::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}

.log-scroll-area {
  max-height: 400px;
  overflow-y: auto;
}
.ga-1 {
  gap: 4px;
}
.ga-2 {
  gap: 8px;
}
.ga-4 {
  gap: 16px;
}
</style>
