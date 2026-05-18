/**
 * 涅塔克什的手帐博客 - 多语言切换核心联动脚本
 * 适用于多页面架构 (index.html, diary.html 等)
 */

function applyLanguage(lang) {
    // 1. 根据当前选择语言，切换 body 类名控制文本全局显隐
    document.body.classList.remove('lang-de', 'lang-en');
    if (lang === 'de') document.body.classList.add('lang-de');
    if (lang === 'en') document.body.classList.add('lang-en');
    
    // 2. 自动联动修改网站在浏览器标签页上的标题 (<title>)
    // 它会优先读取各个页面自己定义的配置，如果没有，则降级显示默认名字
    const defaultTitles = {
        'zh': '涅塔克什',
        'de': 'Nettahcs',
        'en': 'Nettahcs'
    };
    
    // 如果你在具体页面定义了 window.pageTitles 字典，就会优先采用页面的专属标题
    if (window.pageTitles && window.pageTitles[lang]) {
        document.title = window.pageTitles[lang];
    } else {
        document.title = defaultTitles[lang] || 'Nettahcs';
    }

    // 3. 将首选项安全保存在用户的浏览器本地中（跨页面共享状态）
    localStorage.setItem('preferred-lang', lang);

    // 4. 驱动右侧挂载的纸条按钮：对应激活的语言往右侧拔出显示
    document.querySelectorAll('.lang-bookmark-btn').forEach(btn => {
        if (btn.getAttribute('data-lang') === lang) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
}

// 确保在页面 DOM 加载完毕后再执行
document.addEventListener('DOMContentLoaded', () => {
    // 页面初始化：优先读取本地缓存，其次识别浏览器系统语言，默认降级英文
    const savedLang = localStorage.getItem('preferred-lang') || 
        (((navigator.language || navigator.userLanguage).toLowerCase().substring(0, 2) === 'de') ? 'de' : 
         ((navigator.language || navigator.userLanguage).toLowerCase().substring(0, 2) === 'zh') ? 'zh' : 'en');
    
    applyLanguage(savedLang);

    // 循环为三枚语言书签按钮注册点击联动监听
    document.querySelectorAll('.lang-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetLang = e.currentTarget.getAttribute('data-lang');
            applyLanguage(targetLang);
        });
    });
});