/* ============ 语言切换 ============ */

function applyLanguage(lang) {
    // 1. 根据当前选择语言，切换 body 类名控制文本全局显隐
    document.body.classList.remove('lang-de', 'lang-en');
    if (lang === 'de') document.body.classList.add('lang-de');
    if (lang === 'en') document.body.classList.add('lang-en');

    // 2. 自动修改标题
    const defaultTitles = {
        'zh': '涅塔克什',
        'de': 'Nettahcs',
        'en': 'Nettahcs'
    };

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

    // 5. 同步切换 Giscus 组件的内部语言
    const giscusFrame = document.querySelector('iframe.giscus-frame');
    if (giscusFrame) {
        const giscusLang = lang === 'zh' ? 'zh-CN' : (lang === 'de' ? 'de' : 'en');
        try {
            giscusFrame.contentWindow.postMessage(
                { giscus: { setConfig: { lang: giscusLang } } },
                'https://giscus.app'
            );
        } catch (e) {
            console.warn("Giscus frame 尚未完全就绪，将在加载后自动匹配语言。");
        }
    }
}

// 在页面 DOM 加载完毕后执行事件绑定
document.addEventListener('DOMContentLoaded', () => {
    // 检测浏览器系统语言，默认降级英文
    function detectBrowserLang() {
        const lang = (navigator.language || navigator.userLanguage || '').toLowerCase();
        if (lang.startsWith('zh')) return 'zh';
        if (lang.startsWith('de')) return 'de';
        return 'en';
    }

    // 页面初始化：优先读取本地缓存，其次识别浏览器系统语言
    const savedLang = localStorage.getItem('preferred-lang') || detectBrowserLang();
    applyLanguage(savedLang);

    // 绑定多语言切换标签的点击事件
    document.querySelectorAll('.lang-bookmark-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const targetLang = e.currentTarget.getAttribute('data-lang');
            applyLanguage(targetLang);
        });
    });
});