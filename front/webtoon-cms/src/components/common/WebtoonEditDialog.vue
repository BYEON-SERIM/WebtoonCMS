<template>
  <v-dialog v-model="internalValue" max-width="600px" persistent>
    <v-card class="rounded-xl pa-4 shadow-lg">
      <v-card-title class="font-weight-black text-h6 px-2 mb-4">
        {{ isEditMode ? '작품 상세 정보 수정' : '신규 작품 등록' }}
      </v-card-title>

      <v-card-text class="px-2">
        <v-row dense>
          <!-- 1. 작품명 & 작가 -->
          <v-col cols="12">
            <p class="text-caption font-weight-bold text-grey mb-1">작품명</p>
            <v-text-field
              v-model="form.title"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <p class="text-caption font-weight-bold text-grey mb-1">작가</p>
            <v-text-field
              v-model="form.author"
              variant="outlined"
              density="compact"
              hide-details
              class="mb-3"
            ></v-text-field>
          </v-col>

          <!-- 2. 장르 & 상태 -->
          <v-col cols="6">
            <p class="text-caption font-weight-bold text-grey mb-1">장르</p>
            <v-select
              v-model="form.genre"
              :items="genres"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="6">
            <p class="text-caption font-weight-bold text-grey mb-1">상태 설정</p>
            <v-select
              v-model="form.status"
              :items="statuses"
              variant="outlined"
              density="compact"
              hide-details
            ></v-select>
          </v-col>

          <!-- 3. [추가] 예약 발행 시간 설정 영역 -->
          <v-col cols="12">
            <v-expand-transition>
              <div
                v-if="form.status === '발행예약'"
                class="mt-3 pa-4 bg-blue-lighten-5 rounded-lg border-dashed border-blue"
              >
                <p class="text-caption font-weight-bold text-blue-darken-2 mb-1">
                  <v-icon size="small" class="mr-1">mdi-clock-outline</v-icon>발행 예약 시간
                </p>
                <v-text-field
                  v-model="form.scheduledAt"
                  type="datetime-local"
                  variant="outlined"
                  density="compact"
                  hide-details
                  bg-color="white"
                ></v-text-field>
                <p class="text-caption text-blue-darken-1 mt-2">
                  * 설정된 시간이 되면 시스템이 자동으로 <b>'연재중'</b> 상태로 변경합니다.
                </p>
              </div>
            </v-expand-transition>
          </v-col>

          <!-- 4. AI 줄거리 분석 -->
          <v-col cols="12" class="mt-4">
            <div class="d-flex align-center justify-space-between mb-1">
              <p class="text-caption font-weight-bold text-primary">
                <v-icon size="small" class="mr-1">mdi-sparkles</v-icon>작품 줄거리 (AI 분석용)
              </p>
              <v-btn
                size="x-small"
                variant="tonal"
                color="primary"
                @click="generateAiTags"
                :loading="isAiLoading"
              >
                AI 태그 추천
              </v-btn>
            </div>
            <v-textarea
              v-model="form.description"
              variant="outlined"
              density="compact"
              rows="3"
              hide-details
              placeholder="줄거리를 입력하면 AI가 태그를 분석합니다."
            ></v-textarea>
          </v-col>

          <!-- 5. 태그 관리 영역 -->
          <v-col cols="12" class="mt-4">
            <p class="text-caption font-weight-bold text-grey mb-1">현재 적용된 태그</p>
            <div
              class="d-flex flex-wrap ga-1 bg-grey-lighten-4 pa-3 rounded-lg min-h-12 border-dashed"
              style="border: 1px dashed #ccc"
            >
              <v-chip
                v-for="(tag, idx) in tagsList"
                :key="idx"
                size="small"
                closable
                color="primary"
                variant="flat"
                class="font-weight-bold"
                @click:close="removeTag(idx)"
              >
                {{ tag }}
              </v-chip>
              <span v-if="tagsList.length === 0" class="text-caption text-grey py-1"
                >등록된 태그가 없습니다.</span
              >
            </div>
            <v-text-field
              v-model="newTag"
              placeholder="태그 직접 입력 (엔터)"
              variant="underlined"
              density="compact"
              hide-details
              class="mt-1 px-1"
              @keyup.enter="addTag"
            ></v-text-field>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions class="px-2 mt-6">
        <v-spacer></v-spacer>
        <v-btn variant="text" color="grey" @click="close">취소</v-btn>
        <v-btn
          variant="flat"
          color="primary"
          class="px-8 rounded-lg font-weight-bold"
          @click="handleSave"
          :loading="isSaving"
        >
          저장하기
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useWebtoonStore } from '@/stores/webtoonStore'
import { useSnackbarStore } from '@/stores/snackbar'

const props = defineProps({
  modelValue: Boolean,
  item: Object,
})

const emit = defineEmits(['update:modelValue', 'saved'])

const webtoonStore = useWebtoonStore()
const snackbar = useSnackbarStore()

const isSaving = ref(false)
const isAiLoading = ref(false)
const newTag = ref('')

const genres = ['로맨스판타지', 'BL', '판타지', '에피소드', '로맨스', '스릴러', '스포츠']
const statuses = ['연재중', '완결', '휴재', '발행예약'] // '발행예약' 추가

const form = ref({
  id: null,
  title: '',
  author: '',
  genre: '로맨스판타지',
  status: '연재중',
  description: '',
  tags: '',
  thumbnail: '',
  scheduledAt: null, // 예약 시간 필드 추가
})

const tagsList = computed(() => {
  if (!form.value.tags) return []
  return form.value.tags
    .split(',')
    .map((t) => t.trim())
    .filter((t) => t !== '')
})

const isEditMode = computed(() => !!props.item?.id)
const internalValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
})

watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal) {
      if (props.item) {
        // 수정 모드: 기존 데이터 복사 (예약 시간 포함)
        form.value = { ...props.item }
      } else {
        // 신규 등록 모드 초기화
        form.value = {
          id: null,
          title: '',
          author: '',
          genre: '로맨스판타지',
          status: '연재중',
          description: '',
          tags: '',
          thumbnail: 'https://via.placeholder.com/150x200?text=New+Webtoon',
          scheduledAt: null,
        }
      }
    }
  },
)

const close = () => (internalValue.value = false)

const removeTag = (index) => {
  const list = [...tagsList.value]
  list.splice(index, 1)
  form.value.tags = list.join(',')
}

const addTag = () => {
  if (!newTag.value.trim()) return
  const list = [...tagsList.value]
  if (!list.includes(newTag.value.trim())) {
    list.push(newTag.value.trim())
    form.value.tags = list.join(',')
  }
  newTag.value = ''
}

const handleSave = async () => {
  if (!form.value.title) {
    snackbar.showMessage('작품명을 입력해주세요.', 'warning')
    return
  }

  // 예약 발행 시간 유효성 체크
  if (form.value.status === '발행예약' && !form.value.scheduledAt) {
    snackbar.showMessage('예약 발행 시간을 설정해주세요.', 'warning')
    return
  }

  isSaving.value = true
  try {
    if (isEditMode.value) {
      await webtoonStore.updateWebtoon(form.value)
      await webtoonStore.addLog(`[${form.value.title}] 정보 수정 완료`, 'blue')
    } else {
      await webtoonStore.addWebtoon(form.value)
      await webtoonStore.addLog(`[${form.value.title}] 신규 등록 완료`, 'success')
    }
    snackbar.showMessage('데이터베이스에 성공적으로 저장되었습니다.', 'success')
    emit('saved')
    close()
  } catch (err) {
    snackbar.showMessage('저장 중 오류가 발생했습니다.', 'error')
  } finally {
    isSaving.value = false
  }
}

const generateAiTags = async () => {
  if (!form.value.description) return
  isAiLoading.value = true
  try {
    const recommended = await webtoonStore.recommendTags(form.value.description)
    form.value.tags = recommended
  } finally {
    isAiLoading.value = false
  }
}
</script>

<style scoped>
.ga-1 {
  gap: 4px;
}
.min-h-12 {
  min-height: 48px;
}
.border-dashed {
  border: 1px dashed #ccc !important;
}
</style>
