<template>
  <div class="history-timeline-container">
    <!-- 背景叠加层 -->
    <div class="overlay-layer"></div>
    
    <!-- 顶部控制区域 -->
    <div class="header-section">
  
      <!-- 图例 -->
      <div class="legend">
        <div class="legend-item" v-for="(category, index) in categories" :key="index">
          <div class="legend-color" :style="{ backgroundColor: category.color }"></div>
          <div class="legend-name">{{ category.name }}</div>
        </div>
      </div>
      <!-- 筛选按钮 -->
      <div class="timeline-filter">
        <span>艺术门类筛选：</span>
        <button :class="{ active: currentView === 'all' }" @click="currentView = 'all'">全部</button>
        <button :class="{ active: currentView === 'painting' }" @click="currentView = 'painting'">绘画</button>
        <button :class="{ active: currentView === 'calligraphy' }" @click="currentView = 'calligraphy'">书法</button>
        <button :class="{ active: currentView === 'ceramics' }" @click="currentView = 'ceramics'">瓷器</button>
        <button :class="{ active: currentView === 'architecture' }" @click="currentView = 'architecture'">建筑</button>
        <button :class="{ active: currentView === 'craft' }" @click="currentView = 'craft'">工艺</button>
        <button :class="{ active: currentView === 'other' }" @click="currentView = 'other'">其他</button>
      </div>
    </div>

    <!-- 主可视化区域 -->
    <div class="visualization-container">
      <div class="circular-timeline">
        <!-- 中心徽标 -->
        <div class="center-logo">
          <div class="center-text">宋代贤哲<br>格物图绘</div>
        </div>
        
        <!-- 科学家放射线 - 直接显示不使用过渡 -->
        <div 
          v-for="(scientist, index) in filteredScientists" 
          :key="scientist.name"
          class="scientist-ray" 
          :class="{ active: selectedScientist === scientist, [scientist.category]: true }"
          :style="getRayStyle(index, filteredScientists.length)"
          @click="selectScientist(scientist, $event)"
          @mouseover="hoverScientist(scientist, $event)"
          @mouseleave="hoverScientist(null)"
        >
          <div class="ray-line"></div>
          <div class="ray-endpoint"></div>
          <div class="scientist-name-label">{{ scientist.name }}</div>
        </div>

        <!-- 同心环装饰 -->
        <div class="concentric-rings">
          <div v-for="index in 6" :key="'ring-'+index" class="ring"></div>
        </div>
      </div>
    </div>

    <!-- 全局悬浮信息框（简要目录） -->
    <div class="global-scientist-info" 
         v-if="hoveredScientist || selectedScientist" 
         :style="hoverInfoStyle">
      <div class="info-content">
        <div class="info-header">
          <span class="info-dynasty">{{ (hoveredScientist || selectedScientist).dynasty }}</span>
          <span class="info-field">{{ (hoveredScientist || selectedScientist).field }}</span>
        </div>
        <div class="info-name">{{ (hoveredScientist || selectedScientist).name }}</div>
        <div class="info-achievement">{{ (hoveredScientist || selectedScientist).achievement }}</div>
      </div>
    </div>

    <!-- 详细信息卡片（左下角） -->
    <div class="side-info-card" v-if="hoveredScientist || selectedScientist">
      <div>
        <div class="info-header">
          <span class="info-dynasty">{{ (hoveredScientist || selectedScientist).dynasty }}</span>
          <span class="info-field">{{ (hoveredScientist || selectedScientist).field }}</span>
        </div>
        <div class="info-name">{{ (hoveredScientist || selectedScientist).name }}</div>
        <div class="info-years" v-if="(hoveredScientist || selectedScientist).years">生卒：{{ (hoveredScientist || selectedScientist).years }}</div>
        <div class="info-achievement"><b>成就：</b>{{ (hoveredScientist || selectedScientist).achievement }}</div>
        <div class="info-impact" v-if="(hoveredScientist || selectedScientist).impact"><b>影响：</b>{{ (hoveredScientist || selectedScientist).impact }}</div>
        <div class="info-description" v-if="(hoveredScientist || selectedScientist).description"><b>简介：</b>{{ (hoveredScientist || selectedScientist).description }}</div>
        <div class="info-works" v-if="(hoveredScientist || selectedScientist).works"><b>代表作：</b>{{ (hoveredScientist || selectedScientist).works }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HistoryTimeline',
  data() {
    return {
      selectedScientist: null,
      hoveredScientist: null,
      currentView: 'all',
      mousePos: { x: 0, y: 0 },
      categories: [
        { name: '绘画', color: '#8AB0D8' },
        { name: '书法', color: '#B790D4' },
        { name: '瓷器', color: '#D87F96' },
        { name: '建筑', color: '#E9A87A' },
        { name: '工艺', color: '#7ABD8A' },
        { name: '其他', color: '#E5C890' }
      ],
      scientists: [
        // 绘画（painting）
        {
          name: '张择端', dynasty: '北宋', years: '1085-1145', field: '绘画', category: 'painting', achievement: '代表作《清明上河图》，展现北宋都市生活。', impact: '推动中国风俗画和山水画的发展。',
          description: '张择端，北宋著名画家，以风俗画和山水画见长。他的《清明上河图》以细腻的笔触描绘了北宋都城汴京的繁华景象，是中国古代现实主义绘画的巅峰之作。张择端善于捕捉社会生活细节，对后世风俗画和城市题材绘画影响深远。',
          works: '《清明上河图》、风俗画系列' 
        },
        { name: '李公麟', dynasty: '北宋', years: '1049-1106', field: '绘画', category: 'painting', achievement: '以白描人物画著称，代表作《五马图》。', impact: '推动人物画技法发展。',
          description: '李公麟，北宋著名画家，以白描技法著称，擅长人物、马、佛道题材的绘画。他的线描简练传神，影响了元明以后的白描艺术。',
          works: '《五马图》《维摩诘像》《西园雅集图》' },
        { name: '郭熙', dynasty: '北宋', years: '1023-1085', field: '绘画', category: 'painting', achievement: '山水画家，代表作《早春图》。', impact: '提出"三远法"，影响后世山水画。',
          description: '郭熙，北宋山水画大师，提出"三远法"，强调空间层次与气韵生动。他的山水画构图宏伟，笔墨苍润，理论与实践并重。',
          works: '《早春图》《溪山行旅图》《林泉高致》' },
        { name: '范宽', dynasty: '北宋', years: '约950-1032', field: '绘画', category: 'painting', achievement: '山水画家，代表作《溪山行旅图》。', impact: '以雄浑厚重著称，影响深远。',
          description: '范宽，北宋山水画巨匠，画风雄浑厚重，善于表现北方山川的壮丽景色。他的作品强调自然的真实与气势。',
          works: '《溪山行旅图》《雪景寒林图》' },
        { name: '米芾', dynasty: '北宋', years: '1051-1107', field: '绘画、书法', category: 'painting', achievement: '"米点山水"开创者。', impact: '山水画风格独特。',
          description: '米芾，北宋著名书画家，开创"米点山水"画法，画风潇洒奔放，兼具书法之美。',
          works: '《潇湘奇观图》《云山墨戏图》' },
        { name: '赵佶', dynasty: '北宋', years: '1082-1135', field: '绘画、书法', category: 'painting', achievement: '宋徽宗，擅长花鸟画，代表作《瑞鹤图》。', impact: '创"瘦金体"，推动宫廷艺术。',
          description: '赵佶，即宋徽宗，北宋皇帝，艺术造诣极高，擅长花鸟画和书法，创"瘦金体"，推动宫廷艺术繁荣。',
          works: '《瑞鹤图》《听琴图》《瘦金体书法》' },
        { name: '马远', dynasty: '南宋', years: '约1160-1225', field: '绘画', category: 'painting', achievement: '山水画家，代表作《寒江独钓图》。', impact: '与夏圭并称"马夏"，影响南宋画风。',
          description: '马远，南宋山水画大师，构图简练，善用留白，与夏圭并称"马夏"，对南宋院体画风影响深远。',
          works: '《寒江独钓图》《水图》《山径春行图》' },
        { name: '夏圭', dynasty: '南宋', years: '约1180-1230', field: '绘画', category: 'painting', achievement: '山水画家，代表作《溪山清远图》。', impact: '与马远并称"马夏"，简约画风。',
          description: '夏圭，南宋山水画家，画风简约明快，善于表现江南水乡的清新意境。',
          works: '《溪山清远图》《雪堂客话图》' },
        { name: '梁楷', dynasty: '南宋', years: '约1140-1210', field: '绘画', category: 'painting', achievement: '以泼墨人物画著称，代表作《泼墨仙人图》。', impact: '推动写意画发展。',
          description: '梁楷，南宋画家，擅长人物、佛道题材，泼墨写意风格开创者之一，作品豪放自如。',
          works: '《泼墨仙人图》《六祖斫竹图》' },
        { name: '易元吉', dynasty: '南宋', years: '生卒年不详', field: '绘画', category: 'painting', achievement: '以动物画著称，代表作《百骏图》。', impact: '动物画成就突出。',
          description: '易元吉，南宋动物画家，擅长描绘马、牛等动物，作品生动传神。',
          works: '《百骏图》《群马图》' },
        { name: '王希孟', dynasty: '北宋', years: '约1096-1119', field: '绘画', category: 'painting', achievement: '代表作《千里江山图》。', impact: '青绿山水画巅峰之作。',
          description: '王希孟，北宋青年画家，擅长青绿山水，《千里江山图》被誉为中国青绿山水画的巅峰之作。',
          works: '《千里江山图》' },
        { name: '李唐', dynasty: '南宋', years: '约1066-1150', field: '绘画', category: 'painting', achievement: '山水画家，代表作《万壑松风图》。', impact: '南宋院体画代表人物。',
          description: '李唐，南宋山水画家，画风雄健，善于表现山川气势，是南宋院体画的代表人物。',
          works: '《万壑松风图》《江山小景图》' },

        // 书法（calligraphy）
        { name: '苏轼', dynasty: '北宋', years: '1037-1101', field: '书法、文学', category: 'calligraphy', achievement: '书法自成一派，代表作《黄州寒食帖》。', impact: '对后世书法艺术影响深远。',
          description: '苏轼，北宋著名文学家、书法家、画家，号东坡居士。其书法风格自成一派，兼收并蓄，气韵生动，尤以行书、楷书著称。其文学、书法、绘画成就均为宋代翘楚。',
          works: '《黄州寒食帖》《赤壁赋》《寒食帖》' },
        { name: '黄庭坚', dynasty: '北宋', years: '1045-1105', field: '书法', category: 'calligraphy', achievement: '"宋四家"之一，代表作《松风阁诗帖》。', impact: '以行书、草书著称。',
          description: '黄庭坚，北宋书法家、诗人，"宋四家"之一。其书法以行书、草书见长，笔力遒劲，章法新颖，影响深远。',
          works: '《松风阁诗帖》《诸上座帖》' },
        { name: '米芾', dynasty: '北宋', years: '1051-1107', field: '书法、绘画', category: 'calligraphy', achievement: '"米南宫"，代表作《苕溪诗帖》。', impact: '书法风格奔放。',
          description: '米芾，北宋著名书法家、画家，号襄阳漫士。书法以行书、草书著称，风格奔放自如，影响后世。',
          works: '《苕溪诗帖》《蜀素帖》' },
        { name: '蔡襄', dynasty: '北宋', years: '1012-1067', field: '书法', category: 'calligraphy', achievement: '"宋四家"之一，代表作《自书诗帖》。', impact: '楷书成就高。',
          description: '蔡襄，北宋书法家、政治家，"宋四家"之一。楷书端庄秀丽，行书流畅自然。',
          works: '《自书诗帖》《大观帖》' },
        { name: '赵佶', dynasty: '北宋', years: '1082-1135', field: '书法、绘画', category: 'calligraphy', achievement: '宋徽宗，创"瘦金体"。', impact: '宫廷书法代表。',
          description: '赵佶，即宋徽宗，北宋皇帝，书法创"瘦金体"，风格独特，影响深远。',
          works: '《瘦金体书法》《千字文》' },
        { name: '蔡京', dynasty: '北宋', years: '1047-1126', field: '书法', category: 'calligraphy', achievement: '以行书、楷书著称。', impact: '书法风格严谨。',
          description: '蔡京，北宋书法家、政治家，书法以行书、楷书见长，风格严谨工整。',
          works: '《蔡京书法残卷》' },
        { name: '赵孟頫', dynasty: '元', years: '1254-1322', field: '书法、绘画', category: 'calligraphy', achievement: '承宋学，代表作《胆巴碑》。', impact: '元代书法巨匠。',
          description: '赵孟頫，元代著名书法家、画家，承宋学，书法兼具晋唐风韵，影响元明清三代。',
          works: '《胆巴碑》《洛神赋》' },
        { name: '陆游', dynasty: '南宋', years: '1125-1210', field: '书法、文学', category: 'calligraphy', achievement: '诗书俱佳，代表作《自书诗卷》。', impact: '书法刚健有力。',
          description: '陆游，南宋著名诗人、书法家，书法刚健有力，诗文豪放激昂。',
          works: '《自书诗卷》《剑南诗稿》' },
        { name: '岳飞', dynasty: '南宋', years: '1103-1142', field: '书法、军事', category: 'calligraphy', achievement: '以行书著称，代表作《满江红》。', impact: '民族英雄，书法豪迈。',
          description: '岳飞，南宋著名抗金名将，亦擅书法，行书豪迈奔放，气势磅礴。',
          works: '《满江红》《岳飞手书》' },
        { name: '朱熹', dynasty: '南宋', years: '1130-1200', field: '书法、理学', category: 'calligraphy', achievement: '理学大师，书法端庄。', impact: '理学与书法结合。',
          description: '朱熹，南宋理学大师、书法家，书法端庄大气，理学思想深远。',
          works: '《朱熹书法》《四书集注》' },
        { name: '文天祥', dynasty: '南宋', years: '1236-1283', field: '书法、文学', category: 'calligraphy', achievement: '以正气歌著称。', impact: '民族气节象征。',
          description: '文天祥，南宋末年著名民族英雄、文学家、书法家，以正气歌著称，书法刚正有力。',
          works: '《正气歌》《文山诗集》' },
        { name: '李建中', dynasty: '北宋', years: '945-1013', field: '书法', category: 'calligraphy', achievement: '以楷书著称，代表作《土母帖》。', impact: '楷书规范。',
          description: '李建中，北宋书法家，楷书规范端正，影响后世楷书发展。',
          works: '《土母帖》《李建中书法》' },

        // 瓷器（ceramics）
        { name: '柴窑工匠', dynasty: '北宋', years: '约10世纪', field: '瓷器', category: 'ceramics', achievement: '创烧柴窑，宋代五大名窑之一。', impact: '推动宋代瓷器工艺发展。',
          description: '柴窑工匠，北宋时期著名瓷器工匠，创烧柴窑。柴窑以釉色温润、胎质细腻著称，传说柴窑瓷器"雨过天青云破处"，釉色如玉，极为稀有珍贵。柴窑的烧制工艺对后世瓷器发展产生了深远影响。',
          works: '柴窑青瓷、柴窑碗、柴窑瓶' },
        { name: '汝窑工匠', dynasty: '北宋', years: '约11世纪', field: '瓷器', category: 'ceramics', achievement: '汝窑，宋代五大名窑之一。', impact: '以天青釉著称。',
          description: '汝窑工匠，北宋著名瓷器工匠，烧制汝窑瓷器。汝窑以天青釉色、釉面开片闻名，数量稀少，被誉为"瓷器之冠"。汝窑工艺讲究"雨过天青云破处"，釉色温润如玉，极具收藏价值。',
          works: '汝窑天青釉碗、汝窑盘、汝窑瓶' },
        { name: '官窑工匠', dynasty: '南宋', years: '约12世纪', field: '瓷器', category: 'ceramics', achievement: '官窑，南宋宫廷专用。', impact: '釉色温润，工艺精湛。',
          description: '官窑工匠，南宋时期专为宫廷烧制瓷器，官窑瓷器釉色温润、造型端庄，工艺极为精湛，是宋瓷的代表。官窑以厚釉、紫口铁足、开片纹饰著称，体现了皇家审美与工艺巅峰。',
          works: '官窑瓶、官窑盘、官窑碗' },
        { name: '哥窑工匠', dynasty: '南宋', years: '约12世纪', field: '瓷器', category: 'ceramics', achievement: '哥窑，宋代五大名窑之一。', impact: '以开片釉闻名。',
          description: '哥窑工匠，南宋著名瓷器工匠，哥窑瓷器以釉面开片、色泽温润著称，工艺独特。哥窑的"金丝铁线"开片纹理极具艺术美感，是宋代瓷器工艺的杰出代表。',
          works: '哥窑开片釉瓶、哥窑碗' },
        { name: '定窑工匠', dynasty: '北宋', years: '约10-12世纪', field: '瓷器', category: 'ceramics', achievement: '定窑，宋代五大名窑之一。', impact: '以白瓷著称。',
          description: '定窑工匠，北宋著名瓷器工匠，定窑以白瓷著称，胎质细腻，装饰技法丰富。定窑瓷器常见刻花、印花装饰，造型优美，釉色洁白如玉，是宋代北方白瓷的典范。',
          works: '定窑白瓷碗、定窑刻花盘' },
        { name: '钧窑工匠', dynasty: '北宋', years: '约11-12世纪', field: '瓷器', category: 'ceramics', achievement: '钧窑，宋代五大名窑之一。', impact: '以变釉著称。',
          description: '钧窑工匠，北宋著名瓷器工匠，钧窑以变釉色彩斑斓著称，工艺独特，极具观赏价值。钧窑瓷器釉色有天蓝、紫红、月白等多种变化，呈现出"入窑一色，出窑万彩"的奇观。',
          works: '钧窑变釉花盆、钧窑盘' },
        { name: '龙泉窑工匠', dynasty: '南宋', years: '约12-13世纪', field: '瓷器', category: 'ceramics', achievement: '龙泉青瓷，南宋名窑。', impact: '青瓷工艺高峰。',
          description: '龙泉窑工匠，南宋著名青瓷工匠，龙泉青瓷以釉色青翠、造型优美著称，是中国青瓷工艺的高峰。龙泉窑瓷器釉色厚润，器型多样，远销海外，影响深远。',
          works: '龙泉青瓷瓶、龙泉青瓷盘' },
        { name: '景德镇窑工匠', dynasty: '宋元', years: '约11-14世纪', field: '瓷器', category: 'ceramics', achievement: '景德镇青白瓷。', impact: '成为中国瓷都。',
          description: '景德镇窑工匠，宋元时期著名瓷器工匠，景德镇成为中国瓷都，青白瓷工艺精湛，影响深远。景德镇瓷器以胎质细腻、釉色洁白、造型多样著称，是中国瓷器的重要代表。',
          works: '景德镇青白瓷瓶、景德镇瓷盘' },
        { name: '磁州窑工匠', dynasty: '宋', years: '约11-13世纪', field: '瓷器', category: 'ceramics', achievement: '磁州窑，北方民窑代表。', impact: '装饰技法丰富。',
          description: '磁州窑工匠，宋代北方著名民窑工匠，磁州窑以装饰技法丰富、题材多样著称。磁州窑瓷器常见黑花、白地、刻划、剔花等多种装饰，反映了民间生活和艺术趣味。',
          works: '磁州窑黑花瓷枕、磁州窑碗' },
        { name: '建窑工匠', dynasty: '北宋', years: '约11-13世纪', field: '瓷器', category: 'ceramics', achievement: '建盏，黑釉瓷器代表。', impact: '茶文化推动者。',
          description: '建窑工匠，北宋著名黑釉瓷器工匠，建盏以黑釉著称，是宋代茶文化的重要载体。建盏釉色有兔毫、油滴等多种花纹，深受文人雅士喜爱。',
          works: '建盏、兔毫盏' },
        { name: '越窑工匠', dynasty: '五代宋初', years: '约10世纪', field: '瓷器', category: 'ceramics', achievement: '越窑，青瓷名窑。', impact: '青瓷工艺先驱。',
          description: '越窑工匠，五代至宋初著名青瓷工匠，越窑青瓷釉色温润，是中国青瓷工艺的先驱。越窑瓷器造型端庄，釉色青翠，影响了后世南方青瓷的发展。',
          works: '越窑青瓷碗、越窑盘' },
        { name: '邢窑工匠', dynasty: '唐宋', years: '约9-10世纪', field: '瓷器', category: 'ceramics', achievement: '邢窑，白瓷先驱。', impact: '推动白瓷发展。',
          description: '邢窑工匠，唐宋时期著名白瓷工匠，邢窑以白瓷著称，是中国白瓷的先驱。邢窑瓷器胎质洁白，釉色明亮，对后世白瓷工艺影响深远。',
          works: '邢窑白瓷碗、邢窑盘' },

        // 建筑（architecture）
        { name: '李诫', dynasty: '北宋', years: '约1065-1110', field: '建筑', category: 'architecture', achievement: '编撰《营造法式》，系统总结宋代建筑设计与施工规范。', impact: '为后世建筑提供理论基础，推动中国古代建筑科学化。',
          description: '李诫，北宋著名建筑学家，主持编撰《营造法式》，该书是中国古代最系统的建筑规范著作，详细规定了建筑设计、结构、施工等标准，对后世建筑理论和实践影响深远。',
          works: '《营造法式》、宋代宫殿与寺庙建筑设计' },
        { name: '宇文虚中', dynasty: '北宋', years: '约11世纪', field: '建筑', category: 'architecture', achievement: '参与大型宫殿、寺庙建筑设计。', impact: '推动宋代建筑技术进步。',
          description: '宇文虚中，北宋著名建筑师，参与多项大型宫殿、寺庙的设计与建造，推动了宋代建筑技术和美学的发展。',
          works: '北宋宫殿、寺庙建筑项目' },
        { name: '喻皓', dynasty: '北宋', years: '约11世纪', field: '建筑', category: 'architecture', achievement: '著有《木经》，总结木构建筑经验。', impact: '影响后世木结构建筑。',
          description: '喻皓，北宋建筑理论家，著有《木经》，系统总结了中国古代木构建筑的结构与施工经验，对后世木结构建筑影响深远。',
          works: '《木经》、木构建筑理论' },
        { name: '乐史', dynasty: '北宋', years: '930-1007', field: '建筑、地理', category: 'architecture', achievement: '著有《太原志》，记载城市建筑。', impact: '为城市规划提供参考。',
          description: '乐史，北宋地理学家、建筑学家，著有《太原志》，详细记载了城市建筑与规划，为后世城市建设提供了重要参考。',
          works: '《太原志》、城市规划文献' },
        { name: '俞希鲁', dynasty: '南宋', years: '生卒年不详', field: '建筑', category: 'architecture', achievement: '著有《营造法原》。', impact: '补充完善建筑理论。',
          description: '俞希鲁，南宋建筑理论家，著有《营造法原》，对宋代建筑理论进行了补充和完善，推动了建筑学的发展。',
          works: '《营造法原》' },
        { name: '赵令畤', dynasty: '北宋', years: '生卒年不详', field: '建筑、乐器', category: 'architecture', achievement: '著有《侯鲭录》，记载建筑与乐器。', impact: '多领域成就。',
          description: '赵令畤，北宋建筑师、乐器专家，著有《侯鲭录》，内容涵盖建筑、乐器等多个领域，展现了宋代多元文化。',
          works: '《侯鲭录》' },
        { name: '王黼', dynasty: '北宋', years: '1079-1126', field: '建筑', category: 'architecture', achievement: '主持宫殿营建。', impact: '推动宫廷建筑发展。',
          description: '王黼，北宋权臣，主持多项宫殿营建工程，推动了宋代宫廷建筑的发展。',
          works: '北宋宫殿建筑项目' },
        { name: '王安石', dynasty: '北宋', years: '1021-1086', field: '建筑、经济', category: 'architecture', achievement: '主持新城建设。', impact: '推动城市规划。',
          description: '王安石，北宋著名政治家、改革家，主持新城建设，重视城市规划与基础设施建设，对宋代城市发展有重要贡献。',
          works: '新城建设、城市规划改革' },
        { name: '朱昂', dynasty: '南宋', years: '生卒年不详', field: '桥梁设计', category: 'architecture', achievement: '桥梁设计专家。', impact: '推动桥梁工程发展。',
          description: '朱昂，南宋著名桥梁设计专家，主持和参与多项大型桥梁工程，推动了中国古代桥梁技术的发展。',
          works: '大型桥梁设计、南宋桥梁工程' },
        { name: '朱载堉', dynasty: '明初承宋学', years: '1536-1611', field: '建筑理论', category: 'architecture', achievement: '建筑理论家。', impact: '理论影响深远。',
          description: '朱载堉，明代著名建筑理论家，承宋学，提出多项建筑理论，对后世建筑学发展有重要影响。',
          works: '建筑理论著作' },
        { name: '释道原', dynasty: '北宋', years: '生卒年不详', field: '寺庙建筑', category: 'architecture', achievement: '主持寺庙建筑。', impact: '推动佛教建筑发展。',
          description: '释道原，北宋著名寺庙建筑师，主持多项寺庙建筑工程，推动了佛教建筑的发展。',
          works: '寺庙建筑项目' },
        { name: '释智圆', dynasty: '北宋', years: '976-1022', field: '寺庙营造', category: 'architecture', achievement: '寺庙营造专家。', impact: '推动宗教建筑发展。',
          description: '释智圆，北宋寺庙营造专家，擅长寺庙建筑设计与施工，推动了宗教建筑的发展。',
          works: '寺庙营造工程' },

        // 工艺（craft）
        { name: '毕昇', dynasty: '北宋', years: '约970-1051', field: '印刷术', category: 'craft', achievement: '发明活字印刷术，解决文化传播技术瓶颈。', impact: '极大促进知识传播，被誉为"世界四大发明"之一。',
          description: '毕昇，北宋著名工匠，发明了泥活字印刷术，极大地提高了印刷效率和文化传播速度，是中国古代科技史上的重要人物。',
          works: '泥活字印刷术、活字印刷工艺' },
        { name: '蔡襄', dynasty: '北宋', years: '1012-1067', field: '水利、工艺', category: 'craft', achievement: '主持建造福建万安桥，改进造纸、制茶工艺。', impact: '推动宋代水利和工艺技术进步。',
          description: '蔡襄，北宋著名政治家、工艺家，主持建造福建万安桥，并对造纸、制茶等工艺进行改进，推动了宋代工艺技术的发展。',
          works: '福建万安桥、造纸工艺改进、制茶工艺' },
        { name: '沈括', dynasty: '北宋', years: '1031-1095', field: '机械、冶金', category: 'craft', achievement: '改进水运仪象台齿轮、冶铁鼓风炉等机械。', impact: '推动机械制造和冶金技术发展。',
          description: '沈括，北宋著名科学家、工程师，对机械制造和冶金技术有重要贡献，改进了水运仪象台齿轮和冶铁鼓风炉等机械。',
          works: '水运仪象台、冶铁鼓风炉' },
        { name: '王祯', dynasty: '元', years: '约1271-1333', field: '农书与木活字', category: 'craft', achievement: '发明木活字印刷，著有《农书》。', impact: '推动农业与印刷技术。',
          description: '王祯，元代著名农学家、工艺家，发明木活字印刷术，著有《农书》，推动了农业和印刷技术的发展。',
          works: '木活字印刷术、《农书》' },
        { name: '郭守敬', dynasty: '元', years: '1231-1316', field: '天文仪器', category: 'craft', achievement: '改进天文仪器。', impact: '推动科技进步。',
          description: '郭守敬，元代著名天文学家、工程师，改进了多种天文仪器，对中国古代天文学和科技进步有重要贡献。',
          works: '简仪、仰仪、天文观测仪器' },
        { name: '赵令畤', dynasty: '北宋', years: '生卒年不详', field: '乐器制作', category: 'craft', achievement: '乐器制作专家。', impact: '推动乐器工艺发展。',
          description: '赵令畤，北宋乐器制作专家，精通多种乐器的制作工艺，推动了宋代乐器工艺的发展。',
          works: '乐器制作工艺、乐器改良' },
        { name: '朱载堉', dynasty: '明初承宋学', years: '1536-1611', field: '律吕改革', category: 'craft', achievement: '发明十二平均律。', impact: '推动音律科学化。',
          description: '朱载堉，明代著名音乐理论家、工艺家，发明十二平均律，推动了音律的科学化和音乐理论的发展。',
          works: '十二平均律、音乐理论著作' },
        { name: '叶梦得', dynasty: '北宋', years: '1077-1148', field: '水利工程', category: 'craft', achievement: '主持水利工程。', impact: '推动水利技术进步。',
          description: '叶梦得，北宋著名水利工程师，主持多项水利工程，推动了宋代水利技术的进步。',
          works: '水利工程项目' },
        { name: '李诫', dynasty: '北宋', years: '约1065-1110', field: '建筑工艺', category: 'craft', achievement: '总结建筑工艺。', impact: '推动建筑工艺标准化。',
          description: '李诫，北宋著名建筑学家，系统总结了建筑工艺，推动了建筑工艺的标准化和科学化。',
          works: '《营造法式》、建筑工艺标准' },
        { name: '赵佶', dynasty: '北宋', years: '1082-1135', field: '工艺美术', category: 'craft', achievement: '推动宫廷工艺美术。', impact: '提升工艺美术水平。',
          description: '赵佶，即宋徽宗，北宋皇帝，极力推动宫廷工艺美术的发展，提升了宋代工艺美术的整体水平。',
          works: '宫廷工艺美术品、艺术创新' },
        { name: '司马光', dynasty: '北宋', years: '1019-1086', field: '水钟', category: 'craft', achievement: '改进水钟计时。', impact: '推动计时技术发展。',
          description: '司马光，北宋著名历史学家、工艺家，改进了水钟计时技术，推动了宋代计时技术的发展。',
          works: '水钟、计时器改良' },
        { name: '赵明诚', dynasty: '南宋', years: '1081-1129', field: '青铜器研究', category: 'craft', achievement: '研究青铜器铭文。', impact: '推动金石学发展。',
          description: '赵明诚，南宋著名金石学家，专注于青铜器铭文的研究，推动了中国金石学的发展。',
          works: '青铜器铭文研究、金石学著作' },

        // 其他（other）
        { name: '朱熹', dynasty: '南宋', years: '1130-1200', field: '理学', category: 'other', achievement: '集理学与自然科学于一身，著有《朱子语类》。', impact: '推动理学与科学结合，影响后世思想与科学发展。',
          description: '朱熹，南宋著名理学家、教育家，集理学与自然科学于一身，著有《朱子语类》，推动了理学与科学的结合，对后世思想和科学发展影响深远。',
          works: '《朱子语类》《四书集注》' },
        { name: '王安石', dynasty: '北宋', years: '1021-1086', field: '经济改革', category: 'other', achievement: '推行青苗法、均输法，重视农学与经济改革。', impact: '推动宋代农业和经济制度创新。',
          description: '王安石，北宋著名政治家、改革家，推行青苗法、均输法等经济改革，重视农学与经济制度创新，对宋代社会经济发展有重要影响。',
          works: '青苗法、均输法、农学改革' },
        { name: '叶适', dynasty: '南宋', years: '1150-1223', field: '实学', category: 'other', achievement: '著有《习学记言》，重视实学与地理考察。', impact: '推动宋代实学与地理学发展。',
          description: '叶适，南宋著名实学家、地理学家，著有《习学记言》，重视实学与地理考察，推动了宋代实学与地理学的发展。',
          works: '《习学记言》、地理考察文献' },
        { name: '朱载堉', dynasty: '明初承宋学', years: '1536-1611', field: '音律', category: 'other', achievement: '发明十二平均律，推动音律与历法科学化。', impact: '对世界音乐理论和历法发展有重要影响。',
          description: '朱载堉，明代著名音乐理论家、历法学家，发明十二平均律，推动了音律与历法的科学化，对世界音乐理论和历法发展有重要影响。',
          works: '十二平均律、音乐与历法著作' },
        { name: '欧阳修', dynasty: '北宋', years: '1007-1072', field: '史学', category: 'other', achievement: '著有《新五代史》。', impact: '史学与文学成就突出。',
          description: '欧阳修，北宋著名史学家、文学家，著有《新五代史》，在史学和文学领域均有突出成就。',
          works: '《新五代史》《欧阳文忠公文集》' },
        { name: '司马光', dynasty: '北宋', years: '1019-1086', field: '史学', category: 'other', achievement: '著有《资治通鉴》。', impact: '史学巨著，影响深远。',
          description: '司马光，北宋著名史学家、政治家，著有《资治通鉴》，该书是中国古代最重要的编年体通史之一，影响深远。',
          works: '《资治通鉴》《司马文正公集》' },
        { name: '程颢', dynasty: '北宋', years: '1032-1085', field: '理学', category: 'other', achievement: '理学创始人之一。', impact: '推动宋明理学发展。',
          description: '程颢，北宋著名理学家，理学创始人之一，与弟程颐共同推动了宋明理学的发展。',
          works: '理学著作、哲学论文' },
        { name: '程颐', dynasty: '北宋', years: '1033-1107', field: '理学', category: 'other', achievement: '理学创始人之一。', impact: '理学体系奠基人。',
          description: '程颐，北宋著名理学家，理学体系奠基人，与兄程颢共同奠定了宋明理学的基础。',
          works: '理学著作、哲学论文' },
        { name: '陆九渊', dynasty: '南宋', years: '1139-1193', field: '心学', category: 'other', achievement: '心学代表人物。', impact: '影响明清心学发展。',
          description: '陆九渊，南宋著名哲学家，心学代表人物，对明清心学的发展有重要影响。',
          works: '心学著作、哲学论文' },
        { name: '文天祥', dynasty: '南宋', years: '1236-1283', field: '民族气节', category: 'other', achievement: '以正气歌著称。', impact: '民族气节象征。',
          description: '文天祥，南宋末年著名民族英雄、文学家，以正气歌著称，是民族气节的象征。',
          works: '《正气歌》《文山诗集》' },
        { name: '陆游', dynasty: '南宋', years: '1125-1210', field: '诗文', category: 'other', achievement: '著有《剑南诗稿》。', impact: '诗文成就卓著。',
          description: '陆游，南宋著名诗人、文学家，著有《剑南诗稿》，诗文成就卓著，影响深远。',
          works: '《剑南诗稿》《陆放翁集》' },
        { name: '苏轼', dynasty: '北宋', years: '1037-1101', field: '文学', category: 'other', achievement: '文学、艺术全才。', impact: '对中国文化影响深远。',
          description: '苏轼，北宋著名文学家、艺术家，文学、书法、绘画皆有极高成就，对中国文化影响深远。',
          works: '《东坡全集》《赤壁赋》《念奴娇·赤壁怀古》' }
      ]
    }
  },
  computed: {
    filteredScientists() {
      if (this.currentView === 'all') {
        return this.scientists;
      }
      return this.scientists.filter(s => s.category === this.currentView);
    },
    hoverInfoStyle() {
      return {
        left: `${this.mousePos.x + 15}px`,
        top: `${this.mousePos.y - 15}px`
      }
    }
  },
  methods: {
    selectScientist(scientist, event) {
      if (this.selectedScientist === scientist) {
        this.selectedScientist = null;
      } else {
        this.selectedScientist = scientist;
        if (event) {
          this.updateMousePosition(event);
        }
      }
    },
    hoverScientist(scientist, event) {
      this.hoveredScientist = scientist;
      if (event) {
        this.updateMousePosition(event);
      }
    },
    updateMousePosition(event) {
      this.mousePos = { x: event.clientX, y: event.clientY };
    },
    getRayStyle(index, total) {
      // 在圆周上均匀分布，每个科学家分配相等的角度
      // 计算每个科学家之间的角度步长
      const angleStep = 360 / total;
      
      // 为了增加视觉多样性，使用两个不同的半径长度交替出现
      const isAlternate = index % 3;  // 0, 1, 2循环
      let baseLength = '45%';
      
      if (isAlternate === 1) {
        baseLength = '50%';  // 稍长的放射线
      } else if (isAlternate === 2) {
        baseLength = '40%';  // 稍短的放射线
      }
      
      // 计算最终角度，均匀分布在整个圆周上
      const angle = (index * angleStep) % 360;
      
      // 根据角度范围决定文本标签位置
      // 在90-270度范围内的标签放在左侧
      const labelPosition = (angle > 80 && angle < 280) ? 'left' : 'right';
      
      return {
        transform: `rotate(${angle}deg)`,
        width: baseLength,
        '--ray-angle': `${angle}deg`, // 传递角度给CSS变量
        '--label-position': labelPosition, // 传递标签位置给CSS变量
        '--category-color': this.getCategoryColor(this.filteredScientists[index].category) // 添加类别颜色变量
      };
    },
    // 提取年份数值用于计算时间跨度
    getYearSpan(yearStr) {
      // 处理形如"公元前xxx年-公元前xxx年"或"xxx年-xxx年"的格式
      if (yearStr.includes('-')) {
        const parts = yearStr.split('-');
        return this.extractYear(parts[0]); // 取早期年份
      }
      // 处理形如"公元前xxx世纪"或"约公元xxx世纪"的格式
      else if (yearStr.includes('世纪')) {
        const match = yearStr.match(/(\d+)世纪/);
        if (match) {
          let century = parseInt(match[1]);
          if (yearStr.includes('公元前')) {
            return -century * 100 + 50; // 公元前x世纪，取中间值
          } else {
            return century * 100 - 50; // 公元x世纪，取中间值
          }
        }
      }
      // 处理单一年份
      else {
        return this.extractYear(yearStr);
      }
      
      return 0; // 默认值
    },
    // 从字符串中提取年份数值
    extractYear(yearStr) {
      const match = yearStr.match(/(\d+)年/);
      if (match) {
        let year = parseInt(match[1]);
        if (yearStr.includes('公元前')) {
          return -year;
        } else {
          return year;
        }
      }
      return 0;
    },
    getCategoryColor(category) {
      const colorMap = {
        'painting': '#8AB0D8',
        'calligraphy': '#B790D4',
        'ceramics': '#D87F96',
        'architecture': '#E9A87A',
        'craft': '#7ABD8A',
        'other': '#E5C890'
      };
      return colorMap[category] || '#E5C890';
    },
    getLabelPosition(index, total) {
      const angleStep = 360 / total;
      const angle = (index * angleStep) % 360;
      if (angle > 135 && angle < 225) {
        return 'left';
      } else {
        return 'right';
      }
    }
  },
  mounted() {
    // 默认不选中任何科学家
    this.selectedScientist = null;
    
    // 设置各个图例项目的颜色
    setTimeout(() => {
      this.categories.forEach((category, index) => {
        const legendItems = document.querySelectorAll('.legend-item');
        if (legendItems[index]) {
          const colorElement = legendItems[index].querySelector('.legend-color');
          if (colorElement) {
            colorElement.style.setProperty('--legend-color', category.color);
            colorElement.style.backgroundColor = category.color;
          }
        }
      });
    }, 0);
    
    // 添加全局鼠标移动监听
    document.addEventListener('mousemove', this.updateMousePosition);
    
    // 手动设置背景图片
    const container = document.querySelector('.history-timeline-container');
    if (container) {
      container.style.backgroundImage = 'url(/jingweichengluo.jpg)';
      container.style.backgroundSize = 'cover';
      container.style.backgroundPosition = 'center center';
      container.style.backgroundRepeat = 'no-repeat';
    }
  },
  beforeDestroy() {
    // 移除全局鼠标移动监听
    document.removeEventListener('mousemove', this.updateMousePosition);
  },
  watch: {
    currentView() {
      // 清除选中状态，重置视图
      this.selectedScientist = null;
      this.hoveredScientist = null;
    }
  }
}
</script>

<style scoped>
.history-timeline-container {
  min-height: 100vh;
  padding: 0;
  color: #e6e1d6;
  font-family: "STFangsong", "华文仿宋", "仿宋", serif;
  overflow-x: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: url('../assets/jingweichengluo.jpg') no-repeat center center;
  background-size: cover;
}

/* 顶部控制区域 */
.header-section {
  width: 100%;
  padding: 1.5rem 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
  backdrop-filter: none;
  border-bottom: none;
  box-shadow: none;
}

/* 图例样式 */
.legend {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1rem 2rem;
  background-color: transparent;
  border-radius: 0;
  backdrop-filter: none;
  border: none;
  box-shadow: none;
}

.legend-item {
  display: flex;
  align-items: center;
  background-color: rgba(26, 15, 15, 0.5);
  padding: 0.35rem 1.1rem;
  border-radius: 14px;
  border: 1.5px solid rgba(211, 183, 142, 0.3);
  backdrop-filter: blur(6px);
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.12);
}

.legend-color {
  width: 1.5rem;
  height: 1.5rem;
  border-radius: 50%;
  margin-right: 0.8rem;
  box-shadow: 0 0 10px var(--legend-color, rgba(229, 200, 144, 0.4));
  border: 1.5px solid rgba(255, 255, 255, 0.35);
}

.legend-name {
  font-size: 1.1rem;
  color: #e2c89f;
  letter-spacing: 1.5px;
}

/* 筛选按钮 */
.timeline-filter {
  text-align: center;
  margin: 0 auto;
  padding: 0.6rem 0;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: nowrap;
  gap: 2rem;
  background-color: transparent;
  overflow-x: auto;
}

.timeline-filter span {
  font-weight: bold;
  margin-right: 1rem;
  color: #e2c89f;
  background-color: rgba(26, 15, 15, 0.5);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  border: 1px solid rgba(211, 183, 142, 0.3);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
}

.timeline-filter button {
  background-color: rgba(26, 15, 15, 0.5);
  border: 1px solid rgba(211, 183, 142, 0.3);
  color: #c4b59e;
  padding: 0.6rem 2rem;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  border-radius: 14px;
  backdrop-filter: blur(8px);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
  white-space: nowrap;
}

.timeline-filter button:after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: 0;
  left: 50%;
  background-color: #e2c89f;
  transition: width 0.3s ease;
  transform: translateX(-50%);
}

.timeline-filter button:before {
  display: none;
}

.timeline-filter button.active, .timeline-filter button:hover {
  color: #f2e6d9;
  background-color: rgba(40, 25, 20, 0.6);
  box-shadow: 0 0 10px rgba(211, 183, 142, 0.3);
  transform: translateY(-2px);
}

.timeline-filter button.active:after {
  width: 80%;
}

/* 可视化容器 */
.visualization-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80vh;
  width: 100%;
  margin-top: 1rem;
}

.circular-timeline {
  position: relative;
  width: 85vmin;
  height: 85vmin;
  max-width: 850px;
  max-height: 850px;
  margin: 0 auto;
  border-radius: 50%;
  border: 1px solid rgba(211, 183, 142, 0.3);
  background: radial-gradient(circle, rgba(40, 25, 20, 0.3) 0%, rgba(20, 12, 8, 0.6) 100%);
  box-shadow: 0 0 30px rgba(0, 0, 0, 0.5), inset 0 0 50px rgba(211, 183, 142, 0.1);
}

/* 中心徽标 */
.center-logo {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 15%;  
  height: 15%;  
  background: rgba(26, 15, 15, 0.7);
  border-radius: 50%;
  border: 1px solid rgba(211, 183, 142, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 20;
  box-shadow: 0 0 20px rgba(211, 183, 142, 0.3);
}

.center-text {
  font-size: 1rem;
  font-weight: bold;
  color: #f2e6d9;
  text-align: center;
  text-shadow: 0 0 10px rgba(211, 183, 142, 0.7);
  z-index: 2;
  line-height: 1.5;
  letter-spacing: 1px;
}

/* 科学家放射线样式 */
.scientist-ray {
  position: absolute;
  top: 50%;
  left: 50%;
  height: 4px;
  transform-origin: left center;
  cursor: pointer;
  transition: all 0.3s ease;
  z-index: 5;
}

.ray-line {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px; 
  transform-origin: left center;
  opacity: 0.7;
  transition: all 0.3s ease;
}

.ray-endpoint {
  position: absolute;
  top: 50%;
  right: -8px;
  width: 16px;  
  height: 16px;  
  border-radius: 50%;
  transform: translate(0, -50%);
  z-index: 10;
  box-shadow: 0 0 15px currentColor;
  border: 2px solid rgba(255, 255, 255, 0.6);
  transition: all 0.3s ease;
  
  /* 脉冲动画调整 */
  animation: gentle-pulse 4s infinite alternate ease-in-out;
}

@keyframes gentle-pulse {
  0% { opacity: 0.8; box-shadow: 0 0 8px currentColor; }
  100% { opacity: 1; box-shadow: 0 0 15px currentColor, 0 0 25px rgba(211, 183, 142, 0.4); }
}

/* 优化科学家名称标签，使其随环形旋转 */
.scientist-name-label {
  position: absolute;
  font-size: 0.95rem;
  color: #e2c89f;
  white-space: nowrap;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.9);
  transition: all 0.3s ease;
  padding: 3px 8px;
  border-radius: 3px;
  background-color: rgba(26, 15, 15, 0.5);
  border: 1px solid rgba(211, 183, 142, 0.1);
  backdrop-filter: blur(3px);
}

/* 名字随着放射线角度旋转 */
.scientist-ray .scientist-name-label {
  top: 50%;
  right: 0;
  transform: translate(calc(100% + 10px), -50%);
  transform-origin: left center;
  opacity: 0.85;
}

/* 被选中或悬停时的样式调整 */
.scientist-ray.active .scientist-name-label,
.scientist-ray:hover .scientist-name-label {
  color: #f2e6d9;
  filter: brightness(1.2);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(211, 183, 142, 0.7);
  background-color: rgba(40, 25, 20, 0.8);
  border-color: rgba(211, 183, 142, 0.3);
  opacity: 1;
}

/* 同心环装饰 */
.concentric-rings {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  pointer-events: none;
  display: block;
}

.ring {
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 50%;
  border: 1px solid rgba(211, 183, 142, 0.15);
  transform: translate(-50%, -50%);
}

.ring:nth-child(1) {
  width: 20%;
  height: 20%;
}

.ring:nth-child(2) {
  width: 40%;
  height: 40%;
}

.ring:nth-child(3) {
  width: 60%;
  height: 60%;
}

.ring:nth-child(4) {
  width: 80%;
  height: 80%;
}

.ring:nth-child(5) {
  width: 95%;
  height: 95%;
  border-width: 2px;
}

/* 全局悬浮信息框样式 */
.global-scientist-info {
  position: fixed;
  width: 300px;
  background-color: rgba(26, 15, 15, 0.85);
  border-radius: 8px;
  padding: 1.2rem;
  border: 1px solid rgba(211, 183, 142, 0.4);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.6), 0 0 30px rgba(211, 183, 142, 0.1);
  z-index: 1000;
  pointer-events: none;
  backdrop-filter: blur(8px);
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.info-content {
  position: relative;
}

.info-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.8rem;
  padding-bottom: 0.6rem;
  border-bottom: 1px solid rgba(211, 183, 142, 0.3);
}

.info-dynasty {
  color: #e2c89f;
  font-weight: bold;
  font-size: 0.9rem;
}

.info-field {
  color: #c4b59e;
  font-size: 0.9rem;
}

.info-name {
  color: #f2e6d9;
  font-size: 1.7rem;
  font-weight: bold;
  margin-bottom: 0.7rem;
  letter-spacing: 2px;
  text-shadow: 0 2px 8px rgba(229, 200, 144, 0.18);
  z-index: 2;
}

.info-achievement {
  color: #f2e6d9;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 0.8rem;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.6);
  z-index: 2;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .circular-timeline {
    width: 90vmin;
    height: 90vmin;
  }
  
  .center-text {
    font-size: 0.9rem;
  }
  
  .timeline-filter button {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
  }
  
  .legend {
    gap: 1rem;
    padding: 0.5rem;
  }

  .legend-name {
    font-size: 0.8rem;
  }
}

/* 各领域放射线颜色 增加色彩饱和度和亮度 */
.scientist-ray.painting .ray-line {
  background: linear-gradient(90deg, rgba(138, 176, 216, 0.3), rgba(138, 176, 216, 0.9));
  box-shadow: 0 0 10px rgba(138, 176, 216, 0.5);
}

.scientist-ray.calligraphy .ray-line {
  background: linear-gradient(90deg, rgba(183, 144, 212, 0.3), rgba(183, 144, 212, 0.9));
  box-shadow: 0 0 10px rgba(183, 144, 212, 0.5);
}

.scientist-ray.ceramics .ray-line {
  background: linear-gradient(90deg, rgba(216, 127, 150, 0.3), rgba(216, 127, 150, 0.9));
  box-shadow: 0 0 10px rgba(216, 127, 150, 0.5);
}

.scientist-ray.architecture .ray-line {
  background: linear-gradient(90deg, rgba(233, 168, 122, 0.3), rgba(233, 168, 122, 0.9));
  box-shadow: 0 0 10px rgba(233, 168, 122, 0.5);
}

.scientist-ray.craft .ray-line {
  background: linear-gradient(90deg, rgba(122, 189, 138, 0.3), rgba(122, 189, 138, 0.9));
  box-shadow: 0 0 10px rgba(122, 189, 138, 0.5);
}

.scientist-ray.other .ray-line {
  background: linear-gradient(90deg, rgba(229, 200, 144, 0.3), rgba(229, 200, 144, 0.9));
  box-shadow: 0 0 10px rgba(229, 200, 144, 0.5);
}

/* 增强各领域端点的亮度和大小 */
.scientist-ray.painting .ray-endpoint {
  background-color: rgba(138, 176, 216, 0.9);
  box-shadow: 0 0 15px rgba(138, 176, 216, 0.9), 0 0 25px rgba(138, 176, 216, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.scientist-ray.calligraphy .ray-endpoint {
  background-color: rgba(183, 144, 212, 0.9);
  box-shadow: 0 0 15px rgba(183, 144, 212, 0.9), 0 0 25px rgba(183, 144, 212, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.scientist-ray.ceramics .ray-endpoint {
  background-color: rgba(216, 127, 150, 0.9);
  box-shadow: 0 0 15px rgba(216, 127, 150, 0.9), 0 0 25px rgba(216, 127, 150, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.scientist-ray.architecture .ray-endpoint {
  background-color: rgba(233, 168, 122, 0.9);
  box-shadow: 0 0 15px rgba(233, 168, 122, 0.9), 0 0 25px rgba(233, 168, 122, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.scientist-ray.craft .ray-endpoint {
  background-color: rgba(122, 189, 138, 0.9);
  box-shadow: 0 0 15px rgba(122, 189, 138, 0.9), 0 0 25px rgba(122, 189, 138, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

.scientist-ray.other .ray-endpoint {
  background-color: rgba(229, 200, 144, 0.9);
  box-shadow: 0 0 15px rgba(229, 200, 144, 0.9), 0 0 25px rgba(229, 200, 144, 0.6);
  border: 2px solid rgba(255, 255, 255, 0.7);
}

/* 被选中时更加突出 */
.scientist-ray.active .ray-line,
.scientist-ray:hover .ray-line {
  height: 4px;
  opacity: 1;
  filter: brightness(1.3);
}

/* 移除光标悬浮状态的端点动画 */
.scientist-ray.active .ray-endpoint,
.scientist-ray:hover .ray-endpoint {
  transform: translate(0, -50%) scale(1.3);
  box-shadow: 0 0 25px var(--category-color, rgba(229, 200, 144, 1)), 0 0 40px rgba(211, 183, 142, 0.5);
  animation: none;
  filter: brightness(1.3);
}

.scientist-ray.active .scientist-name-label,
.scientist-ray:hover .scientist-name-label {
  color: #f2e6d9;
  filter: brightness(1.2);
  text-shadow: 0 0 10px rgba(0, 0, 0, 0.8), 0 0 20px rgba(211, 183, 142, 0.7);
}

/* 容器样式 - 添加到CSS部分 */
.rays-container {
  position: relative;
  width: 100%;
  height: 100%;
}

/* 美化鼠标悬停效果 */
.scientist-ray:hover .ray-line {
  opacity: 1;
  filter: brightness(1.2);
}

.scientist-ray:hover .ray-endpoint {
  transform: translate(0, -50%) scale(1.2);
  filter: brightness(1.2);
}

/* 添加背景图片 */
.history-timeline-container::before {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('../assets/jingweichengluo.jpg') no-repeat center center;
  background-size: cover;
  opacity: 0.9;
  z-index: -1;
  filter: brightness(0.85) contrast(1.1);
}

/* 添加暗色叠加层 */
.history-timeline-container::after {
  content: '';
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(10, 5, 5, 0.3) 0%, rgba(10, 5, 5, 0.7) 100%);
  z-index: -1;
}

/* 背景叠加层 */
.overlay-layer {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at center, rgba(10, 5, 5, 0.3) 0%, rgba(10, 5, 5, 0.7) 100%);
  z-index: -1;
  pointer-events: none;
}

/* 右侧固定信息卡片样式（缩小版） */
.side-info-card {
  position: fixed;
  width: 380px;
  min-height: 200px;
  left: 32px;
  bottom: 32px;
  padding: 1.5rem 1.5rem 1.2rem 1.5rem;
  border-radius: 18px;
  font-size: 1.28rem;
  box-shadow: 0 6px 28px 0 rgba(229, 200, 144, 0.15), 0 0 0 2px rgba(229, 200, 144, 0.08) inset;
  z-index: 1200;
  color: #f2e6d9;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  overflow: hidden;
  transition: box-shadow 0.3s, border 0.3s;
  background: linear-gradient(135deg, rgba(44, 32, 18, 0.82) 60%, rgba(211, 183, 142, 0.07) 100%);
}

.side-info-card::before {
  content: '';
  display: block;
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  border-radius: 10px 10px 0 0;
  background: linear-gradient(90deg, #e5c890 0%, #f2e6d9 100%);
  opacity: 0.7;
  z-index: 1;
}

.side-info-card .info-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 0.3rem;
  font-size: 1.22rem;
  border-bottom: 1px solid rgba(229, 200, 144, 0.10);
  padding-bottom: 0.2rem;
  color: #e5c890;
  font-weight: 500;
  letter-spacing: 0.5px;
  z-index: 2;
}

.side-info-card .info-name {
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 0.3rem;
  color: #ffe9b2;
  letter-spacing: 1px;
  text-shadow: 0 1px 3px rgba(229, 200, 144, 0.10);
  z-index: 2;
}

.side-info-card .info-years {
  color: #e5c890;
  font-size: 1.28rem;
  margin-bottom: 0.2rem;
  z-index: 2;
}

.side-info-card .info-achievement {
  margin-bottom: 0.3rem;
  color: #f2e6d9;
  font-size: 1.28rem;
  line-height: 1.3;
  z-index: 2;
}

.side-info-card .info-impact {
  color: #e5c890;
  font-size: 1.28rem;
  font-style: italic;
  border-top: 1px dashed rgba(229, 200, 144, 0.10);
  padding-top: 0.2rem;
  z-index: 2;
}

.side-info-card .info-description {
  color: #f2e6d9;
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
  line-height: 1.3;
  z-index: 2;
}

.side-info-card .info-works {
  color: #ffe9b2;
  font-size: 1.5rem;
  margin-bottom: 0.2rem;
  z-index: 2;
}

.side-info-card .info-placeholder {
  color: #bba77a;
  font-size: 0.8rem;
  text-align: center;
  width: 100%;
  margin-top: 1rem;
  z-index: 2;
}
</style>
