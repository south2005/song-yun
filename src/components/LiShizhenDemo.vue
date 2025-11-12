<template>
  <div class="lishizhen-demo-container">
    <iframe 
      v-if="demoType === 'timeline'"
      src="/src/data/lishizheng/index.html" 
      class="lishizhen-iframe"
      frameborder="0"
    ></iframe>
    <iframe 
      v-if="demoType === 'interactive'"
      src="/src/data/bencaogangmu/flip-game.html" 
      class="lishizhen-iframe"
      frameborder="0"
    ></iframe>
    <button class="back-button" @click="$emit('close')">返回</button>
  </div>
</template>

<script>
export default {
  name: 'LiShizhenDemo',
  props: {
    demoType: {
      type: String,
      required: true,
      validator: (value) => ['timeline', 'interactive'].includes(value)
    }
  },
  mounted() {
    console.log('LiShizhenDemo 已加载, demoType =', this.demoType);
  }
}
</script>

<style scoped>
.lishizhen-demo-container {
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

.lishizhen-iframe {
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