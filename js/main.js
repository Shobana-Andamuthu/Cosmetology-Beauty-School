// Dismiss luxury page preloader smoothly on window load with fallback
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('is-hidden');
    }, 250);
  }
});
setTimeout(() => {
  const loader = document.getElementById('page-loader');
  if (loader && !loader.classList.contains('is-hidden')) {
    loader.classList.add('is-hidden');
  }
}, 1000);

/**
 * BeautyPro Cosmetology & Beauty School - Main Interactive Script
 * Handles responsive navigation, hamburger menu, dropdowns, Theme Toggle (Light/Dark),
 * RTL toggle, form validation, and auth features.
 */

// Initialize saved theme & text direction immediately to prevent flash
(function initPreferencesEarly() {
  const savedTheme = localStorage.getItem('beautypro_theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  const savedDir = localStorage.getItem('beautypro_dir');
  if (savedDir === 'rtl') {
    document.documentElement.setAttribute('dir', 'rtl');
  }
})();

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initThemeToggle();
  initRtlToggle();
  initMobileNav();
  initFaqAccordion();
  initPasswordToggles();
  initContactForm();
  initAuthForms();
});

/* --------------------------------------------------------------------------
   Theme Toggle (Light / Dark Mode)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtns = document.querySelectorAll('.theme-toggle');
  if (!toggleBtns.length) return;

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('beautypro_theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('beautypro_theme', 'light');
    }
    toggleBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', theme === 'dark');
    });
  }

  toggleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      applyTheme(isDark ? 'light' : 'dark');
    });
  });
}

/* --------------------------------------------------------------------------
   RTL Toggle (LTR / RTL Text Direction)
   -------------------------------------------------------------------------- */
function initRtlToggle() {
  const rtlBtns = document.querySelectorAll('.rtl-toggle');
  if (!rtlBtns.length) return;

  function applyDir(dir) {
    document.documentElement.classList.add('no-transitions');
    if (dir === 'rtl') {
      document.documentElement.setAttribute('dir', 'rtl');
      localStorage.setItem('beautypro_dir', 'rtl');
    } else {
      document.documentElement.setAttribute('dir', 'ltr');
      localStorage.setItem('beautypro_dir', 'ltr');
    }
    rtlBtns.forEach(btn => {
      btn.setAttribute('aria-pressed', dir === 'rtl');
    });
    requestAnimationFrame(() => {
      setTimeout(() => {
        document.documentElement.classList.remove('no-transitions');
      }, 60);
    });
  }

  rtlBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const isRtl = document.documentElement.getAttribute('dir') === 'rtl';
      applyDir(isRtl ? 'ltr' : 'rtl');
    });
  });
}

/* --------------------------------------------------------------------------
   Mobile & iPad Responsive Navigation Drawer
   MANDATORY: Works across mobile, all iPads, and iPad Pros (<= 1366px)
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const navDrawer = document.querySelector('.mobile-nav-drawer');
  const navBackdrop = document.querySelector('.mobile-nav-backdrop');
  const closeBtn = document.querySelector('.mobile-nav-close');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-sublink');
  const mobileDropdownToggle = document.querySelector('.mobile-dropdown-header');
  const mobileSublinks = document.querySelector('.mobile-sublinks');

  if (!hamburgerBtn || !navDrawer || !navBackdrop) return;

  // Highlight Home if current page is index.html or home-2.html
  const currentPath = window.location.pathname.toLowerCase();
  const isHome = currentPath.endsWith('index.html') || currentPath.endsWith('home-2.html') || currentPath.endsWith('/') || currentPath === '';
  if (isHome && mobileDropdownToggle) {
    mobileDropdownToggle.classList.add('active');
  }

  function resetDropdown() {
    if (mobileSublinks) {
      mobileSublinks.classList.remove('is-open');
      mobileSublinks.style.removeProperty('display');
    }
    if (mobileDropdownToggle) {
      mobileDropdownToggle.classList.remove('is-open');
      const arrow = mobileDropdownToggle.querySelector('.dropdown-arrow');
      if (arrow) arrow.style.transform = '';
    }
  }

  function openMenu() {
    hamburgerBtn.classList.add('is-active');
    navDrawer.classList.add('is-active');
    navBackdrop.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    hamburgerBtn.classList.remove('is-active');
    navDrawer.classList.remove('is-active');
    navBackdrop.classList.remove('is-active');
    document.body.style.overflow = '';
    resetDropdown(); // Automatically close dropdown when menu is closed
  }

  hamburgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (navDrawer.classList.contains('is-active')) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMenu);
  }

  navBackdrop.addEventListener('click', closeMenu);

  // Close when pressing ESC key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navDrawer.classList.contains('is-active')) {
      closeMenu();
    }
  });

  // Close when selecting any link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Mobile Dropdown Toggle for "Home" subpages
  if (mobileDropdownToggle && mobileSublinks) {
    mobileDropdownToggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = mobileSublinks.classList.contains('is-open');
      if (isOpen) {
        mobileSublinks.classList.remove('is-open');
        mobileDropdownToggle.classList.remove('is-open');
        mobileSublinks.style.setProperty('display', 'none', 'important');
      } else {
        mobileSublinks.classList.add('is-open');
        mobileDropdownToggle.classList.add('is-open');
        mobileSublinks.style.setProperty('display', 'flex', 'important');
      }
    });
  }
}

/* --------------------------------------------------------------------------
   FAQ Accordion Functionality
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
  const accordionItems = document.querySelectorAll('.accordion-item');
  if (!accordionItems.length) return;

  accordionItems.forEach(item => {
    const header = item.querySelector('.accordion-header');
    if (!header) return;

    header.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      // Close all other accordion items
      accordionItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('is-open');
        }
      });

      // Toggle current
      if (isOpen) {
        item.classList.remove('is-open');
      } else {
        item.classList.add('is-open');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Password Visibility Toggle
   -------------------------------------------------------------------------- */
function initPasswordToggles() {
  const toggleButtons = document.querySelectorAll('.password-toggle-btn');
  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const input = btn.closest('.password-input-group')?.querySelector('input');
      if (!input) return;

      const isPassword = input.getAttribute('type') === 'password';
      input.setAttribute('type', isPassword ? 'text' : 'password');
      btn.innerHTML = isPassword 
        ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>`
        : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>`;
    });
  });
}

/* --------------------------------------------------------------------------
   Contact Form Validation & Feedback
   -------------------------------------------------------------------------- */
function initContactForm() {
  const contactForm = document.getElementById('contact-form');
  if (!contactForm) return;

  const successAlert = document.getElementById('form-success-alert');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let isValid = true;

    const fields = [
      { id: 'contact-name', validator: val => val.trim().length >= 2 },
      { id: 'contact-email', validator: val => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) },
      { id: 'contact-phone', validator: val => val.trim().length >= 7 },
      { id: 'contact-program', validator: val => val !== '' },
      { id: 'contact-message', validator: val => val.trim().length >= 10 }
    ];

    fields.forEach(({ id, validator }) => {
      const field = document.getElementById(id);
      if (!field) return;

      if (!validator(field.value)) {
        field.classList.add('is-invalid');
        isValid = false;
      } else {
        field.classList.remove('is-invalid');
      }

      field.addEventListener('input', () => {
        if (validator(field.value)) {
          field.classList.remove('is-invalid');
        }
      }, { once: true });
    });

    if (isValid) {
      if (successAlert) {
        successAlert.classList.add('show');
        successAlert.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      contactForm.reset();
      setTimeout(() => {
        if (successAlert) successAlert.classList.remove('show');
      }, 7000);
    }
  });
}

/* --------------------------------------------------------------------------
   Auth Forms Validation (Login & Register)
   -------------------------------------------------------------------------- */
function initAuthForms() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const email = document.getElementById('login-email');
      const pass = document.getElementById('login-password');
      let valid = true;

      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (valid) {
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Signing in...';
        submitBtn.disabled = true;
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);
      }
    });
  }

  const registerForm = document.getElementById('register-form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('reg-name');
      const email = document.getElementById('reg-email');
      const pass = document.getElementById('reg-password');
      let valid = true;

      if (!name.value || name.value.trim().length < 2) {
        name.classList.add('is-invalid');
        valid = false;
      } else {
        name.classList.remove('is-invalid');
      }

      if (!email.value || !email.value.includes('@')) {
        email.classList.add('is-invalid');
        valid = false;
      } else {
        email.classList.remove('is-invalid');
      }

      if (!pass.value || pass.value.length < 6) {
        pass.classList.add('is-invalid');
        valid = false;
      } else {
        pass.classList.remove('is-invalid');
      }

      if (valid) {
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.innerHTML = 'Creating Account...';
        submitBtn.disabled = true;
        setTimeout(() => {
          window.location.href = 'dashboard.html';
        }, 600);
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Back to Top Floating Action Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('is-visible');
    } else {
      btn.classList.remove('is-visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
