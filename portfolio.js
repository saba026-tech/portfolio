const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle ? themeToggle.querySelector('.theme-icon') : null;
const backToTop = document.getElementById('backToTop');
const nav = document.getElementById('mainNav');
const navOverlay = document.getElementById('navOverlay');
const menuToggle = document.getElementById('menuToggle');
const siteHeader = document.getElementById('siteHeader');
const root = document.body;
const currentYear = document.getElementById('year');

const setTheme = (mode) => {
  root.classList.toggle('dark', mode === 'dark');
  root.classList.toggle('light', mode === 'light');
  localStorage.setItem('portfolioTheme', mode);
  if (themeIcon) {
    themeIcon.textContent = mode === 'dark' ? '🌙' : '☀️';
  }
};

if (currentYear) {
  currentYear.textContent = new Date().getFullYear();
}

const savedTheme = localStorage.getItem('portfolioTheme');
setTheme(savedTheme || 'light');

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme = root.classList.contains('dark') ? 'light' : 'dark';
    setTheme(nextTheme);
  });
}

const toggleMenu = (open) => {
  const isOpen = typeof open === 'boolean' ? open : !nav.classList.contains('open');
  nav.classList.toggle('open', isOpen);
  navOverlay.classList.toggle('active', isOpen);
  menuToggle.setAttribute('aria-expanded', String(isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Close navigation menu' : 'Open navigation menu');
};

if (menuToggle) {
  menuToggle.addEventListener('click', () => toggleMenu());
}
if (navOverlay) {
  navOverlay.addEventListener('click', () => toggleMenu(false));
}

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => toggleMenu(false));
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 860 && nav.classList.contains('open')) {
    toggleMenu(false);
  }
});

const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.18 });

revealElements.forEach((el) => revealObserver.observe(el));

const navLinks = document.querySelectorAll('.nav-list a');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    const id = entry.target.getAttribute('id');
    const link = document.querySelector(`.nav-list a[href="#${id}"]`);
    if (!link) return;
    if (entry.isIntersecting) {
      navLinks.forEach((item) => item.classList.remove('active'));
      link.classList.add('active');
    }
  });
}, {
  rootMargin: '-35% 0px -55% 0px',
  threshold: 0,
});

document.querySelectorAll('section[id]').forEach((section) => sectionObserver.observe(section));

const counters = document.querySelectorAll('.counter');
let countersAnimated = false;

const animateCounters = () => {
  if (countersAnimated) return;
  const statsSection = document.getElementById('stats');
  if (!statsSection) return;
  const rect = statsSection.getBoundingClientRect();
  if (rect.top < window.innerHeight && rect.bottom > 0) {
    counters.forEach((counter) => {
      const target = Number(counter.dataset.target) || 0;
      const duration = 1400;
      let current = 0;
      const step = Math.max(1, Math.round(target / (duration / 16)));
      const update = () => {
        current += step;
        if (current >= target) {
          counter.textContent = target;
        } else {
          counter.textContent = current;
          requestAnimationFrame(update);
        }
      };
      update();
    });
    countersAnimated = true;
  }
};

window.addEventListener('scroll', () => {
  animateCounters();
  if (backToTop) {
    if (window.scrollY > 420) {
      backToTop.classList.add('show');
    } else {
      backToTop.classList.remove('show');
    }
  }
  if (siteHeader) {
    if (window.scrollY > 30) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  }
});

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

window.addEventListener('load', () => {
  animateCounters();
});
