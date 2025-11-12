import { createApp } from 'vue';
import mitt from 'mitt';
import { initAuth, sendChatMessage } from './auth';  // 直接导入函数

// 创建事件总线
const emitter = mitt();

const messageHandler = {
    install(app) {
        // 在 app 上挂载 $messageHandler 实例和事件总线
        app.config.globalProperties.$messageHandler = this;
        app.config.globalProperties.$eventHub = emitter;
    },
    
    async init() {
        try {
            // 初始化鉴权模块
            await initAuth();  // 直接使用导入的函数
            
            // 获取机器人配置信息
            const configInfo = {
                name: '古韵先贤',
                avatar: require('../assets/zuopingxingshang.jpg'),
                is_available: true,
                session_id: localStorage.getItem('session_id') || Math.random().toString(36).substring(2, 15)
            };
            
            // 触发配置变化事件
            emitter.emit('client_configChange', configInfo);
        } catch (error) {
            console.error('初始化消息系统失败:', error);
            throw error;
        }
    },
    
    async sendMessage(text) {
        try {
            // 发送消息到后端
            const result = await sendChatMessage(text);  // 直接使用导入的函数
            
            // 触发消息内容变化事件
            emitter.emit('client_msgContentChange', result);
            
            return result;
        } catch (error) {
            console.error('发送消息失败:', error);
            throw error;
        }
    },
    
    destroy() {
        // 清理所有事件监听
        emitter.all.clear();
    }
};

export default messageHandler; 