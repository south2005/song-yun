/**
 * 宋韵流芳 - 动画控制模块
 * 负责页面动画和特效的加载和控制
 */

// 动画状态控制
const animationState = {
    enabled: true,
    loadingAnimationsComplete: false
};

// 页面加载完成后初始化动画
document.addEventListener('DOMContentLoaded', function() {
    console.log("动画效果控制器已加载，但部分动画已被禁用以防止闪烁");

    // 禁用可能导致闪烁的动画
    window.disableAnimationsTemporarily = function() {
        document.body.classList.add('no-animations');
    };
    
    window.enableAnimations = function() {
        document.body.classList.remove('no-animations');
    };
    
    // 立即禁用动画
    window.disableAnimationsTemporarily();

    // 初始化页面动画
    initPageAnimations();
});

/**
 * 初始化页面加载动画
 */
function initPageAnimations() {
    // 为菜单项添加序号，用于动画延迟
    const menuItems = document.querySelectorAll('.menu-item');
    menuItems.forEach((item, index) => {
        item.style.setProperty('--item-index', index);
    });
    
    // 添加页面载入动画完成事件
    const contentLayer = document.querySelector('.content-layer');
    
    if (contentLayer) {
        contentLayer.addEventListener('animationend', function() {
            animationState.loadingAnimationsComplete = true;
        });
    }
}

/**
 * 创建毛笔书写动画
 * @param {number} x - 起始X坐标
 * @param {number} y - 起始Y坐标
 * @param {string} character - 要书写的汉字
 */
function createBrushAnimation(x, y, character) {
    if (!animationState.enabled) return;
    
    // 创建SVG容器
    const brushEffect = document.createElement('div');
    brushEffect.className = 'brush-effect';
    document.body.appendChild(brushEffect);
    
    // 添加SVG内容
    brushEffect.innerHTML = `
        <svg width="100%" height="100%" viewBox="0 0 100 100">
            <path d="M20,50 Q50,20 80,50" class="brush-stroke" />
        </svg>
    `;
    
    // 动画结束后移除
    const path = brushEffect.querySelector('path');
    path.addEventListener('animationend', function() {
        setTimeout(() => {
            brushEffect.remove();
        }, 500);
    });
}

/**
 * 创建水墨晕染特效
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {number} size - 大小（默认50px）
 */
function createInkEffect(x, y, size = 50) {
    if (!animationState.enabled) return;
    
    const inkSplash = document.createElement('div');
    inkSplash.className = 'ink-splash';
    inkSplash.style.width = `${size}px`;
    inkSplash.style.height = `${size}px`;
    inkSplash.style.left = `${x - size/2}px`;
    inkSplash.style.top = `${y - size/2}px`;
    
    document.body.appendChild(inkSplash);
    
    // 动画结束后移除元素
    inkSplash.addEventListener('animationend', function() {
        inkSplash.remove();
    });
}

/**
 * 创建印章盖章特效
 * @param {number} x - X坐标
 * @param {number} y - Y坐标
 * @param {string} imageSrc - 印章图片路径（可选）
 */
function createSealEffect(x, y, imageSrc = null) {
    if (!animationState.enabled) return;
    
    const seal = document.createElement('div');
    seal.className = 'seal-effect';
    seal.style.position = 'absolute';
    seal.style.width = '100px';
    seal.style.height = '100px';
    seal.style.left = `${x - 50}px`;
    seal.style.top = `${y - 50}px`;
    
    if (imageSrc) {
        seal.style.backgroundImage = `url(${imageSrc})`;
    } else {
        seal.style.backgroundImage = 'url(assets/images/seal.jpg)';
    }
    
    seal.style.backgroundSize = 'contain';
    seal.style.backgroundRepeat = 'no-repeat';
    
    document.body.appendChild(seal);
    
    // 动画结束后移除元素
    seal.addEventListener('animationend', function() {
        setTimeout(() => {
            seal.remove();
        }, 2000);
    });
    
    // 播放印章音效
    if (typeof playSound === 'function') {
        playSound('click-sound');
    }
}

/**
 * 创建卷轴展开动画
 * @param {HTMLElement} element - 要添加动画的元素
 */
function createScrollAnimation(element) {
    if (!animationState.enabled || !element) return;
    
    element.classList.add('scroll-unfold');
    
    // 播放翻页音效
    if (typeof playSound === 'function') {
        playSound('page-turn-sound');
    }
}

/**
 * 创建仙鹤飞过动画
 */
function createCraneAnimation() {
    if (!animationState.enabled) return;
    
    const crane = document.createElement('div');
    crane.className = 'crane';
    
    // 随机高度位置
    const randomTop = Math.floor(Math.random() * 300) + 50;
    crane.style.top = `${randomTop}px`;
    
    document.body.appendChild(crane);
    
    // 播放鸟叫声
    if (typeof playTraditionalSound === 'function') {
        playTraditionalSound('bamboo');
    }
    
    // 动画结束后移除元素
    crane.addEventListener('animationend', function() {
        crane.remove();
    });
}

/**
 * 创建枫叶飘落动画
 * @param {number} count - 枫叶数量
 */
function createMapleLeafEffect(count = 10) {
    if (!animationState.enabled) return;
    
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const leaf = document.createElement('div');
            leaf.className = 'maple-leaf';
            
            // 随机起始位置
            const randomLeft = Math.floor(Math.random() * window.innerWidth);
            leaf.style.left = `${randomLeft}px`;
            
            // 随机变换
            const randomX = Math.floor(Math.random() * 300) - 150;
            const randomRotate = Math.floor(Math.random() * 720) - 360;
            
            leaf.style.setProperty('--random-x', `${randomX}px`);
            leaf.style.setProperty('--random-rotate', `${randomRotate}deg`);
            
            document.body.appendChild(leaf);
            
            // 动画结束后移除元素
            leaf.addEventListener('animationend', function() {
                leaf.remove();
            });
        }, i * 300);
    }
    
    // 播放古琴音效
    if (typeof playTraditionalSound === 'function') {
        playTraditionalSound('qin');
    }
}

/**
 * 创建答题正确特效
 * @param {HTMLElement} element - 要添加特效的元素
 */
function createCorrectAnswerEffect(element) {
    if (!animationState.enabled || !element) return;
    
    // 添加正确答案特效
    element.classList.add('correct-answer');
    
    // 创建特效层
    const effect = document.createElement('div');
    effect.className = 'answer-correct-effect';
    
    const rect = element.getBoundingClientRect();
    effect.style.width = `${rect.width}px`;
    effect.style.height = `${rect.height}px`;
    effect.style.left = `${rect.left}px`;
    effect.style.top = `${rect.top}px`;
    
    document.body.appendChild(effect);
    
    // 动画结束后移除元素
    effect.addEventListener('animationend', function() {
        if (this.style.opacity === '0') {
            this.remove();
        }
    });
    
    // 播放成功音效
    if (typeof playSound === 'function') {
        playSound('success-sound');
    }
}

// 导出动画函数给全局使用
window.animationEffects = {
    createBrushAnimation,
    createInkEffect,
    createSealEffect,
    createScrollAnimation,
    createCraneAnimation,
    createMapleLeafEffect,
    createCorrectAnswerEffect
}; 