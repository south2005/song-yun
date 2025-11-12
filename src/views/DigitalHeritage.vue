<template>
  <div class="digital-heritage-container" :style="{ backgroundImage: `url(${backgroundImage})` }">
    <div class="content-wrapper">
      <div class="title-container">
        <div class="title-decoration left"></div>
        <h1 class="main-title">古韵今辉<span class="title-dot">·</span>智慧交响</h1>
        <div class="title-decoration right"></div>
      </div>
      
      <div class="dialogue-container">
        <!-- 对话交互区域 -->
        <div class="dialogue-section">
          <!-- 古代人物 -->
          <div class="dialogue-character ancient-character">
            <div class="character-portrait" :style="{ backgroundImage: `url(${ancientCharacter.portrait})` }">
              <div class="character-glow ancient-glow"></div>
            </div>
            <h3 class="character-name">{{ ancientCharacter.name }}</h3>
          </div>
          
          <!-- 对话内容区域 -->
          <div class="dialogue-content">
            <!-- 所有对话气泡按顺序显示 -->
            <div v-for="(message, index) in allMessages" 
                 :key="index"
                 :class="['dialogue-bubble', message.type + '-bubble']"
                 :style="{ animationDelay: index * 0.3 + 's' }">
              <p>{{ message.text }}</p>
            </div>
            <!-- 添加思考中的动画 -->
            <div v-if="isThinking" class="thinking-animation">
              <div class="thinking-dots">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
          
          <!-- 现代人物 -->
          <div class="dialogue-character modern-character">
            <div class="character-portrait" :style="{ backgroundImage: `url(${modernCharacter.portrait})` }">
              <div class="character-glow modern-glow"></div>
            </div>
            <h3 class="character-name">{{ modernCharacter.name }}</h3>
          </div>
        </div>
        
        <!-- 用户输入区域 -->
        <div class="user-input-container">
          <input 
            type="text" 
            v-model="userInput" 
            @keyup.enter="sendUserMessage"
            placeholder="输入您想说的话..." 
            class="user-input-field"
          />
          <button @click="sendUserMessage" class="send-button">
            <div class="send-icon"></div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCurrentInstance, onMounted, onBeforeUnmount, ref, nextTick } from 'vue';
import messageHandler from '../utils/messageHandler';

export default {
  name: 'DigitalHeritage',
  setup() {
    const { proxy } = getCurrentInstance();
    
    // 定义响应式数据
    const backgroundImage = ref(require('../assets/gujinhuiying.jpg'));
    const dialogueComplete = ref(true);
    const customDialogMode = ref(true);
    const userInput = ref('');
    const currentResponder = ref('ancient');
    const allMessages = ref([{
      type: 'ancient',
      text: "有何指教，请直言不讳。古今之辨，愿闻其详。",
      elements: ['对话']
    }]);
    const ancientCharacter = ref({
      name: '古韵先贤',
      portrait: require('../assets/zuopingxingshang.jpg')
    });
    const modernCharacter = ref({
      name: '数字匠人',
      portrait: require('../assets/shuzijiangren.jpg')
    });
    const isAvailable = ref(true);
    const isThinking = ref(false);

    // 定义方法
    const initMessageSystem = async () => {
      try {
        await proxy.$messageHandler.init();
      } catch (error) {
        console.error('初始化消息系统失败:', error);
        isAvailable.value = false;
      }
    };
    
    const listenMessageChanges = () => {
      // 监听配置变化
      proxy.$eventHub.on('client_configChange', (config) => {
        isAvailable.value = config.is_available;
      });
      
      // 监听消息内容变化
      proxy.$eventHub.on('client_msgContentChange', (data) => {
        const { type, content, is_final } = data;
        
        if (type === 'reply') {
          // 收到回复时立即隐藏思考动画
          isThinking.value = false;
          // 处理AI的回答
          allMessages.value.push({
            type: 'ancient',
            text: content,
            elements: []
          });
        } else if (type === 'question') {
          // 处理用户消息
          allMessages.value.push({
            type: 'modern',
            text: content,
            elements: []
          });
        } else if (type === 'error') {
          // 发生错误时立即隐藏思考动画
          isThinking.value = false;
          // 处理错误消息
          allMessages.value.push({
            type: 'system',
            text: `发生错误: ${content}`,
            elements: ['错误']
          });
        }
        
        // 立即滚动到底部
        nextTick(() => {
          scrollToBottom();
        });
      });
    };
    
    const sendUserMessage = () => {
      if (!userInput.value.trim() || !isAvailable.value) return;
      
      // 立即清空输入框
      const message = userInput.value;
      userInput.value = '';
      
      // 发送消息到消息处理系统
      proxy.$messageHandler.sendMessage(message);
      
      // 延迟显示思考动画
      setTimeout(() => {
        isThinking.value = true;
      }, 1000); // 延迟500毫秒显示思考动画
    };
    
    const scrollToBottom = () => {
      nextTick(() => {
        const dialogueContent = document.querySelector('.dialogue-content');
        if (dialogueContent) {
          dialogueContent.scrollTop = dialogueContent.scrollHeight;
        }
      });
    };

    // 在组件挂载时初始化消息系统
    onMounted(() => {
      initMessageSystem();
      listenMessageChanges();
    });

    // 在组件销毁前清理
    onBeforeUnmount(() => {
      if (proxy.$messageHandler) {
        proxy.$messageHandler.destroy();
      }
      // 清理事件监听
      proxy.$eventHub.off('client_configChange');
      proxy.$eventHub.off('client_msgContentChange');
    });

    return {
      // 返回需要在模板中使用的数据和方法
      backgroundImage,
      dialogueComplete,
      customDialogMode,
      userInput,
      currentResponder,
      allMessages,
      ancientCharacter,
      modernCharacter,
      isAvailable,
      isThinking,
      initMessageSystem,
      listenMessageChanges,
      sendUserMessage,
      scrollToBottom
    };
  }
}
</script>

<style scoped>
.digital-heritage-container {
  height: 100vh;
  width: 100%;
  color: #e6e1d6;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.content-wrapper {
  width: 100%;
  max-width: 1200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  z-index: 2;
  padding: 0 20px;
}

.title-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 40px;
  position: relative;
  width: 100%;
}

.main-title {
  font-size: 2rem;
  color: #e2c89f;
  text-shadow: 0 0 15px rgba(226, 200, 159, 0.5), 0 0 30px rgba(139, 90, 43, 0.3);
  position: relative;
  z-index: 2;
  letter-spacing: 3px;
  font-weight: normal;
  text-align: center;
  background: linear-gradient(to right, #e2c89f 0%, #f0e6d2 50%, #e2c89f 100%);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: shimmer 3s infinite;
  padding: 0 10px;
}

.title-dot {
  display: inline-block;
  color: #e2c89f;
  -webkit-text-fill-color: #e2c89f;
  font-size: 2.2rem;
  animation: pulsate 2s infinite ease-in-out;
  margin: 0 5px;
  position: relative;
  top: 2px;
  text-shadow: 0 0 10px rgba(226, 200, 159, 0.8);
}

.title-decoration {
  height: 2px;
  background: linear-gradient(to var(--direction), transparent, rgba(226, 200, 159, 0.8) 50%, transparent);
  flex: 1;
  max-width: 150px;
  position: relative;
}

.title-decoration::before, 
.title-decoration::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: #e2c89f;
  box-shadow: 0 0 8px #e2c89f, 0 0 16px rgba(226, 200, 159, 0.5);
  animation: glow 3s infinite alternate;
}

.title-decoration.left {
  --direction: right;
}

.title-decoration.left::before {
  right: 0;
  transform: translate(0, -50%);
}

.title-decoration.left::after {
  right: 30px;
  transform: translate(0, -50%) scale(0.7);
  animation-delay: 1s;
}

.title-decoration.right {
  --direction: left;
}

.title-decoration.right::before {
  left: 0;
  transform: translate(0, -50%);
}

.title-decoration.right::after {
  left: 30px;
  transform: translate(0, -50%) scale(0.7);
  animation-delay: 1s;
}

@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}

@keyframes glow {
  0% { opacity: 0.3; }
  100% { opacity: 1; }
}

@keyframes pulsate {
  0% { transform: scale(1); }
  50% { transform: scale(1.2); }
  100% { transform: scale(1); }
}

.digital-heritage-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.6);
  z-index: 1;
}

/* 对话容器 */
.dialogue-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.dialogue-section {
  width: 100%;
  display: grid;
  grid-template-columns: 180px 1fr 180px;
  gap: 25px;
  margin-bottom: 40px;
  transition: all 0.5s ease;
}

.dialogue-section.show-ancient .ancient-character {
  opacity: 1;
  filter: brightness(1.2);
  transform: scale(1.05);
}

.dialogue-section.show-ancient .modern-character {
  opacity: 0.6;
  filter: brightness(0.8);
  transform: scale(0.95);
}

.dialogue-section.show-modern .modern-character {
  opacity: 1;
  filter: brightness(1.2);
  transform: scale(1.05);
}

.dialogue-section.show-modern .ancient-character {
  opacity: 0.6;
  filter: brightness(0.8);
  transform: scale(0.95);
}

/* 角色样式 */
.dialogue-character {
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: all 0.3s ease;
}

.character-portrait {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  background-size: cover;
  background-position: center;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.6);
  border: 3px solid;
  transition: all 0.3s ease;
}

.ancient-character .character-portrait {
  border-color: #8b5a2b;
}

.modern-character .character-portrait {
  border-color: #4a90e2;
}

.character-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  opacity: 0.6;
  animation: glow-pulse 3s infinite alternate;
}

.ancient-glow {
  background: radial-gradient(circle, rgba(139, 90, 43, 0.5) 0%, transparent 70%);
}

.modern-glow {
  background: radial-gradient(circle, rgba(74, 144, 226, 0.5) 0%, transparent 70%);
}

@keyframes glow-pulse {
  0% { opacity: 0.3; transform: scale(0.9); }
  100% { opacity: 0.7; transform: scale(1.1); }
}

.character-name {
  margin-top: 20px;
  font-size: 1.3rem;
  font-weight: normal;
  text-align: center;
}

.ancient-character .character-name {
  color: #e2c89f;
  text-shadow: 0 0 10px rgba(226, 200, 159, 0.5);
}

.modern-character .character-name {
  color: #a5c9ff;
  text-shadow: 0 0 10px rgba(74, 144, 226, 0.5);
}

/* 对话内容 */
.dialogue-content {
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.3);
  border-radius: 10px;
  padding: 25px;
  min-height: 400px;
  max-height: 550px;
  backdrop-filter: blur(5px);
  border: 1px solid rgba(226, 200, 159, 0.2);
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  scroll-behavior: smooth;
  width: 100%;
  /* 自定义滚动条样式 */
  scrollbar-width: thin;
  scrollbar-color: rgba(219, 170, 57, 0.5) rgba(0, 0, 0, 0.2);
}

/* 自定义WebKit浏览器的滚动条样式 */
.dialogue-content::-webkit-scrollbar {
  width: 10px;
}

.dialogue-content::-webkit-scrollbar-track {
  background: rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 5px 0;
}

.dialogue-content::-webkit-scrollbar-thumb {
  background: linear-gradient(to bottom, rgba(219, 170, 57, 0.5), rgba(139, 90, 43, 0.7));
  border-radius: 5px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  box-shadow: inset 0 0 6px rgba(226, 200, 159, 0.3);
}

.dialogue-content::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(to bottom, rgba(219, 170, 57, 0.7), rgba(139, 90, 43, 0.9));
}

/* 装饰滚动条的轨道边缘 */
.dialogue-content::after {
  content: '';
  position: absolute;
  top: 5px;
  right: 5px;
  bottom: 5px;
  width: 12px;
  pointer-events: none;
  background: transparent;
  border-radius: 6px;
  box-shadow: inset 0 0 8px rgba(226, 200, 159, 0.1);
  z-index: 1;
}

/* 滚动条按钮样式 */
.dialogue-content::-webkit-scrollbar-button {
  display: none;
}

/* 对话气泡 */
.dialogue-bubble {
  padding: 18px 20px;
  border-radius: 10px;
  margin-bottom: 20px;
  max-width: 85%;
  position: relative;
  animation: fadeInUp 0.5s ease both;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
}

.ancient-bubble {
  align-self: flex-start;
  background: rgba(219, 170, 57, 0.2);
  border-left: 4px solid #dbaa39;
  color: #f0e6d2;
}

.modern-bubble {
  align-self: flex-end;
  background: rgba(74, 144, 226, 0.2);
  border-right: 4px solid #4a90e2;
  color: #d5e8ff;
}

.dialogue-bubble p {
  line-height: 1.6;
  font-size: 1.15rem;
  letter-spacing: 0.5px;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 对话元素标签 */

.dialogue-element {
  padding: 6px 6px;
  border-radius: 15px;
  font-size: 0.95rem;
  display: inline-block;
  animation: fadeIn 0.5s ease both;
}

.ancient-element {
  background: rgba(139, 90, 43, 0.3);
  border: 1px solid #8b5a2b;
  color: #e2c89f;
}

.modern-element {
  background: rgba(74, 144, 226, 0.3);
  border: 1px solid #4a90e2;
  color: #a5c9ff;
}

/* 话题选择器 */
.dialogue-interaction {
  align-self: center;
  width: 100%;
  margin: 20px 0;
  display: flex;
  justify-content: center;
  animation: fadeIn 0.5s ease both;
}

.topic-selector {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  max-width: 80%;
}

.topic-option {
  padding: 10px 20px;
  background: rgba(226, 200, 159, 0.2);
  border: 1px solid #e2c89f;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #e2c89f;
  text-align: center;
}

.topic-option:hover, .topic-option.active {
  background: rgba(226, 200, 159, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(226, 200, 159, 0.3);
}

/* 控制面板 */
.control-panel {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

.control-button {
  background: rgba(226, 200, 159, 0.2);
  border: 1px solid #e2c89f;
  color: #e2c89f;
  padding: 10px 25px;
  font-size: 1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
}

.control-button:hover {
  background: rgba(226, 200, 159, 0.4);
  transform: translateY(-3px);
  box-shadow: 0 5px 15px rgba(226, 200, 159, 0.3);
}

.button-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.button-icon {
  width: 16px;
  height: 16px;
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.next-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="%23e2c89f" d="M424.4 214.7L72.4 6.6C43.8-10.3 0 6.1 0 47.9V464c0 37.5 40.7 60.1 72.4 41.3l352-208c31.4-18.5 31.5-64.1 0-82.6z"/></svg>');
}

.reset-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23e2c89f" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4.83 47.89A247.16 247.16 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.19 247.19 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"/></svg>');
}

.chat-icon {
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23e2c89f" d="M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32z"/></svg>');
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

/* 响应式调整 */
@media (max-width: 1024px) {
  .dialogue-section {
    grid-template-columns: 150px 1fr 150px;
    gap: 20px;
  }
  
  .character-portrait {
    width: 130px;
    height: 130px;
  }
  
  .character-name {
    font-size: 1.2rem;
    margin-top: 15px;
  }
}

@media (max-width: 768px) {
  .dialogue-section {
    grid-template-columns: 120px 1fr 120px;
    gap: 15px;
  }
  
  .character-portrait {
    width: 100px;
    height: 100px;
    border-width: 2px;
  }
  
  .dialogue-content {
    padding: 20px;
    min-height: 350px;
  }
  
  .dialogue-bubble p {
    font-size: 1.05rem;
  }
  
  .user-input-field {
    padding: 12px 16px;
    font-size: 1rem;
  }
  
  .character-name {
    font-size: 1.1rem;
    margin-top: 12px;
  }
}

@media (max-width: 480px) {
  .dialogue-section {
    grid-template-columns: 80px 1fr 80px;
    gap: 10px;
  }
  
  .character-portrait {
    width: 70px;
    height: 70px;
  }
  
  .character-name {
    font-size: 0.9rem;
    margin-top: 8px;
  }
  
  .dialogue-bubble p {
    font-size: 1rem;
  }
}

/* 用户输入框样式 */
.user-input-container {
  display: flex;
  width: 100%;
  margin-top: 25px;
  position: relative;
}

.user-input-field {
  flex: 1;
  padding: 14px 18px;
  border-radius: 25px;
  border: 1px solid rgba(226, 200, 159, 0.5);
  background: rgba(0, 0, 0, 0.3);
  color: #e6e1d6;
  font-family: inherit;
  font-size: 1.1rem;
  outline: none;
  transition: all 0.3s ease;
}

.user-input-field:focus {
  border-color: #e2c89f;
  box-shadow: 0 0 10px rgba(226, 200, 159, 0.3);
}

.user-input-field::placeholder {
  color: rgba(226, 200, 159, 0.5);
}

.send-button {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: rgba(226, 200, 159, 0.3);
  margin-left: 12px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.send-button:hover {
  background: rgba(226, 200, 159, 0.5);
}

.send-icon {
  width: 24px;
  height: 24px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="%23e2c89f" d="M476 3.2L12.5 270.6c-18.1 10.4-15.8 35.6 2.2 43.2L121 358.4l287.3-253.2c5.5-4.9 13.3 2.6 8.6 8.3L176 407v80.5c0 23.6 28.5 32.9 42.5 15.8L282 426l124.6 52.2c14.2 6 30.4-2.9 33-18.2l72-432C515 7.8 493.3-6.8 476 3.2z"/></svg>');
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
}

.topic-selection {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 30px 0;
  animation: fadeIn 0.8s ease;
  background: rgba(0, 0, 0, 0.3);
  padding: 25px;
  border-radius: 12px;
  border: 1px solid rgba(219, 170, 57, 0.3);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.5);
}

.topic-title {
  font-size: 1.25rem;
  color: #e2c89f;
  margin-bottom: 25px;
  text-align: center;
  text-shadow: 0 0 10px rgba(226, 200, 159, 0.5);
  letter-spacing: 1px;
  font-weight: normal;
}

.topic-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: 100%;
  max-width: 800px;
}

.topic-item {
  background: rgba(219, 170, 57, 0.2);
  border: 2px solid #dbaa39;
  padding: 15px 18px;
  border-radius: 10px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  color: #f0e6d2;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 60px;
  position: relative;
  overflow: hidden;
}

.topic-item:hover {
  background: rgba(219, 170, 57, 0.4);
  transform: translateY(-5px);
  box-shadow: 0 6px 20px rgba(219, 170, 57, 0.4);
}

.topic-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, rgba(219, 170, 57, 0.1) 0%, transparent 100%);
  pointer-events: none;
}

.topic-item::after {
  content: '';
  position: absolute;
  bottom: 0;
  right: 0;
  width: 20px;
  height: 20px;
  background: radial-gradient(circle, rgba(219, 170, 57, 0.8) 0%, transparent 70%);
  border-radius: 50%;
  pointer-events: none;
    opacity: 0; 
  transition: opacity 0.3s ease;
  }

.topic-item:hover::after {
    opacity: 1; 
}

@media (max-width: 768px) {
  .topic-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
  
  .topic-item {
    padding: 15px;
    font-size: 1rem;
    min-height: 60px;
  }
  
  .topic-title {
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .topic-grid {
    grid-template-columns: 1fr;
  }
  
  .topic-item {
    padding: 12px;
    min-height: 50px;
  }
}

/* 思考中的动画样式 */
.thinking-animation {
  display: flex;
  align-items: center;
  padding: 15px 20px;
  margin-bottom: 20px;
  background: rgba(219, 170, 57, 0.1);
  border-radius: 10px;
  border-left: 4px solid #dbaa39;
  animation: fadeIn 0.3s ease;
}

.thinking-dots {
  display: flex;
  gap: 8px;
}

.thinking-dots span {
  width: 8px;
  height: 8px;
  background: #dbaa39;
  border-radius: 50%;
  animation: thinking 1.4s infinite ease-in-out;
}

.thinking-dots span:nth-child(1) {
  animation-delay: 0s;
}

.thinking-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.thinking-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes thinking {
  0%, 80%, 100% { 
    transform: scale(0.6);
    opacity: 0.6;
  }
  40% { 
    transform: scale(1);
    opacity: 1;
  }
}
</style> 