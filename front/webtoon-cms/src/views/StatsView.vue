<!-- @ts-nocheck -->
<template>
  <v-container fluid class="pa-2 pa-sm-6 bg-grey-lighten-4" style="min-height: 100vh">
    <!-- 1. 상단 요약 카드 (Store의 statsSummary 연동) -->
    <v-row class="mb-3">
      <v-col v-for="s in summary" :key="s.title" cols="12" sm="6" md="3" class="py-2">
        <v-card border flat class="rounded-lg pa-4 bg-white shadow-sm">
          <div class="text-caption text-grey-darken-1 font-weight-bold mb-1">{{ s.title }}</div>
          <div class="d-flex align-end justify-space-between">
            <div class="text-h5 text-sm-h4 font-weight-black">{{ s.value }}</div>
            <div
              :class="s.trend?.startsWith('+') ? 'text-success' : 'text-primary'"
              class="text-caption font-weight-bold mb-1"
            >
              {{ s.trend }}
            </div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row>
      <!-- 2. 조회수 추이 차트 (DB dailyStats 연동) -->
      <v-col cols="12" md="8" class="py-2">
        <v-card border flat class="rounded-lg pa-4 pa-sm-6 bg-white shadow-sm h-100">
          <div class="d-flex justify-space-between align-center mb-6">
            <div class="text-subtitle-1 font-weight-black">일일 조회수 추이</div>
            <v-btn-toggle
              v-model="timeRange"
              density="compact"
              color="primary"
              mandatory
              variant="outlined"
            >
              <v-btn value="7" size="small">7일</v-btn>
              <v-btn value="30" size="small">30일</v-btn>
            </v-btn-toggle>
          </div>
          <div :style="{ height: $vuetify.display.xs ? '250px' : '300px' }">
            <Line
              v-if="lineChartData.labels.length > 0"
              :data="lineChartData"
              :options="lineChartOptions"
            />
            <div v-else class="d-flex align-center justify-center h-100 text-grey">
              조회수 데이터가 없습니다.
            </div>
          </div>
        </v-card>
      </v-col>

      <!-- 3. 장르별 비중 차트 (Store의 genreDistribution 연동) -->
      <v-col cols="12" md="4" class="py-2">
        <v-card border flat class="rounded-lg pa-4 pa-sm-6 bg-white shadow-sm h-100">
          <div class="text-subtitle-1 font-weight-black mb-6">보유 장르 분포</div>
          <div
            :style="{ height: $vuetify.display.xs ? '250px' : '300px' }"
            class="d-flex justify-center"
          >
            <Doughnut
              v-if="doughnutData && doughnutData.labels?.length > 0"
              :data="doughnutData"
              :options="doughnutOptions"
            />
            <div v-else class="d-flex align-center text-grey">데이터가 없습니다.</div>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-row class="mt-1 mt-sm-3">
      <!-- 4. 실시간 조회수 랭킹 TOP 5 (Store의 topFiveToons 연동) -->
      <v-col cols="12" md="8">
        <v-card border flat class="rounded-lg shadow-sm bg-white overflow-hidden">
          <v-card-title
            class="font-weight-black px-4 px-sm-6 pt-3 pt-sm-4 pb-1 text-body-1 text-sm-h6"
          >
            실시간 누적 조회수 TOP 5
          </v-card-title>
          <v-table density="comfortable" class="pa-2 pa-sm-4 custom-table">
            <thead>
              <tr class="bg-grey-lighten-5">
                <th class="text-left font-weight-bold">순위</th>
                <th class="text-left font-weight-bold">작품명</th>
                <th class="text-left font-weight-bold d-none d-sm-table-cell">작가 / 장르</th>
                <th class="text-right font-weight-bold">누적 조회수</th>
                <th class="text-center font-weight-bold">상태</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, idx) in topToons" :key="item.id">
                <td class="font-weight-black text-primary">{{ idx + 1 }}</td>
                <td class="font-weight-bold text-truncate" style="max-width: 180px">
                  {{ item.title }}
                </td>
                <td class="text-grey-darken-1 d-none d-sm-table-cell">
                  <span class="text-body-2 font-weight-medium">{{ item.author }}</span>
                  <v-chip
                    size="x-small"
                    variant="flat"
                    :color="getGenreColor(item.genre)"
                    class="ml-2 font-weight-bold text-white"
                  >
                    {{ item.genre }}
                  </v-chip>
                </td>
                <td class="text-right font-weight-black text-caption text-sm-body-2">
                  {{ item.viewCount?.toLocaleString() }}
                </td>
                <td class="text-center">
                  <v-chip
                    :size="$vuetify.display.xs ? 'x-small' : 'small'"
                    :color="item.status === '연재중' ? 'success' : 'grey-darken-1'"
                    variant="flat"
                    class="font-weight-bold text-white"
                  >
                    {{ item.status }}
                  </v-chip>
                </td>
              </tr>
            </tbody>
          </v-table>
        </v-card>
      </v-col>

      <!-- 5. 최근 변경 이력 -->
      <v-col cols="12" md="4">
        <v-card border flat class="rounded-lg shadow-sm bg-white h-100">
          <v-card-title class="font-weight-black px-4 pt-4 text-body-1">
            최근 변경 이력
          </v-card-title>

          <!-- 스크롤 영역 컨테이너 -->
          <v-card-text class="pa-0">
            <div class="recent-log-container pa-4">
              <v-timeline side="end" align="start" density="compact">
                <v-timeline-item
                  v-for="log in recentLogs"
                  :key="log.id"
                  :dot-color="log.color"
                  size="x-small"
                >
                  <div class="text-caption font-weight-black text-primary">
                    {{ log.displayTime }}
                  </div>
                  <div class="text-caption text-grey-darken-2">{{ log.message }}</div>
                </v-timeline-item>

                <v-timeline-item v-if="recentLogs.length === 0" dot-color="grey" size="x-small">
                  <div class="text-caption text-grey">이력이 없습니다.</div>
                </v-timeline-item>
              </v-timeline>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useWebtoonStore } from '@/stores/webtoonStore'
import { lineChartOptions, doughnutOptions } from '@/utils/chartConfigs'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from 'chart.js'
import { Line, Doughnut } from 'vue-chartjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
)

const webtoonStore = useWebtoonStore()
const timeRange = ref('7') // 일일 조회수 추이 (7일을 delfault값으로)

onMounted(async () => {
  await Promise.all([webtoonStore.fetchDashboardData(), webtoonStore.fetchGenreCodes()])
})

// Store의 Getter들을 컴포넌트 데이터와 연결
const summary = computed(() => webtoonStore.statsSummary)
const topToons = computed(() => webtoonStore.topFiveToons)
const doughnutData = computed(() => webtoonStore.genreDistribution)
const recentLogs = computed(() => webtoonStore.recentLogs)

/* 라인 차트 데이터 처리 */
const lineChartData = computed(() => {
  const stats = webtoonStore.dailyStats || []

  // 날짜순 정렬 후 선택된 범위만큼 슬라이스
  const sortedStats = [...stats]
    .sort((a, b) => new Date(a.statDate) - new Date(b.statDate))
    .slice(-parseInt(timeRange.value))

  return {
    labels: sortedStats.map((s) => s.statDate.substring(5)), // '2024-05-20' -> '05-20'
    datasets: [
      {
        label: '일일 조회수',
        backgroundColor: 'rgba(60, 104, 221, 0.1)',
        borderColor: '#3C68DD',
        data: sortedStats.map((s) => s.dailyViews),
        tension: 0.4,
        fill: true,
        pointRadius: timeRange.value === '30' ? 2 : 4,
        pointBackgroundColor: '#3C68DD',
      },
    ],
  }
})

const getGenreColor = (genre) => {
  return webtoonStore.getGenreColor(genre)
}
</script>

<style scoped>
.h-100 {
  height: 100%;
}
.custom-table :deep(th),
.custom-table :deep(td) {
  white-space: nowrap;
  padding: 0 16px !important;
}
.text-truncate {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
tbody tr:hover {
  background-color: #f8faff;
}

.recent-log-container {
  max-height: 300px;
  overflow-y: auto;
  scrollbar-gutter: stable;
}

/* 커스텀 스크롤바 디자인  */
.recent-log-container::-webkit-scrollbar {
  width: 4px;
}
.recent-log-container::-webkit-scrollbar-track {
  background: #f1f1f1;
}
.recent-log-container::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 10px;
}
.recent-log-container::-webkit-scrollbar-thumb:hover {
  background: #bdbdbd;
}

/* 테이블 호환 높이 설정 */
.h-100 {
  height: 100%;
}
</style>
