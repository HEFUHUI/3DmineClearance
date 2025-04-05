import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { useGameStatsStore } from './gameStats';

export const useGameStore = defineStore('game', () => {
  // 游戏状态
  const gameState = ref('idle'); // idle, playing, won, lost
  const board = ref([]);
  const mineCount = ref(0);
  const flaggedCount = ref(0);
  const timer = ref(0);
  const timerInterval = ref(null);

  // 游戏配置
  const config = ref({
    width: 9,
    height: 9,
    mines: 10
  });

  // 计算属性
  const remainingMines = computed(() => mineCount.value - flaggedCount.value);

  // 初始化游戏
  function initializeGame(newConfig) {
    config.value = newConfig;
    gameState.value = 'idle';
    mineCount.value = newConfig.mines;
    flaggedCount.value = 0;
    timer.value = 0;
    board.value = createBoard();
  }

  // 创建游戏板
  function createBoard() {
    const { width, height } = config.value;
    return Array(height).fill(null).map(() =>
      Array(width).fill(null).map(() => ({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        neighborMines: 0
      }))
    );
  }

  // 放置地雷
  function placeMines(firstClickX, firstClickY) {
    const { width, height, mines } = config.value;
    let placedMines = 0;

    while (placedMines < mines) {
      const x = Math.floor(Math.random() * width);
      const y = Math.floor(Math.random() * height);

      // 避免在第一次点击的位置及其周围放置地雷
      if (!board.value[y][x].isMine && 
          (Math.abs(x - firstClickX) > 1 || Math.abs(y - firstClickY) > 1)) {
        board.value[y][x].isMine = true;
        placedMines++;
      }
    }

    // 计算每个格子周围的地雷数
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (!board.value[y][x].isMine) {
          board.value[y][x].neighborMines = countNeighborMines(x, y);
        }
      }
    }
  }

  // 计算周围地雷数
  function countNeighborMines(x, y) {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = y + dy;
        const newX = x + dx;
        if (newY >= 0 && newY < config.value.height &&
            newX >= 0 && newX < config.value.width &&
            board.value[newY][newX].isMine) {
          count++;
        }
      }
    }
    return count;
  }

  // 开始计时
  function startTimer() {
    if (timerInterval.value) return;
    timerInterval.value = setInterval(() => {
      timer.value++;
    }, 1000);
  }

  // 停止计时
  function stopTimer() {
    if (timerInterval.value) {
      clearInterval(timerInterval.value);
      timerInterval.value = null;
    }
  }

  // 翻开格子
  function revealCell(x, y) {
    if (gameState.value === 'idle') {
      gameState.value = 'playing';
      placeMines(x, y);
      startTimer();
    }

    const cell = board.value[y][x];
    if (cell.isRevealed || cell.isFlagged) return;

    cell.isRevealed = true;

    if (cell.isMine) {
      gameState.value = 'lost';
      revealAllMines();
      stopTimer();
      // 记录游戏失败统计
      const gameStatsStore = useGameStatsStore();
      gameStatsStore.recordGame(false, timer.value, config.value);
      return;
    }

    if (cell.neighborMines === 0) {
      revealNeighbors(x, y);
    }

    checkWinCondition();
  }

  // 翻开周围格子
  function revealNeighbors(x, y) {
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const newY = y + dy;
        const newX = x + dx;
        if (newY >= 0 && newY < config.value.height &&
            newX >= 0 && newX < config.value.width &&
            !board.value[newY][newX].isRevealed) {
          revealCell(newX, newY);
        }
      }
    }
  }

  // 标记地雷
  function toggleFlag(x, y) {
    if (gameState.value !== 'playing' && gameState.value !== 'idle') return;
    
    const cell = board.value[y][x];
    if (cell.isRevealed) return;

    cell.isFlagged = !cell.isFlagged;
    flaggedCount.value += cell.isFlagged ? 1 : -1;

    if (gameState.value === 'idle') {
      gameState.value = 'playing';
      startTimer();
    }

    checkWinCondition();
  }

  // 检查胜利条件
  function checkWinCondition() {
    const { width, height } = config.value;
    let allNonMinesRevealed = true;

    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const cell = board.value[y][x];
        if (!cell.isMine && !cell.isRevealed) {
          allNonMinesRevealed = false;
          break;
        }
      }
    }

    if (allNonMinesRevealed) {
      gameState.value = 'won';
      stopTimer();
      // 记录游戏胜利统计
      const gameStatsStore = useGameStatsStore();
      gameStatsStore.recordGame(true, timer.value, config.value);
    }
  }

  // 显示所有地雷
  function revealAllMines() {
    const { width, height } = config.value;
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (board.value[y][x].isMine) {
          board.value[y][x].isRevealed = true;
        }
      }
    }
  }

  return {
    gameState,
    board,
    mineCount,
    flaggedCount,
    timer,
    placeMines,
    remainingMines,
    config,
    initializeGame,
    revealCell,
    toggleFlag
  };
});