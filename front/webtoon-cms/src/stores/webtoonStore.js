import { defineStore } from 'pinia'
import api from '@/api'

export const useWebtoonStore = defineStore('webtoonStore', {
  state: () => ({
    webtoons: [],     // 전체 웹툰 리스트
    logs: [],         // 변경 이력 리스트
    dailyStats: [],   // 일별 조회수
    genreCodes: [],   // 장르 코드
    loading: false,
  }),

  getters: {
    // 1. 대시보드 상단 요약 통계
    statsSummary: (state) => {
      const list = state.webtoons || [];
      const total = list.length;
      if (total === 0) return [];

      const totalViews = list.reduce((acc, cur) => acc + (cur.viewCount || 0), 0);
      const activeCount = list.filter(w => w.status === '연재중').length;
      const aiTaggedCount = list.filter(w => w.tags && w.tags.length > 0).length;

      // 단위 변환 (억, 만)
      const viewsDisplay = totalViews >= 100000000 
        ? (totalViews / 100000000).toFixed(1) + '억' 
        : (totalViews / 10000).toFixed(0) + '만';

      return [
        { title: '전체 누적 조회수', value: viewsDisplay, trend: '+12.5%' },
        { title: '연재 중 작품', value: activeCount + '개', trend: '+2' },
        { title: 'AI 분석 완료', value: aiTaggedCount + '개', trend: '100%' },
        { title: '전체 작품 수', value: total + '개', trend: 'NEW' },
      ];
    },

    // 2. 조회수 TOP 5 데이터
    topFiveToons: (state) => {
      return [...state.webtoons]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5);
    },

    // 3. 장르 분포 데이터
    genreDistribution: (state) => {
      const list = state.webtoons || [];
      if (list.length === 0) return { labels: [], datasets: [] };

      const counts = {};
      list.forEach(w => {
        if (w.genre) counts[w.genre] = (counts[w.genre] || 0) + 1;
      });

      return {
        labels: Object.keys(counts),
        datasets: [{
          label: '장르 분포',
          data: Object.values(counts),
          backgroundColor: ['#5A9CB5', '#8BAE66', '#FACE68', '#FAAC68', '#FA6868', '#C5B0CD'],
          borderWidth: 0
        }]
      };
    },

    // 4. 가공된 최근 로그
    recentLogs: (state) => {
      return state.logs.map(log => ({
        ...log,
        color: log.color || 'blue',
        displayTime: log.createdAt 
          ? new Date(log.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false }) 
          : '방금 전'
      })).slice(0, 6);
    }
  },

  actions: {
    setLoading(value) {
      this.loading = value
    },
    
    // 대시보드에 사용하는 데이터
    async fetchDashboardData() {
      this.loading = true;
      try {
        const [webtoonsRes, logsRes, statsRes] = await Promise.all([
          api.get('/webtoons'),
          api.get('/logs'),
          api.get('/webtoons/daily-stats') // 백엔드에 해당 엔드포인트 구현 필요
        ]);
        
        this.webtoons = webtoonsRes.data || [];
        this.logs = logsRes.data || [];
        this.dailyStats = statsRes.data || [];
      } catch (err) {
        console.error('대시보드 데이터 로드 실패:', err);
      } finally {
        this.loading = false;
      }
    },

    // 전체 웹툰 로드 (R)
    async fetchWebtoons() {
      this.loading = true
      try {
        const res = await api.get('/webtoons')
        this.webtoons = res.data || []
      } catch (err) {
        console.error('웹툰 로드 실패:', err)
      } finally {
        this.loading = false
      }
    },

    // 신규 작품 추가 (C)
    async addWebtoon(webtoonData) {
      this.loading = true
      try {
        const res = await api.post('/webtoons', webtoonData)
        this.webtoons.push(res.data) 
        await this.addLog(`신규 작품 [${res.data.title}] 등록`, 'success')
        return res.data
      } catch (err) {
        console.error('신규 등록 실패:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 작품 정보 업데이트 (U)
    async updateWebtoon(webtoon) {
      this.loading = true
      try {
        const res = await api.put(`/webtoons/${webtoon.id}`, webtoon)
        const index = this.webtoons.findIndex(t => t.id === webtoon.id)
        if (index !== -1) {
          this.webtoons[index] = res.data
        }
        await this.addLog(`작품 [${webtoon.title}] 정보 수정`, 'info')
      } catch (err) {
        console.error('수정 실패:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 작품 제거 (D)
    async deleteWebtoon(id) {
      this.loading = true
      try {
        const target = this.webtoons.find(t => t.id === id);
        const title = target ? target.title : id;
        
        await api.delete(`/webtoons/${id}`)
        this.webtoons = this.webtoons.filter(t => t.id !== id)
        await this.addLog(`작품 [${title}] 삭제 완료`, 'red')
      } catch (err) {
        console.error('삭제 실패:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 큐레이션 순서 변경 및 저장 (U)
    async saveFinalOrder() {
      this.loading = true
      try {
        const idList = this.webtoons.map(toon => toon.id)
        await api.put('/webtoons/order', idList)
        await this.addLog('큐레이션 순서 저장 완료', 'success')
      } catch (err) {
        console.error('순서 저장 실패:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // 전체 로그 조회 (R)
    async fetchLogs() {
      try {
        const res = await api.get('/logs')
        this.logs = res.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      } catch (err) {
        console.error('로그 조회 실패:', err)
      }
    },

    // 새 로그 추가 (C)
    async addLog(message, color = 'blue') {
      try {
        const res = await api.post('/logs', { message, color })
        this.logs.unshift(res.data)
      } catch (err) {
        console.error('로그 기록 실패:', err)
      }
    },

    // 공통 코드 조회 (R)
    async fetchGenreCodes() {
      try {
        const res = await api.get('/common/codes?group=GENRE')
        this.genreCodes = res.data
      } catch (err) {
        console.error('공통 코드 로드 실패:', err)
      }
    },

    // 장르 이름으로 색상을 찾아주는 함수
    getGenreColor(genreName) {
      const code = this.genreCodes.find(c => c.codeName === genreName)
      return code ? code.attr1 : 'grey'
    },

    // Gemini 사용 api
    async recommendTags(description) {
      const res = await api.get('/webtoons/recommend-tags', { params: { description } })
      return res.data
    },
    async aiPlotSearch(plot) {
      const res = await api.post('/webtoons/ai-search', { plot })
      return res.data
    },
    async findTitleByAi(plot) {
      const res = await api.post('/webtoons/ai-find-title', { plot });
      return res.data;
    }
  }
})