import axios from 'axios';
import { getCurrentInstance } from 'vue';
import mitt from 'mitt';

class AuthService {
    constructor() {
        this.token = null;
        this.sessionId = null;
        this.appId = '';
        this.eventHub = mitt();
    }

    async init() {
        try {
            // 生成会话ID
            this.sessionId = Math.random().toString(36).substring(2, 12);
            return true;
        } catch (error) {
            console.error('初始化失败:', error);
            throw error;
        }
    }

    async sendMessage(text) {
        try {
            // 立即显示用户消息
            this.eventHub.emit('client_msgContentChange', {
                type: 'question',
                content: text,
                is_final: true  // 添加标记表示这是最终消息
            });

            // 发送消息到后端
            const response = await axios.post('http://localhost:3003/chat', {
                text,
                sessionId: this.sessionId
            });

            // 显示AI回复
            this.eventHub.emit('client_msgContentChange', {
                type: 'reply',
                content: response.data.content,
                from_name: response.data.from_name,
                from_avatar: response.data.from_avatar,
                is_final: true  // 添加标记表示这是最终消息
            });

            return response.data;
        } catch (error) {
            console.error('发送消息失败:', error);
            // 显示错误消息
            this.eventHub.emit('client_msgContentChange', {
                type: 'error',
                content: error.response?.data?.message || error.message,
                is_final: true  // 添加标记表示这是最终消息
            });
            throw error;
        }
    }

    destroy() {
        this.eventHub.all.clear();
    }
}

const authService = new AuthService();

// 导出初始化函数
export const initAuth = async () => {
    try {
        await authService.init();
        return true;
    } catch (error) {
        console.error('初始化鉴权失败:', error);
        throw error;
    }
};

// 导出发送消息函数
export const sendChatMessage = async (text) => {
    try {
        const response = await authService.sendMessage(text);
        return {
            chatsContent: [{
                content: text,
                type: 'QUESTION'
            }, {
                content: response.content,
                type: 'ANSWER'
            }],
            type: 'ANSWER'
        };
    } catch (error) {
        console.error('发送消息失败:', error);
        throw error;
    }
};

const auth = {
    install(app) {
        // 在 app 上挂载 $auth 实例和 eventHub
        app.config.globalProperties.$auth = authService;
        app.config.globalProperties.$eventHub = authService.eventHub;
    }
};

export default auth; 