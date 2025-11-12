// 立即添加事件监听，不等待DOMContentLoaded
(function() {
    // 立即运行的函数
    function setupEnterButton() {
        var enterBtn = document.getElementById('enter-site-btn');
        var entranceAnimation = document.getElementById('entrance-animation');
        var mainContainer = document.querySelector('.main-container');
        
        if (enterBtn && entranceAnimation && mainContainer) {
            // 确保按钮可见
            enterBtn.style.opacity = '1';
            
            // 添加点击事件
            enterBtn.onclick = function() {
                console.log("立即进入按钮被点击");
                entranceAnimation.style.opacity = '0';
                setTimeout(function() {
                    entranceAnimation.style.display = 'none';
                    mainContainer.style.opacity = '1';
                }, 500);
            };
            
            console.log("立即进入按钮已设置");
        } else {
            console.log("找不到必要的元素", !!enterBtn, !!entranceAnimation, !!mainContainer);
            // 尝试再次设置
            setTimeout(setupEnterButton, 500);
        }
    }
    
    // 立即尝试设置按钮事件
    setupEnterButton();
    
    // 页面加载完成后，再次检查确保按钮可用
    window.addEventListener('load', setupEnterButton);
})();

// 页面加载事件
document.addEventListener('DOMContentLoaded', function() {
    // 获取当前页面文件名
    const path = window.location.pathname;
    let page = '';
    if (path.includes('index.html')) page = 'index';
    else if (path.includes('exhibitions.html')) page = 'exhibitions';
    else if (path.includes('collection.html')) page = 'collection';
    else if (path.includes('works.html')) page = 'works';
    else if (path.includes('education.html')) page = 'education';

    // 移除所有active
    document.querySelectorAll('.nav-item').forEach(li => li.classList.remove('active'));
    // 给当前项加active
    const current = document.querySelector(`.nav-item[data-page="${page}"]`);
    if (current) current.classList.add('active');

    // 入场动画（仅在首页显示）
    if (window.location.pathname.endsWith('index.html') || window.location.pathname.endsWith('/')) {
        const entranceAnimation = document.getElementById('entrance-animation');
        const mainContainer = document.querySelector('.main-container');
        const enterBtn = document.getElementById('enter-site-btn');
        
        if (entranceAnimation) {
            // 显示入场动画
            entranceAnimation.style.display = 'flex';
            entranceAnimation.style.opacity = '1';
            
            // 添加立即进入按钮点击事件
            if (enterBtn) {
                enterBtn.addEventListener('click', function() {
                    entranceAnimation.style.opacity = '0';
                    setTimeout(function() {
                        entranceAnimation.style.display = 'none';
                        mainContainer.style.opacity = '1';
                    }, 500);
                });
            }
            
            // 进度条动画完成后显示主内容
            setTimeout(function() {
                entranceAnimation.style.opacity = '0';
                setTimeout(function() {
                    entranceAnimation.style.display = 'none';
                    mainContainer.style.opacity = '1';
                }, 1500);
            }, 5000); // 缩短时间，用户体验更好
        } else {
            // 如果找不到入场动画元素，直接显示主内容
            mainContainer.style.opacity = '1';
        }
    }

    // 处理图片加载错误
    handleImageErrors();

    // 初始化水墨动画效果
    initInkAnimations();
    
    // 处理导航菜单
    setupNavigation();
    
    // 初始化展览轮播（仅首页）
    if (document.querySelector('.exhibition-carousel')) {
        initExhibitionCarousel();
    }
    
    // 初始化虚拟导览按钮
    const virtualTourBtn = document.getElementById('virtual-tour-btn');
    if (virtualTourBtn) {
        virtualTourBtn.addEventListener('click', startVirtualTour);
    }
});

// 处理图片加载错误
function handleImageErrors() {
    // 为所有背景图片元素添加默认样式
    const backgroundElements = document.querySelectorAll(
        '.mountains-distant, .mountains-far, .mountains-mid, .mountains-near, ' +
        '.optics-exhibition, .mechanics-exhibition, .philosophy-exhibition, .special-exhibition, ' +
        '.mojing-manuscript, .defense-model, .optics-device, .satellite-model, .mohist-tablet'
    );
    
    backgroundElements.forEach(element => {
        // 添加文本内容作为备用
        if (element.classList.contains('optics-exhibition')) {
            element.setAttribute('title', '墨经光学成就特展');
        } else if (element.classList.contains('mechanics-exhibition')) {
            element.setAttribute('title', '墨家机械科技展');
        } else if (element.classList.contains('philosophy-exhibition')) {
            element.setAttribute('title', '墨家思想与伦理观');
        } else if (element.classList.contains('special-exhibition')) {
            element.setAttribute('title', '墨子号与量子科技特展');
        }
    });
    
    // 处理徽标
    const emblems = document.querySelectorAll('.museum-emblem, .logo-emblem, .footer-emblem');
    emblems.forEach(emblem => {
        emblem.innerHTML = '墨';
        emblem.style.display = 'flex';
        emblem.style.alignItems = 'center';
        emblem.style.justifyContent = 'center';
        emblem.style.fontSize = '28px';
        emblem.style.fontWeight = 'bold';
        emblem.style.color = '#211a0f';
    });
}

// 水墨动画效果
function initInkAnimations() {
    const inkContainer = document.getElementById('ink-animation');
    if (!inkContainer) return;
    
    // 页面加载时的水墨扩散效果
    setTimeout(() => {
        createInkDrop(window.innerWidth / 2, window.innerHeight / 2, 'massive');
    }, 1000);
    
    // 点击事件产生水墨效果
    document.addEventListener('click', (e) => {
        createInkDrop(e.clientX, e.clientY, 'medium');
    });
    
    // 鼠标移动偶尔产生微小水墨
    let lastTime = 0;
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastTime > 800 && Math.random() > 0.7) {
            lastTime = now;
            createInkDrop(e.clientX, e.clientY, 'small');
        }
    });
    
    // 创建水墨滴效果
    function createInkDrop(x, y, size) {
        const ink = document.createElement('div');
        ink.className = 'ink-drop';
        
        // 设置尺寸
        let dimension, duration;
        switch(size) {
            case 'small':
                dimension = 30 + Math.random() * 50;
                duration = 1 + Math.random();
                break;
            case 'medium':
                dimension = 100 + Math.random() * 100;
                duration = 1.5 + Math.random() * 0.5;
                break;
            case 'massive':
                dimension = Math.max(window.innerWidth, window.innerHeight) * 2;
                duration = 2.5;
                break;
            default:
                dimension = 50;
                duration = 1;
        }
        
        // 设置位置和样式
        ink.style.width = `${dimension}px`;
        ink.style.height = `${dimension}px`;
        ink.style.left = `${x - dimension/2}px`;
        ink.style.top = `${y - dimension/2}px`;
        ink.style.animationDuration = `${duration}s`;
        
        // 添加到容器
        inkContainer.appendChild(ink);
        
        // 动画结束后移除
        setTimeout(() => {
            ink.remove();
        }, duration * 1000);
    }
    
    // 添加毛笔书法效果
    function createCalligraphyStroke(startX, startY, width, height, angle) {
        const stroke = document.createElement('div');
        stroke.className = 'calligraphy-stroke';
        
        // 设置样式
        stroke.style.width = `${width}px`;
        stroke.style.height = `${height}px`;
        stroke.style.left = `${startX - width/2}px`;
        stroke.style.top = `${startY - height/2}px`;
        stroke.style.transform = `rotate(${angle}deg)`;
        
        // 添加到容器
        inkContainer.appendChild(stroke);
        
        // 动画结束后移除
        setTimeout(() => {
            stroke.remove();
        }, 3000);
    }
}

// 设置导航菜单
function setupNavigation() {
    // 获取当前页面路径
    const currentPath = window.location.pathname;
    
    // 设置活动导航项
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        const link = item.querySelector('a');
        if (link && currentPath.includes(link.getAttribute('href'))) {
            item.classList.add('active');
        }
    });
    
    // 设置子菜单交互
    const itemsWithSubmenu = document.querySelectorAll('.nav-item:has(.submenu)');
    itemsWithSubmenu.forEach(item => {
        // 鼠标移入显示子菜单
        item.addEventListener('mouseenter', function() {
            const submenu = this.querySelector('.submenu');
            if (submenu) {
                submenu.style.display = 'flex';
                setTimeout(() => {
                    submenu.style.opacity = '1';
                }, 10);
            }
        });
        
        // 鼠标移出隐藏子菜单
        item.addEventListener('mouseleave', function() {
            const submenu = this.querySelector('.submenu');
            if (submenu) {
                submenu.style.opacity = '0';
                setTimeout(() => {
                    submenu.style.display = 'none';
                }, 300);
            }
        });
    });
}

// 处理展览轮播
function initExhibitionCarousel() {
    const carouselContainer = document.querySelector('.carousel-container');
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.carousel-indicators .indicator');
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');
    
    let currentIndex = 0;
    
    // 更新轮播显示
    function updateCarousel() {
        items.forEach((item, index) => {
            item.classList.remove('active');
            if (index === currentIndex) {
                item.classList.add('active');
            }
        });
        
        indicators.forEach((indicator, index) => {
            indicator.classList.remove('active');
            if (index === currentIndex) {
                indicator.classList.add('active');
            }
        });
    }
    
    // 下一个
    function nextSlide() {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel();
    }
    
    // 上一个
    function prevSlide() {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel();
    }
    
    // 设置点击事件
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    
    // 设置指示器点击
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel();
        });
    });
    
    // 自动轮播
    setInterval(nextSlide, 5000);
}

// 虚拟导览功能
function startVirtualTour() {
    alert('虚拟导览功能即将推出，敬请期待！');
    // 这里可以添加实际的虚拟导览启动代码
}