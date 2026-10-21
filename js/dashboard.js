/**
 * BeautyPro Student Dashboard - Interactive Script
 * Handles sidebar toggling for mobile & iPad (<= 1366px), hours tracking updates,
 * practice exam alerts, schedule filters, and quick action notifications.
 */

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

document.addEventListener('DOMContentLoaded', () => {
  initBackToTop();
  initDashboardSidebar();
  initHoursTracker();
  initScheduleInteractions();
  initExamPrep();
  initQuickActions();
});

/* --------------------------------------------------------------------------
   Mobile & iPad Dashboard Sidebar Toggle (<= 1366px)
   -------------------------------------------------------------------------- */
function initDashboardSidebar() {
  const toggleBtn = document.querySelector('.dashboard-menu-toggle');
  const sidebar = document.querySelector('.dashboard-sidebar');
  const closeBtn = document.querySelector('.sidebar-close-btn');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const sidebarItems = document.querySelectorAll('.sidebar-item');

  if (!sidebar) return;

  function openSidebar() {
    sidebar.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-open');
    document.body.style.overflow = 'hidden';
  }

  function closeSidebar() {
    sidebar.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-open');
    document.body.style.overflow = '';
  }

  if (toggleBtn) {
    toggleBtn.addEventListener('click', openSidebar);
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSidebar);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeSidebar);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      closeSidebar();
    }
  });

  sidebarItems.forEach(item => {
    item.addEventListener('click', (e) => {
      sidebarItems.forEach(i => i.classList.remove('active'));
      item.classList.add('active');
      if (window.innerWidth <= 1366) {
        closeSidebar();
      }
    });
  });
}

/* --------------------------------------------------------------------------
   Interactive Hours Tracker Demo
   -------------------------------------------------------------------------- */
function initHoursTracker() {
  const logBtn = document.getElementById('log-hours-btn');
  const completedNum = document.getElementById('completed-hours-val');
  const remainingNum = document.getElementById('remaining-hours-val');
  const percentageNum = document.getElementById('hours-percentage-val');
  const cuttingHours = document.getElementById('cutting-hours-val');

  if (!logBtn || !completedNum) return;

  logBtn.addEventListener('click', () => {
    let current = parseInt(completedNum.textContent.replace(',', '')) || 320;
    const added = 4;
    const total = 1500;
    const updated = Math.min(total, current + added);
    const remaining = total - updated;
    const pct = Math.round((updated / total) * 100);

    completedNum.textContent = updated;
    if (remainingNum) remainingNum.textContent = remaining;
    if (percentageNum) percentageNum.textContent = pct + '%';
    if (cuttingHours) {
      let cutVal = parseInt(cuttingHours.textContent) || 120;
      cuttingHours.textContent = (cutVal + added) + ' hrs';
    }

    showDashboardToast(`+4 Practical Clinic Hours logged! Total verified: ${updated} / 1,500 hrs.`);
  });
}

/* --------------------------------------------------------------------------
   Schedule Interactions
   -------------------------------------------------------------------------- */
function initScheduleInteractions() {
  const scheduleItems = document.querySelectorAll('.schedule-card');
  scheduleItems.forEach(card => {
    card.addEventListener('click', () => {
      const title = card.querySelector('.schedule-title')?.textContent || 'Session';
      showDashboardToast(`Viewing details for: ${title}`);
    });
  });
}

/* --------------------------------------------------------------------------
   Exam Prep Demo
   -------------------------------------------------------------------------- */
function initExamPrep() {
  const startExamBtn = document.getElementById('start-mock-exam-btn');
  if (startExamBtn) {
    startExamBtn.addEventListener('click', () => {
      showDashboardToast('Opening State Board Mock Exam 3... Good luck, Sarah!');
    });
  }

  const flashcardBtn = document.getElementById('flashcard-btn');
  if (flashcardBtn) {
    flashcardBtn.addEventListener('click', () => {
      showDashboardToast('Launching Cosmetology Chemistry & Sanitation Flashcards (45 cards)');
    });
  }
}

/* --------------------------------------------------------------------------
   Quick Links Actions
   -------------------------------------------------------------------------- */
function initQuickActions() {
  const downloadBtns = document.querySelectorAll('.quick-link-btn');
  downloadBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const text = btn.textContent.trim();
      showDashboardToast(`Action triggered: ${text}`);
    });
  });
}

/* --------------------------------------------------------------------------
   Helper Toast Notification
   -------------------------------------------------------------------------- */
function showDashboardToast(msg) {
  let toast = document.getElementById('dash-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'dash-toast';
    toast.style.position = 'fixed';
    toast.style.bottom = '24px';
    toast.style.right = '24px';
    toast.style.backgroundColor = '#17212D';
    toast.style.color = '#FFFFFF';
    toast.style.padding = '14px 22px';
    toast.style.borderRadius = '8px';
    toast.style.boxShadow = '0 8px 24px rgba(23,33,45,0.25)';
    toast.style.fontSize = '0.925rem';
    toast.style.fontWeight = '500';
    toast.style.borderLeft = '4px solid #D94378';
    toast.style.zIndex = '9999';
    toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    toast.style.transform = 'translateY(10px)';
    toast.style.opacity = '0';
    document.body.appendChild(toast);
  }

  toast.textContent = msg;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(window.toastTimeout);
  window.toastTimeout = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
  }, 4000);
}

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
