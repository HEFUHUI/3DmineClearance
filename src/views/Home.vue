<template>
  <div class="home-container">
    <h1 class="title">3D扫雷</h1>
    <div class="difficulty-selection">
      <h2>选择难度</h2>
      <div class="difficulty-buttons">
        <button
          v-for="level in difficultyLevels"
          :key="level.name"
          class="difficulty-btn"
          @click="startGame(level)"
        >
          <h3>{{ level.label }}</h3>
          <p>{{ level.description }}</p>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useGameStore } from '../stores/game';

const router = useRouter();
const gameStore = useGameStore();

const difficultyLevels = [
  {
    name: 'beginner',
    label: '初级',
    description: '9×9 格子，10 个地雷',
    config: { width: 9, height: 9, mines: 10 }
  },
  {
    name: 'intermediate',
    label: '中级',
    description: '16×16 格子，40 个地雷',
    config: { width: 16, height: 16, mines: 40 }
  },
  {
    name: 'expert',
    label: '高级',
    description: '16×30 格子，99 个地雷',
    config: { width: 30, height: 16, mines: 99 }
  }
];

const startGame = (level) => {
  gameStore.initializeGame(level.config);
  router.push('/game');
};
</script>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
  text-align: center;
  width: 100%;
  box-sizing: border-box;
  background: linear-gradient(135deg, #121212 0%, #2a2a2a 100%);
  min-height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.title {
  font-size: 4rem;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.8), 0 0 20px rgba(51, 102, 255, 0.5);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  animation: glow 2s ease-in-out infinite alternate;
}

@keyframes glow {
  from {
    text-shadow: 0 0 10px rgba(51, 102, 255, 0.8), 0 0 20px rgba(51, 102, 255, 0.5);
  }
  to {
    text-shadow: 0 0 15px rgba(51, 102, 255, 1), 0 0 30px rgba(51, 102, 255, 0.8), 0 0 40px rgba(51, 102, 255, 0.6);
  }
}

.difficulty-selection {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.difficulty-buttons {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.difficulty-btn {
  background: rgba(0, 0, 0, 0.3);
  border: 2px solid rgba(51, 102, 255, 0.3);
  border-radius: 16px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  position: relative;
  overflow: hidden;
  color: white;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.difficulty-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(51, 102, 255, 0.2) 0%, rgba(255, 102, 51, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.4s ease;
  z-index: 1;
}

.difficulty-btn:hover {
  transform: translateY(-5px) scale(1.03);
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.3);
  border-color: rgba(51, 102, 255, 0.8);
}

.difficulty-btn:hover::before {
  opacity: 1;
}

.difficulty-btn h3 {
  margin: 0 0 0.8rem 0;
  color: #fff;
  font-size: 1.4rem;
  position: relative;
  z-index: 2;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.difficulty-btn p {
  margin: 0;
  color: rgba(255, 255, 255, 0.8);
  font-size: 1rem;
  position: relative;
  z-index: 2;
}

.difficulty-selection h2 {
  color: white;
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
}
</style>