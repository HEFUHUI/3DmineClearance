import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useGameStatsStore = defineStore('gameStats', () => {
  // 统计数据
  const statistics = ref({
    totalGames: 0,
    wins: 0,
    bestTimes: {
      beginner: null,
      intermediate: null,
      expert: null,
      custom: null
    },
    recentGames: []
  });

  // 加载统计数据
  function loadStatistics() {
    const savedStats = localStorage.getItem('minesweeper-stats');
    if (savedStats) {
      statistics.value = JSON.parse(savedStats);
    }
  }

  // 保存统计数据
  function saveStatistics() {
    localStorage.setItem('minesweeper-stats', JSON.stringify(statistics.value));
  }

  // 记录游戏结果
  function recordGame(won, time, config) {
    // 确定难度级别
    let difficulty = 'custom';
    if (config.width === 9 && config.height === 9 && config.mines === 10) {
      difficulty = 'beginner';
    } else if (config.width === 16 && config.height === 16 && config.mines === 40) {
      difficulty = 'intermediate';
    } else if (config.width === 30 && config.height === 16 && config.mines === 99) {
      difficulty = 'expert';
    }

    // 更新总游戏次数和胜利次数
    statistics.value.totalGames++;
    if (won) {
      statistics.value.wins++;

      // 更新最佳时间
      if (!statistics.value.bestTimes[difficulty] || time < statistics.value.bestTimes[difficulty]) {
        statistics.value.bestTimes[difficulty] = time;
      }
    }

    // 添加到最近游戏记录
    statistics.value.recentGames.unshift({
      difficulty,
      won,
      time,
      date: Date.now()
    });

    // 限制最近游戏记录数量
    if (statistics.value.recentGames.length > 10) {
      statistics.value.recentGames = statistics.value.recentGames.slice(0, 10);
    }

    // 保存到本地存储
    saveStatistics();
  }

  // 初始化
  loadStatistics();

  return {
    statistics,
    recordGame
  };
});