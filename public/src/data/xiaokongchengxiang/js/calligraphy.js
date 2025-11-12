/**
 * 宋韵流芳 - 书法找茬游戏
 * 实现两幅书法作品的比对找茬功能
 */

// 书法作品数据
const calligraphyWorks = {
    '寒食帖': {
        title: '寒食帖',
        author: '苏轼',
        year: '宋朝绍圣元年(1094年)',
        description: '苏轼的代表作，被誉为"天下第三行书"',
        originalText: '自我来黄州，已过三寒食。年年欲惜春，春去不容情。\n今年又苦雨，两月秋萧瑟。卧闻海棠花，泥污燕支雪。\n暗中偷负香，谁道不相越？一年将尽夜，明月满帘栊。\n美人庭树下，回首烛龙红。与君各沾巾，一别如晨风。',
        modifiedText: '自我来黄州，已过三寒食。年年欲惜春，椿去不容情。\n今年又苦雨，两月球萧瑟。卧闻海棠花，泥污燕支雪。\n黯中偷负香，谁道不相越？一哖将尽夜，明月满帘栊。\n美人庭树下，回首炷龙红。与君各沾巾，一别如晨风。',
        differences: [
            { row: 0, col: 18, original: '春', modified: '椿' },
            { row: 1, col: 8, original: '秋', modified: '球' },
            { row: 2, col: 13, original: '暗', modified: '黯' },
            { row: 2, col: 0, original: '年', modified: '哖' },
            { row: 3, col: 8, original: '烛', modified: '炷' }
        ]
    },
};

// 游戏状态
let gameState = {
    currentWork: null,
    timeRemaining: 60, // 1分钟
    foundDifferences: [],
    timerInterval: null,
    gameActive: false,
    hintsUsed: 0,
    startTime: null,
    initialTime: null,
    penaltyTime: 0
};

// 初始化找茬游戏
function initCalligraphyGame() {
    console.log("初始化书法找茬游戏");
    
    try {
        // 确保找茬游戏容器存在且可见
        const gameContainer = document.getElementById('calligraphy-game');
        if (!gameContainer) {
            console.error("找不到找茬游戏容器");
            alert("找茬游戏容器未找到，请刷新页面重试");
            return;
        }
        
        console.log("找茬游戏容器当前状态:", 
            gameContainer.style.display, 
            gameContainer.style.visibility, 
            gameContainer.classList.contains('hidden'));
        
        // 强制设置容器可见
        gameContainer.classList.remove('hidden');
        gameContainer.style.display = 'block';
        gameContainer.style.visibility = 'visible';
        gameContainer.style.opacity = '1';
        gameContainer.style.zIndex = '1000'; // 确保在最上层
        
        console.log("已设置找茬游戏容器为可见状态");
        
        // 创建游戏界面
        createGameInterface();
        
        // 默认加载第一个书法作品
        const workTitle = Object.keys(calligraphyWorks)[0];
        let selectedWork = workTitle;
        
        // 尝试获取当前NPC分配的任务
        if (window.gameState && window.gameState.currentNpc) {
            const currentNpcId = window.gameState.currentNpc;
            console.log("当前NPC ID:", currentNpcId);
            
            // 从window.dialogueSystem检查是否有NPC数据
            if (window.dialogueSystem && window.dialogueSystem.npcData) {
                const npcData = window.dialogueSystem.npcData;
                if (npcData[currentNpcId] && npcData[currentNpcId].task) {
                    const npcTask = npcData[currentNpcId].task;
                    if (npcTask && npcTask.source && calligraphyWorks[npcTask.source]) {
                        selectedWork = npcTask.source;
                        console.log("从NPC加载书法作品:", selectedWork);
                    } else {
                        console.warn("NPC任务未指定有效的书法作品，使用默认作品:", workTitle);
                    }
                } else {
                    console.warn("当前NPC没有任务数据，使用默认作品:", workTitle);
                }
            } 
            // 从本地npcData检查是否有NPC数据
            else if (typeof npcData !== 'undefined' && npcData[currentNpcId]) {
                const npcTask = npcData[currentNpcId].task;
                if (npcTask && npcTask.source && calligraphyWorks[npcTask.source]) {
                    selectedWork = npcTask.source;
                    console.log("从本地NPC数据加载书法作品:", selectedWork);
                } else {
                    console.warn("NPC任务未指定有效的书法作品，使用默认作品:", workTitle);
                }
            } else {
                console.warn("未找到NPC数据，使用默认作品:", workTitle);
            }
        } else {
            console.warn("未找到当前NPC ID，使用默认作品:", workTitle);
        }
        
        // 创建游戏状态 - 注意：先创建状态，再加载作品和开始计时
        gameState = {
            currentWork: calligraphyWorks[selectedWork],
            timeRemaining: 60, // 1分钟
            foundDifferences: [],
            timerInterval: null,
            gameActive: true,
            hintsUsed: 0,
            startTime: null,
            initialTime: null,
            penaltyTime: 0
        };
        
        // 加载选定的书法作品
        loadCalligraphyWork(selectedWork);
        
        // 绑定事件监听
        bindGameEvents();
        
        // 确保计时器显示正确的初始值
        updateTimer();

        // 开始游戏计时 - 放在最后启动计时器
        startGameTimer();
        
        console.log("书法找茬游戏初始化完成，已加载:", selectedWork);
    } catch (error) {
        console.error("初始化书法找茬游戏出错:", error);
        alert("游戏加载出错，请刷新重试");
    }
}

// 创建游戏界面
function createGameInterface() {
    const gameContainer = document.getElementById('calligraphy-game');
    
    if (!gameContainer) {
        console.error("找不到找茬游戏容器");
        return;
    }
    
    // 清空容器
    gameContainer.innerHTML = '';
    
    console.log("清空找茬游戏容器，准备创建界面");
    
    // 应用特殊样式
    gameContainer.style.backgroundColor = '#f9f6e9'; // 浅米色背景
    gameContainer.style.padding = '80px 20px 100px 20px'; // 增加顶部内边距到80px
    gameContainer.style.overflow = 'auto';
    
    // 创建游戏标题和计时器
    const headerHTML = `
        <div class="game-header" style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; background-color: rgba(255, 248, 220, 0.9); padding: 15px 25px; border-radius: 8px; border: 2px solid #a67c52;">
            <h2 class="game-title" style="color: #732e1c; margin: 0; font-size: 24px;">诗词欣赏与找错</h2>
            <div class="game-timer" style="background-color: #a67c52; color: white; padding: 8px 15px; border-radius: 20px; font-weight: bold; font-size: 18px;">
                <span id="time-remaining">01:00</span>
            </div>
        </div>
    `;
    
    // 创建书法作品展示区域
    const contentHTML = `
        <div class="calligraphy-container" style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px; flex-grow: 1;">
            <div class="calligraphy-original" style="flex: 1; background-color: rgba(255, 248, 220, 0.9); padding: 15px; border-radius: 8px; border: 2px solid #a67c52; display: flex; flex-direction: column;">
                <h3 style="text-align: center; color: #732e1c; margin-top: 0; margin-bottom: 15px; font-size: 20px;">原作</h3>
                <div class="text-container" style="position: relative; width: 100%; height: 500px; overflow: auto; border: 1px solid #a67c52; background-color: #f9f5e9; padding: 20px;">
                    <div id="original-work" class="text-work" style="font-size: 24px; line-height: 2; letter-spacing: 2px; white-space: pre-wrap; font-family: 'KaiTi', 'SimSun', serif; cursor: pointer;"></div>
                    <div class="markers-layer" id="original-markers" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>
                </div>
            </div>
            <div class="calligraphy-modified" style="flex: 1; background-color: rgba(255, 248, 220, 0.9); padding: 15px; border-radius: 8px; border: 2px solid #a67c52; display: flex; flex-direction: column;">
                <h3 style="text-align: center; color: #732e1c; margin-top: 0; margin-bottom: 15px; font-size: 20px;">临摹</h3>
                <div class="text-container" style="position: relative; width: 100%; height: 500px; overflow: auto; border: 1px solid #a67c52; background-color: #f9f5e9; padding: 20px;">
                    <div id="modified-work" class="text-work" style="font-size: 24px; line-height: 2; letter-spacing: 2px; white-space: pre-wrap; font-family: 'KaiTi', 'SimSun', serif; cursor: pointer;"></div>
                    <div class="markers-layer" id="modified-markers" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none;"></div>
                </div>
            </div>
        </div>
    `;
    
    // 创建游戏控制区域
    const controlsHTML = `
        <div class="game-controls" style="display: flex; justify-content: space-between; align-items: center; background-color: rgba(255, 248, 220, 0.9); padding: 15px 25px; border-radius: 8px; border: 2px solid #a67c52; margin-top: 20px; margin-bottom: 100px; position: relative; z-index: 100;">
            <div class="game-progress" style="font-size: 18px; color: #732e1c; font-weight: bold;">
                <span>已找到: </span>
                <span id="found-count">0</span>
                <span>/</span>
                <span id="total-count">5</span>
            </div>
            <div class="game-buttons" style="display: flex; gap: 15px;">
                <button id="hint-button" class="game-button" style="background-color: #a67c52; color: white; border: none; padding: 8px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">提示 (-10秒)</button>
                <button id="back-button" class="game-button" style="background-color: #a67c52; color: white; border: none; padding: 8px 20px; font-size: 16px; cursor: pointer; border-radius: 5px;">返回</button>
            </div>
        </div>
    `;
    
    // 创建结果弹窗
    const resultHTML = `
        <div id="result-popup" class="result-popup hidden" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background-color: rgba(0, 0, 0, 0.7); justify-content: center; align-items: center; z-index: 9999;">
            <div class="result-content" style="width: 90%; max-width: 600px; background-color: #f9f6e9; border: 3px solid #a67c52; border-radius: 10px; padding: 30px; text-align: center; position: relative; box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);">
                <h3 id="result-title" style="color: #732e1c; font-size: 28px; margin-bottom: 15px; font-weight: bold;">挑战完成！</h3>
                <p id="result-message" style="font-size: 18px; margin-bottom: 25px; color: #5a3d30;">你成功找出了所有差异！</p>
                <div class="result-stats" style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 20px; background-color: rgba(255, 248, 220, 0.7); padding: 15px; border-radius: 8px; width: 80%; margin-left: auto; margin-right: auto;">
                    <div class="stat-item" style="display: flex; justify-content: space-between; padding: 5px 30px;">
                        <span>找到差异：</span>
                        <span id="result-found">0/5</span>
                    </div>
                    <div class="stat-item" style="display: flex; justify-content: space-between; padding: 5px 30px;">
                        <span>剩余时间：</span>
                        <span id="result-time">00:00</span>
                    </div>
                    <div class="stat-item" style="display: flex; justify-content: space-between; padding: 5px 30px;">
                        <span>使用提示：</span>
                        <span id="result-hints">0次</span>
                    </div>
                </div>
                <div class="knowledge-block" style="background-color: rgba(166, 124, 82, 0.15); padding: 15px; border-radius: 8px; margin-bottom: 25px; text-align: left; border-left: 4px solid #a67c52;">
                    <h4 style="color: #732e1c; margin-bottom: 10px; font-size: 18px;">书法知识</h4>
                    <p id="calligraphy-knowledge" style="font-size: 16px; line-height: 1.6; color: #5a3d30;">加载中...</p>
                </div>
                <div class="result-buttons" style="display: flex; justify-content: center; gap: 15px; margin-top: 20px;">
                    <button id="continue-dialogue-btn" class="result-button" style="background-color: #a67c52; color: white; border: none; padding: 10px 25px; font-size: 16px; cursor: pointer; border-radius: 8px;">进行原稿欣赏</button>
                    <button id="replay-button" class="result-button" style="background-color: #a67c52; color: white; border: none; padding: 10px 25px; font-size: 16px; cursor: pointer; border-radius: 8px;">再玩一次</button>
                </div>
            </div>
        </div>
    `;

    // 添加到容器中
    gameContainer.innerHTML = headerHTML;
    gameContainer.innerHTML += contentHTML;
    gameContainer.innerHTML += controlsHTML;
    gameContainer.innerHTML += resultHTML;

    // 再次获取元素并添加事件监听器，因为innerHTML重置了所有之前的事件绑定
    setTimeout(() => {
        // 添加事件监听器
        const continueButton = document.getElementById('continue-dialogue-btn');
        if (continueButton) {
            continueButton.addEventListener('click', function(e) {
                console.log('[DEBUG] 点击了"进行原稿欣赏"按钮');
                e.preventDefault();
                try {
                    completeTask();
                    console.log('[DEBUG] completeTask函数已执行');
                } catch (error) {
                    console.error('[ERROR] completeTask函数执行出错:', error);
                }
            });
        } else {
            console.error('[ERROR] 找不到"进行原稿欣赏"按钮');
        }
        
        const replayButton = document.getElementById('replay-button');
        if (replayButton) {
            replayButton.addEventListener('click', function(e) {
                console.log('[DEBUG] 点击了"再玩一次"按钮');
                e.preventDefault();
                try {
                    resetGame();
                    console.log('[DEBUG] resetGame函数已执行');
                } catch (error) {
                    console.error('[ERROR] resetGame函数执行出错:', error);
                }
            });
        } else {
            console.error('[ERROR] 找不到"再玩一次"按钮');
        }
    }, 0);
    
    console.log("游戏界面创建完成");
}

// 添加游戏样式
function addGameStyles() {
    // 检查是否已存在样式
    if (document.getElementById('calligraphy-game-styles')) return;
    
    const styleElement = document.createElement('style');
    styleElement.id = 'calligraphy-game-styles';
    
    styleElement.textContent = `
        .game-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            background-color: rgba(255, 248, 220, 0.9);
            padding: 10px 20px;
            border-radius: 8px;
            border: 2px solid #a67c52;
        }
        
        .game-title {
            color: #732e1c;
            margin: 0;
            font-family: 'SimSun', serif;
        }
        
        .game-timer {
            background-color: #a67c52;
            color: white;
            padding: 8px 15px;
            border-radius: 20px;
            font-weight: bold;
            font-size: 18px;
        }
        
        .calligraphy-container {
            display: flex;
            justify-content: space-between;
            gap: 20px;
            margin-bottom: 20px;
        }
        
        .calligraphy-original, .calligraphy-modified {
            flex: 1;
            background-color: rgba(255, 248, 220, 0.9);
            padding: 15px;
            border-radius: 8px;
            border: 2px solid #a67c52;
        }
        
        .calligraphy-original h3, .calligraphy-modified h3 {
            text-align: center;
            color: #732e1c;
            margin-top: 0;
            margin-bottom: 15px;
            font-family: 'SimSun', serif;
        }
        
        .image-container {
            position: relative;
            width: 100%;
            height: 500px;
            overflow: hidden;
            border: 1px solid #a67c52;
            background-color: #f9f5e9;
        }
        
        .image-container img {
            width: 100%;
            height: 100%;
            object-fit: contain;
        }
        
        .markers-layer {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        
        .difference-marker {
            position: absolute;
            width: 40px;
            height: 40px;
            border-radius: 50%;
            border: 3px solid #ff6b6b;
            transform: translate(-50%, -50%);
            animation: pulse 1.5s infinite;
            pointer-events: none;
        }
        
        @keyframes pulse {
            0% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
            50% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
            100% { transform: translate(-50%, -50%) scale(0.8); opacity: 0.8; }
        }
        
        .game-controls {
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: rgba(255, 248, 220, 0.9);
            padding: 15px 20px;
            border-radius: 8px;
            border: 2px solid #a67c52;
        }
        
        .game-progress {
            font-size: 18px;
            color: #5a3d30;
            font-weight: bold;
        }
        
        .game-buttons {
            display: flex;
            gap: 15px;
        }
        
        .game-button {
            background-color: #a67c52;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 8px 20px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .game-button:hover {
            background-color: #8c6e5d;
            transform: translateY(-2px);
        }
        
        .result-popup {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            display: flex !important;
            justify-content: center;
            align-items: center;
            z-index: 1000 !important;
        }
        
        .result-popup.hidden {
            display: none !important;
        }
        
        .result-content {
            background-color: rgba(255, 248, 220, 0.95);
            padding: 30px;
            border-radius: 12px;
            border: 2px solid #a67c52;
            width: 80%;
            max-width: 500px;
            text-align: center;
        }
        
        .result-title {
            color: #732e1c;
            margin-top: 0;
            margin-bottom: 20px;
            font-family: 'SimSun', serif;
        }
        
        .result-message {
            font-size: 18px;
            color: #5a3d30;
            margin-bottom: 20px;
        }
        
        .result-stats {
            background-color: rgba(255, 255, 255, 0.7);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .stat-item {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
            font-size: 16px;
            color: #5a3d30;
        }
        
        .knowledge-block {
            background-color: rgba(255, 240, 200, 0.7);
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
            text-align: left;
        }
        
        .knowledge-block h4 {
            color: #732e1c;
            margin-top: 0;
            margin-bottom: 10px;
            font-family: 'SimSun', serif;
        }
        
        .result-buttons {
            display: flex;
            justify-content: center;
            gap: 15px;
        }
        
        .result-button {
            background-color: #a67c52;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 25px;
            font-size: 16px;
            cursor: pointer;
            transition: all 0.2s ease;
        }
        
        .result-button:hover {
            background-color: #8c6e5d;
            transform: translateY(-2px);
        }
    `;
    
    document.head.appendChild(styleElement);
}

// 加载书法作品
function loadCalligraphyWork(workTitle) {
    console.log("尝试加载书法作品:", workTitle);
    
    try {
        // 获取作品数据
        const work = calligraphyWorks[workTitle];
        
        if (!work) {
            console.error("作品数据未找到:", workTitle);
            // 如果找不到指定作品，加载默认作品
            const defaultWork = Object.keys(calligraphyWorks)[0];
            console.log("加载默认作品:", defaultWork);
            gameState.currentWork = calligraphyWorks[defaultWork];
        } else {
            gameState.currentWork = work;
        }
        
        // 设置当前状态
        gameState.foundDifferences = [];
        gameState.hintsUsed = 0;
        
        // 更新文本内容
        const originalTextElem = document.getElementById('original-work');
        const modifiedTextElem = document.getElementById('modified-work');
        
        if (originalTextElem && modifiedTextElem) {
            // 设置默认文本内容，以防数据缺失
            const originalText = gameState.currentWork.originalText || '原文内容未找到';
            const modifiedText = gameState.currentWork.modifiedText || '临摹内容未找到';
            
            console.log("正在加载原文内容");
            console.log("正在加载临摹内容");
            
            // 先清除现有内容
            originalTextElem.innerHTML = '';
            modifiedTextElem.innerHTML = '';
            
            // 确保有样式
            if (!document.getElementById('calligraphy-text-styles')) {
                const styleElement = document.createElement('style');
                styleElement.id = 'calligraphy-text-styles';
                styleElement.textContent = `
                    .char-span {
                        cursor: pointer;
                        padding: 2px;
                        margin: 1px;
                        border-radius: 2px;
                        transition: all 0.2s;
                        position: relative;
                        display: inline-block;
                    }
                    .char-span:hover {
                        background-color: rgba(166, 124, 82, 0.2);
                    }
                    .char-span.highlighted {
                        background-color: rgba(255, 107, 107, 0.6) !important;
                        color: #732e1c !important;
                        font-weight: bold;
                        box-shadow: 0 0 5px rgba(255, 107, 107, 0.8);
                        transform: scale(1.2);
                        z-index: 10;
                    }
                    
                    .diff-char {
                        /* 差异字符的样式，但不使用边框或轮廓 */
                        position: relative;
                    }
                    .text-work {
                        font-size: 28px;
                        line-height: 1.8;
                        letter-spacing: 3px;
                        text-align: center;
                    }
                    .text-container {
                        padding: 30px !important;
                    }
                `;
                document.head.appendChild(styleElement);
            }
            
            // 处理原文
            let originalLines = originalText.split('\n');
            let modifiedLines = modifiedText.split('\n');
            
            // 初始化加载前，先验证差异点的有效性
            console.log("差异点定义:", gameState.currentWork.differences);

            // 添加调试信息，显示文本和差异点位置
            console.log("原文文本:");
            originalLines.forEach((line, index) => console.log(`第${index}行: "${line}"`));
            console.log("临摹文本:");
            modifiedLines.forEach((line, index) => console.log(`第${index}行: "${line}"`));

            // 检查每个差异是否在文本范围内
            gameState.currentWork.differences.forEach((diff, index) => {
                const originalLine = originalLines[diff.row] || "";
                const modifiedLine = modifiedLines[diff.row] || "";
                
                const originalChar = originalLine[diff.col] || "超出范围";
                const modifiedChar = modifiedLine[diff.col] || "超出范围";
                
                console.log(`差异${index+1}: [${diff.row},${diff.col}] 原文:"${originalChar}" 临摹:"${modifiedChar}"`);
                
                if (originalChar === "超出范围" || modifiedChar === "超出范围") {
                    console.warn(`警告: 差异点 ${index+1} 位置 [${diff.row},${diff.col}] 超出文本范围!`);
                } 
                else if (originalChar === modifiedChar) {
                    console.warn(`警告: 差异点 ${index+1} 位置 [${diff.row},${diff.col}] 原文和临摹字符相同! "${originalChar}"`);
                }
            });

            // 在所有字符上添加额外的调试信息
            for (let rowIndex = 0; rowIndex < originalLines.length; rowIndex++) {
                const line = originalLines[rowIndex];
                const lineDiv = document.createElement('div');
                lineDiv.className = 'text-line';
                lineDiv.dataset.row = rowIndex;
                
                for (let colIndex = 0; colIndex < line.length; colIndex++) {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = line[colIndex];
                    charSpan.className = 'char-span';
                    charSpan.dataset.row = rowIndex;
                    charSpan.dataset.col = colIndex;
                    // 添加标题显示位置信息
                    charSpan.title = `位置: [${rowIndex},${colIndex}]`;
                    
                    // 检查是否为差异字符
                    const isDifferent = gameState.currentWork.differences.some(
                        diff => Number(diff.row) === Number(rowIndex) && Number(diff.col) === Number(colIndex)
                    );
                    
                    if (isDifferent) {
                        charSpan.dataset.isDiff = 'true';
                        // 添加特殊类名以便于CSS选择
                        charSpan.classList.add('diff-char');
                        
                        const diffInfo = gameState.currentWork.differences.find(
                            diff => Number(diff.row) === Number(rowIndex) && Number(diff.col) === Number(colIndex)
                        );
                        if (diffInfo) {
                            charSpan.dataset.original = diffInfo.original;
                            charSpan.dataset.modified = diffInfo.modified;
                            // 增加调试信息和特殊样式
                            console.log(`原文差异字符 [${rowIndex},${colIndex}]: '${line[colIndex]}'`);
                            // 移除虚线框
                            charSpan.title += ` (差异点: 原'${diffInfo.original}' 对比'${diffInfo.modified}')`;
                            // 可以添加一个自定义类，便于将来样式调整
                            charSpan.classList.add('diff-original');
                        }
                    }
                    
                    lineDiv.appendChild(charSpan);
                }
                
                originalTextElem.appendChild(lineDiv);
                if (rowIndex < originalLines.length - 1) {
                    originalTextElem.appendChild(document.createElement('br'));
                }
            }
            
            // 处理临摹文本
            for (let rowIndex = 0; rowIndex < modifiedLines.length; rowIndex++) {
                const line = modifiedLines[rowIndex];
                const lineDiv = document.createElement('div');
                lineDiv.className = 'text-line';
                lineDiv.dataset.row = rowIndex;
                
                for (let colIndex = 0; colIndex < line.length; colIndex++) {
                    const charSpan = document.createElement('span');
                    charSpan.textContent = line[colIndex];
                    charSpan.className = 'char-span';
                    charSpan.dataset.row = rowIndex;
                    charSpan.dataset.col = colIndex;
                    // 添加标题显示位置信息
                    charSpan.title = `位置: [${rowIndex},${colIndex}]`;
                    
                    // 检查是否为差异字符
                    const isDifferent = gameState.currentWork.differences.some(
                        diff => Number(diff.row) === Number(rowIndex) && Number(diff.col) === Number(colIndex)
                    );
                    
                    if (isDifferent) {
                        charSpan.dataset.isDiff = 'true';
                        // 添加特殊类名以便于CSS选择
                        charSpan.classList.add('diff-char');
                        
                        const diffInfo = gameState.currentWork.differences.find(
                            diff => Number(diff.row) === Number(rowIndex) && Number(diff.col) === Number(colIndex)
                        );
                        if (diffInfo) {
                            charSpan.dataset.original = diffInfo.original;
                            charSpan.dataset.modified = diffInfo.modified;
                            // 增加调试信息和特殊样式
                            console.log(`临摹差异字符 [${rowIndex},${colIndex}]: '${line[colIndex]}'`);
                            // 移除虚线框
                            charSpan.title += ` (差异点: 原'${diffInfo.original}' 改为'${diffInfo.modified}')`;
                            // 可以添加一个自定义类，便于将来样式调整
                            charSpan.classList.add('diff-modified');
                        }
                    }
                    
                    lineDiv.appendChild(charSpan);
                }
                
                modifiedTextElem.appendChild(lineDiv);
                if (rowIndex < modifiedLines.length - 1) {
                    modifiedTextElem.appendChild(document.createElement('br'));
                }
            }
            
            // 更新游戏进度显示
            document.getElementById('found-count').textContent = '0';
            document.getElementById('total-count').textContent = gameState.currentWork.differences.length;
            
            console.log("书法作品加载成功:", workTitle);
        } else {
            console.error("找不到文本元素");
        }
    } catch (error) {
        console.error("加载书法作品出错:", error);
    }
}

// 绑定游戏事件
function bindGameEvents() {
    console.log("绑定游戏事件");
    
    // 绑定提示按钮
    const hintBtn = document.getElementById('hint-button');
    if (hintBtn) {
        hintBtn.addEventListener('click', function() {
            console.log("点击提示按钮");
            showHint();
        });
    }
    
    // 添加一个调试/显示差异按钮
    const debugContainer = document.getElementById('game-controls');
    if (debugContainer) {
        const showAllBtn = document.createElement('button');
        showAllBtn.id = 'show-all-diffs-btn';
        showAllBtn.className = 'game-button';
        showAllBtn.textContent = '显示所有差异';
        showAllBtn.style.marginLeft = '10px';
        showAllBtn.style.backgroundColor = '#6c757d';
        
        showAllBtn.addEventListener('click', function() {
            console.log("显示所有差异");
            window.checkAllDifferences();
            
            // 添加视觉提示，表示已显示所有差异
            this.textContent = '已显示所有差异';
            this.style.backgroundColor = '#28a745';
            
            setTimeout(() => {
                this.textContent = '显示所有差异';
                this.style.backgroundColor = '#6c757d';
            }, 3000);
        });
        
        // 添加到游戏控制区
        const buttonArea = document.querySelector('.game-buttons');
        if (buttonArea) {
            buttonArea.appendChild(showAllBtn);
        } else {
            debugContainer.appendChild(showAllBtn);
        }
    }
    
    // 绑定返回按钮
    const backBtn = document.getElementById('back-button');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            console.log("点击返回按钮");
            returnToDialogue();
        });
    }
    
    // 绑定继续对话按钮
    const continueBtn = document.getElementById('continue-dialogue-btn');
    if (continueBtn) {
        continueBtn.addEventListener('click', function() {
            console.log("点击继续对话按钮");
            completeTask();
        });
    }
    
    // 绑定重玩按钮
    const replayBtn = document.getElementById('replay-button');
    if (replayBtn) {
        replayBtn.addEventListener('click', function() {
            console.log("点击重玩按钮");
            resetGame();
        });
    }
    
    // 阻止结果弹窗背景点击关闭
    const resultPopup = document.getElementById('result-popup');
    if (resultPopup) {
        resultPopup.addEventListener('click', function(event) {
            // 阻止点击背景关闭弹窗
            if (event.target === resultPopup) {
                event.stopPropagation();
                console.log("阻止点击背景关闭弹窗");
                return false;
            }
        });
        
        // 阻止ESC键关闭弹窗
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape' && !resultPopup.classList.contains('hidden')) {
                event.preventDefault();
                event.stopPropagation();
                console.log("阻止ESC键关闭弹窗");
                return false;
            }
        });
    }
    
    // 绑定找差异点击事件
    bindDifferenceClickEvents();
    
    console.log("游戏事件绑定完成");
}

// 绑定找差异点击事件
function bindDifferenceClickEvents() {
    const originalTextElem = document.getElementById('original-work');
    const modifiedTextElem = document.getElementById('modified-work');
    
    if (!originalTextElem || !modifiedTextElem) {
        console.error("找不到书法作品文本元素");
        return;
    }
    
    // 移除可能存在的旧事件监听器
    originalTextElem.removeEventListener('click', handleCharClick);
    modifiedTextElem.removeEventListener('click', handleCharClick);
    
    // 重新添加事件监听器
    originalTextElem.addEventListener('click', handleCharClick);
    modifiedTextElem.addEventListener('click', handleCharClick);
    
    // 添加音效
    if (!window.clickSound) {
        window.clickSound = new Audio();
        try {
            window.clickSound.src = 'assets/sounds/click.mp3';
            window.clickSound.volume = 0.5;
        } catch (e) {
            console.warn('加载点击音效失败:', e);
        }
    }
    
    if (!window.successSound) {
        window.successSound = new Audio();
        try {
            window.successSound.src = 'assets/sounds/success.mp3';
            window.successSound.volume = 0.6;
        } catch (e) {
            console.warn('加载成功音效失败:', e);
        }
    }
    
    // 确保音效可选
    window.useSound = false; // 默认禁用音效，以防文件不存在
    
    // 尝试预加载音效
    function preloadSounds() {
        try {
            const testAudio = new Audio();
            testAudio.oncanplaythrough = function() {
                window.useSound = true;
                console.log("音效已启用");
            }
            testAudio.onerror = function() {
                window.useSound = false;
                console.warn("音效未启用 - 文件可能不存在");
            }
            testAudio.src = 'assets/sounds/click.mp3';
            testAudio.load();
        } catch (e) {
            window.useSound = false;
            console.warn("音效系统不可用:", e);
        }
    }
    
    // 尝试预加载音效
    preloadSounds();
    
    console.log("差异点击事件绑定完成");
}

// 处理字符点击事件的函数
function handleCharClick(event) {
    if (!gameState.gameActive) return;
    
    const target = event.target;
    
    // 检查是否点击了字符
    if (target.classList.contains('char-span')) {
        const row = parseInt(target.dataset.row);
        const col = parseInt(target.dataset.col);
        
        // 不再使用isDiff标记来限制检测
        console.log("点击了字符:", target.textContent, "位置:", row, col);
        
        // 播放点击音效
        if (window.clickSound && window.useSound) {
            try {
                window.clickSound.currentTime = 0;
                window.clickSound.play().catch(e => console.warn('无法播放音效:', e));
            } catch (e) {
                console.warn('音效播放失败:', e);
            }
        }
        
        checkDifference(row, col);
    }
}

// 检查是否点击到差异
function checkDifference(row, col) {
    if (!gameState.currentWork) return;
    
    console.log("检查差异:", row, col);
    
    // 直接检查所有差异，不依赖isDiff标记
    const differences = gameState.currentWork.differences;
    const diffIndex = differences.findIndex((diff, index) => {
        if (gameState.foundDifferences.includes(index)) return false;
        
        // 使用严格相等比较整数值而不是字符串
        return (Number(diff.row) === Number(row) && Number(diff.col) === Number(col));
    });
    
    console.log("找到差异索引:", diffIndex);
    
    if (diffIndex !== -1) {
        // 找到了一个新差异
        console.log("找到差异点:", diffIndex, "位置:", row, col);
        gameState.foundDifferences.push(diffIndex);
        
        const diff = differences[diffIndex];
        console.log("差异详情:", diff);
        
        // 添加标记
        addMarker(diffIndex, row, col);
        
        // 更新找到数量
        const foundCount = document.getElementById('found-count');
        if (foundCount) {
            foundCount.textContent = gameState.foundDifferences.length.toString();
        }
        
        // 播放成功音效
        if (window.successSound && window.useSound) {
            try {
                window.successSound.currentTime = 0;
                window.successSound.play().catch(e => console.warn('无法播放音效:', e));
            } catch (e) {
                console.warn('音效播放失败:', e);
            }
        }
        
        // 添加视觉反馈 - 闪烁效果
        const gameContainer = document.getElementById('calligraphy-game');
        if (gameContainer) {
            gameContainer.classList.add('flash-correct');
            setTimeout(() => {
                gameContainer.classList.remove('flash-correct');
            }, 300);
        }
        
        // 检查是否找到所有差异
        if (gameState.foundDifferences.length === differences.length) {
            endGame(true);
        }
    } else {
        console.log("未找到差异点");
        // 点击了错误的位置，添加视觉反馈
        const clickedChar = document.querySelector(`#original-work .char-span[data-row="${row}"][data-col="${col}"], #modified-work .char-span[data-row="${row}"][data-col="${col}"]`);
        if (clickedChar) {
            clickedChar.classList.add('wrong-click');
            setTimeout(() => {
                clickedChar.classList.remove('wrong-click');
            }, 500);
        }
    }
}

// 添加差异标记
function addMarker(diffIndex, row, col) {
    console.log("添加标记点:", diffIndex, "位置:", row, col);
    
    // 在原作和临摹中找到对应位置的字符
    const originalChar = document.querySelector(`#original-work .char-span[data-row="${row}"][data-col="${col}"]`);
    const modifiedChar = document.querySelector(`#modified-work .char-span[data-row="${row}"][data-col="${col}"]`);
    
    if (!originalChar || !modifiedChar) {
        console.error("找不到对应位置的字符:", row, col);
        return;
    }
    
    // 添加高亮样式
    originalChar.classList.add('highlighted');
    modifiedChar.classList.add('highlighted');
    
    // 显示原始和修改后的字符
    const diff = gameState.currentWork.differences[diffIndex];
    
    // 添加标签显示找到的差异
    const diffLabel = document.createElement('div');
    diffLabel.className = 'diff-label';
    diffLabel.textContent = gameState.foundDifferences.length.toString();
    diffLabel.style.cssText = `
        position: absolute;
        top: -10px;
        right: -10px;
        background-color: #ff6b6b;
        color: white;
        border-radius: 50%;
        width: 20px;
        height: 20px;
        font-size: 14px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: bold;
        box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    `;
    
    // 添加悬停提示
    originalChar.title = `原字: ${diff.original || originalChar.textContent}`;
    modifiedChar.title = `临摹字: ${diff.modified || modifiedChar.textContent}`;
    
    originalChar.appendChild(diffLabel.cloneNode(true));
    modifiedChar.appendChild(diffLabel);
    
    // 添加动画效果
    originalChar.style.animation = 'pulse-highlight 1s';
    modifiedChar.style.animation = 'pulse-highlight 1s';
    
    // 添加CSS动画
    if (!document.getElementById('diff-animations')) {
        const styleElem = document.createElement('style');
        styleElem.id = 'diff-animations';
        styleElem.textContent = `
            @keyframes pulse-highlight {
                0% { transform: scale(1); }
                50% { transform: scale(1.4); }
                100% { transform: scale(1.2); }
            }
            
            .flash-correct {
                animation: flash-green 0.3s;
            }
            
            @keyframes flash-green {
                0% { background-color: rgba(120, 220, 120, 0.3); }
                100% { background-color: transparent; }
            }
            
            .wrong-click {
                animation: shake 0.5s;
                background-color: rgba(255, 100, 100, 0.3);
            }
            
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%, 60% { transform: translateX(-5px); }
                40%, 80% { transform: translateX(5px); }
            }
        `;
        document.head.appendChild(styleElem);
    }
    
    console.log("标记点添加完成");
}

// 显示提示
function showHint() {
    if (!gameState.gameActive || !gameState.currentWork) return;
    
    const differences = gameState.currentWork.differences;
    
    // 找出尚未发现的差异
    const undiscoveredDiffs = differences.filter((_, index) => !gameState.foundDifferences.includes(index));
    
    if (undiscoveredDiffs.length === 0) return;
    
    // 随机选择一个未发现的差异
    const randomDiff = undiscoveredDiffs[Math.floor(Math.random() * undiscoveredDiffs.length)];
    
    // 找出该差异在原始数组中的索引
    const diffIndex = differences.findIndex(diff => 
        diff.row === randomDiff.row && diff.col === randomDiff.col
    );
    
    console.log("提示差异位置:", randomDiff.row, randomDiff.col, "索引:", diffIndex);
    
    // 找到原文和临摹文中对应的字符元素
    const originalChar = document.querySelector(`#original-work .char-span[data-row="${randomDiff.row}"][data-col="${randomDiff.col}"]`);
    const modifiedChar = document.querySelector(`#modified-work .char-span[data-row="${randomDiff.row}"][data-col="${randomDiff.col}"]`);
    
    if (originalChar && modifiedChar) {
        // 创建闪烁效果
        const hintAnimation = `
            @keyframes hint-pulse {
                0%, 100% { background-color: rgba(255, 215, 0, 0.3); transform: scale(1); }
                50% { background-color: rgba(255, 215, 0, 0.7); transform: scale(1.2); }
            }
        `;
        
        // 添加样式
        const hintStyle = document.createElement('style');
        hintStyle.textContent = hintAnimation;
        document.head.appendChild(hintStyle);
        
        // 应用闪烁样式
        originalChar.style.animation = 'hint-pulse 1s infinite';
        modifiedChar.style.animation = 'hint-pulse 1s infinite';
        
        // 3秒后移除提示效果
        setTimeout(() => {
            originalChar.style.animation = '';
            modifiedChar.style.animation = '';
            
            // 标记为已找到
            gameState.foundDifferences.push(diffIndex);
            
            // 添加标记
            addMarker(diffIndex, randomDiff.row, randomDiff.col);
            
            // 更新找到数量
            document.getElementById('found-count').textContent = gameState.foundDifferences.length;
            
            // 检查是否找到所有差异
            if (gameState.foundDifferences.length === differences.length) {
                endGame(true);
            }
        }, 3000);
    }
    
    // 减少10秒时间作为惩罚（使用惩罚时间机制）
    gameState.penaltyTime += 10; // 增加10秒惩罚
    
    // 确保如果总时间已经不足，游戏也会结束
    if (gameState.initialTime - Math.floor((Date.now() - gameState.startTime) / 1000) - gameState.penaltyTime <= 0) {
        gameState.timeRemaining = 0;
    updateTimer();
        endGame(false);
        return;
    }
    
    updateTimer(); // 立即更新显示
    
    // 增加使用提示次数
    gameState.hintsUsed++;
    
    // 添加提示音效
    if (!window.hintSound) {
        window.hintSound = new Audio();
        window.hintSound.src = 'assets/sounds/hint.mp3';
        window.hintSound.volume = 0.6;
    }
    
    try {
        window.hintSound.currentTime = 0;
        window.hintSound.play().catch(e => console.warn('无法播放提示音效:', e));
    } catch (e) {
        console.warn('提示音效播放失败:', e);
    }
    
    // 显示提示文本
    const hintMsg = document.createElement('div');
    hintMsg.className = 'hint-message';
    hintMsg.textContent = '提示: -10秒，差异会在3秒后自动标记';
    hintMsg.style.cssText = `
        position: fixed;
        top: 20%;
        left: 50%;
        transform: translateX(-50%);
        background-color: rgba(255, 215, 0, 0.8);
        padding: 10px 20px;
        border-radius: 5px;
        font-size: 18px;
        color: #333;
        font-weight: bold;
        animation: fadeIn 0.5s, fadeOut 0.5s 2.5s forwards;
        z-index: 1000;
    `;
    
    // 添加动画
    const fadeAnimation = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translate(-50%, -20px); }
            to { opacity: 1; transform: translate(-50%, 0); }
        }
        @keyframes fadeOut {
            from { opacity: 1; transform: translate(-50%, 0); }
            to { opacity: 0; transform: translate(-50%, -20px); }
        }
    `;
    
    const fadeStyle = document.createElement('style');
    fadeStyle.textContent = fadeAnimation;
    document.head.appendChild(fadeStyle);
    
    document.body.appendChild(hintMsg);
    
    // 移除提示消息
    setTimeout(() => {
        document.body.removeChild(hintMsg);
    }, 3000);
}

// 开始游戏计时
function startGameTimer() {
    // 重置计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
    }
    
    gameState.gameActive = true;
    
    // 记录开始时间
    gameState.startTime = Date.now();
    // 记录初始剩余时间
    gameState.initialTime = gameState.timeRemaining;
    // 记录因使用提示而减少的惩罚时间（初始为0秒）
    gameState.penaltyTime = 0;
    
    // 每100毫秒更新一次计时器，根据实际经过的时间计算剩余时间
    gameState.timerInterval = setInterval(function() {
        // 计算已经过去的秒数（向下取整）
        const elapsedSeconds = Math.floor((Date.now() - gameState.startTime) / 1000);
        // 计算剩余时间（考虑惩罚时间）
        gameState.timeRemaining = gameState.initialTime - elapsedSeconds - gameState.penaltyTime;
        
        updateTimer();
        
        // 时间用完，游戏结束
        if (gameState.timeRemaining <= 0) {
            // 确保时间不会显示为负数
            gameState.timeRemaining = 0;
            updateTimer();
                endGame(false);
            }
    }, 100); // 使用更短的间隔使显示更平滑
    }
    
// 更新计时器显示
function updateTimer() {
    const timerElement = document.getElementById('time-remaining');
    
    if (timerElement) {
        const minutes = Math.floor(gameState.timeRemaining / 60);
        const seconds = gameState.timeRemaining % 60;
        
        timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

// 结束游戏
function endGame(success) {
    console.log("游戏结束，结果:", success ? "成功" : "失败");
    
    // 停止计时器并锁定剩余时间
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 游戏结束，确保弹窗显示
    window.fixResultPopupStyles();
    
    // 添加阻止事件冒泡，确保弹窗不会被意外关闭
    const resultPopupElem = document.getElementById('result-popup');
    if (resultPopupElem) {
        resultPopupElem.onclick = function(event) {
            event.stopPropagation();
        };
    }
    
    gameState.gameActive = false;
    
    // 如果没有成功完成，自动标记剩余差异
    if (!success) {
        // 找出未发现的差异
        const differences = gameState.currentWork.differences;
        const undiscoveredDiffs = differences.filter((diff, index) => !gameState.foundDifferences.includes(index));
        
        // 标记所有未发现的差异
        undiscoveredDiffs.forEach(diff => {
            const originalChar = document.querySelector(`#original-work .char-span[data-row="${diff.row}"][data-col="${diff.col}"]`);
            const modifiedChar = document.querySelector(`#modified-work .char-span[data-row="${diff.row}"][data-col="${diff.col}"]`);
            
            if (originalChar && modifiedChar) {
                originalChar.classList.add('missed-diff');
                modifiedChar.classList.add('missed-diff');
                
                const diffLabel = document.createElement('div');
                diffLabel.className = 'missed-label';
                diffLabel.textContent = '?';
                diffLabel.style.cssText = `
                    position: absolute;
                    top: -10px;
                    right: -10px;
                    background-color: #888;
                    color: white;
                    border-radius: 50%;
                    width: 20px;
                    height: 20px;
                    font-size: 14px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
                `;
                
                originalChar.appendChild(diffLabel.cloneNode(true));
                modifiedChar.appendChild(diffLabel);
            }
        });
        
        // 添加未找到的差异样式
        const missedStyle = document.createElement('style');
        missedStyle.textContent = `
            .missed-diff {
                background-color: rgba(150, 150, 150, 0.4);
                border: 1px dashed #888;
            }
        `;
        document.head.appendChild(missedStyle);
    }
        
    // 显示结果弹窗
    const resultPopup = document.getElementById('result-popup');
    const resultTitle = document.getElementById('result-title');
    const resultMessage = document.getElementById('result-message');
    const resultFound = document.getElementById('result-found');
    const resultTime = document.getElementById('result-time');
    const resultHints = document.getElementById('result-hints');
    const knowledgeText = document.getElementById('calligraphy-knowledge');
    
    if (resultPopup && resultTitle && resultMessage) {
        // 设置样式，确保弹窗显示正常
        resultPopup.style.display = 'flex';
        resultPopup.style.visibility = 'visible';
        resultPopup.style.opacity = '1';
        resultPopup.style.zIndex = '2000';
        
        if (success) {
            resultTitle.textContent = '挑战成功！';
            resultTitle.style.color = '#1e7e34';
            resultMessage.textContent = '恭喜你找出了所有差异，展现了惊人的书法鉴赏能力！';
            
            // 播放成功音效
            if (!window.completeSound) {
                window.completeSound = new Audio();
                window.completeSound.src = 'assets/sounds/complete.mp3';
                window.completeSound.volume = 0.7;
                
                try {
                    window.completeSound.play().catch(e => console.warn('无法播放完成音效:', e));
                } catch (e) {
                    console.warn('完成音效播放失败:', e);
                }
            }
        } else {
            resultTitle.textContent = '挑战失败';
            resultTitle.style.color = '#d9534f';
            resultMessage.textContent = '时间用尽，未能找出所有差异。请看标记出的剩余差异，再接再厉！';
            
            // 播放失败音效
            if (!window.failSound) {
                window.failSound = new Audio();
                window.failSound.src = 'assets/sounds/fail.mp3';
                window.failSound.volume = 0.7;
                
                try {
                    window.failSound.play().catch(e => console.warn('无法播放失败音效:', e));
                } catch (e) {
                    console.warn('失败音效播放失败:', e);
                }
            }
        }
        
        // 更新统计信息
        if (resultFound) {
            resultFound.textContent = `${gameState.foundDifferences.length}/${gameState.currentWork.differences.length}`;
        }
        
        if (resultTime) {
            const minutes = Math.floor(gameState.timeRemaining / 60);
            const seconds = gameState.timeRemaining % 60;
            resultTime.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        
        if (resultHints) {
            resultHints.textContent = `${gameState.hintsUsed}次`;
        }
        
        // 添加书法知识
        if (knowledgeText) {
            try {
                if (window.dialogueSystem && window.gameState && window.gameState.currentNpc) {
                    // 从当前NPC获取相关知识
                    const currentNpc = window.gameState.currentNpc;
                    const npcData = window.dialogueSystem.npcData;
                    
                    if (npcData && npcData[currentNpc] && npcData[currentNpc].dialogues && npcData[currentNpc].dialogues.facts) {
                        const facts = npcData[currentNpc].dialogues.facts;
                        const fact = facts[Math.floor(Math.random() * facts.length)];
                        knowledgeText.textContent = fact || "宋代书法是中国书法艺术发展史上的重要篇章，特点是雅俗共赏、点画相生。";
                    } else {
                        knowledgeText.textContent = "宋代书法以欧阳询、颜真卿为代表，形成了独特的艺术风格，对后世影响深远。";
                    }
                } else {
                    // 如果找不到NPC数据，使用默认知识
                    const defaultFacts = [
                        "宋代书法继承了唐代书法的精华，又有所创新，形成了独特的风格。",
                        "苏轼是北宋著名文学家、书法家，其行书自成一家，风格洒脱自然。",
                        "黄庭坚是北宋著名书法家，其书法瘦硬挺拔，自成一派，被后世称为'江西派'。",
                        "宋四家指的是苏轼、黄庭坚、米芾和蔡襄，他们的书法风格各具特色。",
                        "米芾的书法被称为'米点'，其行书点画圆润，笔势奔放，独具特色。"
                    ];
                    knowledgeText.textContent = defaultFacts[Math.floor(Math.random() * defaultFacts.length)];
                }
            } catch (error) {
                console.error("获取书法知识失败:", error);
                knowledgeText.textContent = "宋代书法艺术注重情趣，讲究表现出作者的精神气质，并追求作品的韵味与格调。";
            }
        }
        
        // 添加弹窗动画
        resultPopup.style.animation = "popup-fade-in 0.5s ease forwards";
        if (!document.getElementById('popup-animations')) {
            const popupStyle = document.createElement('style');
            popupStyle.id = 'popup-animations';
            popupStyle.textContent = `
                @keyframes popup-fade-in {
                    from { opacity: 0; transform: translateY(-20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .result-content {
                    animation: popup-scale-in 0.3s 0.2s ease forwards;
                    transform: scale(0.9);
                    opacity: 0;
                }
                @keyframes popup-scale-in {
                    from { transform: scale(0.9); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(popupStyle);
        }
        
        // 显示弹窗
        resultPopup.classList.remove('hidden');
        // 重要：强制设置display为flex，确保弹窗可见
        setTimeout(() => {
            resultPopup.style.display = 'flex';
            console.log("结果弹窗已显示", resultPopup.style.display);
        }, 10);
    }
}

// 重置游戏
function resetGame() {
    // 隐藏结果弹窗
    const resultPopup = document.getElementById('result-popup');
    if (resultPopup) {
        resultPopup.classList.add('hidden');
        resultPopup.style.display = 'none'; // 确保弹窗完全隐藏
    }
    
    // 清空标记
    const originalMarkers = document.getElementById('original-markers');
    const modifiedMarkers = document.getElementById('modified-markers');
    
    if (originalMarkers) originalMarkers.innerHTML = '';
    if (modifiedMarkers) modifiedMarkers.innerHTML = '';
    
    // 停止现有计时器
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 重置游戏状态
    const currentWork = gameState.currentWork ? gameState.currentWork.title : null;
    
    // 重置游戏时间为60秒
    gameState.timeRemaining = 60;
    gameState.foundDifferences = [];
    gameState.hintsUsed = 0;
    gameState.gameActive = true;
    gameState.penaltyTime = 0; // 重置惩罚时间
    
    // 重新加载作品
    loadCalligraphyWork(currentWork);
    
    // 更新计时器显示
    updateTimer();
    
    // 重新开始计时
    startGameTimer();
}

// 返回对话界面
function returnToDialogue() {
    // 停止游戏
    if (gameState.timerInterval) {
        clearInterval(gameState.timerInterval);
        gameState.timerInterval = null;
    }
    
    // 确保结果弹窗隐藏
    const resultPopup = document.getElementById('result-popup');
    if (resultPopup) {
        resultPopup.classList.add('hidden');
        resultPopup.style.display = 'none';
    }
    
    // 切换到对话场景
    document.querySelectorAll('.game-content').forEach(content => {
        content.classList.add('hidden');
        content.style.display = 'none';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
    });
    
    // 显示对话场景
    const dialogueScene = document.getElementById('dialogue-scene');
    if (dialogueScene) {
        dialogueScene.classList.remove('hidden');
        dialogueScene.style.display = 'block';
        dialogueScene.style.visibility = 'visible';
        dialogueScene.style.opacity = '1';
    }
}

// 完成任务，展示原稿欣赏
function completeTask() {
    // 隐藏结果弹窗
    const resultPopup = document.getElementById('result-popup');
    if (resultPopup) {
        resultPopup.classList.add('hidden');
        resultPopup.style.display = 'none'; // 确保弹窗完全隐藏
    }
    
    // 获取当前作品标题
    const workTitle = gameState.currentWork ? gameState.currentWork.title : null;
    
    // 如果对话系统中存在showArtworkDisplay函数，调用它来展示原稿
    if (window.dialogueSystem && typeof window.dialogueSystem.showArtworkDisplay === 'function') {
        window.dialogueSystem.showArtworkDisplay(workTitle);
    }
    // 如果全局有这个函数
    else if (typeof window.showArtworkDisplay === 'function') {
        window.showArtworkDisplay(workTitle);
    }
    else {
        console.error("找不到展示原稿的函数");
    }
}

// 添加一个调试辅助函数，可以在控制台中调用
window.checkAllDifferences = function() {
    if (!gameState || !gameState.currentWork) {
        console.error("游戏状态不可用");
        return;
    }
    
    console.log("所有差异点位置：");
    gameState.currentWork.differences.forEach((diff, index) => {
        const originalChar = document.querySelector(`#original-work .char-span[data-row="${diff.row}"][data-col="${diff.col}"]`);
        const modifiedChar = document.querySelector(`#modified-work .char-span[data-row="${diff.row}"][data-col="${diff.col}"]`);
        
        let originalText = originalChar ? originalChar.textContent : "未找到";
        let modifiedText = modifiedChar ? modifiedChar.textContent : "未找到";
        
        console.log(`差异 ${index+1}: 位置[${diff.row},${diff.col}] - 原文'${originalText}', 临摹'${modifiedText}'`);
        console.log("原始字符元素:", originalChar);
        console.log("临摹字符元素:", modifiedChar);
        
        // 测试时可以高亮显示所有差异（移除边框样式，使用背景色）
        if (originalChar) originalChar.style.backgroundColor = "rgba(255, 200, 200, 0.2)";
        if (modifiedChar) modifiedChar.style.backgroundColor = "rgba(255, 200, 200, 0.2)";
    });
    
    console.log("可以通过点击这些高亮边框的文字来测试是否正确检测差异");
    return "检查完成，请查看控制台输出";
};

window.resetDiffStyles = function() {
    document.querySelectorAll('.char-span').forEach(span => {
        span.style.border = "";
        span.style.outline = "";
        span.style.backgroundColor = "";
    });
    return "已重置样式";
};

// 导出函数到全局作用域
window.initCalligraphyGame = initCalligraphyGame;

// 添加调试函数来检查和修复结果弹窗
window.checkResultPopup = function() {
    const resultPopup = document.getElementById('result-popup');
    if (!resultPopup) {
        console.error("结果弹窗元素未找到！");
        return "弹窗元素未找到";
    }
    
    console.log("结果弹窗当前状态:", {
        display: resultPopup.style.display,
        visibility: resultPopup.style.visibility,
        opacity: resultPopup.style.opacity,
        zIndex: resultPopup.style.zIndex,
        classList: Array.from(resultPopup.classList)
    });
    
    // 强制显示弹窗
    resultPopup.classList.remove('hidden');
    resultPopup.style.display = 'flex';
    resultPopup.style.visibility = 'visible';
    resultPopup.style.opacity = '1';
    resultPopup.style.zIndex = '2000';
    
    // 应用其他可能影响显示的样式
    const contentDiv = resultPopup.querySelector('.result-content');
    if (contentDiv) {
        contentDiv.style.opacity = '1';
        contentDiv.style.transform = 'scale(1)';
    }
    
    console.log("已强制设置弹窗为可见状态");
    return "弹窗显示已修复";
};

// 添加一个函数来修复CSS样式冲突
window.fixResultPopupStyles = function() {
    // 创建或更新样式元素
    let styleElem = document.getElementById('result-popup-fix');
    if (!styleElem) {
        styleElem = document.createElement('style');
        styleElem.id = 'result-popup-fix';
        document.head.appendChild(styleElem);
    }
    
    // 添加高优先级样式
    styleElem.textContent = `
        #result-popup {
            position: fixed !important;
            top: 0 !important;
            left: 0 !important;
            width: 100% !important;
            height: 100% !important;
            background-color: rgba(0, 0, 0, 0.7) !important;
            display: flex !important;
            justify-content: center !important;
            align-items: center !important;
            z-index: 9999 !important;
            visibility: visible !important;
            opacity: 1 !important;
            pointer-events: auto !important;
        }
        
        #result-popup.hidden {
            display: none !important;
        }
        
        #result-popup .result-content {
            opacity: 1 !important;
            transform: scale(1) !important;
            visibility: visible !important;
            pointer-events: auto !important;
            position: relative !important;
            top: 50px !important; /* 向下移动弹窗 */
            margin-bottom: 100px !important; /* 增加底部间距 */
        }
    `;
    
    console.log("已添加高优先级样式来修复弹窗显示问题");
    
    // 立即显示弹窗，保持显示状态
    const resultPopup = document.getElementById('result-popup');
    if (resultPopup) {
        resultPopup.classList.remove('hidden');
        resultPopup.style.display = 'flex';
        
        return "弹窗样式已修复并保持显示状态";
    }
    
    return "样式已修复，但找不到弹窗元素";
}; 