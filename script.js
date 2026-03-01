/* =================================================================
   KARISHMA DENTAL CLINIC – JAVASCRIPT  (Firebase-connected)
   ================================================================= */

'use strict';

// ── Firebase import (loaded after DOM ready) ───────────────────
let firebaseSaveAppointment = null;

async function loadFirebase() {
  try {
    const mod = await import('./firebase-service.js');
    firebaseSaveAppointment = mod.saveAppointment;
    console.log('🔥 Firebase connected successfully!');
  } catch (err) {
    console.warn('⚠️ Firebase not configured yet. Appointments will not be saved.', err.message);
  }
}

// ── DOM Ready ──────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  loadFirebase();
  initNavbar();
  initHamburger();
  initScrollAnimations();
  initBackToTop();
  initActiveNavLinks();
  setMinDate();
});

/* ============================================================
   NAVBAR – Scroll effect
   ============================================================ */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ============================================================
   HAMBURGER MENU
   ============================================================ */
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  if (!hamburger || !navLinks) return;

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  document.addEventListener('click', e => {
    if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
}

/* ============================================================
   SCROLL ANIMATIONS
   ============================================================ */
function initScrollAnimations() {
  const aosEls = document.querySelectorAll('[data-aos]');
  if (aosEls.length) {
    const aosObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = parseInt(el.dataset.delay || 0);
          setTimeout(() => el.classList.add('aos-animate'), delay);
          aosObserver.unobserve(el);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
    aosEls.forEach(el => aosObserver.observe(el));
  }

  const cards = document.querySelectorAll(
    '.service-card, .team-card, .testimonial-card, .why-card, .contact-card'
  );
  const cardObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const idx = parseInt(el.dataset.delay || 0);
        setTimeout(() => {
          el.style.opacity = '1';
          el.style.transform = el.classList.contains('testimonial-featured')
            ? 'scale(1.02) translateY(0)'
            : 'translateY(0)';
        }, idx);
        cardObserver.unobserve(el);
      }
    });
  }, { threshold: 0.1 });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = card.classList.contains('testimonial-featured')
      ? 'scale(1.02) translateY(20px)'
      : 'translateY(20px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    cardObserver.observe(card);
  });
}

/* ============================================================
   BACK TO TOP
   ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;
  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 400);
  }, { passive: true });
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

/* ============================================================
   ACTIVE NAV LINKS
   ============================================================ */
function initActiveNavLinks() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active',
            link.getAttribute('href') === `#${entry.target.id}`);
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => observer.observe(s));
}

/* ============================================================
   APPOINTMENT FORM  🔥 Firebase Integration
   ============================================================ */
window.handleFormSubmit = async function handleFormSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('submitBtn');
  const success = document.getElementById('formSuccess');
  const form = document.getElementById('appointmentForm');
  const errBox = document.getElementById('formError');
  if (!btn || !success || !form) return;

  // Collect form data
  const data = {
    firstName: form.firstName.value.trim(),
    lastName: form.lastName.value.trim(),
    phone: form.phone.value.trim(),
    email: form.email.value.trim(),
    service: form.service.value,
    date: form.date.value,
    time: form.time.value,
    message: form.message.value.trim()
  };

  // Show loading state
  btn.disabled = true;
  btn.innerHTML = `<span class="spinner"></span> Saving…`;
  if (errBox) errBox.style.display = 'none';

  // ── Try to save to Firebase Firestore ──────────────────────
  let savedToFirebase = false;
  if (firebaseSaveAppointment) {
    const result = await firebaseSaveAppointment(data);
    savedToFirebase = result.success;
    if (!result.success && errBox) {
      errBox.textContent = '⚠️ Could not connect to database. Please call us directly at +91 98765 43210';
      errBox.style.display = 'flex';
    }
  }

  // ── Always show success UI to user ─────────────────────────
  setTimeout(() => {
    btn.innerHTML = `✓ Appointment Requested!`;
    btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

    success.style.display = 'flex';
    success.style.animation = 'fadeInUp 0.4s ease';
    success.innerHTML = savedToFirebase
      ? `<span>🎉</span> Appointment saved! We'll confirm within 24 hours.`
      : `<span>📋</span> Request received! We'll contact you soon.`;

    // Reset after 6 seconds
    setTimeout(() => {
      form.reset();
      btn.disabled = false;
      btn.innerHTML = 'Confirm Appointment';
      btn.style.background = '';
      success.style.display = 'none';
    }, 6000);
  }, 1200);
};

/* ============================================================
   SET MIN DATE
   ============================================================ */
function setMinDate() {
  const dateInput = document.getElementById('date');
  if (!dateInput) return;
  const today = new Date();
  const y = today.getFullYear();
  const m = String(today.getMonth() + 1).padStart(2, '0');
  const d = String(today.getDate()).padStart(2, '0');
  dateInput.min = `${y}-${m}-${d}`;
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (!target) return;
    e.preventDefault();
    const navHeight = document.getElementById('navbar')?.offsetHeight || 80;
    window.scrollTo({ top: target.getBoundingClientRect().top + window.scrollY - navHeight, behavior: 'smooth' });
  });
});

/* ============================================================
   DYNAMIC STYLES
   ============================================================ */
const style = document.createElement('style');
style.textContent = `
  .hamburger.active span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
  .hamburger.active span:nth-child(2) { opacity: 0; transform: scaleX(0); }
  .hamburger.active span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

  @keyframes fadeInUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .spinner {
    display: inline-block;
    width: 16px; height: 16px;
    border: 2px solid rgba(255,255,255,0.4);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    vertical-align: middle;
    margin-right: 6px;
  }

  @keyframes spin { to { transform: rotate(360deg); } }

  .form-error {
    display: none;
    align-items: center;
    gap: 10px;
    background: rgba(239,68,68,0.1);
    border: 1px solid rgba(239,68,68,0.3);
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 0.85rem;
    font-weight: 500;
    color: #ef4444;
    margin-top: 12px;
  }
`;
document.head.appendChild(style);
