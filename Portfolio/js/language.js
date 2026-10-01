document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('lang-toggle');
  if (!toggle) return;

  const currentLabel = toggle.querySelector('.lang-current');
  const alternateLabel = toggle.querySelector('.lang-alt');
  let language = localStorage.getItem('lang') === 'jp' ? 'jp' : 'en';

  function applyLanguage() {
    document.querySelectorAll('[data-en][data-jp]').forEach(element => {
      element.textContent = element.getAttribute(language === 'jp' ? 'data-jp' : 'data-en');
    });
    document.querySelectorAll('.glitch-effect').forEach(element => {
      element.setAttribute('data-text', element.textContent.trim());
    });

    currentLabel.textContent = language === 'jp' ? 'JP' : 'EN';
    alternateLabel.textContent = language === 'jp' ? 'EN' : 'JP';
    toggle.setAttribute('aria-label', language === 'jp' ? 'Switch to English' : '日本語に切り替える');
    document.documentElement.lang = language === 'jp' ? 'ja' : 'en';
    document.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang: language } }));
  }

  applyLanguage();
  toggle.addEventListener('click', () => {
    language = language === 'en' ? 'jp' : 'en';
    localStorage.setItem('lang', language);
    applyLanguage();
  });
});
