<!-- @ts-nocheck -->
<template>
  <v-container fluid class="pa-2 pa-sm-6">
    <!-- 1. 헤더 섹션 -->
    <v-row class="mb-4" align="center">
      <v-col cols="12" sm="7">
        <h2 class="text-h5 font-weight-black text-grey-darken-3">작품 마스터 관리</h2>
        <p class="text-caption text-grey mt-1">
          Pinia와 AI 엔진을 활용하여 작품 메타데이터를 통합 관리합니다.
        </p>
      </v-col>
      <v-col cols="12" sm="5" class="d-flex ga-2 justify-sm-end">
        <!-- AI 제목 찾기 버튼 -->
        <v-btn
          variant="outlined"
          color="primary"
          prepend-icon="mdi-robot-outline"
          rounded="lg"
          size="large"
          @click="isAiSearchOpen = true"
        >
          AI 제목 찾기
        </v-btn>
        <v-btn
          color="primary"
          prepend-icon="mdi-plus"
          size="large"
          rounded="lg"
          @click="openModal(null)"
        >
          신규 작품 등록
        </v-btn>
      </v-col>
    </v-row>

    <!-- 2. 컨트롤러 영역 -->
    <v-card border flat class="rounded-lg mb-6 pa-4 shadow-sm bg-white">
      <v-row dense>
        <v-col cols="12" md="4">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="작품명 또는 작가 검색"
            variant="underlined"
            color="primary"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="6" md="2">
          <v-select
            v-model="filterGenre"
            :items="['전체', '로맨스판타지', '판타지', '에피소드', '로맨스', '스릴러', '스포츠']"
            label="장르"
            variant="underlined"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="6" md="2">
          <v-select
            v-model="filterStatus"
            :items="['전체', '연재중', '완결', '휴재']"
            label="상태"
            variant="underlined"
            hide-details
          ></v-select>
        </v-col>
        <v-col cols="12" md="4">
          <v-select
            v-model="sortBy"
            :items="[
              { title: '최신등록순', value: 'id_desc' },
              { title: '조회수 높은순', value: 'views_desc' },
              { title: '제목 가나다순', value: 'title_asc' },
            ]"
            label="정렬 방식"
            variant="underlined"
            hide-details
          ></v-select>
        </v-col>
      </v-row>
    </v-card>

    <!-- 3. 작품 리스트 -->
    <v-card border flat class="rounded-lg overflow-hidden shadow-sm">
      <v-list lines="two" class="pa-0">
        <v-list-item
          v-for="toon in paginatedWebtoons"
          :key="toon.id"
          class="py-3 py-sm-4 border-b px-2 px-sm-4"
        >
          <template v-slot:prepend>
            <div class="text-caption text-grey d-none d-sm-block mr-4" style="width: 30px">
              {{ toon.id }}
            </div>
            <v-avatar rounded="lg" size="52" class="mr-3 border shadow-sm">
              <v-img :src="toon.thumbnail" cover></v-img>
            </v-avatar>
          </template>

          <v-list-item-title class="font-weight-black">{{ toon.title }}</v-list-item-title>

          <v-list-item-subtitle class="d-flex align-center">
            {{ toon.author }}
            <v-divider vertical class="mx-2" style="height: 12px"></v-divider>
            <v-chip
              :color="getGenreColor(toon.genre)"
              size="x-small"
              variant="flat"
              class="font-weight-bold text-white"
            >
              {{ toon.genre }}
            </v-chip>
          </v-list-item-subtitle>

          <template v-slot:append>
            <v-btn
              icon="mdi-pencil-outline"
              variant="text"
              color="blue"
              @click="openModal(toon)"
            ></v-btn>
            <v-btn
              icon="mdi-delete-outline"
              variant="text"
              color="error"
              @click="deleteItem(toon)"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>

    <!-- 4. 페이지네이션 -->
    <v-pagination
      v-model="page"
      :length="pageCount"
      rounded="lg"
      color="primary"
      class="mt-6"
    ></v-pagination>

    <!-- AI - 줄거리로 제목 찾기 -->
    <v-dialog v-model="isAiSearchOpen" max-width="500">
      <v-card class="rounded-xl pa-4">
        <v-card-title class="d-flex align-center font-weight-black">
          <v-icon color="primary" class="mr-2">mdi-robot-outline</v-icon>
          AI 시놉시스 탐색기
        </v-card-title>
        <v-card-text>
          <p class="text-caption text-grey-darken-1 mb-4">
            줄거리나 소재를 입력하면 AI가 관리 중인 작품을 찾아줍니다.
          </p>
          <v-textarea
            v-model="aiQuery"
            variant="outlined"
            placeholder="예: 주인공이 과거로 돌아가서 복수하는 로맨스 판타지 알려줘"
            rows="3"
            hide-details
            class="mb-4"
          ></v-textarea>

          <v-expand-transition>
            <div v-if="aiResult" class="bg-blue-lighten-5 pa-4 rounded-lg text-body-2 mb-4">
              <div class="font-weight-black text-primary mb-1">AI 분석 결과:</div>
              <div style="white-space: pre-line">{{ aiResult }}</div>
            </div>
          </v-expand-transition>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="closeAiSearch">닫기</v-btn>
          <v-btn
            color="primary"
            variant="flat"
            :loading="isAiLoading"
            @click="handleAiSearch"
            class="px-6 rounded-lg font-weight-bold"
          >
            작품 찾기
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- 5. 공통 수정 다이얼로그 적용 -->
    <WebtoonEditDialog v-model="isModalOpen" :item="selectedToon" />
  </v-container>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useWebtoonStore } from '@/stores/webtoonStore'
import { useSnackbarStore } from '@/stores/snackbar'
import { useDialogStore } from '@/stores/dialog'
import WebtoonEditDialog from '@/components/common/WebtoonEditDialog.vue'

const webtoonStore = useWebtoonStore()
const snackbar = useSnackbarStore()
const dialog = useDialogStore()

// --- 기존 상태 변수 ---
const searchQuery = ref('')
const filterGenre = ref('전체')
const filterStatus = ref('전체')
const sortBy = ref('id_desc')
const page = ref(1)
const itemsPerPage = 7
const isModalOpen = ref(false)
const selectedToon = ref(null)

// --- AI 상태 변수 ---
const isAiSearchOpen = ref(false)
const aiQuery = ref('')
const aiResult = ref('')
const isAiLoading = ref(false)

onMounted(async () => {
  await webtoonStore.fetchGenreCodes()
})

const handleAiSearch = async () => {
  if (!aiQuery.value.trim()) return
  isAiLoading.value = true
  aiResult.value = ''
  try {
    aiResult.value = await webtoonStore.findTitleByAi(aiQuery.value)
    webtoonStore.addLog(`AI 시놉시스 탐색 시도: ${aiQuery.value.substring(0, 10)}...`, 'purple')
  } catch (err) {
    snackbar.showMessage('AI 검색 중 오류가 발생했습니다.', 'error')
  } finally {
    isAiLoading.value = false
  }
}

const closeAiSearch = () => {
  isAiSearchOpen.value = false
  aiQuery.value = ''
  aiResult.value = ''
}

const filteredAndSortedWebtoons = computed(() => {
  let list = [...webtoonStore.webtoons]
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(
      (t) => t.title.toLowerCase().includes(q) || t.author.toLowerCase().includes(q),
    )
  }
  if (filterGenre.value !== '전체') list = list.filter((t) => t.genre === filterGenre.value)
  if (filterStatus.value !== '전체') list = list.filter((t) => t.status === filterStatus.value)
  list.sort((a, b) => {
    if (sortBy.value === 'views_desc') return (b.viewCount || 0) - (a.viewCount || 0)
    if (sortBy.value === 'title_asc') return a.title.localeCompare(b.title)
    return b.id - a.id
  })
  return list
})

const paginatedWebtoons = computed(() => {
  const start = (page.value - 1) * itemsPerPage
  return filteredAndSortedWebtoons.value.slice(start, start + itemsPerPage)
})

const pageCount = computed(() => Math.ceil(filteredAndSortedWebtoons.value.length / itemsPerPage))
watch([searchQuery, filterGenre, filterStatus, sortBy], () => (page.value = 1))

const openModal = (item) => {
  selectedToon.value = item
  isModalOpen.value = true
}

const deleteItem = async (item) => {
  const ok = await dialog.confirm('작품 삭제 확인', `[${item.title}] 작품을 정말 삭제하시겠습니까?`)
  if (ok) {
    try {
      await webtoonStore.deleteWebtoon(item.id)
      snackbar.showMessage('작품이 정상적으로 삭제되었습니다.', 'success')
    } catch (error) {
      snackbar.showMessage('삭제 중 오류가 발생했습니다.', 'error')
    }
  }
}

const getGenreColor = (genre) => {
  return webtoonStore.getGenreColor(genre)
}
</script>
