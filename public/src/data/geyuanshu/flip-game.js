document.addEventListener('DOMContentLoaded', function() {
    // 游戏状态
    let gameState = {
        cards: [],
        selectedCard: null,
        matchedPairs: 0,
        totalPairs: 8,
        gameStarted: false,
        canFlip: true,
        flipCount: 0,
        matchedItems: [] // 记录已匹配的瓷器
    };
    
    // DOM元素缓存
    const elements = {
        gameBoard: document.getElementById('gameBoard'),
        herbInfo: document.getElementById('herbInfo'),
        pairsLeft: document.getElementById('pairsLeft'),
        flipCount: document.getElementById('flipCount'),
        gameOver: document.getElementById('gameOver'),
        restartBtn: document.getElementById('restartBtn'),
        prescriptionHerbs: document.getElementById('prescriptionHerbs'),
        prescriptionEffect: document.getElementById('prescriptionEffect'),
        guideModal: document.getElementById('guideModal'),
        guideContinueBtn: document.getElementById('guideContinueBtn'),
        showGuideBtn: document.getElementById('showGuideBtn'),
        mainContainer: document.querySelector('.container')
    };
    
    // 检查必要元素是否存在
    for (const [key, element] of Object.entries(elements)) {
        if (!element) {
            console.error(`无法找到${key}元素`);
            return;
        }
    }
    
    // 检查porcelainData是否存在
    if (typeof porcelainData === 'undefined') {
        console.error('无法找到porcelainData数据，请确保flip-data.js已正确加载');
        return;
    }
    
    // 固定的卡片布局
    const fixedLayout = [
        // 第一行
        { id: 1, name: "汝窑天青釉葵花形笔洗" },
        { id: 2, name: "南宋官窑琮式瓶" },
        { id: 3, name: "定窑白釉印花双鱼洗" },  
        { id: 4, name: "耀州窑青釉刻花提梁兽首三足壶" },
        // 第二行
        { id: 5, name: "钧窑玫瑰紫釉花盆" },
        { id: 1, name: "汝窑天青釉葵花形笔洗" },
        { id: 6, name: "景德镇窑青白瓷风首壶" },
        { id: 2, name: "南宋官窑琮式瓶" },
        // 第三行
        { id: 7, name: "建窑黑釉兔毫盏" },
        { id: 3, name: "定窑白釉印花双鱼洗" },  
        { id: 8, name: "磁州窑黑剔花龙纹长颈瓶" },
        { id: 5, name: "钧窑玫瑰紫釉花盆" },
        // 第四行
        { id: 4, name: "耀州窑青釉刻花提梁兽首三足壶" },
        { id: 6, name: "景德镇窑青白瓷风首壶" },
        { id: 7, name: "建窑黑釉兔毫盏" },
        { id: 8, name: "磁州窑黑剔花龙纹长颈瓶" }
    ];
    
    // 初始只显示玩法解读弹窗，隐藏主内容
    elements.mainContainer.style.display = 'none';
    elements.guideModal.style.display = 'flex';
    elements.showGuideBtn.style.display = 'none';

    // 弹窗按钮事件
    elements.guideContinueBtn.onclick = function() {
        elements.guideModal.style.display = 'none';
        elements.mainContainer.style.display = '';
        elements.showGuideBtn.style.display = '';
        // 直接显示所有卡片，不使用渐变效果
        const cards = document.querySelectorAll('.card');
        cards.forEach(card => {
            card.style.opacity = 1;
        });
    };
    
    elements.showGuideBtn.onclick = function() {
        elements.guideModal.style.display = 'flex';
        elements.showGuideBtn.style.display = 'none';
        elements.mainContainer.style.display = 'none';
    };
    
    // 初始化游戏
    function initGame() {
        // 清空游戏板
        elements.gameBoard.innerHTML = '';
        elements.gameBoard.appendChild(elements.gameOver);
        elements.gameOver.style.display = 'none';
        
        // 重置游戏状态
        gameState.cards = [];
        gameState.selectedCard = null;
        gameState.matchedPairs = 0;
        gameState.canFlip = true;
        gameState.flipCount = 0;
        gameState.matchedItems = [];
        
        // 创建卡片数据
        createFixedCards();
        
        // 更新UI
        updatePairsLeft();
        updateFlipCount();
        
        // 显示初始信息
        elements.herbInfo.innerHTML = `
            <h3>🏺 瓷器知识 🏺</h3>
            <p>点击卡片翻面，找到两张相同的瓷器卡片进行消除。</p>
            <p>记住卡片的位置，尽量用最少的步数完成游戏！</p>
        `;
        
        gameState.gameStarted = true;
    }
    
    // 创建固定布局的卡片
    function createFixedCards() {
        // 创建卡片文档片段，提高性能
        const fragment = document.createDocumentFragment();
        const rows = 4, cols = 4;
        
        // 调整游戏板样式为4x4网格
        elements.gameBoard.style.gridTemplateColumns = 'repeat(4, 1fr)';
        elements.gameBoard.style.gridTemplateRows = 'repeat(4, 1fr)';
        
        // 放置卡片到游戏板
        for (let index = 0; index < fixedLayout.length; index++) {
            const cardInfo = fixedLayout[index];
            const porcelainItem = porcelainData.find(item => item.id === cardInfo.id);
            
            if (!porcelainItem) {
                console.error('无法找到对应的瓷器数据:', cardInfo);
                continue;
            }
            
            // 创建卡片DOM元素
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.row = Math.floor(index / cols);
            card.dataset.col = index % cols;
            card.dataset.id = porcelainItem.id;
            card.dataset.name = porcelainItem.name;
            
            // 创建卡片正面（背面朝上）
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            
            // 使用本地图片作为卡片封面
            const coverImg = document.createElement('img');
            coverImg.src = '/src/data/geyuanshu/card-cover.jpg';
            coverImg.alt = '宋代瓷器';
            coverImg.className = 'card-cover-img';
            coverImg.loading = 'lazy'; // 延迟加载图片
            
            // 添加图片加载错误处理
            coverImg.onerror = function() {
                this.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="150" viewBox="0 0 100 150"><rect width="100%" height="100%" fill="#8B4513"/><text x="50%" y="50%" font-family="Arial" font-size="12" fill="white" text-anchor="middle">宋代瓷器</text></svg>';
            };
            
            // 添加装饰性花纹和图标到封面
            const cardIcon = document.createElement('div');
            cardIcon.className = 'card-icon';
            cardIcon.innerHTML = '🎴';
            
            cardFront.appendChild(coverImg);
            cardFront.appendChild(cardIcon);
            
            // 创建卡片背面（瓷器图片和名称）
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            
            const img = document.createElement('img');
            img.src = '/src/data/geyuanshu/' + porcelainItem.image;
            img.alt = porcelainItem.name;
            img.loading = 'lazy'; // 延迟加载图片
            
            img.onerror = function() {
                this.style.display = 'none';
                const textElement = document.createElement('div');
                textElement.style.width = '100%';
                textElement.style.height = '70%';
                textElement.style.display = 'flex';
                textElement.style.alignItems = 'center';
                textElement.style.justifyContent = 'center';
                textElement.style.backgroundColor = '#f8f3e6';
                textElement.style.color = '#8B4513';
                textElement.style.fontWeight = 'bold';
                textElement.textContent = porcelainItem.name;
                this.parentNode.insertBefore(textElement, this);
            };
            
            // 添加瓷器名称到卡片背面
            const itemName = document.createElement('div');
            itemName.className = 'herb-name';
            itemName.textContent = porcelainItem.name;
            
            cardBack.appendChild(img);
            cardBack.appendChild(itemName);
            
            // 添加到卡片
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            // 添加点击事件
            card.addEventListener('click', handleCardClick);
            
            fragment.appendChild(card);
            gameState.cards.push({
                element: card,
                id: porcelainItem.id,
                name: porcelainItem.name,
                image: porcelainItem.image,
                description: porcelainItem.description,
                row: Math.floor(index / cols),
                col: index % cols,
                flipped: false,
                matched: false,
                position: index
            });
        }
        
        // 一次性添加所有卡片到DOM，减少重排
        elements.gameBoard.appendChild(fragment);
    }
    
    // 处理卡片点击
    function handleCardClick(event) {
        if (!gameState.gameStarted || !gameState.canFlip) return;
        
        const card = event.currentTarget;
        const cardIndex = gameState.cards.findIndex(c => c.element === card);
        const cardData = gameState.cards[cardIndex];
        
        // 如果卡片已经翻开或已匹配，则忽略
        if (cardData.flipped || cardData.matched) return;
        
        // 翻转卡片
        flipCard(cardData);
        
        // 增加翻牌次数
        gameState.flipCount++;
        updateFlipCount();
        
        // 如果没有选中的卡片，则选中当前卡片
        if (!gameState.selectedCard) {
            gameState.selectedCard = cardData;
            return;
        }
        
        // 检查是否匹配
        if (gameState.selectedCard.id === cardData.id) {
            // 匹配成功
            setTimeout(() => {
                markAsMatched(gameState.selectedCard);
                markAsMatched(cardData);
                
                // 显示瓷器信息
                displayPorcelainInfo(cardData);
                
                // 记录已匹配的瓷器
                if (!gameState.matchedItems.some(item => item.name === cardData.name)) {
                    gameState.matchedItems.push({
                        name: cardData.name,
                        image: cardData.image,
                        description: cardData.description
                    });
                }
                
                // 增加匹配对数
                gameState.matchedPairs++;
                updatePairsLeft();
                
                // 重置选中的卡片
                gameState.selectedCard = null;
                gameState.canFlip = true;
                
                // 检查游戏是否结束
                if (gameState.matchedPairs === gameState.totalPairs) {
                    setTimeout(showGameOver, 300);
                }
            }, 300);
        } else {
            // 匹配失败，翻回去
            gameState.canFlip = false;
            setTimeout(() => {
                flipCard(gameState.selectedCard, false);
                flipCard(cardData, false);
                gameState.selectedCard = null;
                gameState.canFlip = true;
            }, 700);
        }
    }
    
    // 翻转卡片
    function flipCard(cardData, flipped = true) {
        cardData.flipped = flipped;
        if (flipped) {
            cardData.element.classList.add('flipped');
        } else {
            cardData.element.classList.remove('flipped');
        }
    }
    
    // 标记卡片为已匹配
    function markAsMatched(cardData) {
        cardData.matched = true;
        cardData.element.classList.add('matched');
        setTimeout(() => {
            cardData.element.style.visibility = 'hidden';
        }, 500);
    }
    
    // 显示瓷器信息
    function displayPorcelainInfo(cardData) {
        elements.herbInfo.innerHTML = `
            <h3>🏺 ${cardData.name} 🏺</h3>
            <img src="/src/data/geyuanshu/${cardData.image}" alt="${cardData.name}" loading="lazy">
            <p>${cardData.description}</p>
        `;
    }
    
    // 更新剩余配对数
    function updatePairsLeft() {
        elements.pairsLeft.textContent = gameState.totalPairs - gameState.matchedPairs;
    }
    
    // 更新翻牌次数
    function updateFlipCount() {
        elements.flipCount.textContent = gameState.flipCount;
    }
    
    // 显示游戏结束和瓷器分类
    function showGameOver() {
        // 清空瓷器展示区域
        elements.prescriptionHerbs.innerHTML = '';
        elements.prescriptionEffect.innerHTML = '';
        
        // 使用文档片段优化DOM操作
        const itemsFragment = document.createDocumentFragment();
        
        // 添加已匹配的瓷器
        gameState.matchedItems.forEach((item, index) => {
            const itemElement = document.createElement('div');
            itemElement.className = 'prescription-herb';
            
            const img = document.createElement('img');
            img.src = '/src/data/geyuanshu/' + item.image;
            img.alt = item.name;
            img.loading = 'lazy';
            
            img.onerror = function() {
                this.style.display = 'none';
                itemElement.style.backgroundColor = '#f8f3e6';
                itemElement.style.padding = '5px';
            };
            
            const span = document.createElement('span');
            span.textContent = item.name;
            
            itemElement.appendChild(img);
            itemElement.appendChild(span);
            itemsFragment.appendChild(itemElement);
        });
        
        elements.prescriptionHerbs.appendChild(itemsFragment);
        
        // 显示瓷器分类信息
        if (outfits && outfits.length > 0) {
            const porcelainOutfit = outfits[0]; // 使用第一个分类
            
            // 使用文档片段优化DOM操作
            const effectFragment = document.createDocumentFragment();
            
            // 创建分类标题
            const titleDiv = document.createElement('div');
            titleDiv.className = 'prescription-title';
            titleDiv.textContent = `✨ 分类名称：${porcelainOutfit.name} ✨`;
            effectFragment.appendChild(titleDiv);
            
            // 创建分类描述
            const effectDiv = document.createElement('div');
            effectDiv.className = 'prescription-effect-text';
            effectDiv.textContent = porcelainOutfit.effect;
            effectFragment.appendChild(effectDiv);
            
            elements.prescriptionEffect.appendChild(effectFragment);
        } else {
            const errorDiv = document.createElement('div');
            errorDiv.textContent = '恭喜完成游戏！';
            elements.prescriptionEffect.appendChild(errorDiv);
        }
        
        // 显示游戏结束界面
        elements.gameOver.style.display = 'flex';
    }
    
    // 重新开始游戏按钮事件
    elements.restartBtn.addEventListener('click', function() {
        initGame();
    });
    
    // 初始化游戏
    initGame();
});