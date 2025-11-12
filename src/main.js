import { createApp } from 'vue';
import { createRouter, createWebHistory } from 'vue-router';
import { createStore } from 'vuex';
import App from './App.vue';
import messageHandler from './utils/messageHandler';
import auth from './utils/auth';

// 导入视图组件
// Home组件已删除
import Gallery from './views/Gallery.vue';
import HistoryTimeline from './views/HistoryTimeline.vue';
import AncientTechnology from './views/AncientTechnology.vue';
import DigitalHeritage from './views/DigitalHeritage.vue';

// 创建路由配置
const routes = [
    { 
        path: '/', 
        component: Gallery, // Gallery设置为首页
        meta: { transition: 'slide-fade' }
    },
    {
        path: '/ancient-tech',
        component: AncientTechnology,
        meta: { transition: 'slide-fade' }
    },
    {
        path: '/history-timeline',
        component: HistoryTimeline,
        meta: { transition: 'slide-fade' }
    },
    {
        path: '/digital-heritage',
        component: DigitalHeritage,
        meta: { transition: 'slide-fade' }
    }
];

// 初始化路由
const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        } else {
            return { top: 0, behavior: 'smooth' };
        }
    }
});

// 添加路由变化效果
router.beforeEach((to, from, next) => {
    const toDepth = to.path.split('/').length;
    const fromDepth = from.path.split('/').length;
    to.meta.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left';
    next();
});

// 创建Vuex存储
const store = createStore({
    state() {
        return {
            sections: [
                { id: 1, title: '溯洄·天工开物', content: '  古贤以器测形，以术穷理，千载积累，成就天工绝技；今人以数字之光，溯源重构，与古智慧相映成辉。此般古今交融，为这悠悠天工，铸就永恒星碑。' },
                { id: 2, title: '史诗·经纬成络', content: '  九州慧智，源远流长。天文历法为经，数学几何为纬，医药本草为络，科技创新为用，农工技艺为基，思想体系为魂。放射交织，六脉同源。非独器物之巧，实乃天人合一之道。' },
                { id: 3, title: '立意·古今辉映', content: '  华夏灵智，承仰观俯察之志。昔圭表定四时，浑仪推星轨，龟甲窥阴阳，《易》云"观天文察地理"。今遥感校遗数，射电应星宿，河图化算法，以数码续文明于云汉。' }
            ],
            contentStyle: {
                fontSize: '22px',
                lineHeight: '1.8'
            },
            titleStyle: {
                fontSize: '28px',
                fontWeight: 'bold',
                marginBottom: '20px'
            }
        }
    },
    getters: {
        getSections: (state) => state.sections,
        getContentStyle: (state) => state.contentStyle,
        getTitleStyle: (state) => state.titleStyle
    }
});

// 创建并挂载应用
const app = createApp(App);
app.use(router);
app.use(store);
app.use(messageHandler);
app.use(auth);
app.mount('#app'); 