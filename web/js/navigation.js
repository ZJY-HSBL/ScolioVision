const navigation = {
  init() {
    const navItems = document.querySelectorAll('.nav-item');
    const appPages = document.querySelectorAll('.app-page');

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navItems.forEach(nav => {
          nav.classList.remove('active');
          nav.removeAttribute('aria-current');
        });
        item.classList.add('active');
        item.setAttribute('aria-current', 'page');

        const targetPageId = item.getAttribute('data-target');

        appPages.forEach(page => {
          page.classList.toggle('active', page.id === targetPageId);
        });
      });
    });
  }
};

export default navigation;
