/**
 * AiCOD Solutions - Main site script
 * Handles navigation, animations, forms, search, and security helpers.
 */

// --- Mobile Navigation ---
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');
const navOverlay = document.getElementById('nav-overlay');

function closeMobileMenu() {
    hamburger?.classList.remove('active');
    navMenu?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.classList.remove('menu-open');
    hamburger?.setAttribute('aria-expanded', 'false');
}

function openMobileMenu() {
    hamburger?.classList.add('active');
    navMenu?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.classList.add('menu-open');
    hamburger?.setAttribute('aria-expanded', 'true');
}

function toggleMobileMenu(e) {
    e?.preventDefault();
    e?.stopPropagation();
    if (navMenu?.classList.contains('active')) {
        closeMobileMenu();
    } else {
        openMobileMenu();
    }
}

if (hamburger) {
    hamburger.addEventListener('click', toggleMobileMenu);
}

navOverlay?.addEventListener('click', closeMobileMenu);

document.querySelectorAll('.nav-link, .btn-nav-cta').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileMenu();
});

window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeMobileMenu();
}, { passive: true });

// --- Scroll reveal ---
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = parseInt(entry.target.dataset.delay || '0', 10);
            setTimeout(() => entry.target.classList.add('visible'), delay);
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

const ANIMATION_SELECTORS = [
    '.section-header',
    '.page-header .container > *',
    '.about-content',
    '.about-image',
    '.mv-card',
    '.value-card',
    '.stat',
    '.company-stats .stat',
    '.location-info',
    '.location-map',
    '.contact-header',
    '.contact-method',
    '.contact-info-container',
    '.faq-item',
    '.service-card',
    '.service-detail',
    '.service-content',
    '.portfolio-item',
    '.blog-card',
    '.blog-post',
    '.testimonial-card',
    '.pricing-card',
    '.feature',
    '.stat-card',
    '.stat-item',
    '.cta-content',
    '.newsletter-content',
    '.map-container',
    '.filter-buttons',
    '.service-nav-wrapper',
    '.category-buttons',
    '.portfolio-filter',
    '.blog-categories',
    '.emergency-contact',
    '.business-hours',
    '.contact-cta',
    '.visit-cta',
    '.highlight-item',
    '.reveal'
].join(',');

function initScrollAnimations() {
    const seen = new Set();
    document.querySelectorAll(ANIMATION_SELECTORS).forEach((el, index) => {
        if (seen.has(el) || el.classList.contains('animate-on-load')) return;
        seen.add(el);
        if (!el.classList.contains('reveal')) el.classList.add('reveal');
        if (!el.dataset.delay) el.dataset.delay = String((index % 6) * 80);
        revealObserver.observe(el);
    });
}

// --- Testimonials ---
let slideIndex = 1;
const testimonials = document.querySelectorAll('.testimonial');
const dots = document.querySelectorAll('.testimonial-dots .dot');

function showSlide(n) {
    testimonials.forEach(t => t.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    if (testimonials[n - 1]) testimonials[n - 1].classList.add('active');
    if (dots[n - 1]) dots[n - 1].classList.add('active');
}

function goToSlide(n) {
    slideIndex = n;
    showSlide(slideIndex);
}

function autoRotate() {
    slideIndex = slideIndex >= testimonials.length ? 1 : slideIndex + 1;
    showSlide(slideIndex);
}

if (testimonials.length > 0) {
    setInterval(autoRotate, 6000);
    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => goToSlide(i + 1));
    });
}

// --- Smooth scroll ---
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            closeMobileMenu();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// --- Navbar scroll ---
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
    navbar?.classList.toggle('scrolled', window.scrollY > 50);
}, { passive: true });

// --- Counter animation ---
function animateCounter(element, target, duration = 2000) {
    const startTime = performance.now();
    const update = (currentTime) => {
        const progress = Math.min((currentTime - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = Math.floor(eased * target);
        if (progress < 1) requestAnimationFrame(update);
        else element.textContent = target;
    };
    requestAnimationFrame(update);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.getAttribute('data-target'), 10);
            if (!isNaN(target)) animateCounter(entry.target, target);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(counter => counterObserver.observe(counter));

// --- Back to top ---
const backToTopBtn = document.createElement('button');
backToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTopBtn.className = 'back-to-top';
backToTopBtn.setAttribute('aria-label', 'Back to top');
document.body.appendChild(backToTopBtn);

window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
}, { passive: true });

backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Security helpers ---
function sanitizeInput(str) {
    if (typeof str !== 'string') return '';
    return str.trim().replace(/[<>]/g, '');
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidPhone(phone) {
    return /^[\d\s+\-()]{7,20}$/.test(phone);
}

function secureExternalLinks() {
    document.querySelectorAll('a[target="_blank"]').forEach(link => {
        if (!link.getAttribute('rel')?.includes('noopener')) {
            link.setAttribute('rel', 'noopener noreferrer');
        }
    });
}

// --- Contact form ---
const contactForm = document.querySelector('#contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const name = sanitizeInput(this.querySelector('[name="name"]')?.value || '');
        const email = sanitizeInput(this.querySelector('[name="email"]')?.value || '');
        const phone = sanitizeInput(this.querySelector('[name="phone"]')?.value || '');
        const message = sanitizeInput(this.querySelector('[name="message"]')?.value || '');

        if (!name || name.length < 2) {
            alert('Please enter a valid name.');
            return;
        }
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }
        if (phone && !isValidPhone(phone)) {
            alert('Please enter a valid phone number.');
            return;
        }
        if (!message || message.length < 10) {
            alert('Please enter a message of at least 10 characters.');
            return;
        }

        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.textContent = 'Sending...';
        submitButton.disabled = true;

        setTimeout(() => {
            alert('Thank you for your message! We will get back to you soon.');
            this.reset();
            submitButton.textContent = originalText;
            submitButton.disabled = false;
        }, 1500);
    });
}

// --- Portfolio filter ---
const filterButtons = document.querySelectorAll('.filter-btn');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        const filter = button.getAttribute('data-filter');
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        portfolioItems.forEach(item => {
            const show = filter === 'all' || item.getAttribute('data-category') === filter;
            item.style.display = show ? 'block' : 'none';
            if (show) item.classList.add('reveal', 'visible');
        });
    });
});

// --- Service filter ---
document.querySelectorAll('.service-nav-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.service-nav-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const filter = btn.getAttribute('data-filter');
        document.querySelectorAll('.services-grid-section .service-card, .services-grid .service-card').forEach(card => {
            const match = filter === 'all' || card.getAttribute('data-category') === filter;
            card.style.display = match ? 'flex' : 'none';
            card.style.opacity = match ? '1' : '0';
            if (match) card.classList.add('reveal', 'visible');
        });
    });
});

// --- FAQ ---
document.querySelectorAll('.faq-item').forEach(item => {
    item.querySelector('.faq-question')?.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(other => other.classList.remove('active'));
        if (!isActive) item.classList.add('active');
    });
});

// --- Homepage nav highlight only ---
function highlightActiveNavLink() {
    if (!document.getElementById('home')) return;
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link[href^="#"]');
    let current = '';
    sections.forEach(section => {
        if (window.scrollY >= section.offsetTop - 200) {
            current = section.getAttribute('id');
        }
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
}

window.addEventListener('scroll', highlightActiveNavLink, { passive: true });

// --- Site Search (XSS-safe rendering) ---
const sitePages = [
    { title: 'Home', url: 'index.html', description: 'Welcome to AiCOD Solutions Limited – Digital Solutions & Technology Services.' },
    { title: 'About Us', url: 'about.html', description: 'Learn about AiCOD Solutions Limited, our mission, vision, and values.' },
    { title: 'Services', url: 'services.html', description: 'Explore our website design, mobile app development, ICT training, and more.' },
    { title: 'Portfolio', url: 'portfolio.html', description: 'See our completed projects and digital solutions for clients.' },
    { title: 'Blog', url: 'blog.html', description: 'Read the latest news and insights from AiCOD Solutions.' },
    { title: 'Contact Us', url: 'contact.html', description: 'Get in touch with AiCOD Solutions Limited for your digital needs.' }
];

function renderSearchResults(results) {
    const dropdown = document.getElementById('search-results-dropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';
    if (results.length === 0) {
        dropdown.style.display = 'none';
        return;
    }
    results.forEach(page => {
        const item = document.createElement('a');
        item.href = page.url;
        item.className = 'search-result-item';
        const strong = document.createElement('strong');
        strong.textContent = page.title;
        const span = document.createElement('span');
        span.textContent = page.description;
        item.appendChild(strong);
        item.appendChild(document.createElement('br'));
        item.appendChild(span);
        dropdown.appendChild(item);
    });
    dropdown.style.display = 'block';
}

const searchInput = document.getElementById('site-search-input');
const searchDropdown = document.getElementById('search-results-dropdown');
const searchForm = document.querySelector('.site-search-form');

if (searchInput && searchDropdown && searchForm) {
    searchInput.addEventListener('input', function () {
        const query = sanitizeInput(this.value).toLowerCase();
        if (!query) { searchDropdown.style.display = 'none'; return; }
        renderSearchResults(sitePages.filter(p =>
            p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        ));
    });

    document.addEventListener('click', e => {
        if (!searchForm.contains(e.target)) searchDropdown.style.display = 'none';
    });

    searchForm.addEventListener('submit', e => {
        e.preventDefault();
        const query = sanitizeInput(searchInput.value).toLowerCase();
        const results = sitePages.filter(p =>
            p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query)
        );
        if (results.length) window.location.href = results[0].url;
    });
}

// --- Page load animations ---
function initPageHeaderAnimation() {
    const header = document.querySelector('.page-header .container');
    if (header) {
        header.querySelectorAll('h1, p').forEach((el, i) => {
            el.classList.add('animate-on-load');
            el.style.animationDelay = `${0.1 + i * 0.15}s`;
        });
    }
}

// --- Initialize ---
document.addEventListener('DOMContentLoaded', () => {
    if (testimonials.length) showSlide(1);
    initScrollAnimations();
    initPageHeaderAnimation();
    secureExternalLinks();
});
