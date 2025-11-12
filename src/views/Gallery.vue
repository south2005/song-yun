<template>
  <div class="gallery">
    <div class="background-image"></div>
    <div class="chinese-ornament top-left"></div>
    <div class="chinese-ornament top-right"></div>
    <div class="chinese-ornament bottom-left"></div>
    <div class="chinese-ornament bottom-right"></div>
    
    <div class="content">
      <h1 class="page-title">古法解密 <span class="title-dot">•</span> 乾坤之悬</h1>
      <div class="title-ornament"></div>
      <audio ref="clickSound" src="/click.mp3" preload="auto"></audio>
      <audio ref="snapSound" src="/snap.mp3" preload="auto"></audio>

      <!-- 成就预览图，在未解锁时也可显示 -->
      <div class="preview-image-container">
        <img :src="currentAchievementImage || '/zuopingxingshang.jpg'" alt="背景图片" class="preview-image" />
      </div>
      
      <!-- 永久显示的成功消息 -->
      <!-- 这一段整体删除，不再显示右下角提示框 -->

      <div class="dial-container">
        <!-- 装饰圆环 -->
        <div class="decoration-ring outer-ring"></div>
        <div class="decoration-ring middle-ring"></div>
        <div class="decoration-ring inner-ring"></div>
        
        <!-- 外层转盘：朝代 -->
        <div class="dial outer-dial" ref="outerDial" 
          @mousedown="(e) => startRotate('outer', e)"
          @touchstart="(e) => startRotate('outer', e)"
          :class="{ 'active': rotating === 'outer' }">
          <div v-for="(dynasty, index) in dynasties" :key="`outer-${index}`" class="dial-number outer-number"
            :style="{ transform: `rotate(${index * 36}deg) translateY(-185px)` }"
            @click.stop="rotateToNumber('outer', index)">
            {{ dynasty.short }}
          </div>
          <div class="dial-marker"></div>
        </div>

        <!-- 中层转盘：类别 -->
        <div class="dial middle-dial" ref="middleDial" 
          @mousedown="(e) => startRotate('middle', e)"
          @touchstart="(e) => startRotate('middle', e)"
          :class="{ 'active': rotating === 'middle' }">
          <div v-for="(category, index) in categories" :key="`middle-${index}`" class="dial-number middle-number"
            :style="{ transform: `rotate(${index * 36}deg) translateY(-135px)` }"
            @click.stop="rotateToNumber('middle', index)">
            {{ category.code }}
          </div>
          <div class="dial-marker"></div>
        </div>

        <!-- 内层转盘 -->
        <div class="dial inner-dial" ref="innerDial" 
          @mousedown="(e) => startRotate('inner', e)"
          @touchstart="(e) => startRotate('inner', e)"
          :class="{ 'active': rotating === 'inner' }">
          <div v-for="n in 10" :key="`inner-${n}`" class="dial-number inner-number"
            :style="{ transform: `rotate(${(n - 1) * 36}deg) translateY(-85px)` }"
            @click.stop="rotateToNumber('inner', n - 1)">
            {{ (n - 1) }}
          </div>
          <div class="dial-marker"></div>
        </div>

        <!-- 中心点 -->
        <div class="dial-center">
          <div class="center-inner"></div>
        </div>
        
        <!-- 转盘光晕效果 -->
        <div class="dial-glow"></div>
      </div>

      <!-- 古韵提示文字 -->
      <div class="instruction-text-container">
        <p class="instruction-elegant-text">透左右密匙 • 旋转乾坤盘 • 合周天之数 • 启天机玄关</p>
      </div>

      <!-- 当前密码显示和解锁按钮 -->
      <div class="password-area">
        <div class="password-frame">
          <div class="frame-corner top-left"></div>
          <div class="frame-corner top-right"></div>
          <div class="frame-corner bottom-left"></div>
          <div class="frame-corner bottom-right"></div>
          
          <div class="password-display">
            <span class="password-label">当前密码：</span>
            <span class="password-value">{{ dynastyValue }}{{ categoryValue }}{{ innerValue }}</span>
          </div>
          
          <div class="button-container">
            <button class="unlock-button" @click="checkPassword">
              <div class="button-corner top-left"></div>
              <div class="button-corner bottom-right"></div>
              <span class="button-text">解密</span>
            </button>
          </div>
        </div>
      </div>

      <!-- 解锁成功模态框 -->
      <div v-if="unlocked" class="unlock-modal" @click="closeModal">
        <div class="modal-content" @click.stop>
          <button class="close-button" @click="closeModal">&times;</button>
          <div class="success-message">
            <h2>恭喜！密码正确</h2>
            <p>您已成功解锁《{{ currentAchievement.name }}》</p>
            <div class="achievement-info">
              <div class="achievement-image">
                <img :src="currentAchievement.imageUrl" :alt="currentAchievement.name" />
              </div>
              <div class="achievement-text">
                <p><strong>朝代：</strong>{{ currentAchievement.dynasty }}</p>
                <p><strong>年代：</strong>{{ currentAchievement.year }}</p>
                <p><strong>发明者：</strong>{{ currentAchievement.inventor }}</p>
                <p class="achievement-description">{{ currentAchievement.description }}</p>
                
                <div class="button-row">
                  <button class="visualization-button" @click="showTimeline">
                    <span class="button-text">演示</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 时间线组件 -->
      <MoziTimeline v-if="showingTimeline === 'mozi'" @close="closeTimeline" @show-demo="showDemo" />
      <ZhangHengTimeline v-if="showingTimeline === 'zhangheng'" @close="closeTimeline" @show-demo="showDemo" />
      <ZuChongzhiTimeline v-if="showingTimeline === 'zuchongzhi'" @close="closeTimeline" @show-demo="showDemo" />
      <GuoShoujingTimeline v-if="showingTimeline === 'guoshoujing'" @close="closeTimeline" @show-demo="showDemo" />
      <LiShizhenTimeline v-if="showingTimeline === 'lishizhen'" @close="closeTimeline" @show-demo="showDemo" />

      <!-- 密码提示区域 -->
      <div class="password-hint-panels">
        <div class="password-panel left-panel">
          <div class="panel-header">
            <div class="panel-title">古典科学密匙</div>
            <div class="panel-subtitle">中华文明的天工精粹</div>
          </div>
          
          <div class="hint-item" data-dynasty="周">
            <div class="hint-icon"><i class="hint-symbol">画</i></div>
            <div class="hint-content">
              <div class="hint-code">068</div>
              <div class="hint-name">诗情画意</div>
              <div class="hint-desc">宋代文人画艺术，融合诗词意境与绘画技法</div>
            </div>
          </div>
          
          <div class="hint-item" data-dynasty="汉">
            <div class="hint-icon"><i class="hint-symbol">书</i></div>
            <div class="hint-content">
              <div class="hint-code">178</div>
              <div class="hint-name">书法艺术</div>
              <div class="hint-desc">宋代书法艺术，以苏黄米蔡四大家为代表</div>
            </div>
          </div>
          
          <div class="hint-item" data-dynasty="南">
            <div class="hint-icon"><i class="hint-symbol">瓷</i></div>
            <div class="hint-content">
              <div class="hint-code">429</div>
              <div class="hint-name">瓷器工艺</div>
              <div class="hint-desc">宋代五大名窑，展现中国瓷器艺术巅峰</div>
            </div>
          </div>
        </div>
        
        <div class="password-panel right-panel">
          <div class="panel-header">
            <div class="panel-title">古法密码</div>
            <div class="panel-subtitle">解锁华夏智慧遗产</div>
          </div>
          
          <div class="hint-item" data-dynasty="元">
            <div class="hint-icon"><i class="hint-symbol">建</i></div>
            <div class="hint-content">
              <div class="hint-code">731</div>
              <div class="hint-name">雕梁画栋</div>
              <div class="hint-desc">宋代建筑艺术，展现精湛的木构建筑技艺</div>
            </div>
          </div>
          
          <div class="hint-item" data-dynasty="明">
            <div class="hint-icon"><i class="hint-symbol">服</i></div>
            <div class="hint-content">
              <div class="hint-code">818</div>
              <div class="hint-name">袍服冠带</div>
              <div class="hint-desc">宋代服饰文化，体现等级制度与审美风尚</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed, watch } from 'vue';
import { soundManager } from '../utils/soundManager';
import MoziTimeline from '../components/MoziTimeline.vue';
import ZhangHengTimeline from '../components/ZhangHengTimeline.vue';
import ZuChongzhiTimeline from '../components/ZuChongzhiTimeline.vue';
import GuoShoujingTimeline from '../components/GuoShoujingTimeline.vue';
import LiShizhenTimeline from '../components/LiShizhenTimeline.vue';

export default {
  name: 'Gallery',
  components: {
    MoziTimeline,
    ZhangHengTimeline,
    ZuChongzhiTimeline,
    GuoShoujingTimeline,
    LiShizhenTimeline
  },
  setup() {
    // 转盘元素引用
    const outerDial = ref(null);
    const middleDial = ref(null);
    const innerDial = ref(null);

    // 各层当前角度
    const outerAngle = ref(0);
    const middleAngle = ref(0);
    const innerAngle = ref(0);

    // 朝代数据
    const dynasties = ref([
      { id: 0, name: "0", short: "0" },
      { id: 1, name: "1", short: "1" },
      { id: 2, name: "2", short: "2" },
      { id: 3, name: "3", short: "3" },
      { id: 4, name: "4", short: "4" },
      { id: 5, name: "5", short: "5" },
      { id: 6, name: "6", short: "6" },
      { id: 7, name: "7", short: "7" },
      { id: 8, name: "8", short: "8" },
      { id: 9, name: "9", short: "9" }
    ]);

    // 类别数据
    const categories = ref([
      { id: 0, name: "天文学", code: "1" },
      { id: 1, name: "数学", code: "2" },
      { id: 2, name: "医学", code: "3" },
      { id: 3, name: "工艺技术", code: "4" },
      { id: 4, name: "农学", code: "5" },
      { id: 5, name: "哲学", code: "6" },
      { id: 6, name: "文学", code: "7" },
      { id: 7, name: "绘画", code: "8" },
      { id: 8, name: "音乐", code: "9" },
      { id: 9, name: "军事", code: "0" }
    ]);

    // 各层当前值
    const dynastyValue = ref("周");
    const categoryValue = ref("1");
    const innerValue = ref(0);

    // 当前朝代文本
    const currentDynasty = ref("");

    // 密码输入和状态
    const password = ref("");
    const incorrectPassword = ref(false);

    // 解锁状态
    const unlocked = ref(false);
    const currentAchievement = ref({});
    
    // 当前组合可能匹配的成就图片
    const currentAchievementImage = computed(() => {
      const currentCode = `${dynastyValue.value}${categoryValue.value}${innerValue.value}`;
      const found = achievements.value.find(a => a.code === currentCode);
      return found ? found.imageUrl : null;
    });
    
    // 当前组合可能匹配的成就名称
    const currentAchievementName = computed(() => {
      const currentCode = `${dynastyValue.value}${categoryValue.value}${innerValue.value}`;
      const found = achievements.value.find(a => a.code === currentCode);
      return found ? found.name : "未知成就";
    });
    
    // 解锁进度百分比，根据已正确设置的转盘数量计算
    const progressPercentage = computed(() => {
      if (!currentAchievementImage.value) return 0;
      
      let progress = 0;
      const currentCode = `${dynastyValue.value}${categoryValue.value}${innerValue.value}`;
      const targetAchievement = achievements.value.find(a => a.code === currentCode);
      
      if (targetAchievement) {
        // 计算各部分是否匹配
        if (targetAchievement.code.startsWith(dynastyValue.value)) progress += 33.3;
        if (targetAchievement.code.substring(1, 2) === categoryValue.value) progress += 33.3;
        if (targetAchievement.code.substring(2) === String(innerValue.value)) progress += 33.4;
      }
      
      return progress;
    });

    // 科学成就数据
    const achievements = ref([
      {
        id: 1,
        code: "068",
        name: "诗情画意",
        dynasty: "宋朝",
        year: "约10-13世纪",
        inventor: "文人画家",
        description: "宋代文人画艺术，融合诗词意境与绘画技法，开创了中国绘画艺术的新境界。",
        imageUrl: "/images/allxiaokongchengxianng.jpg"
      },
      {
        id: 2,
        code: "178",
        name: "书法艺术",
        dynasty: "宋朝",
        year: "约10-13世纪",
        inventor: "苏黄米蔡",
        description: "宋代书法艺术以苏黄米蔡四大家为代表，开创了书法艺术的新风格。",
        imageUrl: "/images/allhoufengdidongyi.jpg"
      },
      {
        id: 3,
        code: "429",
        name: "瓷器工艺",
        dynasty: "宋朝",
        year: "约10-13世纪",
        inventor: "五大名窑",
        description: "宋代五大名窑（汝、官、哥、钧、定）的瓷器工艺，展现了中国瓷器艺术的巅峰。",
        imageUrl: "/images/allsuanchou.jpg"
      },
      {
        id: 4,
        code: "731",
        name: "雕梁画栋",
        dynasty: "宋朝",
        year: "约10-13世纪",
        inventor: "建筑工匠",
        description: "宋代建筑艺术，以精湛的木构建筑技艺和精美的装饰艺术著称。",
        imageUrl: "/images/alljianyi.jpg"
      },
      {
        id: 5,
        code: "818",
        name: "袍服冠带",
        dynasty: "宋朝",
        year: "约10-13世纪",
        inventor: "服饰工匠",
        description: "宋代服饰文化，通过袍服冠带等服饰形式，体现了等级制度与审美风尚。",
        imageUrl: "/images/allyaohulu.jpg"
      }
    ]);

    // 旋转状态和起始位置
    const rotating = ref(null);
    const startX = ref(0);
    const startY = ref(0);
    const startRotation = ref(0);

    // 计算鼠标/触摸事件的坐标
    const getEventCoordinates = (event) => {
      if (event.type && event.type.includes('touch')) {
        return event.touches[0] || event.changedTouches[0];
      }
      return event;
    };

    // 开始旋转
    const startRotate = (dialType, event) => {
      try {
        // 播放点击音效
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 800; // 时钟般的点击声
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.1);
          
          setTimeout(() => {
            oscillator.stop();
          }, 100);
        } catch (e) {
          console.warn('音效播放失败，但不影响功能', e);
        }
        
        rotating.value = dialType;

        // 获取当前转盘元素和角度
        let currentAngle;
        if (dialType === 'outer') {
          currentAngle = outerAngle.value;
        } else if (dialType === 'middle') {
          currentAngle = middleAngle.value;
        } else {
          currentAngle = innerAngle.value;
        }

        // 记录起始位置和角度
        const coords = getEventCoordinates(event);
        startX.value = coords.clientX;
        startY.value = coords.clientY;
        startRotation.value = currentAngle;

        // 添加事件监听器
        document.addEventListener('mousemove', rotate);
        document.addEventListener('touchmove', rotate, { passive: false });
        document.addEventListener('mouseup', stopRotate);
        document.addEventListener('touchend', stopRotate);
        
        // 防止事件默认行为和冒泡
        if (event) {
          event.preventDefault();
          event.stopPropagation();
        }
      } catch(error) {
        console.error('开始旋转错误:', error);
      }
    };

    // 旋转处理
    const rotate = (event) => {
      if (!rotating.value) return;

      try {
        // 阻止事件默认行为
        event.preventDefault();

        // 获取当前转盘元素
        let dialElement;
        if (rotating.value === 'outer') {
          dialElement = outerDial.value;
        } else if (rotating.value === 'middle') {
          dialElement = middleDial.value;
        } else {
          dialElement = innerDial.value;
        }

        if (!dialElement) return;

        // 获取转盘中心坐标
        const rect = dialElement.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // 获取当前鼠标/触摸位置
        const coords = getEventCoordinates(event);
        const currentX = coords.clientX;
        const currentY = coords.clientY;

        // 计算向量和角度
        const startVector = { x: startX.value - centerX, y: startY.value - centerY };
        const currentVector = { x: currentX - centerX, y: currentY - centerY };
        
        // 计算起始向量与当前向量之间的角度
        const startAngle = Math.atan2(startVector.y, startVector.x);
        const currentAngle = Math.atan2(currentVector.y, currentVector.x);
        let angleDiff = (currentAngle - startAngle) * (180 / Math.PI);
        
        // 确保采用最短路径旋转
        if (angleDiff > 180) angleDiff -= 360;
        if (angleDiff < -180) angleDiff += 360;
        
        // 计算新的旋转角度
        let newAngle = startRotation.value + angleDiff;
        
        // 保持角度在0-360范围内
        newAngle = (newAngle % 360 + 360) % 360;

        // 更新当前转盘的角度和显示
        if (rotating.value === 'outer') {
          dialElement.style.transform = `rotate(${newAngle}deg)`;
          outerAngle.value = newAngle;
          
          // 计算当前朝代索引
          const dialPosition = Math.round(newAngle / 36) % 10;
          const dynastyIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          dynastyValue.value = dynasties.value[dynastyIndex].short;
          
        } else if (rotating.value === 'middle') {
          dialElement.style.transform = `rotate(${newAngle}deg)`;
          middleAngle.value = newAngle;
          
          // 计算当前类别索引
          const dialPosition = Math.round(newAngle / 36) % 10;
          const categoryIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          categoryValue.value = categories.value[categoryIndex].code;
          
        } else {
          dialElement.style.transform = `rotate(${newAngle}deg)`;
          innerAngle.value = newAngle;
          
          // 计算当前内层索引
          const dialPosition = Math.round(newAngle / 36) % 10;
          const innerIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          innerValue.value = innerIndex;
        }
        
        // 在转盘旋转过程中应用背景效果
        adjustBackgroundImage(rotating.value);
        
        // 更新起始位置，使旋转更流畅
        startX.value = currentX;
        startY.value = currentY;
        startRotation.value = newAngle;
        
      } catch (error) {
        console.error('旋转错误:', error);
      }
    };

    // 停止旋转
    const stopRotate = () => {
      if (!rotating.value) return;

      try {
        // 播放音效
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 600; // 较低的音调
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);
          
          setTimeout(() => {
            oscillator.stop();
          }, 200);
        } catch (e) {
          console.warn('音效播放失败，但不影响功能', e);
        }

        // 获取当前转盘和角度
        let dialElement, currentAngle;
        if (rotating.value === 'outer') {
          dialElement = outerDial.value;
          currentAngle = outerAngle.value;
        } else if (rotating.value === 'middle') {
          dialElement = middleDial.value;
          currentAngle = middleAngle.value;
        } else {
          dialElement = innerDial.value;
          currentAngle = innerAngle.value;
        }

        if (!dialElement) {
          rotating.value = null;
          return;
        }

        // 计算最接近的刻度位置（10个刻度，每个36度）
        const closestTick = Math.round(currentAngle / 36) * 36;
        
        // 添加平滑过渡动画
        dialElement.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        dialElement.style.transform = `rotate(${closestTick}deg)`;

        // 更新当前角度为最接近的刻度位置
        if (rotating.value === 'outer') {
          outerAngle.value = closestTick;
          
          // 计算当前朝代索引
          const dialPosition = (closestTick / 36) % 10;
          const dynastyIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          dynastyValue.value = dynasties.value[dynastyIndex].short;
          
        } else if (rotating.value === 'middle') {
          middleAngle.value = closestTick;
          
          // 计算当前类别索引
          const dialPosition = (closestTick / 36) % 10;
          const categoryIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          categoryValue.value = categories.value[categoryIndex].code;
          
        } else {
          innerAngle.value = closestTick;
          
          // 计算当前内层索引
          const dialPosition = (closestTick / 36) % 10;
          const innerIndex = (10 - dialPosition) % 10;
          
          // 更新当前值
          innerValue.value = innerIndex;
        }

        // 重置旋转状态
        rotating.value = null;

        // 移除动画过渡属性
        setTimeout(() => {
          if (dialElement) {
            dialElement.style.transition = '';
          }
        }, 300);

        // 移除事件监听器
        document.removeEventListener('mousemove', rotate);
        document.removeEventListener('touchmove', rotate);
        document.removeEventListener('mouseup', stopRotate);
        document.removeEventListener('touchend', stopRotate);
      } catch (error) {
        console.error('停止旋转错误:', error);
        rotating.value = null;
      }
    };

    // 对齐到最近的数字位置
    const snapToNearestNumber = (dialType) => {
      if (!dialType) return;
      
      try {
        let currentAngle, dialElement;

        if (dialType === 'outer') {
          currentAngle = outerAngle.value;
          dialElement = outerDial.value;
        } else if (dialType === 'middle') {
          currentAngle = middleAngle.value;
          dialElement = middleDial.value;
        } else {
          currentAngle = innerAngle.value;
          dialElement = innerDial.value;
        }

        if (!dialElement) return;

        // 计算最近的刻度位置（每个数字36度）
        const snapAngle = Math.round(currentAngle / 36) * 36;

        // 添加平滑动画效果，使用CSS过渡
        dialElement.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        
        // 应用对齐旋转
        if (dialType === 'outer') {
          outerAngle.value = snapAngle;
          dialElement.style.transform = `rotate(${snapAngle}deg)`;
          const index = Math.round(((360 - snapAngle) % 360) / 36) % 10;
          dynastyValue.value = dynasties.value[index].short;
          currentDynasty.value = dynasties.value[index].name;
        } else if (dialType === 'middle') {
          middleAngle.value = snapAngle;
          dialElement.style.transform = `rotate(${snapAngle}deg)`;
          const index = Math.round(((360 - snapAngle) % 360) / 36) % 10;
          categoryValue.value = categories.value[index].code;
        } else {
          innerAngle.value = snapAngle;
          dialElement.style.transform = `rotate(${snapAngle}deg)`;
          innerValue.value = Math.round(((360 - snapAngle) % 360) / 36) % 10;
        }
        
        // 移除过渡效果，恢复响应式拖动
        setTimeout(() => {
          if (dialElement) {
            dialElement.style.transition = '';
          }
        }, 300);
      } catch(error) {
        console.error('对齐到最近数字错误:', error);
      }
    };

    // 旋转到特定数字
    const rotateToNumber = (dialType, index) => {
      try {
        // 计算目标角度
        const targetAngle = (10 - index) % 10 * 36;

        // 获取当前转盘元素和当前角度
        let dialElement, currentAngle;
        if (dialType === 'outer') {
          dialElement = outerDial.value;
          currentAngle = outerAngle.value;
        } else if (dialType === 'middle') {
          dialElement = middleDial.value;
          currentAngle = middleAngle.value;
        } else {
          dialElement = innerDial.value;
          currentAngle = innerAngle.value;
        }

        if (!dialElement) return;

        // 计算最短路径（考虑360度旋转）
        let angleDiff = targetAngle - (currentAngle % 360);
        if (Math.abs(angleDiff) > 180) {
          angleDiff = angleDiff > 0 ? angleDiff - 360 : angleDiff + 360;
        }

        // 播放点击音效
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.type = 'sine';
          oscillator.frequency.value = 700 + index * 30; // 根据索引变化音调
          gainNode.gain.value = 0.1;
          
          oscillator.start();
          gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.15);
          
          setTimeout(() => {
            oscillator.stop();
          }, 150);
        } catch (e) {
          console.warn('音效播放失败，但不影响功能', e);
        }

        // 添加平滑过渡动画
        dialElement.style.transition = `transform ${Math.abs(angleDiff) / 36 * 0.1 + 0.3}s cubic-bezier(0.175, 0.885, 0.32, 1.275)`;
        dialElement.style.transform = `rotate(${targetAngle}deg)`;

        // 更新当前角度
        if (dialType === 'outer') {
          outerAngle.value = targetAngle;
          dynastyValue.value = dynasties.value[index].short;
        } else if (dialType === 'middle') {
          middleAngle.value = targetAngle;
          categoryValue.value = categories.value[index].code;
        } else {
          innerAngle.value = targetAngle;
          innerValue.value = index;
        }

        // 移除动画过渡属性，但保留样式和转换
        setTimeout(() => {
          if (dialElement) {
            dialElement.style.transition = '';
          }
        }, Math.abs(angleDiff) / 36 * 100 + 300);
        
        // 应用背景效果
        adjustBackgroundImage(dialType);
      } catch (error) {
        console.error('旋转到指定数字错误:', error);
      }
    };

    // 检查密码
    const checkPassword = () => {
      // 获取当前组合
      const currentCode = `${dynastyValue.value}${categoryValue.value}${innerValue.value}`;
      
      // 使用转盘组合验证
      const found = achievements.value.find(a => a.code === currentCode);
      if (found) {
        currentAchievement.value = found;
        unlocked.value = true;
      } else {
        // 使用自定义提示框而不是原生alert
        showInvalidCombinationMessage();
      }
    };

    // 显示无效组合提示
    const showInvalidCombinationMessage = () => {
      // 获取密码显示区域元素
      const passwordDisplay = document.querySelector('.password-display');
      if (!passwordDisplay) {
        console.error('未找到密码显示区域元素');
        return;
      }
      
      // 获取密码区域元素
      const passwordFrame = document.querySelector('.password-frame');
      if (!passwordFrame) {
        console.error('未找到密码框元素');
        return;
      }
      
      // 添加错误样式到密码框
      passwordFrame.classList.add('password-error');
      
      // 创建或更新错误消息
      let errorMsg = document.querySelector('.password-error-message');
      if (!errorMsg) {
        errorMsg = document.createElement('div');
        errorMsg.className = 'password-error-message';
        passwordDisplay.insertAdjacentElement('afterend', errorMsg);
      }
      
      errorMsg.innerHTML = `
        <div class="error-icon">
          <i class="error-symbol">❌</i>
        </div>
        <div class="error-content">
          <p>密码无效，请尝试其他组合</p>
        </div>
      `;
      
      // 自动清除错误状态
      setTimeout(() => {
        passwordFrame.classList.remove('password-error');
        if (errorMsg && errorMsg.parentNode) {
          errorMsg.classList.add('fade-out');
          setTimeout(() => {
            if (errorMsg.parentNode) {
              errorMsg.parentNode.removeChild(errorMsg);
            }
          }, 500);
        }
      }, 3000);
    };

    // 关闭模态框
    const closeModal = () => {
      unlocked.value = false;
      showingTimeline.value = null;
    };

    // 动态调整背景图片样式
    const adjustBackgroundImage = (dialType) => {
      const backgroundImg = document.querySelector('.background-image');
      if (!backgroundImg) return;
      
      // 根据不同的转盘旋转应用不同的动画效果
      if (dialType === 'outer') {
        backgroundImg.style.filter = 'sepia(0.3) brightness(0.7) contrast(1.1) hue-rotate(30deg)';
      } else if (dialType === 'middle') {
        backgroundImg.style.filter = 'sepia(0.3) brightness(0.8) contrast(1.2) saturate(1.2)';
      } else {
        backgroundImg.style.filter = 'sepia(0.3) brightness(0.7) contrast(1.3) saturate(1.3)';
      }
    };

    // 时间线状态
    const showingTimeline = ref(null);
    
    // 显示时间线
    const showTimeline = () => {
      // 根据当前成就的inventor或name来决定显示哪个时间线
      const inventor = currentAchievement.value.inventor?.toLowerCase() || '';
      const name = currentAchievement.value.name || '';
      
      if (inventor.includes('墨') || name.includes('小孔成像')) {
        showingTimeline.value = 'mozi';
      } else if (inventor.includes('张衡') || name.includes('候风地动仪')) {
        showingTimeline.value = 'zhangheng';
      } else if (inventor.includes('祖冲之') || name.includes('密率') || name.includes('圆周率')) {
        showingTimeline.value = 'zuchongzhi';
      } else if (inventor.includes('郭守敬') || name.includes('简仪') || name.includes('授时历')) {
        showingTimeline.value = 'guoshoujing';
      } else if (inventor.includes('李时珍') || name.includes('本草纲目') || name.includes('药葫芦')) {
        showingTimeline.value = 'lishizhen';
      } else {
        // 如果没有匹配到特定的时间线，则根据code来决定
        const code = currentAchievement.value.code;
        if (code === '068') {
          showingTimeline.value = 'mozi';
        } else if (code === '178') {
          showingTimeline.value = 'zhangheng';
        } else if (code === '429') {
          showingTimeline.value = 'zuchongzhi';
        } else if (code === '731') {
          showingTimeline.value = 'guoshoujing';
        } else if (code === '818') {
          showingTimeline.value = 'lishizhen';
        }
      }
    };
    
    // 关闭时间线
    const closeTimeline = () => {
      showingTimeline.value = null;
    };
    
    // 展示演示内容
    const showDemo = (demoType) => {
      console.log(`显示演示: ${demoType}`);
      // 这里可以添加演示内容的实现
      
      // 根据当前显示的时间线类型，处理不同的演示内容
      if (showingTimeline.value === 'zhangheng') {
        console.log(`显示张衡演示: ${demoType}`);
        // 张衡时间线相关的演示已在ZhangHengTimeline组件内部处理
      } else if (showingTimeline.value === 'mozi') {
        console.log(`显示墨子演示: ${demoType}`);
        // 墨子时间线相关的演示可能需要其他处理
      } else {
        console.log(`显示其他演示: ${demoType}`);
        // 其他时间线的演示处理
      }
    };

    // 组件挂载
    onMounted(() => {
      // 初始化转盘位置
      rotateToNumber('outer', 0); // 周
      rotateToNumber('middle', 9); // 0
      rotateToNumber('inner', 0); // 0

      // 设置背景图片
      const bgImage = document.querySelector('.background-image');
      if (bgImage) {
        bgImage.style.backgroundImage = `url(/zuopingxingshang.jpg)`;
        
        // 确保背景图片加载完成后显示
        const img = new Image();
        img.onload = () => {
          bgImage.style.opacity = 0.9;
        };
        img.src = '/zuopingxingshang.jpg';
      }
    });

    onUnmounted(() => {
      document.removeEventListener('mousemove', rotate);
      document.removeEventListener('touchmove', rotate);
      document.removeEventListener('mouseup', stopRotate);
      document.removeEventListener('touchend', stopRotate);
    });

    return {
      outerDial,
      middleDial,
      innerDial,
      dynastyValue,
      categoryValue,
      innerValue,
      dynasties,
      categories,
      startRotate,
      rotateToNumber,
      unlocked,
      currentAchievement,
      currentAchievementImage,
      currentAchievementName,
      progressPercentage,
      checkPassword,
      closeModal,
      showInvalidCombinationMessage,
      adjustBackgroundImage,
      rotating,
      password,
      incorrectPassword,
      showTimeline,
      closeTimeline,
      showingTimeline,
      showDemo
    };
  }
}
</script>

<style scoped>
.gallery {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  padding: 20px;
  background-color: #0a0a0a;
  color: #f2e6d9;
}

/* 背景图片 */
.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/paper-texture.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.6;
  z-index: -2;
  filter: brightness(0.5) contrast(1.3) saturate(0.8);
}

.background-image::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(10, 10, 10, 0.3) 0%, rgba(10, 10, 10, 0.8) 100%);
  z-index: -1;
}

.content {
  position: relative;
  max-width: 1200px;
  width: 100%;
  z-index: 2;
  padding: 30px 0;
}

.content::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="contentPattern" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M0,0 L40,40 M40,0 L0,40" stroke="%23d3b78e" stroke-width="0.2" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23contentPattern)"/></svg>');
  pointer-events: none;
  z-index: -1;
  opacity: 0.3;
}

.page-title {
  font-family: "STXingkai", "华文行楷", "行楷", cursive;
  font-size: 2.8rem;
  color: #e2c89f;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(211, 183, 142, 0.5);
  margin-bottom: 15px;
  text-align: center;
  letter-spacing: 0.2rem;
  position: relative;
  animation: title-glow 3s ease-in-out infinite alternate;
}

@keyframes title-glow {
  from {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 20px rgba(211, 183, 142, 0.3);
  }
  to {
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 30px rgba(211, 183, 142, 0.8);
  }
}

.page-title::before,
.page-title::after {
  content: "";
  position: absolute;
  bottom: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #e2c89f, transparent);
}

.page-title::before {
  left: 30%;
  width: 40%;
  opacity: 0.8;
}

.page-title::after {
  left: 25%;
  width: 50%;
  bottom: 6px;
  opacity: 0.5;
}

.title-dot {
  display: inline-block;
  color: #d3b78e;
  margin: 0 0.5rem;
  transform: translateY(-0.1rem);
  animation: dot-pulse 3s ease-in-out infinite;
}

@keyframes dot-pulse {
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
}

.title-ornament {
  width: 300px;
  height: 20px;
  margin: 0 auto 40px;
  background: linear-gradient(90deg, transparent, rgba(211, 183, 142, 0.5), transparent);
  opacity: 0.8;
}

/* 转盘容器样式 */
.dial-container {
  position: relative;
  width: 400px;
  height: 400px;
  margin: 2rem auto;
  display: flex;
  justify-content: center;
  align-items: center;
  perspective: 1000px;
  transform: scale(1);
  transition: transform 0.5s ease;
}

.dial-container::before {
  content: '';
  position: absolute;
  width: 420px;
  height: 420px;
  border: 1px dashed rgba(211, 183, 142, 0.3);
  border-radius: 50%;
  pointer-events: none;
  animation: rotate-slow 120s linear infinite;
}

@keyframes rotate-slow {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 成就图片背景 */
.achievement-background {
  position: absolute;
  width: 120%;
  height: 120%;
  left: -10%;
  top: -10%;
  border-radius: 50%;
  overflow: hidden;
  z-index: -1;
  opacity: 0.9;
  box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.5);
  animation: pulse 8s ease-in-out infinite alternate;
  transition: opacity 0.3s ease-in;
}

.achievement-background img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  filter: brightness(0.85) contrast(1.2) saturate(1.1);
}

@keyframes pulse {
  0% {
    transform: scale(1.0) rotate(0deg);
    filter: brightness(0.85) contrast(1.1) saturate(1.0);
  }
  100% {
    transform: scale(1.1) rotate(5deg);
    filter: brightness(0.95) contrast(1.3) saturate(1.2);
  }
}

/* 页面响应式布局 */
@media (max-width: 768px) {
  .dial-container {
    transform: scale(0.8);
    margin: 0 auto;
  }

  .password-area {
    margin-top: 0;
    max-width: 100%;
    padding: 0 1rem;
  }

  .page-title {
    font-size: 2rem;
    margin: 2rem 0;
    padding-bottom: 1rem;
    margin-bottom: 2rem;
  }

  .achievement-info {
    flex-direction: column;
  }

  .achievement-image {
    width: 100%;
    max-width: 200px;
    margin: 0 auto 1.5rem;
  }
  
  .unlock-button {
    width: 80%;
  }
}

@media (min-width: 769px) and (max-width: 1024px) {
  .dial-container {
    transform: scale(0.9);
  }
  
  .password-area {
    max-width: 450px;
  }
}

@media (min-height: 800px) {
  .dial-container {
    margin: 3rem auto;
  }
}

/* 移除箭头提示 */
.dial-container::before {
  content: none;
}

@keyframes guide-pulse {
  0%, 100% {
    opacity: 0.8;
  }
  50% {
    opacity: 0.4;
  }
}

/* 基础转盘样式 */
.dial {
  position: absolute;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: grab;
  transition: box-shadow 0.3s ease;
  user-select: none;
  will-change: transform;
  backdrop-filter: blur(1px);
  z-index: 1;
}

.dial:active {
  cursor: grabbing;
}

.dial:hover {
  box-shadow: 0 0 20px rgba(211, 183, 142, 0.3);
}

/* 转盘激活状态 */
.dial.active {
  box-shadow: 0 0 30px rgba(211, 183, 142, 0.5);
}

/* 外层转盘 */
.outer-dial {
  width: 380px;
  height: 380px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="380" height="380" viewBox="0 0 380 380"><circle cx="190" cy="190" r="188" fill="none" stroke="%23d3b78e" stroke-width="2" stroke-dasharray="4,4"/></svg>');
  border: 2px solid #d3b78e;
  transform-style: preserve-3d;
  background-color: rgba(82, 44, 25, 0.15);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.4), 0 0 15px rgba(211, 183, 142, 0.3);
}

/* 中层转盘 */
.middle-dial {
  width: 280px;
  height: 280px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="280" height="280" viewBox="0 0 280 280"><circle cx="140" cy="140" r="138" fill="none" stroke="%23d3b78e" stroke-width="2" stroke-dasharray="6,2"/></svg>');
  border: 2px solid #d3b78e;
  transform-style: preserve-3d;
  background-color: rgba(97, 54, 31, 0.15);
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.4), 0 0 15px rgba(211, 183, 142, 0.3);
}

/* 内层转盘 */
.inner-dial {
  width: 180px;
  height: 180px;
  background: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="180" height="180" viewBox="0 0 180 180"><circle cx="90" cy="90" r="88" fill="none" stroke="%23d3b78e" stroke-width="2" stroke-dasharray="2,2"/></svg>');
  border: 2px solid #d3b78e;
  transform-style: preserve-3d;
  background-color: rgba(117, 64, 37, 0.15);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(211, 183, 142, 0.3);
}

/* 转盘数字 */
.dial-number {
  position: absolute;
  color: #e2c89f;
  font-weight: bold;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.7);
  pointer-events: auto;
  width: 40px;
  height: 40px;
  line-height: 40px;
  text-align: center;
  transition: color 0.3s ease, text-shadow 0.3s ease, transform 0.3s ease;
  cursor: pointer;
  z-index: 3;
}

.dial-number:hover {
  color: #fff;
  text-shadow: 0 0 8px #d3b78e;
  transform: scale(1.2) translateY(-2px);
}

.outer-number {
  font-size: 1.8rem;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
}

.middle-number {
  font-size: 1.6rem;
}

.inner-number {
  font-size: 1.5rem;
}

/* 中心点 */
.dial-center {
  position: absolute;
  width: 40px;
  height: 40px;
  background-color: rgba(211, 183, 142, 0.7);
  border-radius: 50%;
  box-shadow: 0 0 15px rgba(211, 183, 142, 0.7);
  z-index: 10;
  pointer-events: none;
}

.center-inner {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 20px;
  height: 20px;
  background-color: #e2c89f;
  border-radius: 50%;
  box-shadow: 0 0 10px rgba(211, 183, 142, 0.5);
}

/* 转盘光晕效果 */
.dial-glow {
  position: absolute;
  top: -50px;
  left: -50px;
  width: calc(100% + 100px);
  height: calc(100% + 100px);
  border-radius: 50%;
  background: radial-gradient(circle, rgba(211, 183, 142, 0.15) 0%, rgba(211, 183, 142, 0) 70%);
  pointer-events: none;
  z-index: 0;
  animation: glow-pulse 4s infinite alternate ease-in-out;
}

@keyframes glow-pulse {
  0% {
    opacity: 0.3;
    transform: scale(0.95);
  }
  100% {
    opacity: 0.7;
    transform: scale(1.05);
  }
}

/* 按钮发光效果 */
.button-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(45deg, transparent, rgba(211, 183, 142, 0.2), transparent);
  z-index: 0;
  transform: translateX(-100%);
  animation: button-glow 3s infinite;
}

@keyframes button-glow {
  0%, 100% {
    transform: translateX(-100%);
  }
  50% {
    transform: translateX(100%);
  }
}

/* 改善密码显示区域 */
.password-frame {
  position: relative;
  width: 100%;
  max-width: 280px;
  margin: 0 auto;
  padding: 15px;
  background-color: rgba(60, 33, 18, 0.9);
  border-radius: 8px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(183, 148, 95, 0.5);
  transition: all 0.3s ease;
}

.password-frame::before {
  content: "";
  position: absolute;
  top: 1px;
  left: 1px;
  right: 1px;
  bottom: 1px;
  border: 1px solid rgba(183, 148, 95, 0.3);
  border-radius: 6px;
  pointer-events: none;
}

.frame-corner {
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid rgba(183, 148, 95, 0.8);
  opacity: 0.9;
}

.frame-corner.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
  border-radius: 5px 0 0 0;
}

.frame-corner.top-right {
  top: -1px;
  right: -1px;
  border-left: none;
  border-bottom: none;
  border-radius: 0 5px 0 0;
}

.frame-corner.bottom-left {
  bottom: -1px;
  left: -1px;
  border-right: none;
  border-top: none;
  border-radius: 0 0 0 5px;
}

.frame-corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 5px 0;
}

.password-display {
  position: relative;
  background-color: rgba(47, 27, 16, 0.7);
  padding: 10px;
  border-radius: 4px;
  border: 1px solid rgba(183, 148, 95, 0.3);
  text-align: center;
  margin-bottom: 5px;
}

.password-display::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(183, 148, 95, 0.03) 10px, rgba(183, 148, 95, 0.03) 20px);
  pointer-events: none;
}

.password-label {
  color: rgba(183, 148, 95, 0.9);
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  font-size: 1rem;
  margin-right: 5px;
}

.password-value {
  color: #f0e0d0;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  font-size: 1.5rem;
  letter-spacing: 0.3rem;
  text-shadow: 0 0 5px rgba(255, 230, 200, 0.3);
}

.button-container {
  display: flex;
  justify-content: center;
  margin-top: 10px;
}

.unlock-button {
  position: relative;
  padding: 6px 35px;
  background-color: rgba(110, 60, 32, 0.9);
  color: #f0e0d0;
  border: 1px solid rgba(183, 148, 95, 0.8);
  border-radius: 2px;
  font-size: 1.2rem;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  cursor: pointer;
  transition: all 0.2s ease;
  letter-spacing: 0.2rem;
}

.unlock-button:hover {
  background-color: rgba(130, 70, 40, 0.9);
}

.button-corner {
  position: absolute;
  width: 6px;
  height: 6px;
  border: 1px solid rgba(183, 148, 95, 0.8);
}

.button-corner.top-left {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

.button-corner.bottom-right {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

.unlock-button:hover {
  background-color: rgba(156, 85, 47, 0.8);
  transform: translateY(-2px);
  box-shadow: 0 5px 12px rgba(0, 0, 0, 0.3), 0 0 20px rgba(211, 183, 142, 0.3);
  letter-spacing: 0.4rem;
}

.unlock-button:hover .button-corners::before,
.unlock-button:hover .button-corners::after {
  width: 15px;
  height: 15px;
  opacity: 0.8;
}

.button-text {
  position: relative;
  z-index: 2;
}

.button-decoration {
  position: absolute;
  width: 200%;
  height: 100%;
  top: 0;
  left: -100%;
  background: linear-gradient(45deg, transparent, rgba(211, 183, 142, 0.3), transparent);
  transition: all 0.4s ease;
  z-index: 1;
  opacity: 0;
}

.unlock-button:hover .button-decoration {
  opacity: 1;
  transform: translateX(100%);
  transition: all 0.8s ease;
}

.unlock-button:active {
  transform: translateY(-2px);
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.3);
}

.unlock-button::before, .unlock-button::after {
  content: "";
  position: absolute;
  width: 15px;
  height: 15px;
  border: 2px solid #d3b78e;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.unlock-button::before {
  top: 8px;
  left: 8px;
  border-right: none;
  border-bottom: none;
  border-radius: 4px 0 0 0;
}

.unlock-button::after {
  bottom: 8px;
  right: 8px;
  border-left: none;
  border-top: none;
  border-radius: 0 0 4px 0;
}

.unlock-button:hover::before, .unlock-button:hover::after {
  width: 20px;
  height: 20px;
  opacity: 1;
}

.unlock-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
  animation: modal-fade-in 0.5s ease forwards;
  perspective: 1000px;
}

@keyframes modal-fade-in {
  from {
    opacity: 0;
    backdrop-filter: blur(0);
  }
  to {
    opacity: 1;
    backdrop-filter: blur(8px);
  }
}

.modal-content {
  position: relative;
  width: 80%;
  max-width: 800px;
  background: linear-gradient(135deg, rgba(81, 43, 24, 0.95) 0%, rgba(58, 31, 17, 0.95) 100%);
  border-radius: 15px;
  border: 2px solid #d3b78e;
  padding: 40px;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 30px rgba(211, 183, 142, 0.3);
  transform-origin: center;
  animation: modal-appear 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
  overflow: hidden;
}

@keyframes modal-appear {
  from {
    opacity: 0;
    transform: scale(0.8) rotateX(10deg);
  }
  to {
    opacity: 1;
    transform: scale(1) rotateX(0);
  }
}

.modal-content::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(211, 183, 142, 0.03) 20px, rgba(211, 183, 142, 0.03) 40px);
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
}

/* 添加水墨风格的装饰元素 */
.modal-content::after {
  content: '';
  position: absolute;
  bottom: -80px;
  right: -80px;
  width: 200px;
  height: 200px;
  background: radial-gradient(circle at 70% 30%, rgba(211, 183, 142, 0.2) 0%, transparent 70%);
  opacity: 0.1;
  transform: rotate(15deg);
  pointer-events: none;
}

.close-button {
  position: absolute;
  top: 20px;
  right: 20px;
  width: 36px;
  height: 36px;
  background-color: rgba(133, 74, 42, 0.8);
  border: 1px solid #d3b78e;
  border-radius: 50%;
  color: #f2e6d9;
  font-size: 1.5rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
  z-index: 2;
}

.close-button:hover {
  background-color: rgba(156, 85, 47, 0.9);
  transform: rotate(90deg);
}

.success-message {
  text-align: center;
  position: relative;
}

.success-message h2 {
  font-family: "STXingkai", "华文行楷", "行楷", cursive;
  font-size: 2.4rem;
  color: #ffcc99;
  margin-bottom: 10px;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(255, 204, 153, 0.5);
  animation: title-appear 0.8s ease-out 0.1s both;
}

@keyframes title-appear {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.success-message > p {
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  font-size: 1.5rem;
  color: #e2c89f;
  margin-bottom: 30px;
  animation: subtitle-appear 0.8s ease-out 0.3s both;
}

@keyframes subtitle-appear {
  from {
    opacity: 0;
    transform: translateY(-15px);
    letter-spacing: -0.2rem;
  }
  to {
    opacity: 1;
    transform: translateY(0);
    letter-spacing: normal;
  }
}

.achievement-info {
  display: flex;
  gap: 30px;
  position: relative;
}

.achievement-info::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  width: 70%;
  height: 1px;
  background: linear-gradient(to right, transparent 0%, rgba(211, 183, 142, 0.5) 20%, rgba(211, 183, 142, 0.5) 80%, transparent 100%);
}

.achievement-image {
  flex: 0 0 250px;
  position: relative;
}

.achievement-image::before {
  content: '';
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  border: 1px solid rgba(211, 183, 142, 0.3);
  z-index: -1;
}

.achievement-image img {
  width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 10px rgba(211, 183, 142, 0.5);
  border: 2px solid #d3b78e;
  transition: all 0.5s ease;
  animation: image-appear 1.2s cubic-bezier(0.175, 0.885, 0.32, 1.275) 0.7s both;
}

@keyframes image-appear {
  from {
    opacity: 0;
    transform: translateX(-30px) rotate(-5deg);
  }
  to {
    opacity: 1;
    transform: translateX(0) rotate(0);
  }
}

.achievement-image img:hover {
  transform: scale(1.05) rotate(2deg);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(211, 183, 142, 0.7);
}

.achievement-text {
  flex: 1;
  text-align: left;
  animation: text-block-appear 1s ease 0.9s both;
  position: relative;
}

.achievement-text::before {
  content: '';
  position: absolute;
  top: 0;
  left: -15px;
  width: 1px;
  height: 100%;
  background: linear-gradient(to bottom, transparent 0%, rgba(211, 183, 142, 0.3) 20%, rgba(211, 183, 142, 0.3) 80%, transparent 100%);
}

@keyframes text-block-appear {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.achievement-text p {
  margin-bottom: 1.2rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  font-size: 1.3rem;
  text-align: left;
  line-height: 1.6;
  color: #f2e6d9;
}

.achievement-text strong {
  color: #e2c89f;
  font-weight: normal;
  margin-right: 0.5rem;
  position: relative;
}

.achievement-text strong::after {
  content: "•";
  margin-left: 5px;
  color: #d3b78e;
  opacity: 0.7;
}

.achievement-description {
  margin-top: 2rem;
  line-height: 1.8;
  font-size: 1.2rem;
  border-left: 3px solid #d3b78e;
  padding-left: 1.2rem;
  background-color: rgba(211, 183, 142, 0.1);
  padding: 1rem 1.2rem;
  border-radius: 0 5px 5px 0;
  position: relative;
  overflow: hidden;
  color: #f2e6d9;
}

.achievement-description::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(211, 183, 142, 0.02) 20px, rgba(211, 183, 142, 0.02) 40px);
  opacity: 0.05;
  mix-blend-mode: overlay;
  pointer-events: none;
}

.button-row {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.visualization-button {
  padding: 12px 40px;
  background: linear-gradient(to bottom, rgba(133, 74, 42, 0.9), rgba(81, 43, 24, 0.9));
  color: #f2e6d9;
  border: 1px solid #d3b78e;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.3rem;
  transition: all 0.3s ease;
  font-family: "STXingkai", "华文行楷", "行楷", cursive;
  letter-spacing: 0.2rem;
  position: relative;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 10px rgba(211, 183, 142, 0.2);
}

.visualization-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(to right, transparent 0%, rgba(255, 255, 255, 0.2) 50%, transparent 100%);
  transform: skewX(-25deg);
  transition: all 0.5s ease;
}

.visualization-button:hover {
  background: linear-gradient(to bottom, rgba(156, 85, 47, 0.9), rgba(94, 50, 28, 0.9));
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(211, 183, 142, 0.5);
}

.visualization-button:hover::before {
  left: 100%;
  transition: all 0.5s ease;
}

.visualization-button:active {
  transform: translateY(1px);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2), 0 0 5px rgba(211, 183, 142, 0.3);
}

.custom-message {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(82, 44, 25, 0.95);
  border-radius: 10px;
  padding: 2rem;
  box-shadow: 0 0 30px rgba(211, 183, 142, 0.5);
  z-index: 100;
  animation: fadeIn 0.3s ease-in;
  transition: opacity 0.3s ease;
  border: 2px solid #d3b78e;
  backdrop-filter: blur(5px);
  max-width: 90%;
}

.message-content {
  text-align: center;
}

.message-content p {
  color: #f2e6d9;
  font-size: 1.4rem;
  margin-bottom: 2rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.close-message {
  padding: 0.8rem 3rem;
  background-color: rgba(133, 74, 42, 0.7);
  color: #f2e6d9;
  border: 2px solid #d3b78e;
  border-radius: 30px;
  font-size: 1.4rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  letter-spacing: 0.2rem;
}

.close-message:hover {
  background-color: rgba(156, 85, 47, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.3), 0 0 30px rgba(211, 183, 142, 0.3);
}

.fade-out {
  opacity: 0;
  transform: translate(-50%, -60%);
  transition: opacity 0.3s ease, transform 0.3s ease;
  pointer-events: none;
}

.chinese-seal {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 35px;
  height: 35px;
  background: rgba(160, 60, 40, 0.6);
  border-radius: 4px;
  transform: rotate(15deg);
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  opacity: 0;
  z-index: 1;
  animation: seal-appear 1s ease-in-out 0.5s forwards;
}

@keyframes seal-appear {
  0% {
    opacity: 0;
    transform: rotate(45deg) scale(0.5);
  }
  30% {
    transform: rotate(15deg) scale(1.2);
  }
  100% {
    opacity: 0.7;
    transform: rotate(15deg) scale(1);
  }
}

.chinese-seal::before {
  content: "印";
  position: absolute;
  color: rgba(255, 230, 230, 0.9);
  font-size: 20px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.button-row {
  display: flex;
  justify-content: center;
  margin-top: 1.5rem;
}

.visualization-button {
  padding: 0.8rem 2rem;
  background-color: rgba(94, 53, 30, 0.8);
  color: #f2e6d9;
  border: 1px solid #d3b78e;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  letter-spacing: 0.2rem;
}

.visualization-button:hover {
  background-color: rgba(133, 74, 42, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}

/* 添加预览图片样式 */
.preview-image-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: -1;
  pointer-events: none;
  overflow: hidden;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.5;
  filter: brightness(0.6) contrast(1.3) saturate(1.2) blur(2px);
  transition: all 0.8s ease;
  transform: scale(1.05);
}

.preview-image:hover {
  filter: brightness(0.65) contrast(1.3) saturate(1.3) blur(1px);
}

/* 永久显示的成功消息样式 */
.permanent-message {
  position: fixed;
  right: 20px;
  bottom: 20px;
  top: auto;
  width: 280px;
  background-color: rgba(82, 44, 25, 0.9);
  border-radius: 10px;
  padding: 15px 25px;
  box-shadow: 0 0 20px rgba(211, 183, 142, 0.5);
  z-index: 50;
  border: 2px solid #d3b78e;
  backdrop-filter: blur(5px);
  text-align: center;
  animation: message-appear 0.5s ease;
}

@media (min-width: 768px) {
  .permanent-message {
    bottom: 20px;
    right: 20px;
  }
}

@media (max-width: 767px) {
  .permanent-message {
    bottom: 20px;
    right: 10px;
    width: auto;
    max-width: 250px;
  }
}

@keyframes message-appear {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.progress-bar {
  width: 100%;
  height: 8px;
  background-color: rgba(47, 27, 16, 0.7);
  border-radius: 4px;
  overflow: hidden;
  border: 1px solid rgba(183, 148, 95, 0.3);
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #d3b78e, #e2c89f);
  transition: width 0.3s ease;
  border-radius: 4px;
  box-shadow: 0 0 8px rgba(211, 183, 142, 0.5);
}

/* 密码提示区域 */
.password-hint-panels {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 10;
}

.password-panel {
  position: absolute;
  width: 300px;
  background-color: rgba(50, 25, 10, 0.92);
  border-radius: 12px;
  pointer-events: auto;
  top: 50%;
  transform: translateY(-50%);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5), 0 0 15px rgba(211, 183, 142, 0.3);
  border: 1px solid rgba(211, 183, 142, 0.5);
  backdrop-filter: blur(5px);
  overflow: hidden;
  padding-bottom: 20px;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="bgPattern" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M0,20 Q10,25 20,20 M20,0 Q25,10 30,0 M20,40 Q25,30 30,40 M40,20 Q30,25 20,20" stroke="%23d3b78e" stroke-width="0.5" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23bgPattern)"/></svg>');
  transition: transform 0.5s ease, opacity 0.5s ease, box-shadow 0.3s ease;
}

.password-panel:hover {
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.6), 0 0 20px rgba(211, 183, 142, 0.5);
  transform: translateY(-51%);
}

.left-panel {
  left: 30px;
  transform: translateY(-50%) translateX(-10px);
  opacity: 0.85;
}

.left-panel:hover {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

.right-panel {
  right: 30px;
  transform: translateY(-50%) translateX(10px);
  opacity: 0.85;
}

.right-panel:hover {
  transform: translateY(-50%) translateX(0);
  opacity: 1;
}

.panel-header {
  padding: 16px 20px;
  background: linear-gradient(to right, rgba(150, 100, 50, 0.9), rgba(120, 80, 40, 0.9));
  text-align: center;
  border-bottom: 1px solid rgba(211, 183, 142, 0.6);
  position: relative;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.panel-header::before,
.panel-header::after {
  content: "";
  position: absolute;
  width: 120px;
  height: 1px;
  background: linear-gradient(90deg, transparent, #d3b78e, transparent);
  bottom: -1px;
  left: 50%;
  transform: translateX(-50%);
}

.panel-header::after {
  bottom: -3px;
  width: 80px;
  opacity: 0.6;
}

.panel-title {
  color: #f0e0d0;
  font-size: 1.5rem;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  letter-spacing: 0.2rem;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.5), 0 0 10px rgba(211, 183, 142, 0.4);
  margin-bottom: 5px;
}

.panel-subtitle {
  color: #d3b78e;
  font-size: 0.95rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  letter-spacing: 0.1rem;
  opacity: 0.9;
}

.hint-item {
  padding: 14px 20px;
  margin: 15px 18px;
  color: #f2e6d9;
  cursor: default;
  transition: all 0.35s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  background-color: rgba(80, 40, 20, 0.6);
  border-radius: 8px;
  border: 1px solid rgba(211, 183, 142, 0.3);
  display: flex;
  align-items: center;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.2);
  position: relative;
  overflow: hidden;
}

.hint-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(211, 183, 142, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.hint-item::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent);
  transition: left 0.8s ease;
}

.hint-item:hover {
  transform: translateY(-3px) scale(1.03);
  background-color: rgba(100, 60, 30, 0.8);
  border-color: rgba(211, 183, 142, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}

.hint-item:hover::before {
  opacity: 1;
}

.hint-item:hover::after {
  left: 100%;
}

.hint-icon {
  width: 45px;
  height: 45px;
  background-color: rgba(211, 183, 142, 0.2);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border: 1px solid rgba(211, 183, 142, 0.4);
  flex-shrink: 0;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.hint-icon::before {
  content: "";
  position: absolute;
  top: -10px;
  left: -10px;
  right: -10px;
  bottom: -10px;
  background: radial-gradient(circle, rgba(211, 183, 142, 0.2) 0%, transparent 70%);
  opacity: 0;
  transition: opacity 0.5s ease;
}

.hint-item:hover .hint-icon {
  background-color: rgba(211, 183, 142, 0.4);
  box-shadow: 0 0 15px rgba(211, 183, 142, 0.5);
  transform: scale(1.1);
}

.hint-item:hover .hint-icon::before {
  opacity: 1;
}

.hint-symbol {
  font-style: normal;
  color: #e2c89f;
  font-size: 1.5rem;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  line-height: 1;
  text-shadow: 0 2px 5px rgba(0, 0, 0, 0.3);
  position: relative;
  z-index: 2;
  transition: transform 0.3s ease, text-shadow 0.3s ease;
}

.hint-item:hover .hint-symbol {
  transform: scale(1.1);
  text-shadow: 0 0 10px rgba(211, 183, 142, 0.8);
}

.hint-content {
  flex: 1;
}

.hint-code {
  font-weight: bold;
  font-size: 1.3rem;
  color: #e2c89f;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  letter-spacing: 0.15rem;
  margin-bottom: 5px;
  transition: color 0.3s ease, text-shadow 0.3s ease;
}

.hint-item:hover .hint-code {
  color: #f0e0d0;
  text-shadow: 0 0 8px rgba(211, 183, 142, 0.6);
}

.hint-name {
  font-size: 1.15rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  margin-bottom: 6px;
  color: #f0e0d0;
  transition: color 0.3s ease;
}

.hint-item:hover .hint-name {
  color: #ffffff;
}

.hint-desc {
  font-size: 0.85rem;
  color: #d3b78e;
  line-height: 1.4;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  transition: color 0.3s ease, opacity 0.3s ease;
  opacity: 0.85;
}

.hint-item:hover .hint-desc {
  color: #e2c89f;
  opacity: 1;
}

@media (max-width: 1200px) {
  .password-panel {
    width: 280px;
  }
  
  .left-panel {
    left: 20px;
  }
  
  .right-panel {
    right: 20px;
  }
  
  .hint-icon {
    width: 40px;
    height: 40px;
  }
}

@media (max-width: 768px) {
  .password-panel {
    width: 250px;
  }
  
  .left-panel {
    left: 10px;
  }
  
  .right-panel {
    right: 10px;
  }
  
  .hint-item {
    padding: 10px 15px;
    margin: 10px 12px;
  }
  
  .hint-icon {
    width: 35px;
    height: 35px;
    margin-right: 10px;
  }
  
  .hint-symbol {
    font-size: 1.2rem;
  }
  
  .hint-code {
    font-size: 1.1rem;
  }
  
  .hint-name {
    font-size: 1rem;
  }
  
  .hint-desc {
    font-size: 0.75rem;
  }
}

/* 转盘光晕效果 */
.dial-glow {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0) 70%);
  pointer-events: none;
  z-index: 1;
  animation: glow-pulse 3s infinite alternate;
}

@keyframes glow-pulse {
  0% {
    opacity: 0.3;
  }
  100% {
    opacity: 0.7;
  }
}

/* 中国风装饰元素 */
.chinese-ornament {
  position: fixed;
  width: 80px;
  height: 80px;
  background-size: contain;
  background-repeat: no-repeat;
  opacity: 0.7;
  z-index: 1;
  filter: brightness(1.2) sepia(0.3);
}

.top-left {
  top: 20px;
  left: 20px;
  background: radial-gradient(circle at 30% 30%, rgba(211, 183, 142, 0.3), transparent 70%);
  transform: rotate(0deg);
}

.top-right {
  top: 20px;
  right: 20px;
  background: radial-gradient(circle at 30% 30%, rgba(211, 183, 142, 0.3), transparent 70%);
  transform: rotate(90deg);
}

.bottom-left {
  bottom: 20px;
  left: 20px;
  background: radial-gradient(circle at 30% 30%, rgba(211, 183, 142, 0.3), transparent 70%);
  transform: rotate(270deg);
}

.bottom-right {
  bottom: 20px;
  right: 20px;
  background: radial-gradient(circle at 30% 30%, rgba(211, 183, 142, 0.3), transparent 70%);
  transform: rotate(180deg);
}

/* 确保装饰元素在小屏幕上也能正确显示 */
@media (max-width: 768px) {
  .chinese-ornament {
    width: 100px;
    height: 100px;
  }
}

@media (max-width: 480px) {
  .chinese-ornament {
    width: 80px;
    height: 80px;
  }
}

/* 为装饰元素添加微妙的动画效果 */
@keyframes ornament-glow {
  0% {
    filter: drop-shadow(0 0 3px rgba(201, 169, 110, 0.3));
  }
  100% {
    filter: drop-shadow(0 0 6px rgba(201, 169, 110, 0.6));
  }
}

.chinese-ornament {
  animation: ornament-glow 3s infinite alternate ease-in-out;
}

/* 添加各朝代特色风格 */
.hint-item[data-dynasty="周"] {
  background-color: rgba(30, 30, 30, 0.75);
  border-color: rgba(100, 100, 100, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="leiwenPattern" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M0,10 A10,10 0 0,1 10,0 A10,10 0 0,1 20,10 A10,10 0 0,1 10,20 A10,10 0 0,1 0,10 Z" fill="none" stroke="%23666" stroke-width="1" opacity="0.3"/></pattern></defs><rect width="100" height="100" fill="url(%23leiwenPattern)"/></svg>');
}

.hint-item[data-dynasty="周"] .hint-symbol,
.hint-item[data-dynasty="周"] .hint-code {
  color: #a0a0a0;
}

.hint-item[data-dynasty="周"] .hint-name {
  color: #d0d0d0;
}

.hint-item[data-dynasty="周"] .hint-desc {
  color: #909090;
}

.hint-item[data-dynasty="周"] .hint-icon {
  background-color: rgba(60, 60, 60, 0.4);
  border-color: rgba(120, 120, 120, 0.5);
}

.hint-item[data-dynasty="汉"] {
  background-color: rgba(50, 80, 50, 0.75);
  border-color: rgba(100, 160, 120, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="yunqiPattern" patternUnits="userSpaceOnUse" width="40" height="20"><path d="M0,15 Q10,0 20,15 Q30,30 40,15" fill="none" stroke="%2390b090" stroke-width="1" opacity="0.2"/></pattern></defs><rect width="100" height="100" fill="url(%23yunqiPattern)"/></svg>');
}

.hint-item[data-dynasty="汉"] .hint-symbol,
.hint-item[data-dynasty="汉"] .hint-code {
  color: #a0c0a0;
}

.hint-item[data-dynasty="汉"] .hint-name {
  color: #d0e0d0;
}

.hint-item[data-dynasty="汉"] .hint-desc {
  color: #90b090;
}

.hint-item[data-dynasty="汉"] .hint-icon {
  background-color: rgba(80, 120, 80, 0.3);
  border-color: rgba(120, 180, 140, 0.5);
}

.hint-item[data-dynasty="南"] {
  background-color: rgba(100, 50, 100, 0.65);
  border-color: rgba(190, 150, 190, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="lianhuaPattern" patternUnits="userSpaceOnUse" width="40" height="40"><path d="M20,0 C25,10 35,10 40,0 C40,15 25,30 20,40 C15,30 0,15 0,0 C5,10 15,10 20,0 Z" fill="none" stroke="%23d4bad4" stroke-width="1" opacity="0.25"/></pattern></defs><rect width="100" height="100" fill="url(%23lianhuaPattern)"/></svg>');
}

.hint-item[data-dynasty="南"] .hint-symbol,
.hint-item[data-dynasty="南"] .hint-code {
  color: #d4bad4;
}

.hint-item[data-dynasty="南"] .hint-name {
  color: #e8d4e8;
}

.hint-item[data-dynasty="南"] .hint-desc {
  color: #c0a0c0;
}

.hint-item[data-dynasty="南"] .hint-icon {
  background-color: rgba(120, 70, 120, 0.3);
  border-color: rgba(190, 150, 190, 0.5);
}

.hint-item[data-dynasty="元"] {
  background-color: rgba(30, 50, 90, 0.75);
  border-color: rgba(80, 120, 180, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="qinghuaPattern" patternUnits="userSpaceOnUse" width="30" height="30"><path d="M0,15 A15,15 0 0,1 30,15 A15,15 0 0,1 0,15 M7.5,15 A7.5,7.5 0 0,0 22.5,15 A7.5,7.5 0 0,0 7.5,15 Z" fill="none" stroke="%234a7ab3" stroke-width="1" opacity="0.25"/></pattern></defs><rect width="100" height="100" fill="url(%23qinghuaPattern)"/></svg>');
}

.hint-item[data-dynasty="元"] .hint-symbol,
.hint-item[data-dynasty="元"] .hint-code {
  color: #80a0d0;
}

.hint-item[data-dynasty="元"] .hint-name {
  color: #b0c8e8;
}

.hint-item[data-dynasty="元"] .hint-desc {
  color: #6080b0;
}

.hint-item[data-dynasty="元"] .hint-icon {
  background-color: rgba(40, 70, 120, 0.3);
  border-color: rgba(80, 120, 180, 0.5);
}

.hint-item[data-dynasty="明"] {
  background-color: rgba(120, 30, 30, 0.75);
  border-color: rgba(180, 80, 60, 0.5);
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="jindiwenPattern" patternUnits="userSpaceOnUse" width="20" height="20"><path d="M0,0 L20,0 L20,20 L0,20 Z M5,5 L15,5 L15,15 L5,15 Z" fill="none" stroke="%23c04030" stroke-width="1" opacity="0.25"/></pattern></defs><rect width="100" height="100" fill="url(%23jindiwenPattern)"/></svg>');
}

.hint-item[data-dynasty="明"] .hint-symbol,
.hint-item[data-dynasty="明"] .hint-code {
  color: #d08070;
}

.hint-item[data-dynasty="明"] .hint-name {
  color: #f0b0a0;
}

.hint-item[data-dynasty="明"] .hint-desc {
  color: #b06050;
}

.hint-item[data-dynasty="明"] .hint-icon {
  background-color: rgba(130, 50, 40, 0.3);
  border-color: rgba(180, 80, 60, 0.5);
}

.hint-item:hover {
  transform: translateY(-3px) scale(1.03);
  background-color: rgba(100, 60, 30, 0.8);
  border-color: rgba(211, 183, 142, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}

/* 为不同朝代的提示项添加悬停样式覆盖 */
.hint-item[data-dynasty="周"]:hover {
  background-color: rgba(40, 40, 40, 0.85);
  border-color: rgba(140, 140, 140, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.4), 0 0 15px rgba(100, 100, 100, 0.5);
}

.hint-item[data-dynasty="周"]:hover .hint-symbol,
.hint-item[data-dynasty="周"]:hover .hint-code {
  color: #c0c0c0;
  text-shadow: 0 0 8px rgba(180, 180, 180, 0.5);
}

.hint-item[data-dynasty="周"]:hover .hint-name {
  color: #f0f0f0;
}

.hint-item[data-dynasty="周"]:hover .hint-desc {
  color: #b0b0b0;
}

.hint-item[data-dynasty="周"]:hover .hint-icon {
  background-color: rgba(80, 80, 80, 0.5);
  box-shadow: 0 0 15px rgba(140, 140, 140, 0.5);
}

.hint-item[data-dynasty="汉"]:hover {
  background-color: rgba(60, 90, 60, 0.85);
  border-color: rgba(120, 180, 140, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(100, 160, 120, 0.5);
}

.hint-item[data-dynasty="汉"]:hover .hint-symbol,
.hint-item[data-dynasty="汉"]:hover .hint-code {
  color: #b8d8b8;
  text-shadow: 0 0 8px rgba(160, 200, 160, 0.6);
}

.hint-item[data-dynasty="汉"]:hover .hint-name {
  color: #e8f0e8;
}

.hint-item[data-dynasty="汉"]:hover .hint-desc {
  color: #a8c8a8;
}

.hint-item[data-dynasty="汉"]:hover .hint-icon {
  background-color: rgba(90, 140, 90, 0.5);
  box-shadow: 0 0 15px rgba(120, 180, 140, 0.5);
}

.hint-item[data-dynasty="南"]:hover {
  background-color: rgba(110, 60, 110, 0.8);
  border-color: rgba(200, 160, 200, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(190, 150, 190, 0.5);
}

.hint-item[data-dynasty="南"]:hover .hint-symbol,
.hint-item[data-dynasty="南"]:hover .hint-code {
  color: #e8c8e8;
  text-shadow: 0 0 8px rgba(210, 170, 210, 0.6);
}

.hint-item[data-dynasty="南"]:hover .hint-name {
  color: #f8e8f8;
}

.hint-item[data-dynasty="南"]:hover .hint-desc {
  color: #d8b8d8;
}

.hint-item[data-dynasty="南"]:hover .hint-icon {
  background-color: rgba(140, 80, 140, 0.5);
  box-shadow: 0 0 15px rgba(190, 150, 190, 0.6);
}

.hint-item[data-dynasty="元"]:hover {
  background-color: rgba(40, 60, 100, 0.85);
  border-color: rgba(90, 130, 190, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(80, 120, 180, 0.5);
}

.hint-item[data-dynasty="元"]:hover .hint-symbol,
.hint-item[data-dynasty="元"]:hover .hint-code {
  color: #a0c0e8;
  text-shadow: 0 0 8px rgba(130, 170, 220, 0.6);
}

.hint-item[data-dynasty="元"]:hover .hint-name {
  color: #c8dcf8;
}

.hint-item[data-dynasty="元"]:hover .hint-desc {
  color: #80a0d0;
}

.hint-item[data-dynasty="元"]:hover .hint-icon {
  background-color: rgba(60, 90, 140, 0.5);
  box-shadow: 0 0 15px rgba(90, 130, 190, 0.6);
}

.hint-item[data-dynasty="明"]:hover {
  background-color: rgba(130, 40, 40, 0.85);
  border-color: rgba(190, 90, 70, 0.7);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.3), 0 0 15px rgba(180, 80, 60, 0.5);
}

.hint-item[data-dynasty="明"]:hover .hint-symbol,
.hint-item[data-dynasty="明"]:hover .hint-code {
  color: #e8a090;
  text-shadow: 0 0 8px rgba(200, 110, 90, 0.6);
}

.hint-item[data-dynasty="明"]:hover .hint-name {
  color: #ffd0c0;
}

.hint-item[data-dynasty="明"]:hover .hint-desc {
  color: #d08070;
}

.hint-item[data-dynasty="明"]:hover .hint-icon {
  background-color: rgba(150, 60, 50, 0.5);
  box-shadow: 0 0 15px rgba(190, 90, 70, 0.6);
}

.hint-item::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(211, 183, 142, 0.5), transparent);
  opacity: 0;
  transition: opacity 0.3s ease;
}

/* 朝代图标动画效果 */
@keyframes dynasty-glow-周 {
  0% { box-shadow: 0 0 5px rgba(140, 140, 140, 0.3); }
  100% { box-shadow: 0 0 12px rgba(140, 140, 140, 0.6); }
}

@keyframes dynasty-glow-汉 {
  0% { box-shadow: 0 0 5px rgba(120, 180, 140, 0.3); }
  100% { box-shadow: 0 0 12px rgba(120, 180, 140, 0.6); }
}

@keyframes dynasty-glow-南 {
  0% { box-shadow: 0 0 5px rgba(190, 150, 190, 0.3); }
  100% { box-shadow: 0 0 12px rgba(190, 150, 190, 0.6); }
}

@keyframes dynasty-glow-元 {
  0% { box-shadow: 0 0 5px rgba(80, 120, 180, 0.3); }
  100% { box-shadow: 0 0 12px rgba(80, 120, 180, 0.6); }
}

@keyframes dynasty-glow-明 {
  0% { box-shadow: 0 0 5px rgba(180, 80, 60, 0.3); }
  100% { box-shadow: 0 0 12px rgba(180, 80, 60, 0.6); }
}

.hint-item[data-dynasty="周"] .hint-icon {
  animation: dynasty-glow-周 2s infinite alternate ease-in-out;
}

.hint-item[data-dynasty="汉"] .hint-icon {
  animation: dynasty-glow-汉 2s infinite alternate ease-in-out;
}

.hint-item[data-dynasty="南"] .hint-icon {
  animation: dynasty-glow-南 2s infinite alternate ease-in-out;
}

.hint-item[data-dynasty="元"] .hint-icon {
  animation: dynasty-glow-元 2s infinite alternate ease-in-out;
}

.hint-item[data-dynasty="明"] .hint-icon {
  animation: dynasty-glow-明 2s infinite alternate ease-in-out;
}

.permanent-message p {
  color: #f2e6d9;
  font-size: 1.2rem;
  margin-bottom: 10px;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

/* 错误提示卡片 */
.error-card-message {
  position: absolute;
  left: 50%;
  bottom: -80px;
  transform: translateX(-50%);
  width: 280px;
  background-color: rgba(120, 30, 30, 0.9);
  border-radius: 10px;
  padding: 15px;
  box-shadow: 0 0 20px rgba(211, 100, 100, 0.5);
  z-index: 100;
  border: 2px solid #d38e8e;
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  animation: message-appear 0.5s ease;
  transition: opacity 0.5s, transform 0.5s;
}

.error-card-message.fade-out {
  opacity: 0;
  transform: translate(-50%, 20px);
}

.error-icon {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: rgba(180, 50, 50, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 15px;
  border: 1px solid #d38e8e;
}

.error-symbol {
  color: #f2e6d9;
  font-style: normal;
  font-size: 1.2rem;
}

.error-content p {
  color: #f2e6d9;
  font-size: 1.1rem;
  margin: 0;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

@media (max-width: 767px) {
  .error-card-message {
    width: auto;
    max-width: 250px;
    right: 10px;
    bottom: 10px;
    padding: 12px;
  }
  
  .error-icon {
    width: 32px;
    height: 32px;
    margin-right: 10px;
  }
  
  .error-content p {
    font-size: 0.95rem;
  }
}

/* 密码错误状态 */
.password-frame.password-error {
  border-color: #d38e8e;
  box-shadow: 0 5px 25px rgba(120, 30, 30, 0.4);
  animation: error-pulse 0.6s ease;
}

@keyframes error-pulse {
  0% { transform: translateX(0); }
  25% { transform: translateX(-5px); }
  50% { transform: translateX(5px); }
  75% { transform: translateX(-3px); }
  100% { transform: translateX(0); }
}

.password-error-message {
  position: relative;
  width: 100%;
  background-color: rgba(120, 30, 30, 0.9);
  border-radius: 6px;
  padding: 10px;
  margin: 8px 0;
  box-shadow: 0 0 15px rgba(211, 100, 100, 0.5);
  border: 1px solid #d38e8e;
  display: flex;
  align-items: center;
  animation: message-appear 0.5s ease;
  transition: opacity 0.5s, transform 0.5s;
}

.password-error-message.fade-out {
  opacity: 0;
  transform: translateY(10px);
}

.password-error-message .error-icon {
  width: 30px;
  height: 30px;
  min-width: 30px;
  border-radius: 50%;
  background-color: rgba(180, 50, 50, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 10px;
  border: 1px solid #d38e8e;
}

.password-error-message .error-symbol {
  color: #f2e6d9;
  font-style: normal;
  font-size: 1rem;
}

.password-error-message .error-content p {
  color: #f2e6d9;
  font-size: 0.95rem;
  margin: 0;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

@media (max-width: 767px) {
  .password-error-message {
    padding: 8px;
  }
  
  .password-error-message .error-icon {
    width: 24px;
    height: 24px;
    min-width: 24px;
    margin-right: 8px;
  }
  
  .password-error-message .error-content p {
    font-size: 0.85rem;
  }
}

/* 古韵提示文字样式 - 简洁版 */
.instruction-text-container {
  text-align: center;
  margin: 15px auto 25px;
  max-width: 100%;
  overflow: hidden;
}

.instruction-elegant-text {
  font-family: "STXingkai", "华文行楷", "行楷", cursive;
  font-size: 1.5rem;
  color: #e2c89f;
  margin: 0;
  letter-spacing: 0.25rem;
  white-space: nowrap;
  text-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5), 0 0 10px rgba(211, 183, 142, 0.3);
  opacity: 0.9;
  animation: text-fade-in 1.5s ease-out;
}

@keyframes text-fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 0.9;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .instruction-elegant-text {
    font-size: 1.1rem;
    letter-spacing: 0.1rem;
  }
}

@media (max-width: 480px) {
  .instruction-elegant-text {
    font-size: 0.9rem;
    letter-spacing: 0.05rem;
  }
}
</style>