/**
 * 宋韵流芳 - 主逻辑脚本
 * 负责游戏初始化和全局状态管理
 */

// 游戏全局状态
window.gameState = {
    currentModule: null,
    pendingGameType: null, // 用于保存待加载的游戏类型
    gameModules: {
        puzzle: null,
        calligraphy: null,
        poetry: null
    },
    // 游戏配置
    config: {
        animationsEnabled: true
    }
};

// 全局工具函数
window.gameUtils = {
    /**
     * 播放声音效果（如果启用）
     * @param {string} soundId - 音频元素ID
     */
    playSound: function(soundId) {
        // 音频功能已禁用，此函数仅作为占位符保留，以便游戏代码不会出错
        return;
    },
    
    /**
     * 创建水墨晕染效果
     * @param {number} x - 效果出现的X坐标
     * @param {number} y - 效果出现的Y坐标
     */
    createInkEffect: function(x, y) {
        if (!window.gameState.config.animationsEnabled) return;
        
        try {
            const inkEffect = document.createElement('div');
            inkEffect.className = 'ink-effect';
            inkEffect.style.left = (x - 50) + 'px';
            inkEffect.style.top = (y - 50) + 'px';
            
            // 使用纯CSS样式而不是背景图片
            inkEffect.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
            inkEffect.style.borderRadius = '50%';
            
            document.body.appendChild(inkEffect);
            
            // 动画结束后移除元素
            setTimeout(() => {
                inkEffect.style.transform = 'scale(3)';
                inkEffect.style.opacity = '0';
                
                setTimeout(() => {
                    document.body.removeChild(inkEffect);
                }, 1000);
            }, 10);
        } catch (e) {
            console.error("创建水墨效果失败:", e);
        }
    },
    
    /**
     * 创建仙鹤飞过动画
     * @param {HTMLElement} container - 动画容器元素
     */
    createCraneAnimation: function(container) {
        if (!window.gameState.config.animationsEnabled) return;
        
        try {
            const crane = document.createElement('div');
            crane.className = 'crane-animation';
            
            // 使用纯CSS样式而不是背景图片
            crane.style.backgroundColor = 'rgba(100, 100, 100, 0.5)';
            crane.style.width = '50px';
            crane.style.height = '30px';
            crane.style.borderRadius = '50% 50% 50% 50% / 60% 60% 40% 40%';
            
            container.appendChild(crane);
            
            // 动画结束后移除元素
            setTimeout(() => {
                container.removeChild(crane);
            }, 5000);
        } catch (e) {
            console.error("创建仙鹤动画失败:", e);
        }
    },
    
    /**
     * 创建枫叶飘落效果
     * @param {HTMLElement} container - 动画容器元素
     */
    createMapleLeafEffect: function(container) {
        if (!window.gameState.config.animationsEnabled) return;
        
        try {
            const mapleEffectContainer = document.createElement('div');
            mapleEffectContainer.className = 'maple-effect-container';
            
            container.appendChild(mapleEffectContainer);
            
            // 创建多个枫叶元素
            for (let i = 0; i < 20; i++) {
                const leaf = document.createElement('div');
                leaf.className = 'maple-leaf';
                
                // 使用纯CSS样式而不是背景图片
                leaf.style.backgroundColor = 'rgba(165, 42, 42, 0.7)';
                leaf.style.width = '15px';
                leaf.style.height = '15px';
                leaf.style.transform = 'rotate(45deg)';
                
                leaf.style.left = Math.random() * 100 + '%';
                leaf.style.animationDelay = Math.random() * 2 + 's';
                leaf.style.animationDuration = (5 + Math.random() * 5) + 's';
                
                mapleEffectContainer.appendChild(leaf);
            }
            
            // 动画结束后移除元素
            setTimeout(() => {
                container.removeChild(mapleEffectContainer);
            }, 8000);
        } catch (e) {
            console.error("创建枫叶效果失败:", e);
        }
    },
    
    /**
     * 显示成功动画
     * @param {HTMLElement} container - 动画容器元素
     */
    showSuccessAnimation: function(container) {
        if (!window.gameState.config.animationsEnabled) return;
        
        try {
            const successAnimation = document.createElement('div');
            successAnimation.className = 'success-animation';
            
            container.appendChild(successAnimation);
            
            // 创建飘落的元素
            for (let i = 0; i < 15; i++) {
                const floatingItem = document.createElement('div');
                floatingItem.className = 'floating-item';
                
                // 使用纯CSS样式而不是背景图片
                floatingItem.style.backgroundColor = 'rgba(218, 165, 32, 0.6)';
                floatingItem.style.width = '10px';
                floatingItem.style.height = '10px';
                floatingItem.style.borderRadius = '50%';
                
                floatingItem.style.left = (Math.random() * 100) + '%';
                floatingItem.style.animationDelay = (Math.random() * 2) + 's';
                floatingItem.style.animationDuration = (3 + Math.random() * 4) + 's';
                
                successAnimation.appendChild(floatingItem);
            }
            
            // 移除动画
            setTimeout(() => {
                container.removeChild(successAnimation);
            }, 5000);
        } catch (e) {
            console.error("创建成功动画失败:", e);
        }
    }
};

/**
 * 初始化游戏
 */
function initGame() {
    // 为动画效果添加样式
    addDynamicStyles();
    
    // 初始化游戏页面
    document.addEventListener('DOMContentLoaded', function() {
        console.log("游戏初始化完成：宋韵流芳");
    });
}

/**
 * 添加动态样式
 */
function addDynamicStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .hidden {
            display: none !important;
        }
        
        .ink-effect {
            position: absolute;
            width: 100px;
            height: 100px;
            background-color: rgba(0, 0, 0, 0.3);
            border-radius: 50%;
            pointer-events: none;
            z-index: 1000;
            opacity: 0.8;
            transform: scale(0.1);
            transition: all 1s ease-out;
        }
        
        .success-animation {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            overflow: hidden;
        }
        
        .floating-item {
            position: absolute;
            top: -50px;
            width: 10px;
            height: 10px;
            background-color: rgba(218, 165, 32, 0.6);
            border-radius: 50%;
            animation: floatDown linear forwards;
        }
        
        .crane-animation {
            position: absolute;
            width: 50px;
            height: 30px;
            background-color: rgba(100, 100, 100, 0.5);
            border-radius: 50% 50% 50% 50% / 60% 60% 40% 40%;
            top: 30%;
            left: -150px;
            animation: craneFly 5s ease-in-out forwards;
        }
        
        .maple-effect-container {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 100;
            overflow: hidden;
        }
        
        .maple-leaf {
            position: absolute;
            top: -50px;
            width: 15px;
            height: 15px;
            background-color: rgba(165, 42, 42, 0.7);
            transform: rotate(45deg);
            animation: mapleLeafFall linear forwards;
        }
        
        @keyframes floatDown {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes craneFly {
            0% {
                left: -150px;
                transform: translateY(0);
            }
            50% {
                transform: translateY(-30px);
            }
            100% {
                left: calc(100% + 150px);
                transform: translateY(0);
            }
        }
        
        @keyframes mapleLeafFall {
            0% {
                transform: translateY(0) rotate(0deg);
                opacity: 0;
            }
            10% {
                opacity: 1;
            }
            100% {
                transform: translateY(calc(100vh + 50px)) rotate(360deg);
                opacity: 0;
            }
        }
        
        @keyframes float {
            0% {
                transform: translateY(0px);
            }
            50% {
                transform: translateY(-5px);
            }
            100% {
                transform: translateY(0px);
            }
        }
    `;
    
    document.head.appendChild(style);
}

// 初始化游戏
initGame(); 