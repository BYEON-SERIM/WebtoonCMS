import { createRouter, createWebHistory } from 'vue-router'
import { useWebtoonStore } from '@/stores/webtoonStore' // 로딩 상태 제어를 위해 스토어 임포트

// 뷰 컴포넌트 임포트 (@ 별칭으로 경로 통일)
import HomeView from '@/views/HomeView.vue'
import ManageView from '@/views/ManageView.vue'
import StatsView from '@/views/StatsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { 
      path: '/', 
      name: 'home', 
      component: HomeView, 
      meta: { title: '작품 큐레이션' } 
    },
    { 
      path: '/manage', 
      name: 'manage', 
      component: ManageView, 
      meta: { title: '작품 목록 관리' } 
    },
    { 
      path: '/stats', 
      name: 'stats', 
      component: StatsView, // 중복 제거 및 StatsView 연결
      meta: { title: '조회수 통계' } 
    },
  ]
})

/**
 * [Navigation Guard] 페이지 이동 전/후 로직
 */

// 1. 페이지 이동 시작 시
router.beforeEach((to, from, next) => {
  const webtoonStore = useWebtoonStore()
  
  // 전역 로딩 바 활성화
  webtoonStore.setLoading(true)
  
  // 브라우저 탭 제목 변경 (선택 사항)
  document.title = `웹툰 CMS - ${to.meta.title || '관리자'}`
  
  next()
})

// 2. 페이지 이동 완료 시
router.afterEach(() => {
  const webtoonStore = useWebtoonStore()
  
  // 너무 빨리 지나가면 로딩바가 안 보이므로 
  // 실제 서비스 느낌을 주도록 300ms 정도 지연 후 종료
  setTimeout(() => {
    webtoonStore.setLoading(false)
  }, 300)
})

export default router