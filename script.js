const menuToggle = document.querySelector('.menu-toggle');
const navigation = document.querySelector('.nav-links');
const themeToggle = document.querySelector('.theme-toggle');
const typingText = document.querySelector('.typing-text');
const contactForm = document.querySelector('#contact-form');
const formStatus = document.querySelector('#form-status');
const backToTop = document.querySelector('.back-to-top');

const roles = ['Developer', 'Problem Solver', 'Python Programmer'];
let roleIndex = 0;
let characterIndex = roles[0].length;
let deleting = false;
let theme = 'dark';

try {
  const savedTheme = localStorage.getItem('portfolio-theme');
  if (savedTheme === 'light' || savedTheme === 'dark') theme = savedTheme;
} catch (error) {
  console.warn('Theme preference could not be loaded.', error);
}

function applyTheme(nextTheme) {
  theme = nextTheme;
  document.documentElement.dataset.theme = theme === 'light' ? 'light' : 'dark';
  const isLight = theme === 'light';
  themeToggle.setAttribute('aria-label', `Switch to ${isLight ? 'dark' : 'light'} theme`);
  themeToggle.innerHTML = `<i class="fa-regular ${isLight ? 'fa-moon' : 'fa-sun'}" aria-hidden="true"></i>`;
}

applyTheme(theme);

themeToggle.addEventListener('click', () => {
  applyTheme(theme === 'dark' ? 'light' : 'dark');
  try {
    localStorage.setItem('portfolio-theme', theme);
  } catch (error) {
    console.warn('Theme preference could not be saved.', error);
  }
});

menuToggle.addEventListener('click', () => {
  const isOpen = menuToggle.getAttribute('aria-expanded') === 'true';
  menuToggle.setAttribute('aria-expanded', String(!isOpen));
  menuToggle.setAttribute('aria-label', isOpen ? 'Open navigation menu' : 'Close navigation menu');
  navigation.classList.toggle('is-open', !isOpen);
});

navigation.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open navigation menu');
    navigation.classList.remove('is-open');
  });
});

function typeRole() {
  const currentRole = roles[roleIndex];
  characterIndex += deleting ? -1 : 1;
  typingText.textContent = currentRole.slice(0, characterIndex);

  let delay = deleting ? 55 : 95;
  if (!deleting && characterIndex === currentRole.length) {
    deleting = true;
    delay = 1450;
  } else if (deleting && characterIndex === 0) {
    deleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    delay = 350;
  }
  window.setTimeout(typeRole, delay);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  window.setTimeout(typeRole, 1700);
}

const revealElements = document.querySelectorAll('.reveal');
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if ('IntersectionObserver' in window && !prefersReducedMotion) {
  document.documentElement.classList.add('reveal-ready');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealElements.forEach((element) => revealObserver.observe(element));

  // Safety fallback: never leave below-the-fold content hidden if scrolling or
  // IntersectionObserver stops reporting entries.
  window.setTimeout(() => {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  }, 2000);
} else {
  revealElements.forEach((element) => element.classList.add('is-visible'));
}

function updateScrollControls() {
  backToTop.classList.toggle('is-visible', window.scrollY > 420);
}

window.addEventListener('scroll', updateScrollControls, { passive: true });
updateScrollControls();
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

document.querySelector('#current-year').textContent = new Date().getFullYear();

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  formStatus.textContent = '';
  if (!contactForm.reportValidity()) return;

  const formData = new FormData(contactForm);
  const name = String(formData.get('name')).trim();
  const email = String(formData.get('email')).trim();
  const message = String(formData.get('message')).trim();
  if (name.length < 2 || message.length < 10) {
    formStatus.textContent = 'Please enter a name and a message with at least 10 characters.';
    return;
  }

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);
  window.location.href = `mailto:ansharahanif19@gmail.com?subject=${subject}&body=${body}`;
  formStatus.textContent = 'Your email app should open with the message ready to send.';
});
