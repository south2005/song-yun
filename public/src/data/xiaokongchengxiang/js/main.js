/**
 * 宋韵流芳 - 宋代书法文化互动游戏
 * 主逻辑脚本
 */

/**
 * 宋韵流芳 - 主系统
 * 主要负责游戏初始化、场景切换和状态管理
 */

// 全局游戏状态
window.gameState = window.gameState || {
    currentScene: 'start',
    currentNpc: 'scholar',
    completedTasks: [],
    dialogueProgress: 0,
    pendingGameType: null
};

// 全局工具函数
window.gameUtils = {
    /**
     * 播放音效
     * @param {string} soundId - 音效元素ID
     */
    playSound: function(soundId) {
        if (!window.gameState.soundEnabled) return;
        
        const sound = document.getElementById(soundId);
        if (sound) {
            sound.currentTime = 0;
            sound.play().catch(e => console.log("无法播放音效:", e));
        }
    },
    
    /**
     * 创建水墨效果
     * @param {HTMLElement} container - 容器元素
     */
    createInkEffect: function(container) {
        if (!container) return;
        
        const inkEffect = document.createElement('div');
        inkEffect.className = 'ink-effect';
        inkEffect.style.position = 'absolute';
        inkEffect.style.width = '100%';
        inkEffect.style.height = '100%';
        inkEffect.style.top = '0';
        inkEffect.style.left = '0';
        inkEffect.style.pointerEvents = 'none';
        inkEffect.style.zIndex = '99';
        inkEffect.style.background = 'radial-gradient(circle, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0) 70%)';
        inkEffect.style.opacity = '0';
        inkEffect.style.transition = 'opacity 1.5s ease';
        
        container.appendChild(inkEffect);
        
        // 淡入效果
        setTimeout(() => {
            inkEffect.style.opacity = '0.7';
        }, 100);
        
        // 淡出并移除
        setTimeout(() => {
            inkEffect.style.opacity = '0';
            setTimeout(() => {
                if (inkEffect.parentNode) {
                    inkEffect.parentNode.removeChild(inkEffect);
                }
            }, 1500);
        }, 800);
    },
    
    /**
     * 创建成功动画
     * @param {HTMLElement} container - 容器元素
     */
    showSuccessAnimation: function(container) {
        if (!container) return;
        
        // 创建动画容器
        const animContainer = document.createElement('div');
        animContainer.className = 'success-animation';
        animContainer.style.position = 'absolute';
        animContainer.style.top = '0';
        animContainer.style.left = '0';
        animContainer.style.width = '100%';
        animContainer.style.height = '100%';
        animContainer.style.display = 'flex';
        animContainer.style.justifyContent = 'center';
        animContainer.style.alignItems = 'center';
        animContainer.style.zIndex = '100';
        animContainer.style.pointerEvents = 'none';
        
        // 创建成功图标
        const successIcon = document.createElement('div');
        successIcon.textContent = '✓';
        successIcon.style.fontSize = '80px';
        successIcon.style.color = '#4CAF50';
        successIcon.style.background = 'rgba(255, 255, 255, 0.9)';
        successIcon.style.width = '120px';
        successIcon.style.height = '120px';
        successIcon.style.borderRadius = '60px';
        successIcon.style.display = 'flex';
        successIcon.style.justifyContent = 'center';
        successIcon.style.alignItems = 'center';
        successIcon.style.boxShadow = '0 0 20px rgba(76, 175, 80, 0.8)';
        successIcon.style.transform = 'scale(0)';
        successIcon.style.transition = 'transform 0.5s cubic-bezier(0.18, 0.89, 0.32, 1.28)';
        
        animContainer.appendChild(successIcon);
        container.appendChild(animContainer);
        
        // 添加动画
        setTimeout(() => {
            successIcon.style.transform = 'scale(1)';
        }, 100);
        
        // 移除动画
        setTimeout(() => {
            successIcon.style.transform = 'scale(0)';
            setTimeout(() => {
                if (animContainer.parentNode) {
                    animContainer.parentNode.removeChild(animContainer);
                }
            }, 500);
        }, 1500);
    },
    
    /**
     * 创建飘落枫叶效果
     * @param {HTMLElement} container - 容器元素
     */
    createMapleLeafEffect: function(container) {
        if (!container) return;
        
        // 枫叶数量
        const leafCount = 15;
        
        // 枫叶颜色
        const leafColors = [
            '#d62828', '#e63946', '#b2292e', '#ae2012', '#ca6702',
            '#bb3e03', '#c37709', '#a4292e', '#db504a', '#e07a5f'
        ];
        
        // 创建枫叶
        for (let i = 0; i < leafCount; i++) {
            setTimeout(() => {
                // 创建枫叶元素
                const leaf = document.createElement('div');
                leaf.className = 'maple-leaf';
                
                // 随机设置枫叶属性
                const size = Math.random() * 20 + 15; // 15-35px
                const color = leafColors[Math.floor(Math.random() * leafColors.length)];
                const startX = Math.random() * 100; // 0-100%
                const rotation = Math.random() * 360; // 0-360deg
                const duration = Math.random() * 5 + 5; // 5-10s
                
                // 设置样式
                leaf.style.width = `${size}px`;
                leaf.style.height = `${size}px`;
                leaf.style.backgroundColor = color;
                leaf.style.position = 'absolute';
                leaf.style.top = '-50px';
                leaf.style.left = `${startX}%`;
                leaf.style.zIndex = '90';
                leaf.style.opacity = '0.9';
                leaf.style.borderRadius = '30% 70% 30% 0%';
                leaf.style.transform = `rotate(${rotation}deg)`;
                leaf.style.transition = 'none';
                leaf.style.animation = `leafFall ${duration}s linear forwards, leafSway ${Math.random() * 2 + 2}s ease-in-out infinite alternate`;
                
                // 添加到容器
                container.appendChild(leaf);
                
                // 一段时间后移除
                setTimeout(() => {
                    if (leaf.parentNode) {
                        leaf.parentNode.removeChild(leaf);
                    }
                }, duration * 1000);
            }, i * 200); // 错开出现时间
        }
        
        // 添加动画样式
        if (!document.getElementById('leaf-animations')) {
            const style = document.createElement('style');
            style.id = 'leaf-animations';
            style.textContent = `
                @keyframes leafFall {
                    0% { top: -50px; }
                    100% { top: 120%; }
                }
                @keyframes leafSway {
                    0% { margin-left: 0; }
                    100% { margin-left: 50px; }
                }
            `;
            document.head.appendChild(style);
        }
    },
    
    /**
     * 动态设置元素样式
     * @param {HTMLElement} element - 目标元素
     * @param {Object} styles - 样式对象
     */
    setStyles: function(element, styles) {
        if (!element || !styles) return;
        
        Object.keys(styles).forEach(key => {
            element.style[key] = styles[key];
        });
    }
};

// 当DOM加载完成后初始化游戏
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM 加载完成，初始化游戏");
    initGame();
});

// 游戏初始化
function initGame() {
    console.log("初始化游戏...");
    
    // 确保全局游戏状态对象存在
    if (!window.gameState) {
        window.gameState = {
            currentScene: 'start',
            currentNpc: 'scholar',
            completedTasks: [],
            dialogueProgress: 0,
            pendingGameType: null
        };
    }
    
    // 默认显示游戏规则页面
    showGameRules();
    
    // 绑定"进入游戏"按钮事件
    const enterGameBtn = document.getElementById('enter-game-btn');
    if (enterGameBtn) {
        enterGameBtn.addEventListener('click', function() {
            startGame('dialogue');
        });
    } else {
        console.error("找不到进入游戏按钮");
    }
    
    console.log("游戏初始化完成，当前状态:", gameState);
}

// 显示游戏规则页面
function showGameRules() {
    console.log("显示游戏规则页面");
    
    // 隐藏所有游戏内容
    document.querySelectorAll('.game-content').forEach(content => {
        content.classList.add('hidden');
        content.style.display = 'none';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
    });
    
    // 显示游戏规则
    const gameRules = document.getElementById('game-rules');
    if (gameRules) {
        gameRules.classList.remove('hidden');
        gameRules.style.display = 'block';
        gameRules.style.visibility = 'visible';
        gameRules.style.opacity = '1';
    } else {
        console.error("找不到游戏规则容器");
    }
    
    // 显示游戏区域
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.classList.remove('hidden');
        gameArea.style.display = 'block';
        gameArea.style.visibility = 'visible';
        gameArea.style.opacity = '1';
    } else {
        console.error("找不到游戏区域");
    }
    
    // 更新游戏状态
    gameState.currentScene = 'rules';
}

/**
 * 启动指定类型的游戏
 * @param {string} gameType - 游戏类型：'rules'（规则）,'dialogue'（对话）,'calligraphy'（找茬游戏）
 */
function startGame(gameType) {
    console.log("启动游戏类型:", gameType);
    
    try {
        // 显示游戏区域
        const gameArea = document.querySelector('.game-area');
        
        if (gameArea) {
            // 确保游戏区域可见
            gameArea.classList.remove('hidden');
            gameArea.style.display = 'block';
            gameArea.style.visibility = 'visible';
            gameArea.style.opacity = '1';
            
            console.log("游戏区域已设为可见状态");
            
            // 根据游戏类型切换内容
            if (gameType === 'rules') {
                // 显示游戏规则
                showContent('game-rules');
                console.log("显示游戏规则");
                
            } else if (gameType === 'dialogue') {
                // 显示对话场景
                showContent('dialogue-scene');
                console.log("显示对话场景");
                
                // 初始化对话系统
                if (window.dialogueSystem && typeof window.dialogueSystem.initDialogue === 'function') {
                    console.log("通过window.dialogueSystem初始化对话系统");
                    window.dialogueSystem.initDialogue();
                } else if (typeof initDialogueSystem === 'function') {
                    console.log("通过全局initDialogueSystem函数初始化对话系统");
                    initDialogueSystem();
                } else {
                    console.error("对话系统初始化函数未找到");
                }
                
            } else if (gameType === 'calligraphy') {
                // 从对话场景切换到找茬游戏
                console.log("准备切换到找茬游戏");
                
                // 确保先隐藏其他内容
                document.querySelectorAll('.game-content').forEach(content => {
                    if (content.id !== 'calligraphy-game') {
                        content.classList.add('hidden');
                        content.style.display = 'none';
                        content.style.visibility = 'hidden';
                        content.style.opacity = '0';
                    }
                });
                
                // 然后显示找茬游戏
                showContent('calligraphy-game');
                console.log("找茬游戏内容元素显示状态:", document.getElementById('calligraphy-game').style.display);
                
                // 初始化找茬游戏
                if (typeof window.initCalligraphyGame === 'function') {
                    console.log("通过window.initCalligraphyGame初始化找茬游戏");
                    window.initCalligraphyGame();
                } else if (typeof initCalligraphyGame === 'function') {
                    console.log("通过全局initCalligraphyGame函数初始化找茬游戏");
                    initCalligraphyGame();
                } else {
                    console.error("找茬游戏初始化函数未找到");
                }
            }
        } else {
            console.error("游戏区域元素未找到");
        }
    } catch (error) {
        console.error("启动游戏出错:", error);
    }
}

/**
 * 显示指定内容区域
 * @param {string} contentId - 内容区域ID
 */
function showContent(contentId) {
    try {
        console.log(`显示内容: ${contentId}`);
        
        // 获取目标内容元素
        const targetContent = document.getElementById(contentId);
        
        // 检查目标内容是否存在
        if (!targetContent) {
            console.error(`内容元素未找到: ${contentId}`);
            return;
        }
        
        // 隐藏所有游戏内容
        document.querySelectorAll('.game-content').forEach(content => {
            content.classList.add('hidden');
            content.style.display = 'none';
            content.style.visibility = 'hidden';
            content.style.opacity = '0';
            console.log(`隐藏内容: ${content.id}`);
        });
        
        // 显示指定内容
        console.log(`显示目标内容: ${contentId}`);
        targetContent.classList.remove('hidden');
        targetContent.style.display = 'block';
        targetContent.style.visibility = 'visible';
        targetContent.style.opacity = '1';
        targetContent.style.zIndex = '1000'; // 确保在最上层
        
        // 如果是找茬游戏，强制设置一些额外属性
        if (contentId === 'calligraphy-game') {
            console.log("设置找茬游戏特殊样式");
            targetContent.style.position = 'absolute';
            targetContent.style.top = '0';
            targetContent.style.left = '0';
            targetContent.style.width = '100%';
            targetContent.style.height = '100%';
            targetContent.style.overflow = 'auto';
            targetContent.style.backgroundColor = '#f9f6e9'; // 浅米色背景
            
            // 强制重绘
            setTimeout(() => {
                targetContent.style.display = 'block';
                targetContent.style.visibility = 'visible';
                targetContent.style.opacity = '1';
                console.log("找茬游戏内容重绘完成，当前显示状态:", targetContent.style.display);
            }, 50);
        }
        
        console.log(`内容显示完成: ${contentId}`);
    } catch (error) {
        console.error("显示内容出错:", error);
    }
}

/**
 * 返回主页函数
 */
function backToHome() {
    // 隐藏游戏区域
    const gameArea = document.querySelector('.game-area');
    if (gameArea) {
        gameArea.classList.add('hidden');
        gameArea.style.display = 'none';
        gameArea.style.visibility = 'hidden';
        gameArea.style.opacity = '0';
    }
    
    // 直接重新开始游戏，显示规则界面
    startGame('rules');
}

// 如果在模块环境中，导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        gameState: window.gameState,
        gameUtils: window.gameUtils,
        initGame,
        backToHome
    };
}

/**
 * 添加音效元素
 */
function addSoundEffects() {
    // 检查是否已存在音效
    if (document.getElementById('click-sound')) return;
    
    // 创建音效容器
    const soundsContainer = document.createElement('div');
    soundsContainer.id = 'sounds-container';
    soundsContainer.style.display = 'none';
    
    // 添加点击音效
    const clickSound = document.createElement('audio');
    clickSound.id = 'click-sound';
    clickSound.src = 'assets/sounds/click.mp3';
    clickSound.preload = 'auto';
    soundsContainer.appendChild(clickSound);
    
    // 添加成功音效
    const successSound = document.createElement('audio');
    successSound.id = 'success-sound';
    successSound.src = 'assets/sounds/success.mp3';
    successSound.preload = 'auto';
    soundsContainer.appendChild(successSound);
    
    // 添加错误音效
    const errorSound = document.createElement('audio');
    errorSound.id = 'error-sound';
    errorSound.src = 'assets/sounds/error.mp3';
    errorSound.preload = 'auto';
    soundsContainer.appendChild(errorSound);
    
    // 添加到文档
    document.body.appendChild(soundsContainer);
}

/**
 * 添加键盘快捷键
 */
function addKeyboardShortcuts() {
    // 监听键盘事件
    document.addEventListener('keydown', function(event) {
        // ESC键返回主页
        if (event.key === 'Escape') {
            backToHome();
        }
    });
} 