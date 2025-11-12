<template>
  <div class="app">
    <header>
      <nav>
        <div class="logo">宋韵智境——数字幻境启宋韵</div>
        <div class="nav-links">
          <router-link to="/">首页</router-link>
          <router-link to="/ancient-tech">天工开物</router-link>
          <router-link to="/history-timeline">经纬成络</router-link>
          <router-link to="/digital-heritage">古今辉映</router-link>
          <!-- 已移除作品欣赏导航选项 -->
          <!-- <router-link to="/about">关于</router-link> -->
        </div>
      </nav>
    </header>

    <main>
      <transition name="fade" mode="out-in">
        <router-view></router-view>
      </transition>
    </main>

    <footer>
      <p>&copy; 2025 宋韵智境——数字幻境启宋韵项目</p>
      <p class="icp-info">
        <a href="https://beian.miit.gov.cn/" target="_blank" rel="noopener noreferrer">赣ICP备2024027024号-3</a>
      </p>
    </footer>

    <!-- 背景音乐控制器 -->
    <div class="music-controller" @click="toggleMusic">
      <div class="music-icon" :class="{ 'music-on': isPlaying, 'music-off': !isPlaying }">
        <span class="music-note" v-for="i in 3" :key="i" :class="{ 'animate': isPlaying }"></span>
      </div>
    </div>

    <!-- 背景音乐 -->
    <audio ref="audioPlayer" src="/music.mp3" preload="auto" loop></audio>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';

export default {
  name: 'App',
  setup() {
    const audioPlayer = ref(null);
    const isPlaying = ref(false);

    const toggleMusic = async () => {
      if (!audioPlayer.value) return;

      try {
        if (isPlaying.value) {
          audioPlayer.value.pause();
          isPlaying.value = false;
        } else {
          // 用户交互后尝试播放
          const playPromise = audioPlayer.value.play();

          if (playPromise !== undefined) {
            playPromise
              .then(() => {
                isPlaying.value = true;
              })
              .catch(error => {
                console.error('音乐播放失败:', error);
                isPlaying.value = false;
              });
          }
        }
      } catch (error) {
        console.error('音乐控制器错误:', error);
      }
    };

    onMounted(() => {
      // 确保音频元素存在
      if (!audioPlayer.value) return;

      // 预加载音频
      audioPlayer.value.load();

      // 监听音频播放状态变化
      audioPlayer.value.onplay = () => {
        isPlaying.value = true;
      };

      audioPlayer.value.onpause = () => {
        isPlaying.value = false;
      };

      audioPlayer.value.onerror = (e) => {
        console.error('音频加载错误:', e);
        isPlaying.value = false;
      };

      // 用户交互后自动播放音乐
      const startPlayback = () => {
        if (!audioPlayer.value || isPlaying.value) return;

        const playPromise = audioPlayer.value.play();

        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              isPlaying.value = true;
            })
            .catch(error => {
              console.error('自动播放失败:', error);
            });
        }

        // 移除事件监听器
        document.removeEventListener('click', startPlayback);
      };

      document.addEventListener('click', startPlayback, { once: true });
    });

    return {
      audioPlayer,
      isPlaying,
      toggleMusic
    };
  }
};
</script>

<style>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

@font-face {
  font-family: 'ChineseFont';
  src: local('Ma Shan Zheng'), local('FangSong'), local('SimSun');
  font-display: swap;
}

body {
  font-family: 'ChineseFont', 'Ma Shan Zheng', 'STKaiti', 'KaiTi', 'Microsoft YaHei', sans-serif;
  line-height: 1.6;
  color: #333;
  background-color: #f8f8f8;
  scroll-behavior: smooth;
}

.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: rgba(20, 12, 8, 0.85);
  padding: 1rem 2rem;
  position: fixed;
  width: 100%;
  top: 0;
  z-index: 100;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(211, 183, 142, 0.3);
  transition: all 0.4s ease;
}

header:hover {
  background-color: rgba(25, 15, 10, 0.95);
}

nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}

.logo {
  font-size: 1.8rem;
  color: #e2c89f;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(211, 183, 142, 0.6);
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  letter-spacing: 0.25rem;
  transition: all 0.3s ease;
}

.logo:hover {
  text-shadow: 2px 2px 8px rgba(0, 0, 0, 0.7), 0 0 15px rgba(211, 183, 142, 0.8);
  transform: scale(1.03);
}

.nav-links {
  display: flex;
  gap: 3rem;
}

.nav-links a {
  color: #e2c89f;
  text-decoration: none;
  font-size: 1.3rem;
  transition: all 0.4s ease;
  position: relative;
  padding: 0.3rem 0.5rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.nav-links a:before,
.nav-links a:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  background-color: #d3b78e;
  transition: all 0.4s ease;
}

.nav-links a:before {
  top: 0;
  left: 0;
}

.nav-links a:after {
  bottom: 0;
  right: 0;
}

.nav-links a:hover:before,
.nav-links a:hover:after,
.nav-links a.router-link-active:before,
.nav-links a.router-link-active:after {
  width: 100%;
}

.nav-links a:hover {
  color: #f2e6d9;
  text-shadow: 0 0 8px rgba(211, 183, 142, 0.6);
  transform: translateY(-2px);
}

.nav-links a.router-link-active {
  color: #f2e6d9;
  text-shadow: 0 0 8px rgba(211, 183, 142, 0.6);
}

main {
  flex: 1;
  padding-top: 80px;
}

footer {
  background-color: rgba(20, 12, 8, 0.9);
  color: #d3b78e;
  text-align: center;
  padding: 1.5rem;
  margin-top: auto;
  border-top: 1px solid rgba(211, 183, 142, 0.3);
  box-shadow: 0 -5px 15px rgba(0, 0, 0, 0.2);
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  letter-spacing: 0.1rem;
}

.icp-info {
  margin-top: 0.5rem;
  font-size: 0.9rem;
}

.icp-info a {
  color: #d3b78e;
  text-decoration: none;
  transition: all 0.3s ease;
}

.icp-info a:hover {
  color: #f2e6d9;
  text-shadow: 0 0 8px rgba(211, 183, 142, 0.6);
}

/* 音乐控制器样式 */
.music-controller {
  position: fixed;
  bottom: 25px;
  right: 25px;
  width: 60px;
  height: 60px;
  background-color: rgba(82, 44, 25, 0.85);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  z-index: 1000;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 20px rgba(211, 183, 142, 0.3);
  transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 2px solid rgba(211, 183, 142, 0.6);
  animation: pulseGlow 3s infinite alternate;
}

@keyframes pulseGlow {
  0% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 5px rgba(211, 183, 142, 0.2);
  }
  100% {
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4), 0 0 25px rgba(211, 183, 142, 0.5);
  }
}

.music-controller:hover {
  transform: scale(1.1) rotate(10deg);
  background-color: rgba(107, 60, 35, 0.9);
}

.music-icon {
  position: relative;
  width: 30px;
  height: 30px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.music-note {
  position: absolute;
  width: 4px;
  background-color: #f2e6d9;
  border-radius: 2px;
  bottom: 5px;
  transition: all 0.3s ease;
}

.music-note:nth-child(1) {
  left: 8px;
  height: 15px;
}

.music-note:nth-child(2) {
  left: 15px;
  height: 20px;
}

.music-note:nth-child(3) {
  left: 22px;
  height: 12px;
}

.music-on .music-note.animate:nth-child(1) {
  animation: musicWave 1.5s infinite ease-in-out 0.2s;
}

.music-on .music-note.animate:nth-child(2) {
  animation: musicWave 1.5s infinite ease-in-out;
}

.music-on .music-note.animate:nth-child(3) {
  animation: musicWave 1.5s infinite ease-in-out 0.4s;
}

.music-off .music-note {
  background-color: #d3b78e;
  opacity: 0.8;
}

.music-off::before,
.music-off::after {
  content: '';
  position: absolute;
  width: 25px;
  height: 2px;
  background-color: #d3b78e;
  transform: rotate(45deg);
  transition: all 0.3s ease;
}

.music-off::after {
  transform: rotate(-45deg);
}

.music-controller:hover .music-off::before {
  transform: rotate(35deg);
}

.music-controller:hover .music-off::after {
  transform: rotate(-35deg);
}

@keyframes musicWave {
  0%, 100% {
    height: 12px;
    background-color: #f2e6d9;
  }
  50% {
    height: 25px;
    background-color: #ffffff;
  }
}

/* 添加页面转场动画 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.v-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.v-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* 增加适配性 */
@media (max-width: 768px) {
  .logo {
    font-size: 1.4rem;
  }
  
  nav {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-links {
    width: 100%;
    justify-content: space-around;
    gap: 0.5rem;
  }
  
  .nav-links a {
    font-size: 1rem;
    padding: 0.2rem 0.3rem;
  }
  
  .music-controller {
    width: 50px;
    height: 50px;
    bottom: 15px;
    right: 15px;
  }
}

/* 可视化页面样式 */
.visualization-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #f2e6d9;
}

.visualization-page h1 {
  text-align: center;
  color: #e2c89f;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  margin-bottom: 2rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7);
  font-size: 2.5rem;
}

.vis-selector {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 2rem;
}

.vis-selector button {
  background-color: rgba(82, 44, 25, 0.7);
  color: #e2c89f;
  border: 1px solid rgba(211, 183, 142, 0.5);
  padding: 8px 15px;
  border-radius: 5px;
  cursor: pointer;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.vis-selector button.active {
  background-color: rgba(133, 74, 42, 0.9);
  color: #f2e6d9;
  box-shadow: 0 0 10px rgba(211, 183, 142, 0.5);
  transform: translateY(-3px);
}

.vis-selector button:hover {
  background-color: rgba(107, 60, 35, 0.8);
  transform: translateY(-2px);
}

.vis-description {
  background-color: rgba(45, 28, 18, 0.8);
  border: 1px solid rgba(211, 183, 142, 0.3);
  padding: 15px;
  border-radius: 5px;
  margin-bottom: 2rem;
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
}

.vis-description p {
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  line-height: 1.8;
  text-align: justify;
  font-size: 1.1rem;
  color: #f2e6d9;
}

.vis-content {
  background-color: rgba(35, 25, 18, 0.7);
  border: 1px solid rgba(211, 183, 142, 0.3);
  border-radius: 8px;
  padding: 20px;
  min-height: 500px;
  position: relative;
}

.vis-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(20, 12, 8, 0.7);
  z-index: 10;
  border-radius: 8px;
}

.loader {
  width: 50px;
  height: 50px;
  border: 5px solid transparent;
  border-top: 5px solid #d3b78e;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.vis-loading-text {
  margin-top: 20px;
  color: #e2c89f;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

/* 适配移动设备 */
@media (max-width: 768px) {
  .visualization-page {
    padding: 1rem;
  }
  
  .visualization-page h1 {
    font-size: 1.8rem;
    margin-top: 0.5rem;
  }
  
  .vis-selector {
    flex-direction: column;
    align-items: center;
    gap: 0.8rem;
  }
  
  .vis-selector button {
    width: 100%;
    max-width: 300px;
    padding: 0.6rem 1rem;
    font-size: 1rem;
  }
  
  .vis-description {
    padding: 1rem 1.5rem;
    font-size: 0.9rem;
    line-height: 1.6;
  }
  
  .vis-content {
    padding: 1rem;
    min-height: 400px;
  }
}
</style>