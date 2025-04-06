<template>
  <div class="settings-container">
    <h1>游戏设置</h1>

    <div class="settings-section">
      <h2>自定义难度</h2>
      <div class="custom-difficulty">
        <div class="setting-item">
          <label>宽度:</label>
          <input
            type="number"
            v-model.number="customConfig.width"
            min="5"
            max="30"
          >
        </div>
        <div class="setting-item">
          <label>高度:</label>
          <input
            type="number"
            v-model.number="customConfig.height"
            min="5"
            max="30"
          >
        </div>
        <div class="setting-item">
          <label>地雷数:</label>
          <input
            type="number"
            v-model.number="customConfig.mines"
            :min="minMines"
            :max="maxMines"
          >
        </div>
        <button class="save-btn" @click="saveCustomConfig">保存设置</button>
      </div>
    </div>

    <div class="settings-section">
      <h2>主题设置</h2>
      <div class="theme-settings">
        <div class="theme-option" 
             v-for="theme in themes" 
             :key="theme.name"
             :class="{ active: currentTheme === theme.name }"
             @click="setTheme(theme.name)">
          <div class="theme-preview" :style="{ background: theme.colors.primary }"></div>
          <span>{{ theme.label }}</span>
        </div>
      </div>
    </div>

    <div class="settings-section">
      <h2>其他设置</h2>
      <div class="other-settings">
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="settings.soundEnabled">
            启用音效
          </label>
        </div>
        <div class="setting-item">
          <label>
            <input type="checkbox" v-model="settings.showTutorial">
            显示新手引导
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGameStore } from '../stores/game';

const gameStore = useGameStore();

// 自定义配置
const customConfig = ref({
  width: gameStore.config.width,
  height: gameStore.config.height,
  mines: gameStore.config.mines
});

// 计算地雷数量的限制
const minMines = computed(() => 
  Math.ceil(customConfig.value.width * customConfig.value.height * 0.1)
);

const maxMines = computed(() => 
  Math.floor(customConfig.value.width * customConfig.value.height * 0.3)
);

// 保存自定义配置
const saveCustomConfig = () => {
  // 确保地雷数量在合理范围内
  customConfig.value.mines = Math.min(
    Math.max(customConfig.value.mines, minMines.value),
    maxMines.value
  );

  gameStore.initializeGame({
    width: customConfig.value.width,
    height: customConfig.value.height,
    mines: customConfig.value.mines
  });
};

// 主题设置
const themes = [
  { name: 'classic', label: '经典', colors: { primary: '#4a90e2' } },
  { name: 'dark', label: '暗黑', colors: { primary: '#2c3e50' } },
  { name: 'light', label: '明亮', colors: { primary: '#42b983' } }
];

// 从localStorage加载主题设置
const currentTheme = ref(localStorage.getItem('minesweeper-theme') || 'classic');

const setTheme = (themeName) => {
  currentTheme.value = themeName;
  // 保存主题设置到localStorage
  localStorage.setItem('minesweeper-theme', themeName);
};

// 从localStorage加载其他设置
const settings = ref({
  soundEnabled: JSON.parse(localStorage.getItem('minesweeper-sound-enabled') || 'true'),
  showTutorial: JSON.parse(localStorage.getItem('minesweeper-show-tutorial') || 'true')
});

// 监听设置变化并保存
watch(() => settings.value.soundEnabled, (newValue) => {
  localStorage.setItem('minesweeper-sound-enabled', JSON.stringify(newValue));
});

watch(() => settings.value.showTutorial, (newValue) => {
  localStorage.setItem('minesweeper-show-tutorial', JSON.stringify(newValue));
});
</script>

<style scoped>
.settings-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem;
  width: 100%;
  box-sizing: border-box;
  color: white;
}

h1 {
  color: white;
  margin-bottom: 2rem;
  text-shadow: 0 0 10px rgba(51, 102, 255, 0.8), 0 0 20px rgba(51, 102, 255, 0.5);
  background: linear-gradient(to right, #3366ff, #ff6633);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.settings-section {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

h2 {
  color: rgba(255, 255, 255, 0.9);
  margin: 0 0 1rem 0;
  font-size: 1.2rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.custom-difficulty {
  display: grid;
  gap: 1rem;
  max-width: 400px;
}

.setting-item {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.setting-item label {
  min-width: 80px;
  color: rgba(255, 255, 255, 0.8);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.setting-item input[type="number"] {
  width: 80px;
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.2);
  color: white;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.save-btn {
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

.save-btn::before {
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

.save-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 15px rgba(0, 0, 0, 0.3);
  border-color: rgba(51, 102, 255, 0.8);
}

.save-btn:hover::before {
  opacity: 1;
}

.theme-settings {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.theme-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  padding: 1rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(0, 0, 0, 0.2);
}

.theme-option:hover {
  background: rgba(51, 102, 255, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  border-color: rgba(51, 102, 255, 0.4);
}

.theme-option.active {
  background: rgba(51, 102, 255, 0.3);
  border-color: rgba(51, 102, 255, 0.6);
  box-shadow: 0 0 15px rgba(51, 102, 255, 0.4);
}

.theme-preview {
  width: 60px;
  height: 60px;
  border-radius: 4px;
}

.other-settings {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.other-settings .setting-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.other-settings label {
  color: rgba(255, 255, 255, 0.8);
  cursor: pointer;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}
</style>