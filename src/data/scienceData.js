export const scienceAchievements = [
    {
        id: 1,
        category: "天文学",
        name: "浑天仪",
        dynasty: "汉",
        year: "前104年",
        inventor: "落下闳",
        description: "世界上最早的天文观测仪器之一，用于观测天体位置和运动",
        significance: "奠定了中国古代天文学的观测基础，促进了历法的发展",
        imageUrl: "/assets/science/huntianyi.jpg"
    },
    {
        id: 2,
        category: "天文学",
        name: "星图",
        dynasty: "三国",
        year: "约270年",
        inventor: "陈卓",
        description: "《天文图》记录了283颗恒星，是中国最早的星图之一",
        significance: "为后世天文观测和研究提供了重要参考",
        imageUrl: "/assets/science/starchart.jpg"
    },
    {
        id: 3,
        category: "数学",
        name: "九章算术",
        dynasty: "汉",
        year: "约公元前100年",
        inventor: "多人集体智慧",
        description: "中国古代数学经典著作，包含246个应用问题和算法",
        significance: "奠定了中国传统数学的基础，对世界数学发展有重要贡献",
        imageUrl: "/assets/science/jiuzhang.jpg"
    },
    {
        id: 4,
        category: "数学",
        name: "圆周率计算",
        dynasty: "南北朝",
        year: "429年",
        inventor: "祖冲之",
        description: "精确计算圆周率为3.1415926与3.1415927之间",
        significance: "在当时是世界上最精确的圆周率计算，领先西方数学千年",
        imageUrl: "/assets/science/pi.jpg"
    },
    {
        id: 5,
        category: "医学",
        name: "黄帝内经",
        dynasty: "战国至西汉",
        year: "约前200年",
        inventor: "多人集体智慧",
        description: "中医理论的奠基之作，阐述人与自然的关系及生理病理",
        significance: "确立了中医理论体系的基础，影响至今",
        imageUrl: "/assets/science/huangdineijing.jpg"
    },
    {
        id: 6,
        category: "医学",
        name: "针灸铜人",
        dynasty: "宋",
        year: "1026年",
        inventor: "王惟一",
        description: "世界上最早的针灸教学模型，铸造铜人标注经络穴位",
        significance: "推动了针灸医学的标准化和教学普及",
        imageUrl: "/assets/science/acupuncture.jpg"
    },
    {
        id: 7,
        category: "工艺技术",
        name: "指南针",
        dynasty: "北宋",
        year: "约1044年",
        inventor: "未详",
        description: "利用磁铁指向特性制成的导航工具",
        significance: "革命性改变了航海技术，促进了世界贸易和文化交流",
        imageUrl: "/assets/science/compass.jpg"
    },
    {
        id: 8,
        category: "工艺技术",
        name: "活字印刷",
        dynasty: "北宋",
        year: "1041-1048年",
        inventor: "毕昇",
        description: "世界上最早的活字印刷技术，使用陶泥活字",
        significance: "极大促进了文化和知识的传播，是人类文明史上的重大发明",
        imageUrl: "/assets/science/movabletype.jpg"
    },
    {
        id: 9,
        category: "农学",
        name: "齐民要术",
        dynasty: "北魏",
        year: "533-544年",
        inventor: "贾思勰",
        description: "中国古代最完备的农学著作，总结了农业和手工业生产技术",
        significance: "为中国农业科学奠定基础，促进了农业生产发展",
        imageUrl: "/assets/science/qiminyaoshu.jpg"
    }
];

export const scienceCategories = [
    { id: "astronomy", name: "天文学", code: "1" },
    { id: "mathematics", name: "数学", code: "2" },
    { id: "medicine", name: "医学", code: "3" },
    { id: "technology", name: "工艺技术", code: "4" },
    { id: "agriculture", name: "农学", code: "5" }
];

export const categoryToCode = {
    "天文学": "1",
    "数学": "2",
    "医学": "3",
    "工艺技术": "4",
    "农学": "5"
}; 