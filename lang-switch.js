/* 多语言切换 */

function applyLanguage(lang) {
    // 1. 根据当前选择语言，切换 body 类名控制文本全局显隐
    document.body.classList.remove('lang-de', 'lang-en');
    if (lang === 'de') document.body.classList.add('lang-de');
    if (lang === 'en') document.body.classList.add('lang-en');

    // 2. 自动修改标题 (<title>)
    // 优先读取各个页面的自定义配置
    const defaultTitles = {
        'zh': '涅塔克什',
        'de': 'Nettahcs',
        'en': 'Nettahcs'
    };

    // 如果在具体页面定义了 window.pageTitles 字典，就会优先采用页面的专属标题
    if (window.pageTitles && window.pageTitles[lang]) {
        document.title = window.pageTitles[lang];
    } else {
        document.title = defaultTitles[lang] || 'Nettahcs';
    }

    // 3. 将首选项保存在用户的浏览器本地中
    localStorage.setItem('preferred-lang', lang);

    // 4. 纸条按钮激活时拔出显示
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
    // 检测浏览器系统语言，降级英文
    function detectBrowserLang() {
        const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (lang.startsWith('zh')) return 'zh';
        if (lang.startsWith('de')) return 'de';
        return 'en';
    }

    // 页面初始化：优先读取本地缓存，其次识别浏览器系统语言
    const savedLang = localStorage.getItem('preferred-lang') || detectBrowserLang();
    applyLanguage(savedLang);

    // 循环为三枚语言书签按钮注册点击监听
    document.querySelectorAll('.lang-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetLang = e.currentTarget.getAttribute('data-lang');
            applyLanguage(targetLang);
        });
    });
});