<template>
  <div class="statistics-container">
    <h1>游戏统计</h1>

    <div class="stats-grid">
      <div class="stats-card">
        <h2>总体统计</h2>
        <div class="stats-content">
          <div class="stat-item">
            <span class="stat-label">总游戏次数</span>
            <span class="stat-value">{{ statistics.totalGames }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">胜利次数</span>
            <span class="stat-value">{{ statistics.wins }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">胜率</span>
            <span class="stat-value">{{ winRate }}%</span>
          </div>
        </div>
      </div>

      <div class="stats-card">
        <h2>最佳记录</h2>
        <div class="stats-content">
          <div v-for="(record, difficulty) in statistics.bestTimes" 
               :key="difficulty"
               class="record-item">
            <h3>{{ difficultyLabels[difficulty] }}</h3>
            <span class="record-time">{{ formatTime(record) }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="stats-card history-card">
      <h2>最近游戏</h2>
      <div class="history-list">
        <div v-for="(game, index) in statistics.recentGames" 
             :key="index"
             class="history-item">
          <div class="history-info">
            <span class="difficulty-label">{{ difficultyLabels[game.difficulty] }}</span>
            <span class="game-result" :class="game.won ? 'won' : 'lost'">
              {{ game.won ? '胜利' : '失败' }}
            </span>
          </div>
          <div class="history-details">
            <span>用时: {{ formatTime(game.time) }}</span>
            <span>日期: {{ formatDate(game.date) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// 难度标签映射
const difficultyLabels = {
  beginner: '初级',
  intermediate: '中级',
  expert: '高级',
  custom: '自定义'
};

// 统计数据
const statistics = ref({
  totalGames: 0,
  wins: 0,
  bestTimes: {
    beginner: null,
    intermediate: null,
    expert: null
  },
  recentGames: []
});

// 计算胜率
const winRate = computed(() => {
  if (statistics.value.totalGames === 0) return 0;
  return ((statistics.value.wins / statistics.value.totalGames) * 100).toFixed(1);
});

// 格式化时间
const formatTime = (seconds) => {
  if (!seconds) return '暂无记录';
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

// 格式化日期
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
};

// 加载统计数据
const loadStatistics = () => {
  const savedStats = localStorage.getItem('minesweeper-stats');
  if (savedStats) {
    statistics.value = JSON.parse(savedStats);
  }
};

onMounted(() => {
  loadStatistics();
});
</script>

<style scoped>
.statistics-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  color: white;
}

h1 {
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.8), 0 0 20px rgba(51, 102, 255, 0.5);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.stats-card {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: all 0.3s ease;
}

.stats-card:hover {
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
  transform: translateY(-3px);
  border-color: rgba(51, 102, 255, 0.4);
}

.stats-card h2 {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.stats-content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-label {
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.stat-value {
  font-size: 1.2rem;
  font-weight: bold;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.5);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.record-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.record-item h3 {
  margin: 0;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.record-time {
  font-weight: bold;
  color: #81d4fa;
  text-shadow: 0 0 8px rgba(51, 102, 255, 0.6);
}

.history-card {
  grid-column: 1 / -1;
}

.history-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.history-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
}

.history-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(51, 102, 255, 0.4);
}

.history-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.difficulty-label {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.game-result {
  padding: 0.25rem 0.5rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: bold;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.game-result.won {
  background: rgba(46, 125, 50, 0.3);
  color: #81c784;
  border: 1px solid rgba(46, 125, 50, 0.5);
}

.game-result.lost {
  background: rgba(198, 40, 40, 0.3);
  color: #ef9a9a;
  border: 1px solid rgba(198, 40, 40, 0.5);
}

.history-details {
  display: flex;
  justify-content: space-between;
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.6);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>