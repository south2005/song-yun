/**
 * 宋韵流芳 - 对话系统
 * 管理苏轼和黄庭坚的对话、任务分配和进度跟踪
 */

// NPC角色数据
const npcData = {
    'scholar': {
        name: '苏轼',
        title: '北宋文学家、书法家',
        image: 'assets/images/calligrapher.jpg',
        description: '北宋文学家、书法家，与黄庭坚、米芾、蔡襄并称"宋四家"。',
        dialogues: [
            {
                speaker: '苏轼',
                text: '云梦的后人，欢迎你穿越时空来到宋代。你对我的诗词画作可有兴趣？',
                options: null
            },
            {
                speaker: '云梦人',
                text: '苏轼先生，能与您相遇是我的荣幸！您的《水调歌头》和《赤壁赋》在我们现代依然广为流传，我很喜欢您的作品。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '你知道我的词作，真是难得。我写《水调歌头》时，正值中秋望月，思念远方亲人，情不自禁寄情于笔墨。',
                options: null
            },
            {
                speaker: '云梦人',
                text: '您的"但愿人长久，千里共婵娟"成为千古绝唱，表达了人间最美好的祝愿。现代人仍在中秋时吟诵这首词，感受您的情怀。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '不曾想我的词作能流传至此。我一生起伏不定，宦海沉浮，但诗词丹青常是我排遣心中郁结之物。你可了解我的作品？',
                options: null
            },
            {
                speaker: '云梦人',
                text: '当然了解！您的《寒食帖》被誉为"天下第三行书"，您的书法圆润灵动，自成一派，被后世称为"苏体"。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '你知之甚详。我写《寒食帖》时，心系亡弟子由，笔下自然流露真情。诗书画皆是文人抒发情感的载体，三者相辅相成。',
                options: null
            },
            {
                speaker: '云梦人',
                text: '在现代，我们依然推崇您"诗中有画，画中有诗"的艺术理念。您的山水画风格潇洒奔放，与您的诗词一样，充满豪放与智慧。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '见画如见人，画要神似而不必形似。我常以为，文人的艺术追求应是"神游天地之间，不为物役"，表达自己的心性与情怀。',
                options: null
            },
            {
                speaker: '云梦人',
                text: '苏先生，既然我们聊到了您的《寒食帖》，我很想挑战一下自己的眼力，看看能否辨别真伪。您愿意考验我一番吗？',
                options: [
                    {
                        text: '我愿意接受挑战',
                        nextAction: 'startCalligraphyGame'
                    }
                ]
            }
        ],
        completionDialogue: '太棒了！你真有慧眼。《寒食帖》字里行间融入了情感，成为宋代书法的代表作品之一。现在让我为你展示这幅作品的全貌，感受其中的书法魅力。',
        task: {
            type: 'calligraphy',
            source: '寒食帖',
            difficulty: 1
        },
        facts: [
            '《寒食帖》的全称是《寒食帖诗》，共37行，232字。',
            '这件作品被誉为"天下第三行书"，仅次于王羲之的《兰亭序》和颜真卿的《祭侄文稿》。',
            '苏轼的书法追求自然天成，被称为"苏体"，对后世影响深远。'
        ]
    },
    'calligrapher': {
        name: '云梦人',
        title: '现代访客',
        image: 'assets/images/calligrapher.jpg',
        description: '来自现代的访客，对宋代文化和苏轼的诗词书画有着浓厚兴趣。',
        dialogues: [
            {
                speaker: '云梦人',
                text: '苏先生，能与您面对面交流是我的荣幸。您的《赤壁赋》中"大江东去，浪淘尽，千古风流人物"令后世无数读者为之动容。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '你熟读我的作品，难得。那赋作于元丰四年，我在黄州任职时，与朋友泛舟赤壁，借古抒怀所作。',
                options: null
            },
            {
                speaker: '云梦人',
                text: '您的诗词不仅文采斐然，更蕴含深厚的人生哲理。"人有悲欢离合，月有阴晴圆缺，此事古难全"，道出了生活的真谛。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '我一生坎坷，屡遭贬谪，但未曾放弃对生活的热爱。诗词丹青常是我的精神寄托。你对我的画作可有了解？',
                options: null
            },
            {
                speaker: '云梦人',
                text: '当然！您的"枯木怪石图"开创了文人画的新风格，讲求"妙在似与不似之间"。您的绘画被誉为蕴含诗意的画作。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '你说得不错。我常言：诗画本一律，天工与清新。绘画如作诗，贵在表达内心，不必拘泥于形似。',
                options: null
            },
            {
                speaker: '云梦人',
                text: '在现代，我们仍然从您的艺术中汲取灵感。您融合诗书画为一体的艺术理念，成为中国文人艺术的典范。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '文人之道，在于读万卷书，行万里路。只有胸中有丘壑，笔下才能生山川。你对我的书法可有研究？',
                options: null
            },
            {
                speaker: '云梦人',
                text: '您的《寒食帖》是我最爱的书法作品之一，字里行间流露真情，笔法灵动而不失沉稳，被誉为天下第三行书。',
                options: null
            },
            {
                speaker: '苏轼',
                text: '看来你对我的作品确实了解深入。既然提到《寒食帖》，不如让我考验一下你的眼力，看看你能否辨别真迹与赝品？',
                options: [
                    {
                        text: '我愿意接受挑战',
                        nextAction: 'startCalligraphyGame'
                    }
                ]
            }
        ],
        completionDialogue: '慧眼如炬！您真是文化传承的使者，对苏轼的书法艺术有如此深入的了解。让我们一起欣赏《寒食帖》的全貌，感受宋代书法的独特魅力。',
        task: {
            type: 'calligraphy',
            source: '寒食帖',
            difficulty: 2
        },
        facts: [
            '苏轼的《寒食帖》被誉为"天下第三行书"，仅次于王羲之的《兰亭序》和颜真卿的《祭侄文稿》。',
            '苏轼的"诗中有画，画中有诗"艺术理念对后世影响深远。',
            '《寒食帖》写于苏轼被贬黄州期间，字里行间流露出对亡弟的思念之情。'
        ]
    }
};

// 书法知识库
const calligraphyKnowledge = [
    {
        title: '宋代书法的特点',
        content: '宋代书法在继承唐代法度的基础上，追求平淡天真、自然率真的风格。相比于唐代书法的规整雄浑，宋代书法更加注重个性表达和文人气息，将书法与文学、绘画紧密结合，形成了独特的艺术风格。'
    },
    {
        title: '宋四家',
        content: '宋代书法的代表人物是"宋四家"，即苏轼、黄庭坚、米芾和蔡襄。他们各具特色：苏轼的书法圆润灵动，黄庭坚的书法瘦硬方正，米芾的行书天真烂漫，蔡襄的书法端庄秀丽。'
    },
    {
        title: '《寒食帖》',
        content: '《寒食帖》是苏轼的代表作，被誉为"天下第三行书"。这篇作品写于绍圣元年(1094年)，表达了苏轼对亡弟苏辙的思念之情。全帖共37行，232字，笔法流畅自然，情感真挚。'
    },
    {
        title: '宋代书法与文人精神',
        content: '宋代书法与文人精神密不可分，书法不仅是技艺，更是人格与学问的体现。宋代文人追求"内美"，将个人情感与思想寄托于书法艺术中，形成了独特的文人书法传统。'
    },
    {
        title: '《松风阁诗帖》',
        content: '《松风阁诗帖》是黄庭坚的代表作品之一，展现了其"瘦硬方正"的独特书风。黄庭坚主张"书外求书"，融合多家之长，形成了自己的艺术风格。此帖结字严谨，笔力遒劲，布白匠心独具。'
    }
];

// 全局对话状态
let dialogueState = {
    currentNpcId: 'scholar',
    currentDialogueIndex: 0,
    dialogueCompleted: false,
    showOptions: false
};

// 初始化对话系统
function initDialogueSystem() {
    console.log("开始初始化对话系统");
    // 重置对话状态
    dialogueState = {
        currentNpcId: window.gameState && window.gameState.currentNpc ? window.gameState.currentNpc : 'scholar',
        currentDialogueIndex: 0,
        dialogueCompleted: false,
        showOptions: false
    };
    
    // 确保gameState存在
    if (!window.gameState) {
        window.gameState = {
            currentNpc: 'scholar',
            completedTasks: [],
            dialogueProgress: 0
        };
    }
    
    // 更新当前NPC信息
    updateNpcInfo();
    
    // 显示当前对话
    showCurrentDialogue();
    
    // 绑定事件
    bindDialogueEvents();
    
    console.log("对话系统已初始化，当前NPC:", dialogueState.currentNpcId);
}

// 更新当前NPC信息
function updateNpcInfo() {
    const npc = npcData[dialogueState.currentNpcId];
    
    if (npc) {
        // 更新NPC图像
        const npcImage = document.getElementById('current-npc');
        if (npcImage) {
            npcImage.src = npc.image;
            npcImage.alt = npc.name;
        }
    }
}

// 显示当前对话
function showCurrentDialogue() {
    const npc = npcData[dialogueState.currentNpcId];
    
    if (!npc || dialogueState.currentDialogueIndex >= npc.dialogues.length) {
        console.error("未找到当前NPC数据或对话索引超出范围");
        return;
    }
    
    console.log(`显示对话: NPC=${dialogueState.currentNpcId}, 索引=${dialogueState.currentDialogueIndex}`);
    
    const currentDialogue = npc.dialogues[dialogueState.currentDialogueIndex];
    console.log("当前对话:", currentDialogue);
    
    const leftText = document.getElementById('left-text');
    const rightText = document.getElementById('right-text');
    const leftSpeaker = document.getElementById('left-speaker');
    const rightSpeaker = document.getElementById('right-speaker');
    const continueBtn = document.getElementById('continue-btn');
    
    // 调试元素
    console.log("对话元素:", {
        leftText: leftText ? "找到" : "未找到",
        rightText: rightText ? "找到" : "未找到",
        leftSpeaker: leftSpeaker ? "找到" : "未找到",
        rightSpeaker: rightSpeaker ? "找到" : "未找到",
        continueBtn: continueBtn ? "找到" : "未找到"
    });
    
    // 首先隐藏所有说话者标识
    if (leftSpeaker) leftSpeaker.style.display = 'none';
    if (rightSpeaker) rightSpeaker.style.display = 'none';
    
    // 首先清除现有文本
    if (leftText) leftText.textContent = '';
    if (rightText) rightText.textContent = '';
    
    // 根据说话者显示对话
    if (currentDialogue.speaker === '苏轼') {
        // 显示左侧对话
        if (leftText) {
            leftText.textContent = currentDialogue.text;
            leftText.style.display = 'block';
        }
        if (rightText) rightText.style.display = 'none';
        
        // 显示左侧说话者标识
        if (leftSpeaker) leftSpeaker.style.display = 'block';
        
        // 高亮说话者
        highlightSpeakingNPC('苏轼');
    } else if (currentDialogue.speaker === '云梦人') {
        // 显示右侧对话
        if (rightText) {
            rightText.textContent = currentDialogue.text;
            rightText.style.display = 'block';
        }
        if (leftText) leftText.style.display = 'none';
        
        // 显示右侧说话者标识
        if (rightSpeaker) rightSpeaker.style.display = 'block';
        
        // 高亮说话者
        highlightSpeakingNPC('云梦人');
    } else if (currentDialogue.speaker === '黄庭坚') {
        // 显示右侧对话
        if (rightText) {
            rightText.textContent = currentDialogue.text;
            rightText.style.display = 'block';
        }
        if (leftText) leftText.style.display = 'none';
        
        // 显示右侧说话者标识
        if (rightSpeaker) rightSpeaker.style.display = 'block';
        
        // 高亮说话者
        highlightSpeakingNPC('云梦人');
    }
    
    // 检查是否是最后一条对话并且有选项
    if (dialogueState.currentDialogueIndex === npc.dialogues.length - 1 && currentDialogue.options) {
        // 最后一条对话且有选项，自动触发进入游戏
        if (currentDialogue.options.some(option => option.nextAction === 'startCalligraphyGame')) {
            // 隐藏继续按钮
            if (continueBtn) {
                continueBtn.style.display = 'none';
            }
            
            // 设置延时，让用户看完最后一句对话后自动进入游戏
            setTimeout(() => {
                startCalligraphyGame();
            }, 2000);
            return;
        }
    }
    
    // 显示继续按钮
    if (continueBtn) {
        continueBtn.style.display = 'block';
    }
}

// 处理选项选择
function handleOptionSelection(optionIndex) {
    const npc = npcData[dialogueState.currentNpcId];
    
    if (!npc || dialogueState.currentDialogueIndex >= npc.dialogues.length) {
        console.error("未找到当前NPC数据或对话索引超出范围");
        return;
    }
    
    const currentDialogue = npc.dialogues[dialogueState.currentDialogueIndex];
    
    if (currentDialogue.options && currentDialogue.options[optionIndex]) {
        const selectedOption = currentDialogue.options[optionIndex];
        console.log("选择选项:", optionIndex, selectedOption);
        
        // 执行选项对应的操作
        if (selectedOption.nextAction === 'startCalligraphyGame') {
            console.log("选择了挑战选项，即将进入找茬游戏");
            // 立即进入找茬游戏
            startCalligraphyGame();
        } else {
            console.log("选择了普通选项，继续对话");
            // 其他操作...
            // 前进到下一条对话
            moveToNextDialogue();
        }
    }
}

// 前进到下一条对话
function moveToNextDialogue() {
    dialogueState.currentDialogueIndex++;
    
    const npc = npcData[dialogueState.currentNpcId];
    if (npc && dialogueState.currentDialogueIndex < npc.dialogues.length) {
        // 还有更多对话，显示下一条
        showCurrentDialogue();
    } else {
        // 对话结束，进入找茬游戏
        dialogueState.dialogueCompleted = true;
        startCalligraphyGame();
    }
}

/**
 * 启动书法找茬游戏
 */
function startCalligraphyGame() {
    console.log("启动书法找茬游戏...");
    
    // 获取当前NPC的任务信息
    const currentNpc = npcData[dialogueState.currentNpcId];
    
    if (!currentNpc || !currentNpc.task) {
        console.error("当前NPC没有有效的任务数据");
        return;
    }
    
    // 记录当前NPC到全局状态
    window.gameState.currentNpc = dialogueState.currentNpcId;
    window.gameState.pendingGameType = 'calligraphy';
    
    console.log(`准备启动${currentNpc.task.source}找茬任务...`);
    
    // 首先隐藏对话场景，确保不会有显示冲突
    const dialogueScene = document.getElementById('dialogue-scene');
    if (dialogueScene) {
        dialogueScene.classList.add('hidden');
        dialogueScene.style.display = 'none';
        dialogueScene.style.visibility = 'hidden';
        dialogueScene.style.opacity = '0';
    }
    
    // 确保找茬游戏容器是空的
    const calligraphyGame = document.getElementById('calligraphy-game');
    if (calligraphyGame) {
        console.log("清空找茬游戏容器，准备初始化");
        calligraphyGame.innerHTML = '';
    }
    
    // 直接在这里显示找茬游戏，不依赖setTimeout
    try {
        // 使用全局函数切换到找茬游戏
        if (typeof startGame === 'function') {
            console.log("调用startGame('calligraphy')");
            startGame('calligraphy');
        } else if (window.startGame) {
            console.log("调用window.startGame('calligraphy')");
            window.startGame('calligraphy');
        } else {
            console.error("找不到startGame函数，尝试直接显示找茬游戏内容");
            // 如果找不到startGame函数，尝试直接显示找茬游戏内容
            const gameContent = document.querySelectorAll('.game-content');
            gameContent.forEach(content => {
                content.classList.add('hidden');
                content.style.display = 'none';
                content.style.visibility = 'hidden';
                content.style.opacity = '0';
            });
            
            if (calligraphyGame) {
                calligraphyGame.classList.remove('hidden');
                calligraphyGame.style.display = 'block';
                calligraphyGame.style.visibility = 'visible';
                calligraphyGame.style.opacity = '1';
                
                // 初始化找茬游戏
                if (typeof window.initCalligraphyGame === 'function') {
                    console.log("调用window.initCalligraphyGame()");
                    window.initCalligraphyGame();
                } else if (typeof initCalligraphyGame === 'function') {
                    console.log("调用initCalligraphyGame()");
                    initCalligraphyGame();
                } else {
                    console.error("找不到initCalligraphyGame函数");
                    alert("游戏加载出错，请刷新页面重试");
                }
            } else {
                console.error("找不到找茬游戏容器");
            }
        }
    } catch (error) {
        console.error("启动找茬游戏出错:", error);
        alert("启动游戏出错，请刷新重试");
    }
}

// 任务完成后的对话回调
function onTaskComplete(npcId) {
    const npc = npcData[npcId || dialogueState.currentNpcId];
    
    if (npc) {
        // 切换回对话场景
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
        
        // 更新对话内容为任务完成对话
        const leftText = document.getElementById('left-text');
        const rightText = document.getElementById('right-text');
        const leftSpeaker = document.getElementById('left-speaker');
        const rightSpeaker = document.getElementById('right-speaker');
        
        // 清除现有动画类
        if (leftText) {
            leftText.classList.remove('text-appear');
            leftText.textContent = '';
        }
        if (rightText) {
            rightText.classList.remove('text-appear');
            rightText.textContent = '';
        }
        
        // 重置说话者标识
        if (leftSpeaker) leftSpeaker.style.display = 'none';
        if (rightSpeaker) rightSpeaker.style.display = 'none';
        
        // 等待短暂时间后显示对话
        setTimeout(() => {
            // 根据当前NPC确定发言人
            const speakerName = npc.name;
            
            if (speakerName === '苏轼') {
                // 苏轼说话
                if (leftText) {
                    leftText.textContent = npc.completionDialogue;
                    // 添加出现动画
                    setTimeout(() => {
                        leftText.classList.add('text-appear');
                    }, 10);
                }
                
                // 显示苏轼标识
                if (leftSpeaker) leftSpeaker.style.display = 'block';
            } else if (speakerName === '黄庭坚') {
                // 黄庭坚说话
                if (rightText) {
                    rightText.textContent = npc.completionDialogue;
                    // 添加出现动画
                    setTimeout(() => {
                        rightText.classList.add('text-appear');
                    }, 10);
                }
                
                // 显示黄庭坚标识
                if (rightSpeaker) rightSpeaker.style.display = 'block';
            }
            
            // 高亮当前发言的NPC
            highlightSpeakingNPC(speakerName);
            
            // 隐藏对话选项
            const dialogueOptions = document.getElementById('dialogue-options');
            if (dialogueOptions) {
                dialogueOptions.classList.remove('options-appear');
                dialogueOptions.style.display = 'none';
            }
            
            // 显示继续按钮，点击后显示作品展示
            const continueBtn = document.getElementById('continue-btn');
            if (continueBtn) {
                continueBtn.style.display = 'block';
                continueBtn.onclick = function() {
                    showArtworkDisplay(npc.task.source);
                };
            }
            
            // 更新进度
            updateProgress(npc.name);
        }, 200);
    }
}

// 显示作品展示
function showArtworkDisplay(artworkName) {
    console.log(`[DEBUG] 开始显示作品展示: ${artworkName}`);
    
    try {
        // 初始化作品展示区域
        initArtworkDisplay(artworkName);
        
        // 显示作品展示区域
        document.querySelectorAll('.game-content').forEach(content => {
            content.classList.add('hidden');
            content.style.display = 'none';
            content.style.visibility = 'hidden';
            content.style.opacity = '0';
            console.log(`[DEBUG] 隐藏内容: ${content.id}`);
        });
        
        // 检查作品展示区域是否存在，不存在则创建
        let artworkDisplay = document.getElementById('artwork-display');
        console.log(`[DEBUG] 获取artwork-display元素: ${artworkDisplay ? '成功' : '失败'}`);
        
        if (!artworkDisplay) {
            console.log(`[DEBUG] 创建新的artwork-display元素`);
            artworkDisplay = createArtworkDisplayArea();
        }
        
        // 显示作品展示区域
        artworkDisplay.classList.remove('hidden');
        artworkDisplay.style.display = 'block';
        artworkDisplay.style.visibility = 'visible';
        artworkDisplay.style.opacity = '1';
        console.log(`[DEBUG] 显示artwork-display元素: ${artworkDisplay.id}, 当前样式:`, {
            display: artworkDisplay.style.display,
            visibility: artworkDisplay.style.visibility,
            opacity: artworkDisplay.style.opacity,
            className: artworkDisplay.className
        });
        
        // 强制刷新DOM
        setTimeout(() => {
            console.log(`[DEBUG] 再次检查artwork-display元素: `, document.getElementById('artwork-display'));
        }, 100);
    } catch (error) {
        console.error(`[ERROR] 显示作品展示时出错: `, error);
    }
}

// 创建作品展示区域
function createArtworkDisplayArea() {
    const gameArea = document.querySelector('.game-area');
    
    // 创建作品展示区域
    const artworkDisplay = document.createElement('div');
    artworkDisplay.id = 'artwork-display';
    artworkDisplay.className = 'game-content';
    
    gameArea.appendChild(artworkDisplay);
    
    return artworkDisplay;
}

// 初始化作品展示区域
function initArtworkDisplay(artworkName) {
    console.log(`[DEBUG] 初始化作品展示区域: ${artworkName}`);
    
    let artwork;
    
    // 根据作品名称获取对应信息
    for (const knowledge of calligraphyKnowledge) {
        if (knowledge.title.includes(artworkName)) {
            artwork = knowledge;
            console.log(`[DEBUG] 找到作品信息:`, knowledge.title);
            break;
        }
    }
    
    if (!artwork) {
        artwork = {
            title: artworkName,
            content: `这是宋代著名书法家的代表作品《${artworkName}》，展现了宋代书法的独特艺术风格。`
        };
        console.log(`[DEBUG] 未找到匹配作品信息，使用默认信息`);
    }
    
    // 处理特定作品的内容
    if (artworkName === '寒食帖') {
        artwork.content = `《寒食帖》是北宋文学家、书法家苏轼的代表作品，被誉为"天下第三行书"，仅次于王羲之的《兰亭序》和颜真卿的《祭侄文稿》。此帖写于绍圣元年(1094年)，表达了苏轼对亡弟苏辙的思念之情。全帖共37行，232字，笔法流畅自然，情感真挚。字里行间融入了作者的情感，成为宋代书法的代表作品之一。`;
        artwork.author = '苏轼';
        artwork.year = '宋朝绍圣元年(1094年)';
        console.log(`[DEBUG] 使用寒食帖特定内容`);
    }
    
    // 获取作品展示区域
    let artworkDisplay = document.getElementById('artwork-display');
    console.log(`[DEBUG] 获取artwork-display元素(初始化): ${artworkDisplay ? '成功' : '失败'}`);
    
    if (!artworkDisplay) {
        console.log(`[DEBUG] 初始化时创建新的artwork-display元素`);
        artworkDisplay = createArtworkDisplayArea();
    }
    
    // 根据作品名称决定图片路径
    let imagePath = '';
    if (artworkName === '寒食帖') {
        imagePath = 'assets/images/hanshitie.jpg';
    } else {
        // 如果有_original.jpg版本，使用它；否则尝试直接使用作品名
        imagePath = `assets/images/${artworkName.replace(/[《》]/g, '')}.jpg`;
    }
    console.log(`[DEBUG] 图片路径: ${imagePath}`);
    
    // 检查图片是否存在
    const testImg = new Image();
    testImg.onload = () => console.log(`[DEBUG] 图片加载成功: ${imagePath}`);
    testImg.onerror = () => console.error(`[ERROR] 图片加载失败: ${imagePath}`);
    testImg.src = imagePath;
    
    // 添加背景纹理和装饰
    let bgPattern = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' opacity='0.03'%3E%3Cpath d='M0,0 L100,0 L100,100 L0,100 Z' fill='%23000'/%3E%3C/svg%3E";
    
    // 设置作品展示内容
    const htmlContent = `
        <div class="artwork-container" style="background-image: url('${bgPattern}');">
            <h2 class="artwork-title">${artwork.title}</h2>
            ${artwork.author && artwork.year ? `<p class="artwork-meta" style="text-align: center; margin-bottom: 20px; color: #5a3d30;"><span style="font-weight: bold;">${artwork.author}</span> · ${artwork.year}</p>` : ''}
            <div class="artwork-image-container">
                <img src="${imagePath}" alt="${artwork.title}" class="artwork-image" onload="console.log('[DEBUG] 图片已加载到DOM')" onerror="console.error('[ERROR] 图片加载到DOM失败')">
            </div>
            <div class="artwork-description">
                <p>${artwork.content}</p>
            </div>
            <div class="artwork-buttons">
                <button id="return-home-btn" class="artwork-button">返回规则页面</button>
            </div>
            <div class="artwork-seal" style="position: absolute; bottom: 30px; right: 30px;"></div>
        </div>
    `;
    console.log(`[DEBUG] 准备设置HTML内容，长度: ${htmlContent.length}`);
    artworkDisplay.innerHTML = htmlContent;
    console.log(`[DEBUG] HTML内容已设置`);
    
    // 绑定返回首页按钮事件
    const returnHomeBtn = document.getElementById('return-home-btn');
    if (returnHomeBtn) {
        console.log(`[DEBUG] 找到返回按钮，添加事件监听器`);
        returnHomeBtn.addEventListener('click', function() {
            console.log(`[DEBUG] 点击返回按钮`);
            if (typeof backToHome === 'function') {
                backToHome();
            } else if (typeof window.backToHome === 'function') {
                window.backToHome();
            } else {
                // 如果没有返回首页函数，就返回对话场景
                returnToDialogueScene();
            }
        });
    } else {
        console.log(`[WARN] 未找到返回按钮`);
    }
    
    console.log(`[DEBUG] 作品展示区域已初始化: ${artworkName}，图片路径: ${imagePath}`);
}

// 添加一个返回对话场景的函数
function returnToDialogueScene() {
    // 隐藏作品展示区域
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

// 更新玩家进度
function updateProgress(taskCompleted) {
    // 记录已完成任务
    window.gameState.completedTasks.push(taskCompleted);
    
    // 增加对话进度
    window.gameState.dialogueProgress++;
}

// 获取书法知识
function getCalligraphyFact(index) {
    if (index >= 0 && index < calligraphyKnowledge.length) {
        return calligraphyKnowledge[index];
    }
    return calligraphyKnowledge[Math.floor(Math.random() * calligraphyKnowledge.length)];
}

// 绑定对话事件
function bindDialogueEvents() {
    // 绑定继续按钮事件
    const continueBtn = document.getElementById('continue-btn');
    if (continueBtn) {
        continueBtn.onclick = function() {
            moveToNextDialogue();
        };
    }
}

// 如果对话.js加载在DOM完成后，初始化对话系统
document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM加载完成，检查对话场景");
    // 检查对话场景是否存在
    if (document.getElementById('dialogue-scene')) {
        console.log("找到对话场景，初始化对话系统");
        
        // 确保gameState存在
        if (!window.gameState) {
            window.gameState = {
                currentNpc: 'scholar',
                completedTasks: [],
                dialogueProgress: 0
            };
        }
        
        // 延迟一点时间确保其他脚本已加载
        setTimeout(function() {
            initDialogueSystem();
        }, 100);
    } else {
        console.warn("未找到对话场景，可能是页面尚未完全加载");
    }
});

// 在window.onload中也尝试初始化
window.onload = function() {
    console.log("页面完全加载，检查对话系统是否已初始化");
    // 检查对话场景是否存在，且对话系统尚未初始化
    if (document.getElementById('dialogue-scene') && 
        (!dialogueState || dialogueState.currentDialogueIndex === 0)) {
        console.log("在window.onload中初始化对话系统");
        initDialogueSystem();
    }
};

// 导出函数供其他模块使用
window.dialogueSystem = {
    npcData: npcData,
    knowledge: calligraphyKnowledge,
    updateProgress: updateProgress,
    onTaskComplete: onTaskComplete,
    getKnowledge: getCalligraphyFact,
    initDialogue: initDialogueSystem,
    nextDialogue: moveToNextDialogue,
    startGame: startCalligraphyGame,
    showArtworkDisplay: showArtworkDisplay
};

// 添加返回首页函数给全局使用
window.backToHome = function() {
    // 隐藏所有游戏内容
    document.querySelectorAll('.game-content').forEach(content => {
        content.classList.add('hidden');
        content.style.display = 'none';
        content.style.visibility = 'hidden';
        content.style.opacity = '0';
    });
    
    // 显示游戏规则页面
    const gameRules = document.getElementById('game-rules');
    if (gameRules) {
        gameRules.classList.remove('hidden');
        gameRules.style.display = 'block';
        gameRules.style.visibility = 'visible';
        gameRules.style.opacity = '1';
        console.log('[DEBUG] 已返回游戏规则页面');
    } else {
        console.error('[ERROR] 找不到游戏规则页面，尝试返回对话场景');
        returnToDialogueScene();
    }
};

// 添加测试原稿欣赏的函数
window.testShowArtwork = function() {
    console.log('[TEST] 开始测试原稿欣赏功能');
    
    try {
        // 获取artwork-display元素，确保其存在
        let artworkDisplay = document.getElementById('artwork-display');
        if (!artworkDisplay) {
            console.error('[TEST] 没有找到artwork-display元素，创建一个');
            artworkDisplay = document.createElement('div');
            artworkDisplay.id = 'artwork-display';
            artworkDisplay.className = 'game-content';
            document.querySelector('.game-area').appendChild(artworkDisplay);
        }
        
        console.log('[TEST] 找到artwork-display元素:', artworkDisplay);
        
        // 直接调用showArtworkDisplay函数显示寒食帖
        showArtworkDisplay('寒食帖');
        
        // 强制显示artwork-display元素
        setTimeout(function() {
            console.log('[TEST] 强制显示artwork-display元素');
            artworkDisplay.classList.remove('hidden');
            artworkDisplay.style.display = 'flex';
            artworkDisplay.style.visibility = 'visible';
            artworkDisplay.style.opacity = '1';
            artworkDisplay.style.zIndex = '2000';
        }, 200);
        
        return '测试函数已执行，请查看控制台日志';
    } catch (error) {
        console.error('[TEST] 测试中出错:', error);
        return '测试出错: ' + error.message;
    }
};

// 高亮显示当前发言的NPC
function highlightSpeakingNPC(speakerName) {
    const suShiContainer = document.getElementById('sushi-container');
    const visitorContainer = document.getElementById('huang-container'); // 保留ID但用于云梦人
    
    if (speakerName === '苏轼') {
        // 高亮苏轼
        suShiContainer.classList.add('npc-active');
        suShiContainer.classList.remove('npc-inactive');
        
        // 取消云梦人高亮
        visitorContainer.classList.remove('npc-active');
        visitorContainer.classList.add('npc-inactive');
    } else if (speakerName === '云梦人') {
        // 高亮云梦人
        visitorContainer.classList.add('npc-active');
        visitorContainer.classList.remove('npc-inactive');
        
        // 取消苏轼高亮
        suShiContainer.classList.remove('npc-active');
        suShiContainer.classList.add('npc-inactive');
    }
}