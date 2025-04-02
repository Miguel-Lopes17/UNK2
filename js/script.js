const headerEl = document.querySelector('.header');

window.addEventListener('scroll', () => {
    if (window.scrollY > 200) {
    headerEl.classList.add('header-scrolled');
    } else if (window.scrollY <= 90) {
    headerEl.classList.remove('header-scrolled');
    }
});

