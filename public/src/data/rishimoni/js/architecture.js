/**
 * 宋韵流芳 - 建筑文化问答模块
 * 负责《营造法式》建筑文化情景对话和问答的逻辑
 */

/**
 * 初始化建筑文化问答游戏
 * @returns {Object} 游戏控制对象
 */
function initArchitectureGame() {
    console.log("初始化建筑游戏：营造法式");
    
    // 游戏容器
    const gameContainer = document.getElementById('architecture-game');
    if (!gameContainer) return null;
    
    // 游戏状态
    const gameState = {
        currentMode: 'choice',
        currentQuestion: null,
        correctAnswers: 0,
        totalQuestions: 0,
        usedQuestionIds: {
            choice: []
        },
        completedScenes: 0,
        completedSceneIds: [],
        hasReceivedPouch: false,
        allScenesCompleted: false,
        // 场景数据
        scenes: {
            // 只保留建筑拼图场景
            templeOfHeaven: {
                id: 'templeOfHeaven',
                name: '建筑拼图',
                description: '在宋代建筑学院，一位建筑师正在教你如何通过拼图了解宋代建筑结构...',
                background: 'assets/images/tiantan.jpg',
                character: '建筑师',
                mode: 'puzzle',
                difficulty: 3,
                dialogue: [
                    '建筑师：这位学子，欢迎来到宋代建筑学院。',
                    '你：老师好，听闻今天有特别的学习方式。',
                    '建筑师：不错，今天我们将通过拼图来学习宋代建筑结构。',
                    '你：拼图？这是什么学习方法？',
                    '建筑师：拼图是理解建筑组成部分的好方法。通过将散落的建筑构件拼在一起，你可以直观了解它们如何组合成完整的建筑。',
                    '你：听起来很有趣！',
                    '建筑师：我已准备好几种宋代经典建筑的拼图，你准备好挑战了吗？',
                    '你：我已准备就绪。'
                ]
            }
        },
        currentScene: null,
    };
    
    // 清空容器并设置基本样式
    gameContainer.innerHTML = '';
    gameContainer.classList.remove('hidden');
    gameContainer.style.display = 'block';
    gameContainer.style.visibility = 'visible';
    gameContainer.style.opacity = '1';
    
    // 创建游戏界面
    const gameElements = createGameInterface(gameContainer, gameState);
    
    // 检查是否有指定的场景ID
    const directSceneId = window.currentSceneId;
    
    // 将游戏状态存储到全局变量中，以便其他函数可以访问
    window.architectureGameState = gameState;
    
    // 创建游戏控制对象
    const gameModule = {
        reset: () => {
            console.log("重置建筑问答游戏...");
            gameState.hasAnsweredQuestion = false;
            
            // 直接显示拼图游戏
            showPuzzleGame(gameState, gameContainer);
        },
        // 添加直接进入特定场景的方法
        startScene: (sceneId) => {
            console.log(`直接进入场景: ${sceneId}`);
            if (gameState.scenes[sceneId]) {
                // 直接启动场景对话
                startSceneDialogue(gameState, sceneId, () => {
                    // 清空游戏区域的对话框
                    const dialogueBox = gameElements.gameArea.querySelector('.scene-dialogue-box');
                    if (dialogueBox) {
                        console.log("移除对话框");
                        gameElements.gameArea.removeChild(dialogueBox);
                    }
                    
                    // 确保背景图在提问时仍可见
                    gameElements.gameArea.style.backgroundImage = `url('${gameState.currentScene.background}')`;
                    
                    // 显示拼图游戏
                    console.log("显示拼图游戏");
                    showPuzzleGame(gameState, gameContainer);
                });
                return true;
            } else {
                console.error(`场景 ${sceneId} 不存在`);
                return false;
            }
        }
    };
    
    // 默认选择templeOfHeaven场景
    gameState.currentScene = gameState.scenes.templeOfHeaven;
    
        // 使用setTimeout确保界面已经完全初始化
        setTimeout(() => {
        // 直接显示拼图游戏，跳过对话部分
        showPuzzleGame(gameState, gameContainer);
        }, 100);
    
    // 返回游戏控制对象
    return gameModule;
}

/**
 * 显示场景选择界面
 * @param {Object} gameState - 游戏状态
 * @param {HTMLElement} container - 游戏容器
 * @param {Object} gameElements - 游戏元素
 */
function showSceneSelectionUI(gameState, container, gameElements) {
    // 更新游戏标题
    const titleElement = container.querySelector('.game-title');
    if (titleElement) titleElement.textContent = '宋代建筑文化 - 场景选择';
    
    // 更新游戏描述
    const descriptionElement = container.querySelector('.game-description');
    if (descriptionElement) descriptionElement.textContent = '请选择一个场景，与宋代建筑大师交流，了解建筑文化的精髓';
    
    // 清空游戏区域
    const gameArea = gameElements.gameArea;
    gameArea.innerHTML = '';
    gameArea.style.backgroundColor = '#f8ecd8';
    gameArea.style.backgroundImage = 'none';
    gameArea.style.display = 'flex';
    gameArea.style.flexDirection = 'column';
    gameArea.style.justifyContent = 'center';
    gameArea.style.alignItems = 'center';
    
    // 创建场景选择容器
    const sceneSelectionContainer = document.createElement('div');
    sceneSelectionContainer.className = 'scene-selection-container';
    sceneSelectionContainer.style.width = '100%';
    sceneSelectionContainer.style.maxWidth = '1000px';
    sceneSelectionContainer.style.padding = '20px';
    sceneSelectionContainer.style.display = 'flex';
    sceneSelectionContainer.style.flexDirection = 'column';
    sceneSelectionContainer.style.gap = '20px';
    
    // 添加场景选择标题
    const sceneSelectionTitle = document.createElement('h3');
    sceneSelectionTitle.textContent = '选择一个场景开始探索';
    sceneSelectionTitle.style.color = '#732e1c';
    sceneSelectionTitle.style.textAlign = 'center';
    sceneSelectionTitle.style.marginBottom = '20px';
    sceneSelectionTitle.style.fontSize = '24px';
    sceneSelectionContainer.appendChild(sceneSelectionTitle);
    
    // 创建场景卡片容器
    const sceneCardsContainer = document.createElement('div');
    sceneCardsContainer.style.display = 'flex';
    sceneCardsContainer.style.flexWrap = 'wrap';
    sceneCardsContainer.style.justifyContent = 'center';
    sceneCardsContainer.style.gap = '20px';
    
    // 添加场景卡片
    Object.values(gameState.scenes).forEach(scene => {
        const sceneCard = document.createElement('div');
        sceneCard.className = 'scene-card';
        sceneCard.style.backgroundColor = 'rgba(255, 255, 255, 0.9)';
        sceneCard.style.borderRadius = '15px';
        sceneCard.style.padding = '20px';
        sceneCard.style.width = '250px';
        sceneCard.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.15)';
        sceneCard.style.cursor = 'pointer';
        sceneCard.style.border = 'none'; // 移除边框
        sceneCard.style.transition = 'transform 0.2s ease, box-shadow 0.2s ease';
        sceneCard.setAttribute('data-scene-id', scene.id);
        
        // 添加场景图片
        const sceneImage = document.createElement('div');
        sceneImage.style.width = '100%';
        sceneImage.style.height = '150px';
        sceneImage.style.backgroundImage = `url('${scene.background}')`;
        sceneImage.style.backgroundSize = 'cover';
        sceneImage.style.backgroundPosition = 'center';
        sceneImage.style.borderRadius = '10px';
        sceneImage.style.marginBottom = '15px';
        sceneCard.appendChild(sceneImage);
        
        // 创建场景标题
        const sceneTitle = document.createElement('h4');
        sceneTitle.textContent = scene.name;
        sceneTitle.style.color = '#732e1c';
        sceneTitle.style.marginBottom = '10px';
        sceneTitle.style.fontSize = '20px';
        sceneTitle.style.textAlign = 'center';
        sceneCard.appendChild(sceneTitle);
        
        // 创建场景角色
        const sceneCharacter = document.createElement('div');
        sceneCharacter.textContent = `人物：${scene.character}`;
        sceneCharacter.style.color = '#5a3d30';
        sceneCharacter.style.marginBottom = '8px';
        sceneCharacter.style.fontSize = '16px';
        sceneCharacter.style.textAlign = 'center';
        sceneCard.appendChild(sceneCharacter);
        
        // 创建场景描述
        const sceneDescription = document.createElement('p');
        sceneDescription.textContent = scene.description;
        sceneDescription.style.color = '#5a3d30';
        sceneDescription.style.fontSize = '14px';
        sceneDescription.style.textAlign = 'center';
        sceneDescription.style.lineHeight = '1.5';
        sceneCard.appendChild(sceneDescription);
        
        // 添加难度指示器
        const difficultyIndicator = document.createElement('div');
        difficultyIndicator.style.marginTop = '10px';
        difficultyIndicator.style.textAlign = 'center';
        difficultyIndicator.style.color = '#5a3d30';
        difficultyIndicator.style.fontSize = '14px';
        difficultyIndicator.textContent = `难度：${'★'.repeat(scene.difficulty)}`;
        sceneCard.appendChild(difficultyIndicator);
        
        // 添加场景悬停效果
        sceneCard.addEventListener('mouseover', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
            // 移除边框变化
        });
        
        sceneCard.addEventListener('mouseout', function() {
            this.style.transform = 'translateY(0)';
            this.style.boxShadow = '0 3px 8px rgba(0, 0, 0, 0.15)';
            // 移除边框变化
        });
        
        // 添加点击事件
        sceneCard.addEventListener('click', function() {
            if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                window.gameUtils.playSound('click-sound');
            }
            
            console.log(`点击场景: ${scene.id}`);
            
            // 开始选择的场景
            startSceneDialogue(gameState, scene.id, function dialogueCompleteCallback() {
                console.log("对话完成回调被触发");
                // 清空游戏区域的对话框
                const dialogueBox = gameElements.gameArea.querySelector('.scene-dialogue-box');
                if (dialogueBox) {
                    console.log("移除对话框");
                    gameElements.gameArea.removeChild(dialogueBox);
                } else {
                    console.warn("未找到对话框元素");
                }
                
                // 确保背景图在提问时仍可见
                gameElements.gameArea.style.backgroundImage = `url('${gameState.currentScene.background}')`;
                
                // 根据游戏模式显示问题或拼图游戏
                if (gameState.currentScene.mode === 'puzzle') {
                    console.log("显示拼图游戏");
                    showPuzzleGame(gameState, gameContainer);
                } else {
                // 显示问题
                    console.log("显示问题");
                showQuestion(gameState, container);
                }
            });
        });
        
        sceneCardsContainer.appendChild(sceneCard);
    });
    
    sceneSelectionContainer.appendChild(sceneCardsContainer);
    gameArea.appendChild(sceneSelectionContainer);
}

/**
 * 显示完成消息
 * @param {Object} gameState - 游戏状态
 * @param {HTMLElement} container - 游戏容器
 */
function showCompletionMessage(gameState, container) {
    console.log("显示完成消息...");
    
    // 获取游戏区域
    const gameArea = container.querySelector('.architecture-area');
    if (!gameArea) return;
    
    // 清空游戏区域
    gameArea.innerHTML = '';
    gameArea.style.display = 'flex';
    gameArea.style.flexDirection = 'column';
    gameArea.style.justifyContent = 'center';
    gameArea.style.alignItems = 'center';
    gameArea.style.padding = '20px';
    gameArea.style.boxSizing = 'border-box';
    
    // 创建完成消息容器
    const completionContainer = document.createElement('div');
    completionContainer.className = 'completion-container';
    completionContainer.style.width = '100%';
    completionContainer.style.textAlign = 'center';
    
    // 创建完成标题
    const completionTitle = document.createElement('h3');
    completionTitle.textContent = '恭喜！';
    completionTitle.style.color = '#732e1c';
    completionTitle.style.fontSize = '24px';
    completionTitle.style.marginBottom = '15px';
    completionContainer.appendChild(completionTitle);
    
    // 创建完成图片
    const completionImage = document.createElement('div');
    completionImage.style.width = '200px';
    completionImage.style.height = '150px';
    completionImage.style.margin = '0 auto 20px auto';
    completionImage.style.backgroundSize = 'contain';
    completionImage.style.backgroundPosition = 'center';
    completionImage.style.backgroundRepeat = 'no-repeat';
    completionImage.style.border = '2px solid #a67c52';
    completionImage.style.borderRadius = '5px';
    completionImage.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    
    // 根据当前场景ID设置适当的图片
    let imageSrc = 'assets/images/shengmudian.jpg'; // 默认使用圣母殿图片
    
    // 根据完成的拼图ID显示相应图片
    if (gameState.currentScene && gameState.currentScene.currentPuzzle) {
        if (gameState.currentScene.currentPuzzle === 'yingzaofashi') {
            imageSrc = 'assets/images/yingzaofashi.jpg';
        } else if (gameState.currentScene.currentPuzzle === 'shengmudian') {
            imageSrc = 'assets/images/shengmudian.jpg';
        } else if (gameState.currentScene.currentPuzzle === 'monidian') {
            imageSrc = 'assets/images/monidian.jpg';
        }
    }
    
    // 设置拼图完成的图片
    completionImage.style.backgroundImage = `url('${imageSrc}')`;
    
    completionContainer.appendChild(completionImage);
    
    // 创建成功文本
    const successText = document.createElement('p');
    successText.style.color = '#5a3d30';
    successText.style.fontSize = '18px';
    successText.style.marginBottom = '20px';
    successText.style.lineHeight = '1.5';
    
    // 拼图游戏的成功文本
    successText.textContent = '拼图完成！你成功组装了宋代建筑结构，展现了对宋代建筑的良好理解。';
    
    completionContainer.appendChild(successText);
    
    // 创建详情查看按钮
    const detailsButton = document.createElement('button');
    detailsButton.textContent = `查看《${gameState.currentScene.name}》资料`;
    detailsButton.style.padding = '10px 20px';
    detailsButton.style.fontSize = '16px';
    detailsButton.style.backgroundColor = '#a67c52';
    detailsButton.style.color = 'white';
    detailsButton.style.border = 'none';
    detailsButton.style.borderRadius = '5px';
    detailsButton.style.cursor = 'pointer';
    detailsButton.style.marginRight = '10px';
    detailsButton.style.transition = 'background-color 0.3s ease';
    
    detailsButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#8b6b4a';
    });
    
    detailsButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#a67c52';
    });
    
    detailsButton.addEventListener('click', function() {
        console.log("查看详情");
        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
            window.gameUtils.playSound('click-sound');
        }
        
        // 保存当前恭喜界面的引用，用于资料关闭后恢复
        const completionContainerParent = completionContainer.parentElement;
        if (completionContainerParent) {
            window.lastCompletionContainer = {
                container: completionContainer,
                parent: completionContainerParent
            };
        }
        
        showOriginalArchitecture(gameState.currentScene.id);
    });
    
    completionContainer.appendChild(detailsButton);
    
    // 添加返回场景按钮
    const returnMainButton = document.createElement('button');
    returnMainButton.textContent = '返回主界面';
    returnMainButton.style.padding = '10px 20px';
    returnMainButton.style.fontSize = '16px';
    returnMainButton.style.backgroundColor = '#732e1c';
    returnMainButton.style.color = 'white';
    returnMainButton.style.border = 'none';
    returnMainButton.style.borderRadius = '5px';
    returnMainButton.style.cursor = 'pointer';
    returnMainButton.style.marginTop = '15px';
    returnMainButton.style.transition = 'background-color 0.3s ease';
    
    returnMainButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#5f2516';
    });
    
    returnMainButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#732e1c';
    });
    
    returnMainButton.addEventListener('click', function() {
        console.log("返回主界面按钮被点击");
        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
            window.gameUtils.playSound('click-sound');
        }
        
        // 直接返回父页面（主界面）
        window.location.href = 'index.html';
    });
    
    completionContainer.appendChild(returnMainButton);
    
    gameArea.appendChild(completionContainer);
    
    // 标记场景已完成
    if (!gameState.completedSceneIds.includes(gameState.currentScene.id)) {
        gameState.completedSceneIds.push(gameState.currentScene.id);
        gameState.completedScenes++;
    }
    
    // 如果所有场景都已完成，标记全部完成
    if (gameState.completedScenes === Object.keys(gameState.scenes).length) {
        gameState.allScenesCompleted = true;
    }
}

/**
 * 显示建筑资料
 * @param {String} sceneId - 场景ID
 */
function showOriginalArchitecture(sceneId) {
    const overlay = document.createElement('div');
    overlay.className = 'original-architecture-overlay';
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';
    overlay.style.zIndex = '1000';
    
    const contentContainer = document.createElement('div');
    contentContainer.className = 'original-architecture-container';
    contentContainer.style.width = '95%';
    contentContainer.style.maxWidth = '1000px';
    contentContainer.style.height = '90vh';
    contentContainer.style.backgroundColor = 'rgba(255, 248, 230, 0.95)';
    contentContainer.style.padding = '20px';
    contentContainer.style.borderRadius = '10px';
    contentContainer.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
    contentContainer.style.textAlign = 'center';
    contentContainer.style.display = 'flex';
    contentContainer.style.flexDirection = 'column';
    
    // 设置默认的标题和内容
    let title = '宋代建筑结构';
    let imageSrc = 'assets/images/shengmudian.jpg';
    let imageAlt = '宋代建筑结构';
    let captionText = '宋代建筑构件与结构';
    let descriptionHTML = '宋代建筑是中国古代建筑发展的重要阶段，以其精巧的木构结构和装饰艺术闻名于世。<br>宋代建筑以斗拱、梁柱、屋顶等构件精心组合，形成稳固而美观的整体，体现了古代匠人的智慧与审美。其建筑技艺在《营造法式》中有详细记载，成为后世建筑的典范。';
    
    // 根据场景ID设置适当的标题和内容
    if (sceneId === 'shengmudian' || sceneId.includes('shengmudian')) {
        title = '太原晋祠圣母殿';
        imageSrc = 'assets/images/shengmudian.jpg';
        imageAlt = '太原晋祠圣母殿';
        captionText = '山西太原晋祠圣母殿';
        descriptionHTML = '晋祠圣母殿位于山西省太原市西南25公里的晋源区，建于北宋，是中国现存古代木构建筑的经典之作。<br>圣母殿是一座面阔三间、进深二间的建筑，悬山式屋顶，单檐卷棚，檐下用斗拱承托屋檐，内部空间开阔。殿内主要供奉晋王郭汾阳之母，即"圣母"。<br>这座建筑以其精美的建筑结构和雕刻艺术闻名，是研究宋代建筑风格和技术的重要实例。';
    } else if (sceneId === 'monidian' || sceneId.includes('monidian')) {
        title = '正定隆兴寺摩尼殿';
        imageSrc = 'assets/images/monidian.jpg';
        imageAlt = '正定隆兴寺摩尼殿';
        captionText = '河北正定隆兴寺摩尼殿';
        descriptionHTML = '隆兴寺摩尼殿位于河北省石家庄市正定县，建于辽代，是中国现存最为珍贵的辽代建筑之一。<br>摩尼殿为重檐歇山顶，建筑风格独特，殿内主要供奉摩尼佛（弥勒佛）。其建筑特点体现了辽代建筑的典型风格，斗拱结构精巧，为研究辽金时期建筑艺术提供了重要实物资料。<br>该殿保存至今，见证了中国北方古代建筑的发展历程，具有极高的历史、艺术和科学价值。';
    } else if (sceneId === 'yingzaofashi' || sceneId.includes('yingzaofashi')) {
        title = '营造法式';
        imageSrc = 'assets/images/yingzaofashi.jpg';
        imageAlt = '营造法式';
        captionText = '宋代建筑典籍《营造法式》';
        descriptionHTML = '《营造法式》是北宋李诫奉宋徽宗之命编撰的一部关于建筑营造的专著，完成于北宋崇宁二年（1103年）。<br>这部著作详细记录了宋代官式建筑的设计标准、构造方法、用材规格等内容，共34卷，是研究中国古代建筑不可或缺的重要文献。<br>《营造法式》首次系统阐述了"材"、"尺"的概念和模数制度，对斗拱等复杂构件进行了精确分类和规范，对中国传统建筑的发展产生了深远影响。';
    }
    
    // 创建标题
    const titleElement = document.createElement('h3');
    titleElement.textContent = title;
    titleElement.style.color = '#732e1c';
    titleElement.style.marginBottom = '10px';
    titleElement.style.fontSize = '22px';
    
    // 创建图片容器
    const imageContainer = document.createElement('div');
    imageContainer.style.flex = '1';
    imageContainer.style.overflow = 'hidden';
    imageContainer.style.position = 'relative';
    imageContainer.style.margin = '0 0 10px 0';
    imageContainer.style.borderRadius = '5px';
    imageContainer.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.2)';
    
    // 添加图片
    const image = document.createElement('img');
    image.src = imageSrc;
    image.alt = imageAlt;
    image.className = 'original-architecture-image';
    image.style.width = '100%';
    image.style.height = '100%';
    image.style.objectFit = 'contain'; // 确保图片完整显示
    image.style.display = 'block';
    
    // 图片加载失败时的处理
    image.onerror = function() {
        console.error('图片加载失败');
        imageContainer.innerHTML = `
            <div style="padding: 20px; color: #732e1c; text-align: center;">
                <p>图片加载失败</p>
                <p style="font-size: 14px; margin-top: 10px;">请确认图片路径存在：${imageSrc}</p>
            </div>
        `;
    };
    
    imageContainer.appendChild(image);
    
    const caption = document.createElement('p');
    caption.className = 'image-caption';
    caption.textContent = captionText;
    caption.style.color = '#5a3d30';
    caption.style.margin = '10px 0';
    caption.style.fontStyle = 'italic';
    caption.style.fontSize = '16px';
    
    const description = document.createElement('p');
    description.className = 'image-description';
    description.innerHTML = descriptionHTML;
    description.style.color = '#5a3d30';
    description.style.margin = '10px 0';
    description.style.lineHeight = '1.6';
    description.style.textAlign = 'left';
    description.style.fontSize = '16px';
    description.style.maxHeight = '80px';
    description.style.overflow = 'auto';
    
    const closeButton = document.createElement('button');
    closeButton.className = 'close-button';
    closeButton.textContent = '关闭';
    closeButton.style.padding = '10px 20px';
    closeButton.style.fontSize = '16px';
    closeButton.style.backgroundColor = '#a67c52';
    closeButton.style.color = 'white';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    closeButton.style.margin = '10px auto 0 auto';
    closeButton.style.display = 'block';
    closeButton.style.transition = 'background-color 0.3s ease';
    
    closeButton.addEventListener('mouseover', function() {
        this.style.backgroundColor = '#8b6b4a';
    });
    
    closeButton.addEventListener('mouseout', function() {
        this.style.backgroundColor = '#a67c52';
    });
    
    closeButton.addEventListener('click', function() {
        document.body.removeChild(overlay);
        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
            window.gameUtils.playSound('click-sound');
        }
        
        // 检查是否有上一个完成覆盖层，如果有则恢复显示
        if (window.lastCompletionOverlay) {
            console.log("恢复显示拼图完成界面");
            window.lastCompletionOverlay.style.display = 'flex';
            return;
        }
        
        // 检查是否有保存的问答完成界面容器
        if (window.lastCompletionContainer) {
            console.log("恢复显示问答完成界面");
            const { container, parent } = window.lastCompletionContainer;
            if (parent && container && !parent.contains(container)) {
                // 清空父元素并添加容器
                parent.innerHTML = '';
                parent.appendChild(container);
            }
            return;
        }
        
        // 如果没有上一个完成覆盖层，再显示恭喜界面
        // 获取游戏容器
        const container = document.getElementById('architecture-game');
        if (container) {
            // 获取当前游戏状态 - 使用全局变量或从游戏容器中获取
            const currentGameState = window.architectureGameState || {};
            
            // 确保当前场景信息存在
            if (currentGameState.currentScene && currentGameState.currentScene.id === sceneId) {
                // 显示恭喜界面
                showCompletionMessage(currentGameState, container);
            } else {
                // 如果无法获取正确的游戏状态，创建一个临时状态对象
                const tempGameState = {
                    currentScene: {
                        id: sceneId,
                        name: '建筑拼图'
                    }
                };
                showCompletionMessage(tempGameState, container);
            }
        }
    });
    
    contentContainer.appendChild(titleElement);
    contentContainer.appendChild(imageContainer);
    contentContainer.appendChild(caption);
    contentContainer.appendChild(description);
    contentContainer.appendChild(closeButton);
    overlay.appendChild(contentContainer);
    
    document.body.appendChild(overlay);
}

/**
 * 创建游戏界面
 * @param {HTMLElement} container - 游戏容器
 * @param {Object} gameState - 游戏状态
 * @returns {Object} 游戏元素对象
 */
function createGameInterface(container, gameState) {
    console.log("创建古建寻踪问答游戏界面...");
    
    // 清空容器
    container.innerHTML = '';
    
    // 创建标题
    const gameTitle = document.createElement('h2');
    gameTitle.className = 'game-title';
    gameTitle.textContent = '古建寻踪 - 建筑文化问答';
    container.appendChild(gameTitle);
    
    // 创建游戏说明
    const gameDesc = document.createElement('p');
    gameDesc.className = 'game-description';
    gameDesc.textContent = '与宋代建筑大师对话，了解《营造法式》与宋代建筑文化。';
    container.appendChild(gameDesc);
    
    // 创建建筑区域（对话、问题和结果显示区域）
    const architectureArea = document.createElement('div');
    architectureArea.className = 'architecture-area';
    architectureArea.style.position = 'relative';
    architectureArea.style.width = '900px';
    architectureArea.style.maxWidth = '900px';
    architectureArea.style.minHeight = '500px';
    architectureArea.style.margin = '20px auto';
    architectureArea.style.backgroundColor = 'rgba(255, 248, 230, 0.5)';
    architectureArea.style.border = '2px solid #a67c52';
    architectureArea.style.borderRadius = '5px';
    architectureArea.style.overflow = 'hidden';
    architectureArea.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
    container.appendChild(architectureArea);
    
    // 移除底部返回按钮，只保留界面内部的返回按钮
    
    // 返回游戏元素对象
    return { 
        gameArea: architectureArea
    };
}

/**
 * 打乱数组
 * @param {Array} array - 要打乱的数组
 */
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

/**
 * 显示建筑拼图游戏
 * @param {Object} gameState - 游戏状态
 * @param {HTMLElement} container - 游戏容器
 */
function showPuzzleGame(gameState, container) {
    console.log("显示建筑拼图游戏...");
    
    // 获取游戏区域
    const gameArea = container.querySelector('.architecture-area');
    if (!gameArea) return;
    
    // 清空游戏区域
    gameArea.innerHTML = '';
    
    // 拼图图片配置 - 替换为新的图片，调整顺序
    const puzzleImages = [
        {
            id: 'yingzaofashi',
            name: '营造法式',
            image: 'assets/images/yingzaofashi.jpg',
            pieces: 9
        },
        {
            id: 'shengmudian',
            name: '太原晋祠圣母殿',
            image: 'assets/images/shengmudian.jpg',
            pieces: 9
        },
        {
            id: 'monidian',
            name: '正定隆兴寺摩尼殿',
            image: 'assets/images/monidian.jpg',
            pieces: 9
        }
    ];
    
    // 显示选择拼图图片的界面
    function showPuzzleSelection() {
        // 创建拼图选择容器
        const selectionContainer = document.createElement('div');
        selectionContainer.className = 'puzzle-selection-container';
        selectionContainer.style.width = '100%';
        selectionContainer.style.height = '100%';
        selectionContainer.style.padding = '20px';
        selectionContainer.style.display = 'flex';
        selectionContainer.style.flexDirection = 'column';
        selectionContainer.style.alignItems = 'center';
        selectionContainer.style.justifyContent = 'center';
        selectionContainer.style.boxSizing = 'border-box';
        
        // 创建选择标题
        const selectionTitle = document.createElement('h3');
        selectionTitle.textContent = '选择拼图图片';
        selectionTitle.style.color = '#732e1c';
        selectionTitle.style.marginBottom = '20px';
        selectionTitle.style.textAlign = 'center';
        selectionContainer.appendChild(selectionTitle);
        
        // 创建选择说明
        const selectionDesc = document.createElement('p');
        selectionDesc.textContent = '请选择一张图片作为拼图素材';
        selectionDesc.style.color = '#5a3d30';
        selectionDesc.style.marginBottom = '30px';
        selectionDesc.style.textAlign = 'center';
        selectionContainer.appendChild(selectionDesc);
        
        // 创建图片选择区域
        const imagesContainer = document.createElement('div');
        imagesContainer.style.display = 'flex';
        imagesContainer.style.flexWrap = 'nowrap';
        imagesContainer.style.justifyContent = 'center';
        imagesContainer.style.gap = '40px';
        imagesContainer.style.marginBottom = '20px';
        imagesContainer.style.width = '100%';
        imagesContainer.style.maxWidth = '1000px';
        imagesContainer.style.minHeight = '300px';
        imagesContainer.style.padding = '30px';
        imagesContainer.style.backgroundColor = 'rgba(173, 216, 230, 0.5)';
        imagesContainer.style.borderRadius = '15px';
        
        // 添加图片选择卡片
        puzzleImages.forEach(puzzleImage => {
            const imageCard = document.createElement('div');
            imageCard.className = 'image-select-card';
            imageCard.style.width = '30%';
            imageCard.style.maxWidth = '220px';
            imageCard.style.padding = '15px';
            imageCard.style.backgroundColor = 'rgba(255, 255, 255, 0.8)';
            imageCard.style.border = '2px solid #a67c52';
            imageCard.style.borderRadius = '12px';
            imageCard.style.cursor = 'pointer';
            imageCard.style.transition = 'transform 0.2s ease, border-color 0.2s ease';
            imageCard.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
            
            // 图片预览
            const imagePreview = document.createElement('div');
            imagePreview.style.width = '100%';
            imagePreview.style.height = '180px';
            imagePreview.style.backgroundImage = `url('${puzzleImage.image}')`;
            imagePreview.style.backgroundSize = 'cover';
            imagePreview.style.backgroundPosition = 'center';
            imagePreview.style.borderRadius = '8px';
            imagePreview.style.marginBottom = '15px';
            imageCard.appendChild(imagePreview);
            
            // 图片标题
            const imageTitle = document.createElement('h4');
            imageTitle.textContent = puzzleImage.name;
            imageTitle.style.color = '#732e1c';
            imageTitle.style.margin = '0 0 5px 0';
            imageTitle.style.textAlign = 'center';
            imageTitle.style.fontSize = '18px';
            imageTitle.style.fontWeight = 'bold';
            imageCard.appendChild(imageTitle);
            
            // 添加悬停效果
            imageCard.addEventListener('mouseover', function() {
                this.style.transform = 'scale(1.05)';
                this.style.borderColor = '#732e1c';
            });
            
            imageCard.addEventListener('mouseout', function() {
                this.style.transform = 'scale(1)';
                this.style.borderColor = '#a67c52';
            });
            
            // 添加点击事件
            imageCard.addEventListener('click', function() {
                if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                    window.gameUtils.playSound('click-sound');
                }
                // 启动拼图游戏并传递选择的图片
                startPuzzleGame(puzzleImage);
            });
            
            imagesContainer.appendChild(imageCard);
        });
        
        selectionContainer.appendChild(imagesContainer);
        
        // 添加返回按钮
        const returnButton = document.createElement('button');
        returnButton.textContent = '返回';
        returnButton.style.padding = '10px 30px';
        returnButton.style.fontSize = '16px';
        returnButton.style.backgroundColor = '#a67c52';
        returnButton.style.color = 'white';
        returnButton.style.border = 'none';
        returnButton.style.borderRadius = '5px';
        returnButton.style.cursor = 'pointer';
        returnButton.style.marginTop = '30px';
        returnButton.style.transition = 'background-color 0.3s ease';
        
        // 添加悬停效果
        returnButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#8b6b4a';
        });
        
        returnButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#a67c52';
        });
        
        // 修改返回按钮点击事件，现在直接返回到开始页面，不再经过游戏规则页面
        returnButton.addEventListener('click', function() {
            if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                window.gameUtils.playSound('click-sound');
            }
            
            console.log('返回到游戏开始页面');
            
            // 隐藏游戏区域
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                gameArea.classList.add('hidden');
                gameArea.style.display = 'none';
                gameArea.style.visibility = 'hidden';
                gameArea.style.opacity = '0';
            }
            
            // 隐藏主页内容
            const mainPageContent = document.getElementById('main-page-content');
            if (mainPageContent) {
                mainPageContent.style.display = 'none';
            }
            
            // 显示开始游戏页面
            const startPage = document.getElementById('start-page');
            if (startPage) {
                startPage.style.display = 'flex';
            } else {
                console.error('找不到开始游戏页面元素');
                // 如果找不到开始页面，尝试回到主页
                if (typeof window.backToHome === 'function') {
                    window.backToHome();
                }
            }
        });
        
        selectionContainer.appendChild(returnButton);
        
        gameArea.appendChild(selectionContainer);
    }
    
    // 显示选择界面
    showPuzzleSelection();
    
    // 开始拼图游戏
    function startPuzzleGame(selectedPuzzle) {
        // 清空游戏区域
        gameArea.innerHTML = '';
        
        // 保存当前选择的拼图到游戏状态，以便完成后显示正确图片
        if (gameState.currentScene) {
            gameState.currentScene.currentPuzzle = selectedPuzzle.id;
        }
        
        // 创建拼图游戏容器
        const puzzleContainer = document.createElement('div');
        puzzleContainer.className = 'puzzle-container';
        puzzleContainer.style.width = '100%';
        puzzleContainer.style.height = '100%';
        puzzleContainer.style.padding = '20px';
        puzzleContainer.style.display = 'flex';
        puzzleContainer.style.flexDirection = 'column';
        puzzleContainer.style.alignItems = 'center';
        puzzleContainer.style.justifyContent = 'center';
        puzzleContainer.style.boxSizing = 'border-box';
        
        // 创建拼图游戏标题
        const puzzleTitle = document.createElement('h3');
        puzzleTitle.textContent = `宋代建筑拼图 - ${selectedPuzzle.name}`;
        puzzleTitle.style.color = '#732e1c';
        puzzleTitle.style.marginBottom = '15px';
        puzzleTitle.style.textAlign = 'center';
        puzzleContainer.appendChild(puzzleTitle);
        
        // 创建拼图游戏说明
        const puzzleDesc = document.createElement('p');
        puzzleDesc.textContent = '请点击拼图片调整位置，将散乱的图片拼成完整的宋代建筑图片';
        puzzleDesc.style.color = '#5a3d30';
        puzzleDesc.style.marginBottom = '20px';
        puzzleDesc.style.textAlign = 'center';
        puzzleContainer.appendChild(puzzleDesc);
        
        // 创建拼图游戏区域
        const puzzleGameArea = document.createElement('div');
        puzzleGameArea.className = 'puzzle-game-area';
        puzzleGameArea.style.width = '100%';
        puzzleGameArea.style.display = 'flex';
        puzzleGameArea.style.flexDirection = 'row';
        puzzleGameArea.style.justifyContent = 'space-between';
        puzzleGameArea.style.marginBottom = '20px';
        puzzleGameArea.style.position = 'relative';
        puzzleContainer.appendChild(puzzleGameArea);
        
        // 创建模板图片区域
        const templateArea = document.createElement('div');
        templateArea.className = 'template-area';
        templateArea.style.width = '40%';
        templateArea.style.marginRight = '20px';
        templateArea.style.display = 'flex';
        templateArea.style.flexDirection = 'column';
        templateArea.style.alignItems = 'center';
        
        // 添加模板图片标题
        const templateTitle = document.createElement('h4');
        templateTitle.textContent = '模板图片';
        templateTitle.style.color = '#732e1c';
        templateTitle.style.marginBottom = '10px';
        templateTitle.style.textAlign = 'center';
        templateArea.appendChild(templateTitle);
        
        // 添加模板图片
        const templateImage = document.createElement('div');
        templateImage.style.width = '300px';
        templateImage.style.height = '300px';
        templateImage.style.backgroundImage = `url('${selectedPuzzle.image}')`;
        templateImage.style.backgroundSize = 'cover';
        templateImage.style.backgroundPosition = 'center';
        templateImage.style.border = '2px solid #a67c52';
        templateImage.style.borderRadius = '5px';
        templateImage.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        templateArea.appendChild(templateImage);
        
        puzzleGameArea.appendChild(templateArea);
        
        // 创建拼图区域
        const puzzleArea = document.createElement('div');
        puzzleArea.className = 'puzzle-area';
        puzzleArea.style.width = '50%';
        puzzleArea.style.display = 'flex';
        puzzleArea.style.flexDirection = 'column';
        puzzleArea.style.alignItems = 'center';
        
        // 添加拼图区域标题
        const puzzleAreaTitle = document.createElement('h4');
        puzzleAreaTitle.textContent = '拼图区域';
        puzzleAreaTitle.style.color = '#732e1c';
        puzzleAreaTitle.style.marginBottom = '10px';
        puzzleAreaTitle.style.textAlign = 'center';
        puzzleArea.appendChild(puzzleAreaTitle);
        
        // 创建3x3网格容器
        const gridContainer = document.createElement('div');
        gridContainer.className = 'grid-container';
        gridContainer.style.display = 'grid';
        gridContainer.style.gridTemplateColumns = 'repeat(3, 1fr)';
        gridContainer.style.gridTemplateRows = 'repeat(3, 1fr)';
        gridContainer.style.gap = '2px';
        gridContainer.style.width = '300px';
        gridContainer.style.height = '300px';
        gridContainer.style.border = '2px solid #a67c52';
        gridContainer.style.borderRadius = '5px';
        gridContainer.style.backgroundColor = '#a67c52';
        gridContainer.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
        
        // 创建拼图片
        const pieces = [];
        const positions = Array.from({ length: 9 }, (_, i) => i); // [0, 1, 2, ..., 8]
        
        // 打乱拼图片顺序
        shuffleArray(positions);
        
        // 检查是否可解（偶置换）
        if (!isSolvable(positions)) {
            // 如果不可解，交换任意两个位置使其可解
            const temp = positions[0];
            positions[0] = positions[1];
            positions[1] = temp;
        }
        
        // 创建9个固定位置的div单元格
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'puzzle-cell';
            cell.style.width = '98px';
            cell.style.height = '98px';
            cell.style.position = 'relative';
            
            // 将单元格添加到网格
            gridContainer.appendChild(cell);
        }
        
        // 预加载图片以确保正确计算尺寸
        const preloadImage = new Image();
        preloadImage.onload = function() {
            // 一旦图片加载完成，创建拼图块
            createPuzzlePieces();
        };
        preloadImage.onerror = function() {
            console.error('拼图图片加载失败', selectedPuzzle.image);
            // 如果图片加载失败，仍然尝试创建拼图块，但使用背景色
            createPuzzlePieces(true);
        };
        preloadImage.src = selectedPuzzle.image;
        
        // 创建拼图块函数
        function createPuzzlePieces(useBackupColor) {
            // 生成拼图片并放入单元格
            for (let i = 0; i < 9; i++) {
                const piece = document.createElement('div');
                piece.className = 'puzzle-piece';
                piece.setAttribute('data-original-position', i); // 原始位置（正确的拼图位置）
                piece.setAttribute('data-current-position', positions[i]); // 当前位置（打乱后的位置）
                piece.setAttribute('draggable', 'true'); // 添加可拖拽属性
                
                // 设置拼图片外观
                piece.style.width = '98px';
                piece.style.height = '98px';
                piece.style.position = 'absolute';
                piece.style.top = '0';
                piece.style.left = '0';
                
                if (useBackupColor) {
                    // 如果图片加载失败，使用备用颜色
                    const colors = ['#f5deb3', '#d2b48c', '#deb887', '#bc8f8f', '#f4a460', '#8b4513', '#a0522d', '#cd853f', '#daa520'];
                    piece.style.backgroundColor = colors[i % colors.length];
                } else {
                    // 正常使用图片作为背景
                    piece.style.backgroundColor = '#f5f5f5';
                    piece.style.backgroundImage = `url('${selectedPuzzle.image}')`;
                    piece.style.backgroundSize = '300px 300px'; // 设置为网格容器的总大小
                    
                    // 计算原始背景位置 - 确保正确计算偏移
                    const row = Math.floor(i / 3);
                    const col = i % 3;
                    const xOffset = col * 100;
                    const yOffset = row * 100;
                    piece.style.backgroundPosition = `-${xOffset}px -${yOffset}px`;
                }
                
                piece.style.cursor = 'move';
                piece.style.border = '1px solid #a67c52';
                piece.style.borderRadius = '3px';
                piece.style.userSelect = 'none';
                piece.style.boxSizing = 'border-box';
                piece.style.transition = 'transform 0.2s ease';
                
                // 添加拖拽事件
                piece.addEventListener('dragstart', function(e) {
                    e.dataTransfer.setData('text/plain', this.getAttribute('data-current-position'));
                    this.style.opacity = '0.5';
                    this.style.transform = 'scale(1.1)';
                    this.style.zIndex = '1';
                });
                
                piece.addEventListener('dragend', function(e) {
                    this.style.opacity = '1';
                    this.style.transform = 'scale(1)';
                    this.style.zIndex = '0';
                });
                
                piece.addEventListener('dragover', function(e) {
                    e.preventDefault(); // 允许放置
                });
                
                piece.addEventListener('dragenter', function(e) {
                    e.preventDefault();
                    // this.style.border = '2px solid #732e1c'; // 移除边框变色
                    // this.style.transform = 'scale(1.05)'; // 移除缩放效果
                });
                
                piece.addEventListener('dragleave', function(e) {
                    // this.style.border = '1px solid #a67c52'; // 移除边框恢复
                    // this.style.transform = 'scale(1)'; // 移除缩放恢复
                });
                
                piece.addEventListener('drop', function(e) {
                    e.preventDefault();
                    
                    const fromPosition = parseInt(e.dataTransfer.getData('text/plain'));
                    const toPosition = parseInt(this.getAttribute('data-current-position'));

                    // 获取拖拽源的DOM元素和目标位置的DOM元素
                    const fromPiece = findPieceByPosition(fromPosition, gridContainer);
                    const toPiece = this; // 当前被放置的块

                    if (fromPiece && toPiece && fromPiece !== toPiece) {
                        // 1. 获取各自的父单元格 (cell)
                        const fromCell = fromPiece.parentNode;
                        const toCell = toPiece.parentNode;

                        // 2. 更新 data-current-position 属性
                        fromPiece.setAttribute('data-current-position', toPosition);
                        toPiece.setAttribute('data-current-position', fromPosition);

                        // 3. 交换DOM元素：将 toPiece 移动到 fromCell，将 fromPiece 移动到 toCell
                        fromCell.appendChild(toPiece);
                        toCell.appendChild(fromPiece);
                        
                        // 4. 更新移动次数
                        moveCount++;
                        moveCounter.textContent = `移动次数: ${moveCount}`;
                        
                        // 5. 检查是否完成
                        checkCompletion();
                    }
                });
                
                // 将拼图片添加到对应的打乱位置的单元格中
                const targetCell = gridContainer.children[positions[i]];
                targetCell.appendChild(piece);
                
                pieces.push(piece);
            }
        }
        
        puzzleArea.appendChild(gridContainer);
        puzzleGameArea.appendChild(puzzleArea);
        
        // 创建进度显示和重置按钮区域
        const controlsArea = document.createElement('div');
        controlsArea.style.marginTop = '20px';
        controlsArea.style.width = '100%';
        controlsArea.style.display = 'flex';
        controlsArea.style.flexDirection = 'column';
        controlsArea.style.alignItems = 'center';
        
        // 创建移动次数显示
        const moveCounter = document.createElement('div');
        moveCounter.className = 'move-counter';
        moveCounter.textContent = '移动次数: 0';
        moveCounter.style.fontSize = '16px';
        moveCounter.style.color = '#5a3d30';
        moveCounter.style.marginBottom = '10px';
        controlsArea.appendChild(moveCounter);
        
        // 创建重置按钮
    const resetButton = document.createElement('button');
        resetButton.textContent = '重新打乱';
        resetButton.style.padding = '10px 20px';
        resetButton.style.fontSize = '16px';
    resetButton.style.backgroundColor = '#a67c52';
    resetButton.style.color = 'white';
    resetButton.style.border = 'none';
    resetButton.style.borderRadius = '5px';
    resetButton.style.cursor = 'pointer';
        resetButton.style.marginTop = '10px';
        resetButton.style.transition = 'background-color 0.3s ease';
        
        // 添加悬停效果
        resetButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#8b6b4a';
        });
        
        resetButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#a67c52';
        });
        
        // 创建按钮容器
        const buttonsContainer = document.createElement('div');
        buttonsContainer.style.display = 'flex';
        buttonsContainer.style.justifyContent = 'center';
        buttonsContainer.style.gap = '10px'; // 添加按钮之间的间距
        buttonsContainer.appendChild(resetButton);
        
        // 添加返回按钮
        const backButton = document.createElement('button');
        backButton.textContent = '返回';
        backButton.style.padding = '10px 20px';
        backButton.style.fontSize = '16px';
        backButton.style.backgroundColor = '#a67c52';
        backButton.style.color = 'white';
        backButton.style.border = 'none';
        backButton.style.borderRadius = '5px';
        backButton.style.cursor = 'pointer';
        backButton.style.marginTop = '10px';
        backButton.style.transition = 'background-color 0.3s ease';
        
        // 添加悬停效果
        backButton.addEventListener('mouseover', function() {
            this.style.backgroundColor = '#8b6b4a';
        });
        
        backButton.addEventListener('mouseout', function() {
            this.style.backgroundColor = '#a67c52';
        });
        
        // 添加点击事件，返回到拼图选择页面
        backButton.addEventListener('click', function() {
            if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                window.gameUtils.playSound('click-sound');
            }
            
            // 直接返回到游戏开始页面
            console.log('返回到游戏开始页面');
            
            // 隐藏游戏区域
            const gameArea = document.querySelector('.game-area');
            if (gameArea) {
                gameArea.classList.add('hidden');
                gameArea.style.display = 'none';
                gameArea.style.visibility = 'hidden';
                gameArea.style.opacity = '0';
            }
            
            // 隐藏主页内容
            const mainPageContent = document.getElementById('main-page-content');
            if (mainPageContent) {
                mainPageContent.style.display = 'none';
            }
            
            // 显示开始游戏页面
            const startPage = document.getElementById('start-page');
            if (startPage) {
                startPage.style.display = 'flex';
            } else {
                console.error('找不到开始游戏页面元素');
                // 如果找不到开始页面，尝试回到主页
                if (typeof window.backToHome === 'function') {
                    window.backToHome();
                }
            }
        });
        
        // 将返回按钮添加到按钮容器
        buttonsContainer.appendChild(backButton);
        
        controlsArea.appendChild(buttonsContainer);
        
        // 移动次数计数器
        let moveCount = 0;
        
        // 重置按钮点击事件
    resetButton.addEventListener('click', function() {
            // 重新打乱拼图
            shuffleArray(positions);
            
            // 检查是否可解（偶置换）
            if (!isSolvable(positions)) {
                const temp = positions[0];
                positions[0] = positions[1];
                positions[1] = temp;
            }
            
            // 移除所有拼图片
            for (let i = 0; i < 9; i++) {
                const cell = gridContainer.children[i];
                if (cell.firstChild) {
                    cell.removeChild(cell.firstChild);
                }
            }
            
            // 重新放置拼图片
            for (let i = 0; i < 9; i++) {
                const piece = pieces[i];
                piece.setAttribute('data-current-position', positions[i]);
                gridContainer.children[positions[i]].appendChild(piece);
            }
            
            // 重置移动次数
            moveCount = 0;
            moveCounter.textContent = `移动次数: ${moveCount}`;
            
            // 播放声音效果（如果有）
        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
            window.gameUtils.playSound('click-sound');
        }
        });
        
        puzzleContainer.appendChild(controlsArea);
        
        // 判断拼图是否完成
        function checkCompletion() {
            let isComplete = true;
            
            // 检查每个拼图片是否在正确位置
            for (let i = 0; i < 9; i++) {
                const cell = gridContainer.children[i];
                if (cell.firstChild) {
                    const piece = cell.firstChild;
                    const originalPosition = parseInt(piece.getAttribute('data-original-position'));
                    
                    if (originalPosition !== i) {
                        isComplete = false;
                        break;
                    }
                } else {
                    isComplete = false;
                    break;
                }
            }
            
            if (isComplete) {
                // 拼图完成
                setTimeout(() => {
                    // 创建完成消息覆盖层
                    const completionOverlay = document.createElement('div');
                    completionOverlay.className = 'completion-overlay';
                    completionOverlay.style.position = 'fixed';
                    completionOverlay.style.top = '0';
                    completionOverlay.style.left = '0';
                    completionOverlay.style.width = '100%';
                    completionOverlay.style.height = '100%';
                    completionOverlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                    completionOverlay.style.display = 'flex';
                    completionOverlay.style.flexDirection = 'column';
                    completionOverlay.style.justifyContent = 'center';
                    completionOverlay.style.alignItems = 'center';
                    completionOverlay.style.zIndex = '9999';
                    
                    // 创建消息容器
                    const messageContainer = document.createElement('div');
                    messageContainer.style.backgroundColor = 'rgba(248, 236, 216, 0.95)';
                    messageContainer.style.padding = '30px';
                    messageContainer.style.borderRadius = '10px';
                    messageContainer.style.maxWidth = '80%';
                    messageContainer.style.width = '500px';
                    messageContainer.style.textAlign = 'center';
                    messageContainer.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.3)';
                    
                    // 创建成功消息
                    const successTitle = document.createElement('h3');
                    successTitle.textContent = '恭喜！';
                    successTitle.style.color = '#732e1c';
                    successTitle.style.fontSize = '28px';
                    successTitle.style.marginBottom = '20px';
                    messageContainer.appendChild(successTitle);
                    
                    // 创建完成图片
                    const completionImage = document.createElement('div');
                    completionImage.style.width = '200px';
                    completionImage.style.height = '150px';
                    completionImage.style.margin = '0 auto 20px auto';
                    completionImage.style.backgroundImage = `url('${selectedPuzzle.image}')`;
                    completionImage.style.backgroundSize = 'cover';
                    completionImage.style.backgroundPosition = 'center';
                    completionImage.style.border = '2px solid #a67c52';
                    completionImage.style.borderRadius = '5px';
                    completionImage.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
                    messageContainer.appendChild(completionImage);
                    
                    // 创建成功文本
                    const successText = document.createElement('p');
                    successText.textContent = '拼图完成！你成功组装了宋代建筑结构，展现了对宋代建筑的良好理解。';
                    successText.style.color = '#5a3d30';
                    successText.style.fontSize = '18px';
                    successText.style.margin = '20px 0';
                    successText.style.lineHeight = '1.5';
                    messageContainer.appendChild(successText);
                    
                    // 创建按钮容器
                    const buttonContainer = document.createElement('div');
                    buttonContainer.style.display = 'flex';
                    buttonContainer.style.justifyContent = 'center';
                    buttonContainer.style.gap = '15px';
                    buttonContainer.style.marginTop = '20px';
                    
                    // 创建查看资料按钮
                    const detailsButton = document.createElement('button');
                    detailsButton.textContent = `查看《${selectedPuzzle.name}》资料`;
                    detailsButton.style.padding = '12px 25px';
                    detailsButton.style.fontSize = '16px';
                    detailsButton.style.backgroundColor = '#a67c52';
                    detailsButton.style.color = 'white';
                    detailsButton.style.border = 'none';
                    detailsButton.style.borderRadius = '5px';
                    detailsButton.style.cursor = 'pointer';
                    detailsButton.style.transition = 'background-color 0.3s ease';
                    
                    detailsButton.addEventListener('mouseover', function() {
                        this.style.backgroundColor = '#8b6b4a';
                    });
                    
                    detailsButton.addEventListener('mouseout', function() {
                        this.style.backgroundColor = '#a67c52';
                    });
                    
                    detailsButton.addEventListener('click', function() {
                        console.log("查看资料按钮被点击");
                        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                            window.gameUtils.playSound('click-sound');
                        }
                        
                        // 根据拼图图片ID确定要显示的资料
                        let sceneId;
                        if (selectedPuzzle.id === 'shengmudian') {
                            sceneId = 'shengmudian'; // 圣母殿
                        } else if (selectedPuzzle.id === 'yingzaofashi') {
                            sceneId = 'yingzaofashi'; // 营造法式
                        } else if (selectedPuzzle.id === 'monidian') {
                            sceneId = 'monidian'; // 摩尼殿
                        }
                        
                        // 暂时隐藏完成覆盖层，但不移除它，这样关闭资料后还能显示
                        completionOverlay.style.display = 'none';
                        
                        // 设置当前场景信息到游戏状态，确保资料关闭后能返回恭喜界面
                        if (gameState.currentScene) {
                            // 保存原来的场景ID以便查看资料后恢复
                            window.lastCompletionOverlay = completionOverlay;
                        }
                        
                        // 显示相应的建筑资料
                        showOriginalArchitecture(sceneId);
                        
                        // 标记场景已完成
                        if (!gameState.completedSceneIds.includes(gameState.currentScene.id)) {
                            gameState.completedSceneIds.push(gameState.currentScene.id);
                            gameState.completedScenes++;
                        }
                    });
                    
                    buttonContainer.appendChild(detailsButton);
                    
                    // 添加返回主界面按钮
                    const returnMainButton = document.createElement('button');
                    returnMainButton.textContent = '返回主界面';
                    returnMainButton.style.padding = '12px 25px';
                    returnMainButton.style.fontSize = '16px';
                    returnMainButton.style.backgroundColor = '#732e1c';
                    returnMainButton.style.color = 'white';
                    returnMainButton.style.border = 'none';
                    returnMainButton.style.borderRadius = '5px';
                    returnMainButton.style.cursor = 'pointer';
                    returnMainButton.style.transition = 'background-color 0.3s ease';
                    
                    returnMainButton.addEventListener('mouseover', function() {
                        this.style.backgroundColor = '#5f2516';
                    });
                    
                    returnMainButton.addEventListener('mouseout', function() {
                        this.style.backgroundColor = '#732e1c';
                    });
                    
                    returnMainButton.addEventListener('click', function() {
                        console.log("返回主界面按钮被点击");
                        if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                            window.gameUtils.playSound('click-sound');
                        }
                        
                        // 直接返回父页面（主界面）
                        window.location.href = 'riindex.html';
                    });
                    
                    buttonContainer.appendChild(returnMainButton);
                    
                    messageContainer.appendChild(buttonContainer);
                    
                    // 添加消息容器到覆盖层
                    completionOverlay.appendChild(messageContainer);
                    
                    // 添加覆盖层到body，确保它覆盖整个页面
                    document.body.appendChild(completionOverlay);
                    
                    // 播放成功音效
                    if (window.gameUtils && typeof window.gameUtils.playSound === 'function') {
                        window.gameUtils.playSound('success-sound');
                    }
                }, 500);
            }
        }
        
        // 根据位置查找拼图片
        function findPieceByPosition(position, container) {
            // 位置对应的单元格
            const cell = container.children[position];
            // 返回单元格中的拼图片
            return cell.firstChild;
        }
        
        gameArea.appendChild(puzzleContainer);
    }
    
    // 判断拼图是否可解
    function isSolvable(positions) {
        // 计算逆序数
        let inversions = 0;
        for (let i = 0; i < positions.length; i++) {
            for (let j = i + 1; j < positions.length; j++) {
                if (positions[i] > positions[j]) {
                    inversions++;
                }
            }
        }
        
        // 3x3拼图可解的条件：逆序数为偶数
        return inversions % 2 === 0;
    }
}

// 如果在模块环境中，导出函数
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initArchitectureGame };
}