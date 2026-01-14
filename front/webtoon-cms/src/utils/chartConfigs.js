export const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { 
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: (context) => `조회수: ${context.raw.toLocaleString()}회`
      }
    }
  },
  scales: {
    y: { 
      ticks: {
        callback: (value) => (value >= 10000 ? (value / 10000).toLocaleString() + '만' : value)
      }
    }
  }
}

export const formatLineData = (dbStats) => {
  return {
    labels: dbStats.map(s => s.stat_date.substring(5)), // 날짜 형태 변경
    data: dbStats.map(s => s.daily_views)
  }
}

export const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { position: 'bottom' }
  },
  cutout: '65%'
}
