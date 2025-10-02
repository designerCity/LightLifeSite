// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 255, 136, 0.1)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// 고급 스크롤 애니메이션 시스템
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
            
            // 텍스트 애니메이션 트리거
            if (entry.target.classList.contains('text-animate')) {
                animateText(entry.target);
            }
            
            // 카운터 애니메이션 트리거
            if (entry.target.classList.contains('counter-animate')) {
                animateCounter(entry.target);
            }
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
});

// 텍스트 애니메이션 함수
function animateText(element) {
    const text = element.textContent;
    element.textContent = '';
    element.style.opacity = '1';
    
    let i = 0;
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, 50);
}

// 카운터 애니메이션 함수
function animateCounter(element) {
    const target = parseInt(element.textContent.replace('+', ''));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + '+';
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + '+';
        }
    }, 16);
}

// 애니메이션 대상 요소들에 observer 적용
document.addEventListener('DOMContentLoaded', function() {
    const animateElements = document.querySelectorAll('.service-item, .solution-item, .feature-item, .problem-item, .team-member, .stat-item, .contact-item, .cta-item, .value-card, .business-card, .tech-item, .achievement-item, .effect-item, .flow-step, .contact-method-card, .info-card, .tech-card, .impact-item, .tech-detailed-card, .arch-layer, .section-header, .about-text, .about-image, .hero-content, .hero-visual');
    
    animateElements.forEach((el, index) => {
        el.classList.add('scroll-animate');
        
        // 지연 애니메이션 적용
        if (index % 3 === 1) el.classList.add('delay-1');
        if (index % 3 === 2) el.classList.add('delay-2');
        
        scrollObserver.observe(el);
    });
});

// 기존 스크롤 애니메이션 (백업)
document.addEventListener("scroll", function() {
    const elements = document.querySelectorAll(".service-item, .solution-item, .feature-item, .problem-item, .team-member, .stat-item, .contact-item, .cta-item, .value-card, .business-card, .tech-item, .achievement-item, .effect-item, .flow-step, .contact-method-card, .info-card, .tech-card, .impact-item, .tech-detailed-card, .feature-item, .arch-layer");
    const triggerBottom = window.innerHeight * 0.9;
    
    elements.forEach(el => {
        const boxTop = el.getBoundingClientRect().top;
        if (boxTop < triggerBottom) {
            el.classList.add("fade-in");
        }
    });
});

// Intersection Observer for scroll animations (백업)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
const animateElements = document.querySelectorAll('.service-item, .solution-item, .feature-item, .problem-item, .team-member, .stat-item, .contact-item, .cta-item, .value-card, .business-card, .tech-item, .achievement-item, .effect-item, .flow-step, .contact-method-card, .info-card, .tech-card, .impact-item, .tech-detailed-card, .feature-item, .arch-layer');
animateElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(50px)';
    el.style.transition = 'opacity 1s ease, transform 1s ease';
    observer.observe(el);
});

// Counter animation for stats
const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace('+', ''));
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
};

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const statsSection = document.querySelector('.stats');
if (statsSection) {
    statsObserver.observe(statsSection);
}

// Contact methods - no form submission needed
// Users will use mailto: and tel: links directly

// 고급 패럴랙스 스크롤 효과
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const windowHeight = window.innerHeight;
    
    // Hero 섹션 패럴랙스
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
        const rate = scrolled * -0.3;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
    
    // Floating elements 패럴랙스
    const floatingCards = document.querySelectorAll('.floating-card');
    floatingCards.forEach((card, index) => {
        const rate = scrolled * (0.1 + index * 0.05);
        card.style.transform = `translateY(${rate}px)`;
    });
    
    // Background elements 패럴랙스
    const backgroundElements = document.querySelectorAll('.about-image, .brand-visual');
    backgroundElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const rate = (windowHeight - rect.top) * 0.1;
        element.style.transform = `translateY(${rate}px)`;
    });
    
    // Text reveal 애니메이션
    const textElements = document.querySelectorAll('.section-title, .hero-title');
    textElements.forEach(element => {
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < windowHeight && rect.bottom > 0;
        
        if (isVisible) {
            const progress = Math.max(0, Math.min(1, (windowHeight - rect.top) / windowHeight));
            element.style.opacity = progress;
            element.style.transform = `translateY(${(1 - progress) * 50}px)`;
        }
    });
});

// Typing effect for hero title
const typeWriter = (element, text, speed = 100) => {
    let i = 0;
    element.innerHTML = '';
    
    const type = () => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    };
    
    type();
};

// Initialize typing effect when page loads
window.addEventListener('load', () => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
        const originalText = heroTitle.innerHTML;
        setTimeout(() => {
            typeWriter(heroTitle, originalText.replace(/<[^>]*>/g, ''), 50);
        }, 1000);
    }
    
    // Hero 섹션 애니메이션
    const heroContent = document.querySelector('.hero-content');
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroContent) {
        heroContent.classList.add('scroll-animate');
        setTimeout(() => {
            heroContent.classList.add('animate');
        }, 500);
    }
    
    if (heroVisual) {
        heroVisual.classList.add('scroll-animate', 'delay-1');
        setTimeout(() => {
            heroVisual.classList.add('animate');
        }, 800);
    }
});

// Add hover effects to service cards
const serviceCards = document.querySelectorAll('.service-card');
serviceCards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// Add click effects to buttons
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', (e) => {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        button.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Add CSS for ripple effect
const style = document.createElement('style');
style.textContent = `
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Lazy loading for images (if any are added later)
const lazyImages = document.querySelectorAll('img[data-src]');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.classList.remove('lazy');
            imageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => imageObserver.observe(img));

// Add scroll progress indicator
const createScrollProgress = () => {
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 0%;
        height: 3px;
        background: linear-gradient(90deg, #00ff88, #00cc6a);
        z-index: 9999;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + '%';
    });
};

// Initialize scroll progress
createScrollProgress();

// Add keyboard navigation support
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    }
});

// Add focus management for accessibility
navLinks.forEach(link => {
    link.addEventListener('focus', () => {
        link.style.outline = '2px solid #00ff88';
        link.style.outlineOffset = '2px';
    });
    
    link.addEventListener('blur', () => {
        link.style.outline = 'none';
    });
});

// 마우스 추적 효과
document.addEventListener('mousemove', (e) => {
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    }
});

// 커스텀 커서 생성
function createCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.innerHTML = '<div class="cursor-dot"></div>';
    document.body.appendChild(cursor);
}

// 3D 틸트 효과
function addTiltEffect() {
    const tiltElements = document.querySelectorAll('.magnetic, .glassmorphism');
    
    tiltElements.forEach(element => {
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;
            
            element.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
        });
        
        element.addEventListener('mouseleave', () => {
            element.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
        });
    });
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', function() {
    createCustomCursor();
    addTiltEffect();
});

console.log('LIGHT website loaded successfully! 🌱');
