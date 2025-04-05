<template>
  <div class="app-container">
    <nav class="nav-menu" v-if="route.name !== 'game'">
      <router-link to="/" class="nav-item">主页</router-link>
      <router-link to="/game" class="nav-item">开始游戏</router-link>
      <router-link to="/settings" class="nav-item">设置</router-link>
      <router-link to="/statistics" class="nav-item">统计</router-link>
    </nav>
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>

<style>
.app-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #121212 0%, #2a2a2a 100%);
  color: white;
}

.nav-menu {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  max-width: 1000px;
  width: 100%;
  margin: 1rem auto;
  box-sizing: border-box;
  border-radius: 16px;
}

.nav-item {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  font-weight: 500;
  letter-spacing: 0.5px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.nav-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(51, 102, 255, 0.2) 0%, rgba(255, 102, 51, 0.2) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.nav-item:hover {
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.nav-item:hover::before {
  opacity: 1;
}

.router-link-active {
  background: linear-gradient(135deg, rgba(51, 102, 255, 0.3) 0%, rgba(255, 102, 51, 0.3) 100%);
  color: white;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-leave-to {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

/* 添加全局样式 */
:root {
  --primary-color: #3366ff;
  --secondary-color: #ff6633;
  --dark-bg: #121212;
  --light-text: rgba(255, 255, 255, 0.9);
}

body {
  margin: 0;
  padding: 0;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--dark-bg);
  color: var(--light-text);
  overflow-x: hidden;
}

button {
  cursor: pointer;
  font-family: inherit;
  transition: all 0.3s ease;
}

/* 自定义滚动条 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, var(--primary-color), var(--secondary-color));
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, var(--secondary-color), var(--primary-color));
}
</style>