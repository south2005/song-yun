<template>
  <div class="guoshoujing-demo-container">
    <iframe 
      v-if="demoType === 'timeline'"
      src="/src/data/guoshoujing/index.html" 
      class="guoshoujing-iframe"
      frameborder="0"
    ></iframe>
    <iframe 
      v-if="demoType === 'interactive'"
      src="/src/data/rishimoni/riindex.html" 
      class="guoshoujing-iframe"
      frameborder="0"
    ></iframe>
    <button class="back-button" @click="$emit('close')">返回</button>
  </div>
</template>

<script>
export default {
  name: 'GuoShoujingDemo',
  props: {
    demoType: {
      type: String,
      required: true,
      validator: (value) => ['timeline', 'interactive'].includes(value)
    }
  },
  mounted() {
    console.log('GuoShoujingDemo 已加载, demoType =', this.demoType);
    // 检查iframe是否存在并加载了内容
    this.$nextTick(() => {
      const iframe = this.$el.querySelector('.guoshoujing-iframe');
      if (iframe) {
        console.log('找到iframe元素，路径:', iframe.src);
        iframe.onerror = (err) => {
          console.error('iframe加载错误:', err);
        };
        iframe.onload = () => {
          console.log('iframe内容已加载完成');
        };
      } else {
        console.warn('未找到iframe元素，demoType可能不匹配');
      }
    });
  }
}
</script>

<style scoped>
.guoshoujing-demo-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #000;
  z-index: 250;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.guoshoujing-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background-color: #1a0f0f;
}

.back-button {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background-color: rgba(94, 53, 30, 0.8);
  color: #f2e6d9;
  border: 1px solid #d3b78e;
  padding: 10px 20px;
  border-radius: 30px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  z-index: 251;
}

.back-button:hover {
  background-color: rgba(133, 74, 42, 0.9);
  transform: translateX(-50%) translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3), 0 0 15px rgba(211, 183, 142, 0.3);
}
</style> 