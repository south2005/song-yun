<template>
  <div class="timeline-modal">
    <div class="timeline-content">
      <div class="timeline-header">
        <h2>宋代诗画意境</h2>
      </div>
      
      <div class="inventor-bio">
        <div class="inventor-portrait">
          <img src="/images/allmozi.jpg" alt="宋代山水" />
        </div>
        <div class="inventor-info">
          <h3>宋代诗词、绘画</h3>
          <p class="inventor-dates">960年—1279年</p>
          <p class="inventor-description">宋代是中国文化艺术发展的黄金时期，文人雅士以诗画寄情，以山水明志。他们追求"诗中有画，画中有诗"的艺术境界，在山水画中寄托对自然的感悟，在诗词中抒发对生活的热爱。宋代文人崇尚"平淡天真"的艺术风格，追求"外师造化，中得心源"的创作理念。</p>
          <p class="mozi-description">在艺术领域，宋代文人开创了"文人画"的新境界。他们以"诗、书、画"三绝著称，将诗词的意境融入绘画，将书法的笔法融入画作，形成了独特的艺术风格。其艺术成就对后世影响深远，至今仍为世人称颂。</p>
          <div class="demo-action">
            <button class="demo-button timeline-button" @click="showTimelineDemo">
              <span>进入诗情画意展览馆</span>
            </button>
            <button class="demo-button interactive-button" @click="showXiaokongDemo">
              <span>进入诗情画意沉浸式体验</span>
            </button>
          </div>
        </div>
      </div>
       
      <div class="back-container">
        <button class="back-button" @click="$emit('close')">返回</button>
      </div>
    </div>
    
    <!-- 墨子演示组件 -->
    <MoziDemo v-if="showingDemo" @close="closeDemo" :demoType="demoType" />
  </div>
</template>

<script>
import MoziDemo from './MoziDemo.vue';

export default {
  name: 'MoziTimeline',
  components: {
    MoziDemo
  },
  data() {
    return {
      showingDemo: false,
      demoType: '' // 'timeline', 'interactive' 或 'xiaokong'
    };
  },
  methods: {
    showTimelineDemo() {
      this.showingDemo = true;
      this.demoType = 'timeline';
    },
    showXiaokongDemo() {
      this.showingDemo = true;
      this.demoType = 'xiaokong';
      console.log('打开小孔成像实验: demoType=', this.demoType);
    },
    closeDemo() {
      this.showingDemo = false;
      this.demoType = '';
    }
  }
};
</script>

<style scoped>
.timeline-modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 200;
  backdrop-filter: blur(5px);
}

.timeline-content {
  background-color: #1a0f0f;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><defs><pattern id="bamboo" patternUnits="userSpaceOnUse" width="100" height="100"><path d="M20,0 C20,50 20,100 20,150 M22,0 C22,50 22,100 22,150 M35,25 L7,25 M35,45 L7,45 M35,65 L7,65 M35,85 L7,85" stroke="%23d3b78e" stroke-width="0.5" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23bamboo)"/></svg>');
  border-radius: 12px;
  width: 90%;
  max-width: 900px;
  padding: 2rem;
  border: 2px solid #d3b78e;
  box-shadow: 0 0 30px rgba(211, 183, 142, 0.5), 0 0 100px rgba(0, 0, 0, 0.5);
}

.timeline-header {
  text-align: center;
  margin-bottom: 2rem;
  position: relative;
}

.timeline-header h2 {
  color: #e2c89f;
  font-size: 2.5rem;
  margin: 0;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
  letter-spacing: 0.5rem;
  text-shadow: 0 0 15px rgba(211, 183, 142, 0.5);
  position: relative;
  display: inline-block;
}

.inventor-bio {
  display: flex;
  gap: 2rem;
  padding: 1.5rem;
  background-color: rgba(50, 28, 16, 0.4);
  border-radius: 10px;
  border: 1px solid rgba(211, 183, 142, 0.3);
}

.inventor-portrait {
  flex: 0 0 180px;
}

.inventor-portrait img {
  width: 100%;
  border-radius: 5px;
  border: 2px solid rgba(211, 183, 142, 0.6);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  filter: sepia(0.3);
}

.inventor-info {
  flex: 1;
}

.inventor-info h3 {
  color: #e2c89f;
  font-size: 2rem;
  margin: 0 0 0.5rem;
  font-family: "LiSu", "隶书", "STLiti", "华文隶书", serif;
}

.inventor-dates {
  color: #d3b78e;
  font-style: italic;
  margin-bottom: 1rem;
}

.inventor-description {
  color: #f2e6d9;
  line-height: 1.6;
  margin-bottom: 1rem;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.demo-button {
  padding: 0.8rem 1.5rem;
  background-color: rgba(94, 53, 30, 0.8);
  color: #f2e6d9;
  border: 1px solid #d3b78e;
  border-radius: 30px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.timeline-button {
  background-color: rgba(94, 53, 30, 0.8);
}

.interactive-button {
  background-color: rgba(73, 45, 85, 0.8);
}

.demo-button:hover {
  background-color: rgba(133, 74, 42, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}

.interactive-button:hover {
  background-color: rgba(103, 65, 125, 0.9);
}

.demo-action {
  display: flex;
  justify-content: center;
  gap: 1.5rem;
  margin-top: 2rem;
}

.back-container {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.back-button {
  background-color: rgba(94, 53, 30, 0.8);
  color: #f2e6d9;
  border: 1px solid #d3b78e;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.back-button:hover {
  background-color: rgba(133, 74, 42, 0.9);
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}

@media (max-width: 768px) {
  .inventor-bio {
    flex-direction: column;
  }
  
  .inventor-portrait {
    flex: 0 0 auto;
    max-width: 150px;
    margin: 0 auto 1rem;
  }
}
</style>