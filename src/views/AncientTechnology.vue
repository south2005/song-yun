<template>
  <div class="history-timeline">
    <!-- 带导航按钮的时间轴容器 -->
    <div class="timeline-container">
      <button class="timeline-nav-btn left-btn" @click="scrollTimeline('left')">
        &lt;
      </button>
      <div class="timeline" ref="timeline">
        <div 
          v-for="(period, index) in periods" 
          :key="index"
          class="timeline-item"
          :class="{ active: selectedIndex === index }"
          @click="selectPeriod(index)"
        >
          <div class="timeline-upper">
            <span class="science-name">{{ period.upperScience }}</span>
          </div>
          <div class="timeline-dot"></div>
          <div class="timeline-label">{{ period.name }}</div>
          <div class="timeline-lower">
            <span class="science-name">{{ period.lowerScience }}</span>
          </div>
        </div>
        <!-- 新增主线 -->
        <div class="timeline-line"></div>
      </div>
      <button class="timeline-nav-btn right-btn" @click="scrollTimeline('right')">
        &gt;
      </button>
    </div>
    
    <!-- 卡片区域 -->
    <div class="cards-area">
      <div 
        v-for="(card, index) in cards" 
        :key="index"
        class="tech-card"
        :class="[card.color, { active: selectedIndex === index, flipped: flippedCards[index] }]"
        @click="toggleCardFlip(index)"
      >
        <div class="card-front">
          <h3>{{ card.dynasty }}</h3>
          <div class="card-tag">{{ card.tag }}</div>
          <p>{{ card.description }}</p>
        </div>
        <div class="card-back">
          <h3>{{ card.title }}</h3>
          <p>{{ card.detailedInfo }}</p>
          <div class="back-info">
            <div class="scientist">{{ card.scientist }}</div>
            <div class="year">{{ card.year }}</div>
          </div>
          
          <!-- 添加演示按钮，仅对墨子卡片显示 -->
          <div v-if="card.scientist.includes('墨子')" class="card-actions">
            <button class="explore-btn" @click.stop="showMoziTimeline">探索墨子科学成就</button>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 墨子时间轴模态窗口 -->
    <MoziTimeline v-if="showingMoziTimeline" @close="closeMoziTimeline" />
  </div>
</template>

<script>
import MoziTimeline from '@/components/MoziTimeline.vue';

export default {
  name: 'AncientTechnology',
  components: {
    MoziTimeline
  },
  data() {
    return {
      selectedIndex: 0,
      flippedCards: [false, false, false, false, false, false, false, false, false, false, false, false, false, false, false],
      showingMoziTimeline: false,
      periods: [
        { name: '建隆', upperScience: '绘画：山水画兴起', lowerScience: '瓷器：青白瓷初现' },
        { name: '乾德', upperScience: '书法：楷书发展', lowerScience: '建筑：宫殿营造' },
        { name: '开宝', upperScience: '雕版印刷普及', lowerScience: '瓷器：定窑白瓷' },
        { name: '太平兴国', upperScience: '瓷器：汝窑天青釉', lowerScience: '建筑：应天府大殿' },
        { name: '雍熙', upperScience: '绘画：花鸟画', lowerScience: '纺织：宋锦' },
        { name: '端拱', upperScience: '文人画崛起', lowerScience: '活字印刷发明' },
        { name: '淳化', upperScience: '书法：行书流行', lowerScience: '瓷器：磁州窑' },
        { name: '至道', upperScience: '书法：瘦金体', lowerScience: '瓷器：官窑巅峰' },
        { name: '咸平', upperScience: '战乱与文化流散', lowerScience: '南渡开启' },
        { name: '景德', upperScience: '建筑：临安城', lowerScience: '漆器：螺钿工艺' },
        { name: '大中祥符', upperScience: '绘画：院体画繁荣', lowerScience: '瓷器：龙泉青瓷' },
        { name: '天禧', upperScience: '雕塑：佛像艺术', lowerScience: '金银器：錾刻镶嵌' },
        { name: '乾兴', upperScience: '书法：文人书风', lowerScience: '纺织：云锦' },
        { name: '天圣', upperScience: '文房四宝：端砚', lowerScience: '纸张：澄心堂纸' },
        { name: '明道', upperScience: '绘画：山水新风', lowerScience: '瓷器：青白瓷' },
        { name: '景祐', upperScience: '文化南迁', lowerScience: '艺术传承' },
        { name: '宝元', upperScience: '抗元遗民文化', lowerScience: '文人书画' },
        { name: '康定', upperScience: '宋末遗风', lowerScience: '南宋终结' },
        { name: '庆历', upperScience: '绘画：院体画', lowerScience: '瓷器：钧窑' },
        { name: '皇祐', upperScience: '书法：草书', lowerScience: '建筑：园林' },
        { name: '至和', upperScience: '绘画：人物画', lowerScience: '漆器：雕漆' },
        { name: '嘉祐', upperScience: '书法：篆书', lowerScience: '瓷器：耀州窑' },
        { name: '治平', upperScience: '绘画：界画', lowerScience: '建筑：佛寺' },
        { name: '熙宁', upperScience: '书法：隶书', lowerScience: '瓷器：建窑' },
        { name: '元丰', upperScience: '绘画：风俗画', lowerScience: '纺织：缂丝' },
        { name: '元祐', upperScience: '书法：行草', lowerScience: '瓷器：吉州窑' },
        { name: '绍圣', upperScience: '绘画：墨竹', lowerScience: '建筑：园林' },
        { name: '元符', upperScience: '书法：章草', lowerScience: '瓷器：定窑' },
        { name: '建中靖国', upperScience: '绘画：花鸟', lowerScience: '漆器：剔红' },
        { name: '崇宁', upperScience: '书法：大篆', lowerScience: '瓷器：官窑' },
        { name: '大观', upperScience: '绘画：山水', lowerScience: '建筑：宫殿' },
        { name: '政和', upperScience: '书法：小篆', lowerScience: '瓷器：汝窑' },
        { name: '重和', upperScience: '绘画：人物', lowerScience: '漆器：螺钿' },
        { name: '宣和', upperScience: '书法：隶书', lowerScience: '瓷器：钧窑' },
        { name: '靖康', upperScience: '绘画：山水', lowerScience: '建筑：佛寺' },
        { name: '建炎', upperScience: '书法：行书', lowerScience: '瓷器：龙泉' },
        { name: '绍兴', upperScience: '绘画：花鸟', lowerScience: '漆器：雕漆' },
        { name: '隆兴', upperScience: '书法：草书', lowerScience: '瓷器：建窑' },
        { name: '乾道', upperScience: '绘画：人物', lowerScience: '建筑：园林' },
        { name: '淳熙', upperScience: '书法：篆书', lowerScience: '瓷器：吉州' },
        { name: '绍熙', upperScience: '绘画：山水', lowerScience: '漆器：剔红' },
        { name: '庆元', upperScience: '书法：隶书', lowerScience: '瓷器：定窑' },
        { name: '嘉泰', upperScience: '绘画：花鸟', lowerScience: '建筑：佛寺' },
        { name: '开禧', upperScience: '书法：行草', lowerScience: '瓷器：官窑' },
        { name: '嘉定', upperScience: '绘画：人物', lowerScience: '漆器：螺钿' },
        { name: '宝庆', upperScience: '书法：章草', lowerScience: '瓷器：汝窑' },
        { name: '绍定', upperScience: '绘画：山水', lowerScience: '建筑：园林' },
        { name: '端平', upperScience: '书法：大篆', lowerScience: '瓷器：钧窑' },
        { name: '嘉熙', upperScience: '绘画：花鸟', lowerScience: '漆器：雕漆' },
        { name: '淳祐', upperScience: '书法：小篆', lowerScience: '瓷器：龙泉' },
        { name: '宝祐', upperScience: '绘画：人物', lowerScience: '建筑：佛寺' },
        { name: '开庆', upperScience: '书法：隶书', lowerScience: '瓷器：建窑' },
        { name: '景定', upperScience: '绘画：山水', lowerScience: '漆器：剔红' },
        { name: '咸淳', upperScience: '书法：行书', lowerScience: '瓷器：吉州' },
        { name: '德祐', upperScience: '绘画：花鸟', lowerScience: '建筑：园林' },
        { name: '景炎', upperScience: '书法：草书', lowerScience: '瓷器：定窑' },
        { name: '祥兴', upperScience: '绘画：人物', lowerScience: '漆器：螺钿' }
      ],
      cards: [
        // 建隆年间
        {
          dynasty: '建隆年间',
          color: 'blue1',
          tag: '山水画兴起',
          description: '北宋初期，山水画成为绘画主流，荆浩、关仝等开创"北宗山水"。',
          scientist: '荆浩、关仝',
          year: '960-963年',
          title: '北宗山水画',
          detailedInfo: '建隆年间，山水画成为绘画主流。荆浩著《笔法记》，强调"气韵生动"，关仝继承其法，作品多表现北方雄浑山川。山水画成为文人寄托情怀的重要载体。'
        },
        // 乾德年间
        {
          dynasty: '乾德年间',
          color: 'blue2',
          tag: '楷书发展',
          description: '宋代楷书在继承唐代传统基础上，风格更加多样。',
          scientist: '欧阳询、颜真卿',
          year: '963-968年',
          title: '楷书艺术',
          detailedInfo: '乾德年间，欧阳询、颜真卿书法被广泛学习，成为科举考试标准字体。楷书风格严谨工整，笔画遒劲有力。'
        },
        // 开宝年间
        {
          dynasty: '开宝年间',
          color: 'green',
          tag: '雕版印刷',
          description: '雕版印刷技术成熟，书籍大量刊刻，促进文化传播。',
          scientist: '北宋工匠',
          year: '968-976年',
          title: '雕版印刷术',
          detailedInfo: '开宝年间，雕版印刷技术达到成熟，大量书籍得以刊刻，极大促进了知识的传播和文化的普及。'
        },
        // 太平兴国年间
        {
          dynasty: '太平兴国年间',
          color: 'bronze',
          tag: '汝窑天青釉',
          description: '汝窑以天青釉色著称，存世极少，弥足珍贵。',
          scientist: '汝州工匠',
          year: '976-984年',
          title: '汝窑瓷器',
          detailedInfo: '太平兴国年间，汝窑瓷器以釉色天青、釉面开片著称，胎质细腻，釉层肥厚。汝窑传世品极少，被誉为"纵有家财万贯，不如汝瓷一片"。'
        },
        // 雍熙年间
        {
          dynasty: '雍熙年间',
          color: 'gold',
          tag: '宋锦织造',
          description: '宋锦是宋代最负盛名的丝织品，色彩绚丽，图案精美。',
          scientist: '苏州织工',
          year: '984-987年',
          title: '锦绣中华——宋锦',
          detailedInfo: '雍熙年间，宋锦以苏州为中心，采用多梭多彩提花工艺，织造出色彩斑斓、图案繁复的高级丝织品。'
        },
        // 端拱年间
        {
          dynasty: '端拱年间',
          color: 'red1',
          tag: '应天府大殿',
          description: '宋代宫殿建筑雄伟壮观，结构科学，装饰华美。',
          scientist: '李诫（《营造法式》作者）',
          year: '988-989年',
          title: '宋代宫殿建筑',
          detailedInfo: '端拱年间，李诫编撰《营造法式》，系统总结宋代建筑规范。应天府大殿等宫殿建筑结构科学，斗拱、歇山顶等成为宋代建筑标志。'
        },
        // 淳化年间
        {
          dynasty: '淳化年间',
          color: 'gray',
          tag: '活字印刷',
          description: '毕昇发明活字印刷，开创印刷新纪元。',
          scientist: '毕昇',
          year: '990-994年',
          title: '活字印刷术',
          detailedInfo: '淳化年间，毕昇发明泥活字印刷，比欧洲早400年。活字印刷极大提高了印刷效率，是世界印刷史上的伟大创举。'
        },
        // 至道年间
        {
          dynasty: '至道年间',
          color: 'purple',
          tag: '瘦金体',
          description: '宋徽宗自创"瘦金体"，风格独特，影响深远。',
          scientist: '赵佶（宋徽宗）',
          year: '995-997年',
          title: '瘦金体书法',
          detailedInfo: '至道年间，宋徽宗赵佶自创"瘦金体"，笔画瘦劲挺拔，结构严谨，极具装饰性。瘦金体广泛用于宫廷题匾、书画题跋。'
        },
        // 咸平年间
        {
          dynasty: '咸平年间',
          color: 'blue',
          tag: '官窑瓷器',
          description: '官窑瓷器专为宫廷烧制，釉色青翠，造型规整，极具皇家气派。',
          scientist: '汴京官窑工匠',
          year: '998-1003年',
          title: '皇家御用——官窑',
          detailedInfo: '咸平年间，官窑瓷器以釉色青翠、胎体厚重、造型规整著称，釉面常有"蟹爪纹"开片，极具皇家气派。'
        },
        // 景德年间
        {
          dynasty: '景德年间',
          color: 'red',
          tag: '临安城',
          description: '南宋临安城（今杭州）布局严整，城市规划先进。',
          scientist: '南宋工匠',
          year: '1004-1007年',
          title: '南宋都城——临安',
          detailedInfo: '景德年间，南宋迁都临安，城市布局严整，街道纵横，水系发达。临安成为当时世界上最繁华的城市之一。'
        },
        // 大中祥符年间
        {
          dynasty: '大中祥符年间',
          color: 'purple',
          tag: '螺钿漆器',
          description: '南宋螺钿漆器工艺精湛，装饰华美。',
          scientist: '南宋漆工',
          year: '1008-1016年',
          title: '螺钿漆器艺术',
          detailedInfo: '大中祥符年间，螺钿漆器以贝壳镶嵌为主，漆面光亮如镜，图案精美。广泛用于文房、器皿、家具等。'
        },
        // 天禧年间
        {
          dynasty: '天禧年间',
          color: 'darkgold',
          tag: '佛像艺术',
          description: '宋代佛像雕塑造型优美，工艺精湛，注重写实。',
          scientist: '南宋雕塑工匠',
          year: '1017-1021年',
          title: '佛像雕塑艺术',
          detailedInfo: '天禧年间，宋代佛像雕塑注重人物神态与衣纹刻画，造型优美，工艺精湛。大量寺庙佛像保存至今，展现宋代雕塑艺术的高超水平。'
        },
        // 乾兴年间
        {
          dynasty: '乾兴年间',
          color: 'red',
          tag: '金银器',
          description: '南宋金银器工艺精湛，錾刻、镶嵌等技法丰富多样。',
          scientist: '南宋金银匠',
          year: '1022年',
          title: '富丽堂皇——金银器',
          detailedInfo: '乾兴年间，金银器制作工艺高度发达，采用錾刻、镶嵌、错金银等多种技法，器物造型优美，装饰华丽。'
        },
        // 天圣年间
        {
          dynasty: '天圣年间',
          color: 'qing',
          tag: '端砚',
          description: '端砚为宋代四大名砚之首，石质细腻，发墨如油。',
          scientist: '端溪工匠',
          year: '1023-1032年',
          title: '文房瑰宝——端砚',
          detailedInfo: '天圣年间，端砚制作技艺日臻完善，石质细腻温润，发墨如油。端砚不仅是书法绘画的必备工具，也是文人雅士的收藏珍品。'
        },
        // 明道年间
        {
          dynasty: '明道年间',
          color: 'qing2',
          tag: '澄心堂纸',
          description: '澄心堂纸以质地细腻、润墨性好著称，是书画家首选。',
          scientist: '澄心堂造纸工匠',
          year: '1032-1033年',
          title: '澄心堂纸',
          detailedInfo: '明道年间，澄心堂纸被誉为"纸中之王"，广泛用于宫廷书画和文人创作。'
        },
        // 景祐年间
        {
          dynasty: '景祐年间',
          color: 'blue1',
          tag: '文化南迁',
          description: '北宋文化南迁，艺术风格发生重要转变。',
          scientist: '南宋文人',
          year: '1034-1038年',
          title: '文化南迁',
          detailedInfo: '景祐年间，随着政治中心南移，文化艺术也随之南迁，形成了独特的南宋文化风格。'
        },
        // 宝元年间
        {
          dynasty: '宝元年间',
          color: 'blue2',
          tag: '抗元遗民文化',
          description: '南宋遗民文化，艺术创作充满家国情怀。',
          scientist: '南宋遗民',
          year: '1038-1040年',
          title: '遗民文化',
          detailedInfo: '宝元年间，南宋遗民在艺术创作中寄托家国情怀，形成了独特的遗民文化。'
        },
        // 康定年间
        {
          dynasty: '康定年间',
          color: 'green',
          tag: '宋末遗风',
          description: '南宋末期艺术风格，融合南北特色。',
          scientist: '南宋艺术家',
          year: '1040-1041年',
          title: '宋末艺术',
          detailedInfo: '康定年间，南宋艺术融合南北特色，形成了独特的艺术风格。'
        },
        // 庆历年间
        {
          dynasty: '庆历年间',
          color: 'bronze',
          tag: '院体画',
          description: '院体画风格严谨，工笔重彩，极尽精致。',
          scientist: '画院画家',
          year: '1041-1048年',
          title: '院体画艺术',
          detailedInfo: '庆历年间，画院画家创作了大量工笔重彩作品，风格严谨，技法精湛，成为宋代绘画的重要流派。'
        },
        // 皇祐年间
        {
          dynasty: '皇祐年间',
          color: 'gold',
          tag: '草书',
          description: '宋代草书风格奔放，气势磅礴。',
          scientist: '黄庭坚',
          year: '1049-1054年',
          title: '草书艺术',
          detailedInfo: '皇祐年间，黄庭坚等书法家开创了宋代草书的新风格，笔势奔放，气势磅礴。'
        },
        // 至和年间
        {
          dynasty: '至和年间',
          color: 'red1',
          tag: '人物画',
          description: '宋代人物画注重写实，形神兼备。',
          scientist: '李公麟',
          year: '1054-1056年',
          title: '人物画艺术',
          detailedInfo: '至和年间，李公麟等画家创作了大量人物画作品，注重写实，形神兼备。'
        },
        // 嘉祐年间
        {
          dynasty: '嘉祐年间',
          color: 'gray',
          tag: '篆书',
          description: '宋代篆书风格古朴，笔力雄浑。',
          scientist: '米芾',
          year: '1056-1063年',
          title: '篆书艺术',
          detailedInfo: '嘉祐年间，米芾等书法家创作了大量篆书作品，风格古朴，笔力雄浑。'
        },
        // 治平年间
        {
          dynasty: '治平年间',
          color: 'purple',
          tag: '界画',
          description: '宋代界画注重透视，结构严谨。',
          scientist: '郭熙',
          year: '1064-1067年',
          title: '界画艺术',
          detailedInfo: '治平年间，郭熙等画家创作了大量界画作品，注重透视，结构严谨。'
        },
        // 熙宁年间
        {
          dynasty: '熙宁年间',
          color: 'blue',
          tag: '隶书',
          description: '宋代隶书风格端庄，笔力遒劲。',
          scientist: '苏轼',
          year: '1068-1077年',
          title: '隶书艺术',
          detailedInfo: '熙宁年间，苏轼等书法家创作了大量隶书作品，风格端庄，笔力遒劲。'
        },
        // 元丰年间
        {
          dynasty: '元丰年间',
          color: 'red',
          tag: '风俗画',
          description: '宋代风俗画生动活泼，富有生活气息。',
          scientist: '张择端',
          year: '1078-1085年',
          title: '风俗画艺术',
          detailedInfo: '元丰年间，张择端创作了《清明上河图》等风俗画作品，生动展现了宋代市井生活。'
        },
        // 元祐年间
        {
          dynasty: '元祐年间',
          color: 'purple',
          tag: '行草',
          description: '宋代行草风格流畅，气势磅礴。',
          scientist: '米芾',
          year: '1086-1094年',
          title: '行草艺术',
          detailedInfo: '元祐年间，米芾等书法家创作了大量行草作品，风格流畅，气势磅礴。'
        },
        // 绍圣年间
        {
          dynasty: '绍圣年间',
          color: 'darkgold',
          tag: '墨竹',
          description: '宋代墨竹画法独特，意境深远。',
          scientist: '文同',
          year: '1094-1098年',
          title: '墨竹艺术',
          detailedInfo: '绍圣年间，文同等画家创作了大量墨竹作品，画法独特，意境深远。'
        },
        // 元符年间
        {
          dynasty: '元符年间',
          color: 'qing',
          tag: '章草',
          description: '宋代章草风格古朴，笔力雄浑。',
          scientist: '黄庭坚',
          year: '1098-1100年',
          title: '章草艺术',
          detailedInfo: '元符年间，黄庭坚等书法家创作了大量章草作品，风格古朴，笔力雄浑。'
        },
        // 建中靖国年间
        {
          dynasty: '建中靖国年间',
          color: 'qing2',
          tag: '花鸟画',
          description: '宋代花鸟画工笔重彩，极尽精致。',
          scientist: '赵昌',
          year: '1101年',
          title: '花鸟画艺术',
          detailedInfo: '建中靖国年间，赵昌等画家创作了大量花鸟画作品，工笔重彩，极尽精致。'
        },
        // 崇宁年间
        {
          dynasty: '崇宁年间',
          color: 'blue1',
          tag: '大篆',
          description: '宋代大篆风格古朴，笔力雄浑。',
          scientist: '米芾',
          year: '1102-1106年',
          title: '大篆艺术',
          detailedInfo: '崇宁年间，米芾等书法家创作了大量大篆作品，风格古朴，笔力雄浑。'
        },
        // 大观年间
        {
          dynasty: '大观年间',
          color: 'blue2',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1107-1110年',
          title: '山水画艺术',
          detailedInfo: '大观年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        },
        // 政和年间
        {
          dynasty: '政和年间',
          color: 'green',
          tag: '小篆',
          description: '宋代小篆风格严谨，笔力遒劲。',
          scientist: '赵佶',
          year: '1111-1118年',
          title: '小篆艺术',
          detailedInfo: '政和年间，赵佶等书法家创作了大量小篆作品，风格严谨，笔力遒劲。'
        },
        // 重和年间
        {
          dynasty: '重和年间',
          color: 'bronze',
          tag: '人物画',
          description: '宋代人物画形神兼备，生动传神。',
          scientist: '李公麟',
          year: '1118-1119年',
          title: '人物画艺术',
          detailedInfo: '重和年间，李公麟等画家创作了大量人物画作品，形神兼备，生动传神。'
        },
        // 宣和年间
        {
          dynasty: '宣和年间',
          color: 'gold',
          tag: '隶书',
          description: '宋代隶书风格端庄，笔力遒劲。',
          scientist: '赵佶',
          year: '1119-1125年',
          title: '隶书艺术',
          detailedInfo: '宣和年间，赵佶等书法家创作了大量隶书作品，风格端庄，笔力遒劲。'
        },
        // 靖康年间
        {
          dynasty: '靖康年间',
          color: 'red1',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1126-1127年',
          title: '山水画艺术',
          detailedInfo: '靖康年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        },
        // 建炎年间
        {
          dynasty: '建炎年间',
          color: 'gray',
          tag: '行书',
          description: '宋代行书风格流畅，气势磅礴。',
          scientist: '米芾',
          year: '1127-1130年',
          title: '行书艺术',
          detailedInfo: '建炎年间，米芾等书法家创作了大量行书作品，风格流畅，气势磅礴。'
        },
        // 绍兴年间
        {
          dynasty: '绍兴年间',
          color: 'purple',
          tag: '花鸟画',
          description: '宋代花鸟画工笔重彩，极尽精致。',
          scientist: '赵昌',
          year: '1131-1162年',
          title: '花鸟画艺术',
          detailedInfo: '绍兴年间，赵昌等画家创作了大量花鸟画作品，工笔重彩，极尽精致。'
        },
        // 隆兴年间
        {
          dynasty: '隆兴年间',
          color: 'blue',
          tag: '草书',
          description: '宋代草书风格奔放，气势磅礴。',
          scientist: '黄庭坚',
          year: '1163-1164年',
          title: '草书艺术',
          detailedInfo: '隆兴年间，黄庭坚等书法家创作了大量草书作品，风格奔放，气势磅礴。'
        },
        // 乾道年间
        {
          dynasty: '乾道年间',
          color: 'red',
          tag: '人物画',
          description: '宋代人物画形神兼备，生动传神。',
          scientist: '李公麟',
          year: '1165-1173年',
          title: '人物画艺术',
          detailedInfo: '乾道年间，李公麟等画家创作了大量人物画作品，形神兼备，生动传神。'
        },
        // 淳熙年间
        {
          dynasty: '淳熙年间',
          color: 'purple',
          tag: '篆书',
          description: '宋代篆书风格古朴，笔力雄浑。',
          scientist: '米芾',
          year: '1174-1189年',
          title: '篆书艺术',
          detailedInfo: '淳熙年间，米芾等书法家创作了大量篆书作品，风格古朴，笔力雄浑。'
        },
        // 绍熙年间
        {
          dynasty: '绍熙年间',
          color: 'darkgold',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1190-1194年',
          title: '山水画艺术',
          detailedInfo: '绍熙年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        },
        // 庆元年间
        {
          dynasty: '庆元年间',
          color: 'qing',
          tag: '隶书',
          description: '宋代隶书风格端庄，笔力遒劲。',
          scientist: '赵佶',
          year: '1195-1200年',
          title: '隶书艺术',
          detailedInfo: '庆元年间，赵佶等书法家创作了大量隶书作品，风格端庄，笔力遒劲。'
        },
        // 嘉泰年间
        {
          dynasty: '嘉泰年间',
          color: 'qing2',
          tag: '花鸟画',
          description: '宋代花鸟画工笔重彩，极尽精致。',
          scientist: '赵昌',
          year: '1201-1204年',
          title: '花鸟画艺术',
          detailedInfo: '嘉泰年间，赵昌等画家创作了大量花鸟画作品，工笔重彩，极尽精致。'
        },
        // 开禧年间
        {
          dynasty: '开禧年间',
          color: 'blue1',
          tag: '行草',
          description: '宋代行草风格流畅，气势磅礴。',
          scientist: '米芾',
          year: '1205-1207年',
          title: '行草艺术',
          detailedInfo: '开禧年间，米芾等书法家创作了大量行草作品，风格流畅，气势磅礴。'
        },
        // 嘉定年间
        {
          dynasty: '嘉定年间',
          color: 'blue2',
          tag: '人物画',
          description: '宋代人物画形神兼备，生动传神。',
          scientist: '李公麟',
          year: '1208-1224年',
          title: '人物画艺术',
          detailedInfo: '嘉定年间，李公麟等画家创作了大量人物画作品，形神兼备，生动传神。'
        },
        // 宝庆年间
        {
          dynasty: '宝庆年间',
          color: 'green',
          tag: '章草',
          description: '宋代章草风格古朴，笔力雄浑。',
          scientist: '黄庭坚',
          year: '1225-1227年',
          title: '章草艺术',
          detailedInfo: '宝庆年间，黄庭坚等书法家创作了大量章草作品，风格古朴，笔力雄浑。'
        },
        // 绍定年间
        {
          dynasty: '绍定年间',
          color: 'bronze',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1228-1233年',
          title: '山水画艺术',
          detailedInfo: '绍定年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        },
        // 端平年间
        {
          dynasty: '端平年间',
          color: 'gold',
          tag: '大篆',
          description: '宋代大篆风格古朴，笔力雄浑。',
          scientist: '米芾',
          year: '1234-1236年',
          title: '大篆艺术',
          detailedInfo: '端平年间，米芾等书法家创作了大量大篆作品，风格古朴，笔力雄浑。'
        },
        // 嘉熙年间
        {
          dynasty: '嘉熙年间',
          color: 'red1',
          tag: '花鸟画',
          description: '宋代花鸟画工笔重彩，极尽精致。',
          scientist: '赵昌',
          year: '1237-1240年',
          title: '花鸟画艺术',
          detailedInfo: '嘉熙年间，赵昌等画家创作了大量花鸟画作品，工笔重彩，极尽精致。'
        },
        // 淳祐年间
        {
          dynasty: '淳祐年间',
          color: 'gray',
          tag: '小篆',
          description: '宋代小篆风格严谨，笔力遒劲。',
          scientist: '赵佶',
          year: '1241-1252年',
          title: '小篆艺术',
          detailedInfo: '淳祐年间，赵佶等书法家创作了大量小篆作品，风格严谨，笔力遒劲。'
        },
        // 宝祐年间
        {
          dynasty: '宝祐年间',
          color: 'purple',
          tag: '人物画',
          description: '宋代人物画形神兼备，生动传神。',
          scientist: '李公麟',
          year: '1253-1258年',
          title: '人物画艺术',
          detailedInfo: '宝祐年间，李公麟等画家创作了大量人物画作品，形神兼备，生动传神。'
        },
        // 开庆年间
        {
          dynasty: '开庆年间',
          color: 'blue',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1259年',
          title: '山水画艺术',
          detailedInfo: '开庆年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        },
        // 景定年间
        {
          dynasty: '景定年间',
          color: 'red',
          tag: '隶书',
          description: '宋代隶书风格端庄，笔力遒劲。',
          scientist: '赵佶',
          year: '1260-1264年',
          title: '隶书艺术',
          detailedInfo: '景定年间，赵佶等书法家创作了大量隶书作品，风格端庄，笔力遒劲。'
        },
        // 咸淳年间
        {
          dynasty: '咸淳年间',
          color: 'purple',
          tag: '行书',
          description: '宋代行书风格流畅，气势磅礴。',
          scientist: '米芾',
          year: '1265-1274年',
          title: '行书艺术',
          detailedInfo: '咸淳年间，米芾等书法家创作了大量行书作品，风格流畅，气势磅礴。'
        },
        // 德祐年间
        {
          dynasty: '德祐年间',
          color: 'darkgold',
          tag: '花鸟画',
          description: '宋代花鸟画工笔重彩，极尽精致。',
          scientist: '赵昌',
          year: '1275-1276年',
          title: '花鸟画艺术',
          detailedInfo: '德祐年间，赵昌等画家创作了大量花鸟画作品，工笔重彩，极尽精致。'
        },
        // 景炎年间
        {
          dynasty: '景炎年间',
          color: 'qing',
          tag: '人物画',
          description: '宋代人物画形神兼备，生动传神。',
          scientist: '李公麟',
          year: '1276-1278年',
          title: '人物画艺术',
          detailedInfo: '景炎年间，李公麟等画家创作了大量人物画作品，形神兼备，生动传神。'
        },
        // 祥兴年间
        {
          dynasty: '祥兴年间',
          color: 'qing2',
          tag: '山水画',
          description: '宋代山水画意境深远，气势磅礴。',
          scientist: '郭熙',
          year: '1278-1279年',
          title: '山水画艺术',
          detailedInfo: '祥兴年间，郭熙等画家创作了大量山水画作品，意境深远，气势磅礴。'
        }
      ]
    };
  },
  created() {
    // 预加载翻转状态，避免首次翻转卡顿
    this.$nextTick(() => {
      // 添加翻转预加载
      const styleEl = document.createElement('style');
      styleEl.textContent = `
        .tech-card.preload { transform: rotateY(180deg); }
        /* 避免背面闪烁 */
        .card-front, .card-back { 
          -webkit-backface-visibility: hidden !important; 
          backface-visibility: hidden !important; 
        }
      `;
      document.head.appendChild(styleEl);
      setTimeout(() => document.head.removeChild(styleEl), 100);
    });
  },
  methods: {
    toggleCardFlip(index) {
      // Vue 3中不需要$set，直接创建新数组来触发响应性更新
      const newFlippedCards = [...this.flippedCards];
      newFlippedCards[index] = !newFlippedCards[index];
      this.flippedCards = newFlippedCards;
    },
    selectPeriod(index) {
      this.selectedIndex = index;
      // 重置所有翻转状态
      this.flippedCards = this.flippedCards.map(() => false);
      
      // 确保卡片区域滚动到可见位置
      this.$nextTick(() => {
        const cardsArea = document.querySelector('.cards-area');
        if (cardsArea) {
          const card = cardsArea.children[index];
          if (card) {
            card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
          }
        }
      });
    },
    scrollTimeline(direction) {
      const timeline = this.$refs.timeline;
      if (timeline) {
        const scrollAmount = 200;
        const currentScroll = timeline.scrollLeft;
        
        if (direction === 'left') {
          timeline.scrollLeft -= scrollAmount;
        } else {
          timeline.scrollLeft += scrollAmount;
          
          // 检查是否已经滚动到最右端
          const maxScroll = timeline.scrollWidth - timeline.offsetWidth;
          if (timeline.scrollLeft > maxScroll - 20) {
            timeline.scrollLeft = maxScroll; // 确保显示最右侧内容
          }
        }
      }
    },
    scrollToSelectedItem() {
      // 滚动到选中的时间节点
      this.$nextTick(() => {
        const timeline = this.$refs.timeline;
        const items = timeline.querySelectorAll('.timeline-item');
        
        if (items.length > 0 && this.selectedIndex < items.length) {
          const selectedItem = items[this.selectedIndex];
          
          // 计算位置以使选中项居中
          const timelineWidth = timeline.offsetWidth;
          const itemLeft = selectedItem.offsetLeft;
          const itemWidth = selectedItem.offsetWidth;
          
          const scrollPosition = itemLeft - (timelineWidth / 2) + (itemWidth / 2);
          
          timeline.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
          });
        }
      });
    },
    showMoziTimeline(event) {
      // 阻止事件冒泡，避免触发卡片翻转
      if (event) event.stopPropagation();
      this.showingMoziTimeline = true;
    },
    closeMoziTimeline() {
      this.showingMoziTimeline = false;
    },
    ensureLastItemVisible() {
      const timeline = this.$refs.timeline;
      if (timeline) {
        // 强制重新计算总宽度
        timeline.style.width = '100%';
      }
    },
    adjustTimelineWidth() {
      const timeline = this.$refs.timeline;
      if (timeline) {
        // 获取所有时间点元素
        const items = timeline.querySelectorAll('.timeline-item');
        const line = timeline.querySelector('.timeline-line');
        if (items.length > 0 && line) {
          const firstItem = items[0];
          const lastItem = items[items.length - 1];
          // 计算主线宽度 = 最后一个节点的右边界 - 第一个节点的左边界
          const left = firstItem.offsetLeft;
          const right = lastItem.offsetLeft + lastItem.offsetWidth;
          const width = right - left;
          line.style.left = left + 'px';
          line.style.width = width + 'px';
        }
        // 保持原有的内边距和最小宽度逻辑
        if (items.length > 0) {
          timeline.style.justifyContent = 'flex-start';
          const lastItem = items[items.length - 1];
          const extraPadding = 120;
          timeline.style.paddingRight = `${extraPadding}px`;
          this.scrollToSelectedItem();
          this.$nextTick(() => {
            const firstItem = items[0];
            const lastItem = items[items.length - 1];
            const timelineContentWidth = lastItem.offsetLeft + lastItem.offsetWidth - firstItem.offsetLeft;
            if (timeline.scrollWidth < timelineContentWidth + extraPadding) {
              timeline.style.minWidth = `${timelineContentWidth + extraPadding}px`;
            }
          });
        }
      }
    }
  },
  watch: {
    selectedIndex() {
      // 当选中索引变化时，滚动到相应位置
      this.scrollToSelectedItem();
    }
  },
  mounted() {
    console.log('HistoryTimeline mounted!');
    // 初始滚动到选中项
    this.scrollToSelectedItem();
    
    // 确保初始化时线条和时间轴正确渲染
    this.$nextTick(() => {
      const timeline = this.$refs.timeline;
      
      // 调整时间轴容器宽度，确保内容完整显示
      if (timeline) {
        // 确保所有元素都可见
        this.adjustTimelineWidth();
        
        // 监听窗口大小变化，调整时间轴
        window.addEventListener('resize', this.adjustTimelineWidth);
      }
    });
  },
  beforeDestroy() {
    // 移除事件监听，防止内存泄漏
    window.removeEventListener('resize', this.adjustTimelineWidth);
  }
};
</script>

<style scoped>
.history-timeline {
  width: 100%;
  max-width: 100%;
  margin: 0 auto;
  padding: 60px 10px 10px 10px;
  color: #e8e0c9;
  font-family: "楷体", "KaiTi", serif;
  min-height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: hidden;
  background: linear-gradient(to bottom, rgba(36, 26, 16, 0.95), rgba(46, 33, 20, 0.95));
}

/* 完全移除标题相关样式 */
.small-title, .history-timeline h1, .history-timeline h2 {
  display: none;
}

/* 时间轴样式 */
.timeline-container {
  display: flex;
  align-items: center;
  margin: 40px 0 25px;
  position: relative;
  padding: 0 25px;
  width: 98%;
  max-width: 1600px;
  overflow: visible;
  box-sizing: border-box; /* 确保padding不影响宽度计算 */
}

/* 调整时间轴容器结构，确保线条贯穿整个时间轴 */
.timeline {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  position: relative;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  padding: 10px 30px 10px 30px;
  margin: 0;
  width: 100%;
  min-width: 100%;
  z-index: 1;
}

.timeline-line {
  position: absolute;
  top: 50%;
  height: 4px;
  background: repeating-linear-gradient(90deg, 
    rgba(189, 155, 94, 0.05) 0px, 
    rgba(189, 155, 94, 0.15) 2px, 
    rgba(216, 184, 112, 0.3) 4px, 
    rgba(216, 184, 112, 0.5) 6px,
    rgba(216, 184, 112, 0.7) 8px,
    rgba(216, 184, 112, 0.5) 10px,
    rgba(216, 184, 112, 0.3) 12px,
    rgba(189, 155, 94, 0.15) 14px,
    rgba(189, 155, 94, 0.05) 16px
  );
  z-index: 0;
  border-top: 1px solid rgba(216, 184, 112, 0.8);
  border-bottom: 1px solid rgba(216, 184, 112, 0.8);
  box-shadow: 0 0 8px rgba(216, 184, 112, 0.4);
  pointer-events: none;
  /* 不再设置left:0; right:0; width:100% 由JS动态设置 */
}

.timeline-item {
  z-index: 2;
  background: transparent;
}

/* 增强导航按钮样式 */
.timeline-nav-btn {
  background: rgba(189, 155, 94, 0.15);
  border: 1px solid rgba(189, 155, 94, 0.4);
  color: #d8b870;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 4;
  transition: all 0.2s ease;
  font-weight: bold;
  box-shadow: 0 0 8px rgba(189, 155, 94, 0.2);
  position: relative;
}

.left-btn {
  margin-right: 8px;
}

.right-btn {
  margin-left: 8px;
}

.timeline-nav-btn:hover {
  background: rgba(189, 155, 94, 0.25);
  box-shadow: 0 0 12px rgba(189, 155, 94, 0.3);
  transform: scale(1.1);
}

/* 节点样式 */
.timeline-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
  padding: 0 10px;
  margin: 0 10px; /* 减小节点间距 */
  transform: translateZ(0);
  -webkit-transform: translateZ(0);
  -moz-transform: translateZ(0);
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
  -moz-backface-visibility: hidden;
}

/* 修改首尾节点的边距 */
.timeline-item:first-child {
  margin-left: 20px; /* 增加首个节点的左边距 */
}

.timeline-item:last-child {
  margin-right: 60px; /* 大幅增加最后节点的右边距，确保完全显示 */
}

.timeline-item:hover .timeline-dot {
  transform: scale(1.2);
  box-shadow: 0 0 12px rgba(216, 184, 112, 0.6);
}

/* 时间轴节点样式 */
.timeline-dot {
  position: relative;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  background: radial-gradient(circle at center, #d8b870 30%, #bd9b5e 70%);
  margin: 10px 0;
  transition: all 0.3s ease;
  border: 2px solid rgba(232, 224, 201, 0.3);
  box-shadow: 0 0 8px rgba(189, 155, 94, 0.3);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
}

.timeline-dot::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.8), rgba(255, 255, 255, 0.1));
  opacity: 0.7;
}

/* 增强时间轴节点与线的连接效果 */
.timeline-dot::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -20px;
  right: -20px;
  height: 2px;
  background: 
    linear-gradient(
      to right,
      transparent,
      rgba(216, 184, 112, 0.6) 45%,
      rgba(216, 184, 112, 0.6) 55%,
      transparent
    );
  transform: translateY(-50%);
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.timeline-item:hover .timeline-dot::before,
.timeline-item.active .timeline-dot::before {
  opacity: 1;
}

.timeline-item.active .timeline-dot {
  width: 24px;
  height: 24px;
  background: radial-gradient(circle at center, #e8d090 30%, #d8b870 70%);
  box-shadow: 0 0 15px rgba(216, 184, 112, 0.7), inset 0 0 5px rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(232, 224, 201, 0.6);
}

.timeline-item.active .timeline-dot::after {
  width: 10px;
  height: 10px;
  top: 5px;
  left: 5px;
}

.timeline-label {
  font-size: 22px;
  text-align: center;
  color: #d8b870;
  transition: all 0.3s ease;
  white-space: nowrap;
  margin: 8px 0;
  font-weight: bold;
}

.timeline-item.active .timeline-label {
  font-weight: bold;
  transform: scale(1.1);
  color: #e8d090;
  text-shadow: 0 0 8px rgba(216, 184, 112, 0.5);
  font-size: 24px;
}

.timeline-upper, .timeline-lower {
  height: 45px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 0 5px;
}

.science-name {
  font-size: 18px;
  color: #c7b68e;
  text-align: center;
  transition: all 0.3s ease;
  opacity: 0.8;
  line-height: 1.3;
}

.timeline-item.active .science-name {
  color: #e8d090;
  opacity: 1;
  font-weight: bold;
  transform: scale(1.05);
  font-size: 20px;
}

/* 卡片样式 */
.cards-area {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  width: 100%;
  max-width: 1600px;
  perspective: 1000px;
  padding: 0 15px;
  margin-bottom: 20px;
}

.tech-card {
  width: 300px;
  height: 400px;
  perspective: 2000px;
  cursor: pointer;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  transform-style: preserve-3d;
  margin: 20px;
  position: relative;
  border-radius: 18px;
  box-shadow: 0 10px 32px 0 rgba(0,0,0,0.35), 0 0 0 4px rgba(216,184,112,0.08);
  background: linear-gradient(135deg, #3a2c1a 60%, #6e5b3b 100%);
  border: 1.5px solid #e8d090;
}

.tech-card:hover {
  transform: translateY(-12px) scale(1.02);
  box-shadow: 0 18px 40px 0 rgba(0,0,0,0.45), 0 0 0 6px rgba(216,184,112,0.15);
}

.tech-card.active {
  box-shadow: 0 22px 50px 0 rgba(0,0,0,0.55), 0 0 0 8px rgba(216,184,112,0.22);
  border: 2px solid #ffe9a3;
  transform: translateY(-18px) scale(1.03);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 18px;
  overflow: hidden;
  padding: 32px 24px 28px 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: linear-gradient(135deg, #3a2c1a 60%, #6e5b3b 100%);
  will-change: transform;
}

.tech-card.flipped {
  transform: rotateY(180deg);
}

.tech-card.flipped:hover {
  transform: rotateY(180deg) translateY(-8px);
}

.card-back {
  transform: rotateY(180deg);
}

/* 优化卡片内容过渡效果 */
.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(10px);
}

.tech-card:hover .card-front h3,
.tech-card:hover .card-back h3 {
  transform: scale(1.02) translateY(0);
  opacity: 1;
}

.tech-card:hover .card-tag {
  transform: translateY(-2px);
  opacity: 1;
}

.tech-card:hover .card-front p,
.tech-card:hover .card-back p,
.tech-card:hover .back-info {
  transform: translateY(0);
  opacity: 1;
}

/* 优化卡片内容动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  animation: fadeInUp 0.4s ease-out forwards;
}

.card-front p {
  animation-delay: 0.05s;
}

.card-front .card-tag {
  animation-delay: 0.1s;
}

.card-back h3 {
  animation-delay: 0.05s;
}

.card-back p {
  animation-delay: 0.1s;
}

.back-info {
  animation-delay: 0.15s;
}

/* 添加卡片内容过渡效果 */
.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  transition: all 0.4s ease;
  opacity: 0;
  transform: translateY(20px);
}

.tech-card:hover .card-front h3,
.tech-card:hover .card-back h3 {
  transform: scale(1.05) translateY(0);
  opacity: 1;
}

.tech-card:hover .card-tag {
  transform: translateY(-2px);
  opacity: 1;
}

.tech-card:hover .card-front p,
.tech-card:hover .card-back p,
.tech-card:hover .back-info {
  transform: translateY(0);
  opacity: 1;
}

/* 添加卡片内容动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  animation: fadeInUp 0.6s ease-out forwards;
}

.card-front p {
  animation-delay: 0.1s;
}

.card-front .card-tag {
  animation-delay: 0.2s;
}

.card-back h3 {
  animation-delay: 0.1s;
}

.card-back p {
  animation-delay: 0.2s;
}

.back-info {
  animation-delay: 0.3s;
}

/* 优化卡片内容样式 */
.card-front h3,
.card-back h3 {
  font-size: 2.1rem;
  margin-bottom: 18px;
  color: #f0e6c9;
  text-shadow: 0 2px 8px rgba(0,0,0,0.25), 0 0 2px #e8d090;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.card-tag {
  background: rgba(216,184,112,0.15);
  color: #f0e6c9;
  font-weight: bold;
  border-radius: 22px;
  padding: 10px 22px;
  margin: 18px auto 10px auto;
  font-size: 1.15rem;
  box-shadow: 0 2px 8px rgba(216,184,112,0.18), 0 0 0 2px rgba(216,184,112,0.10);
  border: 1.5px solid #e8d090;
  text-shadow: 0 1px 4px rgba(255,255,255,0.18);
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.tech-card p {
  color: #f0e6c9;
  font-size: 1.18rem;
  line-height: 1.8;
  margin-top: 12px;
  text-shadow: 0 2px 8px rgba(0,0,0,0.45);
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.back-info {
  margin-top: 18px;
  display: flex;
  justify-content: space-between;
  font-size: 1.08rem;
  color: #f0e6c9;
  padding-top: 10px;
  border-top: 1.5px solid #e8d090;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  text-shadow: 0 1px 4px rgba(0,0,0,0.18);
}

.scientist, .year {
  font-weight: bold;
  color: #ffe9a3;
}

.tech-card.flipped {
  transform: rotateY(180deg);
}

.tech-card.flipped:hover {
  transform: rotateY(180deg) translateY(-12px);
}

.tech-card.active .card-tag {
  background: rgba(216, 184, 112, 0.25);
  border: 1px solid rgba(216, 184, 112, 0.5);
  color: #f0e6c9;
  box-shadow: 0 0 8px rgba(216, 184, 112, 0.4);
}

.tech-card.flipped {
  transform: rotateY(180deg);
}

.tech-card.flipped:hover {
  transform: rotateY(180deg) translateY(-12px);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transition: transform 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  border-radius: 15px;
  overflow: hidden;
  padding: 25px;
}

.card-front {
  background: linear-gradient(135deg, rgba(245, 247, 250, 0.95), rgba(195, 207, 226, 0.95));
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.card-front::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h100v100H0z" fill="none"/><path d="M10 10h80v80H10z" stroke="rgba(0,0,0,0.1)" stroke-width="1" fill="none"/></svg>') repeat;
  opacity: 0.1;
  pointer-events: none;
}

.card-back {
  background: linear-gradient(135deg, #e8e0c9 80%, #b6b09a 100%);
  color: #3a2c1a;
  border-radius: 18px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.10);
  padding: 38px 32px 32px 32px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: center;
  min-height: 100%;
}

.card-back h3 {
  font-size: 2.3rem;
  font-weight: bold;
  margin-bottom: 24px;
  white-space: nowrap; /* 避免断行 */
  letter-spacing: 2px;
  color: #5a4a2c;
  text-shadow: 0 2px 8px rgba(216,184,112,0.18);
}

.card-back p {
  font-size: 1.18rem;
  line-height: 2.1;
  margin-bottom: 32px;
  color: #3a2c1a;
  text-align: center;
  padding: 0 8px;
}

.card-back .back-info {
  margin-top: 24px;
  padding-top: 12px;
  border-top: 1.5px dashed #b6b09a;
  width: 100%;
  display: flex;
  justify-content: space-between;
  font-size: 1.05rem;
  color: #7c6a4a;
  opacity: 0.85;
}

.tech-card h3 {
  text-align: center;
  margin-bottom: 20px;
  color: #2c3e50;
  font-size: 2rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  position: relative;
  z-index: 2;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.card-tag {
  background: rgba(189, 155, 94, 0.15);
  color: #2c3e50;
  padding: 8px 16px;
  border-radius: 20px;
  text-align: center;
  margin: 15px auto;
  width: fit-content;
  font-size: 18px;
  position: relative;
  z-index: 2;
  backdrop-filter: blur(4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(189, 155, 94, 0.3);
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.tech-card p {
  flex: 1;
  font-size: 18px;
  line-height: 1.8;
  color: #34495e;
  position: relative;
  z-index: 2;
  margin-top: 15px;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.back-info {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  font-size: 17px;
  color: #2c3e50;
  padding-top: 15px;
  border-top: 1px solid rgba(189, 155, 94, 0.3);
  position: relative;
  z-index: 2;
  width: 100%;
}

.scientist {
  font-weight: bold;
  color: #2c3e50;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

.year {
  color: #2c3e50;
  opacity: 0.8;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
}

/* 卡片颜色样式 - 优化后的主题 */
.tech-card.blue1 .card-front, .tech-card.blue1 .card-back {
  background: linear-gradient(135deg, rgba(55, 65, 82, 0.95), rgba(76, 90, 114, 0.95));
  border: 1px solid rgba(89, 108, 137, 0.5);
}

.tech-card.blue2 .card-front, .tech-card.blue2 .card-back {
  background: linear-gradient(135deg, rgba(45, 62, 90, 0.95), rgba(62, 85, 128, 0.95));
  border: 1px solid rgba(76, 102, 153, 0.5);
}

.tech-card.green .card-front, .tech-card.green .card-back {
  background: linear-gradient(135deg, rgba(61, 74, 54, 0.95), rgba(83, 104, 69, 0.95));
  border: 1px solid rgba(102, 121, 80, 0.5);
}

.tech-card.bronze .card-front, .tech-card.bronze .card-back {
  background: linear-gradient(135deg, rgba(118, 89, 58, 0.95), rgba(150, 115, 76, 0.95));
  border: 1px solid rgba(178, 138, 92, 0.5);
}

.tech-card.gold .card-front, .tech-card.gold .card-back {
  background: linear-gradient(135deg, rgba(109, 88, 58, 0.95), rgba(145, 119, 67, 0.95));
  border: 1px solid rgba(189, 155, 94, 0.5);
}

.tech-card.purple .card-front, .tech-card.purple .card-back {
  background: linear-gradient(135deg, rgba(74, 58, 74, 0.95), rgba(100, 71, 99, 0.95));
  border: 1px solid rgba(125, 85, 135, 0.5);
}

.tech-card.blue .card-front, .tech-card.blue .card-back {
  background: linear-gradient(135deg, rgba(57, 74, 90, 0.95), rgba(78, 99, 120, 0.95));
  border: 1px solid rgba(93, 117, 145, 0.5);
}

.tech-card.red .card-front, .tech-card.red .card-back {
  background: linear-gradient(135deg, rgba(92, 60, 48, 0.95), rgba(122, 78, 64, 0.95));
  border: 1px solid rgba(144, 94, 78, 0.5);
}

.tech-card.qing .card-front, .tech-card.qing .card-back {
  background: linear-gradient(135deg, rgba(58, 74, 71, 0.95), rgba(78, 100, 97, 0.95));
  border: 1px solid rgba(95, 120, 115, 0.5);
}

.tech-card.cyan .card-front, .tech-card.cyan .card-back {
  background: linear-gradient(135deg, rgba(57, 89, 84, 0.95), rgba(78, 118, 112, 0.95));
  border: 1px solid rgba(92, 140, 132, 0.5);
}

.tech-card.gray .card-front, .tech-card.gray .card-back {
  background: linear-gradient(135deg, rgba(64, 64, 64, 0.95), rgba(90, 90, 90, 0.95));
  border: 1px solid rgba(112, 112, 112, 0.5);
}

.tech-card.red1 .card-front, .tech-card.red1 .card-back {
  background: linear-gradient(135deg, rgba(89, 58, 52, 0.95), rgba(122, 78, 71, 0.95));
  border: 1px solid rgba(144, 94, 87, 0.5);
}

.tech-card.qing2 .card-front, .tech-card.qing2 .card-back {
  background: linear-gradient(135deg, rgba(48, 74, 70, 0.95), rgba(65, 97, 96, 0.95));
  border: 1px solid rgba(78, 117, 113, 0.5);
}

.tech-card.darkgold .card-front, .tech-card.darkgold .card-back {
  background: linear-gradient(135deg, rgba(104, 82, 58, 0.95), rgba(156, 123, 76, 0.95));
  border: 1px solid rgba(184, 144, 89, 0.5);
}

/* 添加卡片装饰元素 */
.tech-card::after {
  content: '';
  position: absolute;
  top: 10px;
  right: 10px;
  width: 40px;
  height: 40px;
  background: url('data:image/svg+xml,<svg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"><path d="M20 0L40 20L20 40L0 20z" fill="rgba(255,255,255,0.1)"/></svg>') no-repeat;
  opacity: 0.1;
  pointer-events: none;
}

/* 优化卡片翻转效果 */
.tech-card.flipped {
  transform: rotateY(180deg);
}

.tech-card.flipped:hover {
  transform: rotateY(180deg) translateY(-8px) scale(1.02);
}

/* 添加卡片内容过渡效果 */
.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  transition: all 0.3s ease;
}

.tech-card:hover .card-front h3,
.tech-card:hover .card-back h3 {
  transform: scale(1.05);
}

.tech-card:hover .card-tag {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

/* 添加卡片内容阴影效果 */
.card-front h3,
.card-back h3 {
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.card-tag {
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
}

/* 优化卡片内容布局 */
.card-front,
.card-back {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px;
}

.card-front h3,
.card-back h3 {
  margin-bottom: 20px;
}

.card-front p,
.card-back p {
  margin: 15px 0;
  line-height: 1.8;
}

.back-info {
  margin-top: 20px;
  padding-top: 15px;
  border-top: 1px solid rgba(189, 155, 94, 0.3);
}

/* 添加卡片内容动画效果 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.card-front h3,
.card-front p,
.card-front .card-tag,
.card-back h3,
.card-back p,
.back-info {
  animation: fadeIn 0.5s ease-out forwards;
}

.card-front p {
  animation-delay: 0.1s;
}

.card-front .card-tag {
  animation-delay: 0.2s;
}

.card-back h3 {
  animation-delay: 0.1s;
}

.card-back p {
  animation-delay: 0.2s;
}

.back-info {
  animation-delay: 0.3s;
}

/* 响应式布局 */
@media (min-width: 1920px) {
  .cards-area {
    grid-template-columns: repeat(5, 1fr);
    max-width: 1800px;
  }
  
  .tech-card {
    height: 380px;
  }
  
  .timeline-item {
    min-width: 160px;
  }
  
  .timeline-dot {
    width: 24px;
    height: 24px;
  }
  
  .timeline-item.active .timeline-dot {
    width: 32px;
    height: 32px;
  }
  
  .timeline-label {
    font-size: 20px;
  }
  
  .science-name {
    font-size: 18px;
  }
}

@media (max-width: 1200px) {
  .cards-area {
    grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  }
  
  .timeline-item {
    min-width: 110px;
    margin: 0 10px;
  }
  
  .science-name {
    font-size: 13px;
  }
}

@media (max-width: 768px) {
  .cards-area {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 15px;
  }
  
  .tech-card {
    height: 300px;
  }
  
  .timeline {
    padding: 0 10px;
    margin: 20px 0 40px;
  }
  
  .timeline-item {
    min-width: 90px;
    margin: 0 5px;
  }
  
  .timeline-label {
    font-size: 14px;
  }
  
  .science-name {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .cards-area {
    grid-template-columns: 1fr;
    padding: 0 10px;
  }
  
  .tech-card {
    height: 280px;
  }
  
  .timeline {
    margin: 10px 0 30px;
  }
  
  .timeline-item {
    min-width: 70px;
    margin: 0 3px;
    transform: scale(0.9);
  }
  
  .timeline-dot {
    width: 14px;
    height: 14px;
  }
  
  .timeline-item.active .timeline-dot {
    width: 20px;
    height: 20px;
  }
  
  .timeline-label {
    font-size: 12px;
  }
  
  .science-name {
    font-size: 10px;
  }
}

.card-front h3 {
  font-size: 2rem;
  margin-bottom: 15px;
  color: #f0e6c9;
}

.card-front p {
  font-size: 17px;
  line-height: 1.6;
}

.card-front .card-tag {
  font-size: 17px;
  padding: 7px 14px;
}

/* 添加卡片操作按钮样式 */
.card-actions {
  margin-top: 15px;
  display: flex;
  justify-content: center;
}

.explore-btn {
  background-color: rgba(211, 183, 142, 0.8);
  color: #1a0f0f;
  border: none;
  padding: 8px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  transition: all 0.3s ease;
  font-size: 14px;
}

.explore-btn:hover {
  background-color: rgba(211, 183, 142, 1);
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
}

/* 添加时间轴两端装饰 */
.timeline-container::before,
.timeline-container::after {
  content: ''; 
  position: absolute;
  top: 50%;
  width: 28px; /* 进一步增大装饰元素 */
  height: 28px; /* 进一步增大装饰元素 */
  background: radial-gradient(circle, #e8d090, #bd9b5e);
  border: 2px solid rgba(232, 224, 201, 0.8);
  border-radius: 50%;
  transform: translateY(-50%);
  box-shadow: 0 0 15px rgba(216, 184, 112, 0.8);
  z-index: 10; /* 增加z-index确保显示在线条上方 */
}

.timeline-container::before {
  left: -2px; /* 调整左侧装饰位置 */
  background-image: 
    radial-gradient(circle, #e8d090, #bd9b5e),
    linear-gradient(45deg, transparent 45%, #74613a 45%, #74613a 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, #74613a 45%, #74613a 55%, transparent 55%);
  background-size: 100%, 16px 16px, 16px 16px; /* 调整装饰图案大小 */
  background-position: center, center, center;
  background-repeat: no-repeat;
}

.timeline-container::after {
  right: -2px; /* 调整右侧装饰位置，确保完全显示 */
  background-image: 
    radial-gradient(circle, #e8d090, #bd9b5e),
    linear-gradient(45deg, transparent 45%, #74613a 45%, #74613a 55%, transparent 55%),
    linear-gradient(-45deg, transparent 45%, #74613a 45%, #74613a 55%, transparent 55%);
  background-size: 100%, 16px 16px, 16px 16px; /* 调整装饰图案大小 */
  background-position: center, center, center;
  background-repeat: no-repeat;
}

.timeline::-webkit-scrollbar {
  display: none; /* 对WebKit浏览器隐藏滚动条 */
}

.tech-card .card-front p,
.tech-card .card-back p {
  color: #f0e6c9 !important;
  background: none !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.tech-card .card-front .card-tag,
.tech-card .card-back .card-tag {
  color: #f0e6c9 !important;
}

.tech-card .card-front p,
.tech-card .card-back p,
.tech-card .card-front .card-tag,
.tech-card .card-back .card-tag,
.tech-card .card-front h3,
.tech-card .card-back h3,
.tech-card .back-info,
.tech-card .back-info .scientist,
.tech-card .back-info .year {
  color: #f0e6c9 !important;
  text-shadow: 0 2px 8px rgba(0,0,0,0.18);
}

.tech-card .back-info {
  border-top: 1.5px solid #f0e6c9 !important;
}
</style> 