<template>
  <div class="game-container">
    <div class="game-header">
      <div class="game-info">
        <div class="info-item">
          <span class="info-label">剩余地雷:</span>
          <span class="info-value">{{ gameStore.remainingMines }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">时间:</span>
          <span class="info-value">{{ gameStore.timer }}秒</span>
        </div>
      </div>
      <div class="game-controls">
        <button class="control-btn" @click="restartGame">重新开始</button>
        <button class="control-btn" @click="backToHome">返回主页</button>
      </div>
    </div>

    <div class="game-board">
      <GameScene />
    </div>

    <div v-if="gameStore.gameState === 'won' || gameStore.gameState === 'lost'"
         class="game-overlay">
      <div class="game-result">
        <h2>{{ gameStore.gameState === 'won' ? '恭喜获胜!' : '游戏结束' }}</h2>
        <p>用时: {{ gameStore.timer }}秒</p>
        <div class="result-buttons">
          <button class="result-btn" @click="restartGame">再玩一次</button>
          <button class="result-btn" @click="backToHome">返回主页</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';
import GameScene from '../components/GameScene.vue';

const router = useRouter();
const gameStore = useGameStore();

const restartGame = () => {
  gameStore.initializeGame(gameStore.config);
};

const backToHome = () => {
  router.push('/');
};
</script>

<style scoped>
.game-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #f0f0f0;
  box-sizing: border-box;
}

.game-header {
  max-width: 1000px;
  width: 100%;
  margin: 1rem auto;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  border-radius: 16px;
}



.game-info {
  display: flex;
  gap: 2rem;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-label {
  font-weight: bold;
  color: rgba(255, 255, 255, 0.7);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.info-value {
  font-size: 1.2rem;
  color: white;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.5);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: bold;
}

.game-controls {
  display: flex;
  gap: 1rem;
}

.control-btn {
  padding: 0.5rem 1.5rem;
  border: 2px solid rgba(51, 102, 255, 0.3);
  border-radius: 8px;
  background: rgba(51, 102, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.control-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(51, 102, 255, 0.4) 0%, rgba(255, 102, 51, 0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.control-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(51, 102, 255, 0.8);
}

.control-btn:hover::before {
  opacity: 1;
}

.game-board {
  flex: 1;
  position: relative;
  max-width: 1000px;
  width: 100%;
  margin: 0 auto;
}

.game-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  backdrop-filter: blur(5px);
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.game-result {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2.5rem;
  border-radius: 16px;
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  animation: scaleIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  max-width: 400px;
  width: 90%;
}

@keyframes scaleIn {
  from { transform: scale(0.8); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

.game-result h2 {
  margin: 0 0 1.5rem 0;
  color: white;
  font-size: 2rem;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.8);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.game-result p {
  margin: 0 0 2rem 0;
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.result-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.result-btn {
  padding: 0.7rem 1.8rem;
  border: 2px solid rgba(51, 102, 255, 0.3);
  border-radius: 8px;
  background: rgba(51, 102, 255, 0.2);
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
  font-size: 1.1rem;
}

.result-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(51, 102, 255, 0.4) 0%, rgba(255, 102, 51, 0.4) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.result-btn:hover {
  transform: translateY(-3px) scale(1.05);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3);
  border-color: rgba(51, 102, 255, 0.8);
}

.result-btn:hover::before {
  opacity: 1;
}

.result-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}
</style>