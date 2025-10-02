// DOM Elements
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const navbar = document.querySelector('.navbar');

// 앱 환경 감지
const isAppEnvironment = () => {
    return window.matchMedia('(display-mode: standalone)').matches || 
           window.navigator.standalone === true ||
           document.referrer.includes('android-app://');
};

// 앱 환경에서의 추가 최적화
if (isAppEnvironment()) {
    document.body.classList.add('app-environment');
}

// Mobile Navigation Toggle with 앱 환경 최적화
hamburger.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // 앱 환경에서의 햅틱 피드백
    if (navigator.vibrate && isAppEnvironment()) {
        navigator.vibrate(50);
    }
    
    // 앱 환경에서의 스크롤 방지
    if (navMenu.classList.contains('active')) {
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
});

// Close mobile menu when clicking on a link with 앱 환경 최적화
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.style.overflow = '';
        
        // 앱 환경에서의 햅틱 피드백
        if (navigator.vibrate && isAppEnvironment()) {
            navigator.vibrate(30);
        }
        
        // 스무스 스크롤로 섹션 이동
        const targetId = link.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const offsetTop = targetSection.offsetTop - (isAppEnvironment() ? 60 : 70);
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// 앱 환경에서의 스크롤 최적화
const optimizeScrollForApp = () => {
    if (isAppEnvironment()) {
        // 앱 환경에서의 스크롤 성능 최적화
        let ticking = false;
        
        const updateScroll = () => {
            const scrolled = window.pageYOffset;
            const navbar = document.querySelector('.navbar');
            
            if (scrolled > 50) {
                navbar.style.background = 'rgba(10, 10, 10, 0.98)';
                navbar.style.backdropFilter = 'blur(20px)';
                navbar.style.webkitBackdropFilter = 'blur(20px)';
            } else {
                navbar.style.background = 'rgba(10, 10, 10, 0.95)';
                navbar.style.backdropFilter = 'blur(10px)';
                navbar.style.webkitBackdropFilter = 'blur(10px)';
            }
            
            ticking = false;
        };
        
        const requestTick = () => {
            if (!ticking) {
                requestAnimationFrame(updateScroll);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestTick, { passive: true });
    }
};

// 앱 환경에서의 터치 제스처 최적화
const optimizeTouchForApp = () => {
    if (isAppEnvironment()) {
        // 터치 제스처 최적화
        let startY = 0;
        let startX = 0;
        
        document.addEventListener('touchstart', (e) => {
            startY = e.touches[0].clientY;
            startX = e.touches[0].clientX;
        }, { passive: true });
        
        document.addEventListener('touchmove', (e) => {
            const currentY = e.touches[0].clientY;
            const currentX = e.touches[0].clientX;
            const diffY = startY - currentY;
            const diffX = startX - currentX;
            
            // 수직 스크롤 우선 처리
            if (Math.abs(diffY) > Math.abs(diffX)) {
                // 스크롤 동작 허용
                return;
            }
            
            // 수평 스와이프 방지 (앱 환경에서)
            if (Math.abs(diffX) > 50) {
                e.preventDefault();
            }
        }, { passive: false });
        
        // 앱 환경에서의 더블 탭 줌 방지
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = (new Date()).getTime();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, { passive: false });
    }
};

// 고급 스크롤 애니메이션 시스템
class AdvancedScrollAnimations {
    constructor() {
        this.init();
    }

    init() {
        this.createScrollProgress();
        this.setupParallax();
        this.setupTextReveal();
        this.setupSectionTransitions();
        this.setupScrollBasedAnimations();
        this.setupMagneticHover();
    }

    // 스크롤 진행 표시기 생성
    createScrollProgress() {
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + '%';
        });
    }

    // 패럴랙스 효과 설정
    setupParallax() {
        const parallaxElements = document.querySelectorAll('.parallax-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            parallaxElements.forEach((element, index) => {
                const rect = element.getBoundingClientRect();
                const speed = 0.5 + (index * 0.1);
                const yPos = -(scrolled * speed);
                element.style.transform = `translateY(${yPos}px)`;
            });
        });
    }

    // 텍스트 리빌 애니메이션
    setupTextReveal() {
        const textElements = document.querySelectorAll('.text-reveal');
        
        const textObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -100px 0px'
        });

        textElements.forEach(el => textObserver.observe(el));
    }

    // 섹션 전환 효과
    setupSectionTransitions() {
        const sections = document.querySelectorAll('section');
        
        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                } else {
                    entry.target.classList.remove('in-view');
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -200px 0px'
        });

        sections.forEach(section => {
            section.classList.add('section-transition');
            sectionObserver.observe(section);
        });
    }

    // 스크롤 기반 애니메이션
    setupScrollBasedAnimations() {
        const animatedElements = document.querySelectorAll('.scroll-animate, .text-slide-up, .text-slide-left, .text-slide-right, .scale-in, .rotate-in');
        
        const animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        animatedElements.forEach(el => animationObserver.observe(el));
    }

    // 마그네틱 호버 효과
    setupMagneticHover() {
        const magneticElements = document.querySelectorAll('.magnetic-hover');
        
        magneticElements.forEach(element => {
            element.addEventListener('mousemove', (e) => {
                const rect = element.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                
                const distance = Math.sqrt(x * x + y * y);
                const maxDistance = 50;
                
                if (distance < maxDistance) {
                    const moveX = (x / maxDistance) * 10;
                    const moveY = (y / maxDistance) * 10;
                    
                    element.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.05)`;
                }
            });
            
            element.addEventListener('mouseleave', () => {
                element.style.transform = 'translate(0px, 0px) scale(1)';
            });
        });
    }
}

// 향상된 스크롤 애니메이션 (기존 호환성 유지)
const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

// 애니메이션 대상 요소들에 observer 적용
document.addEventListener('DOMContentLoaded', function() {
    // 고급 스크롤 애니메이션 시스템 초기화
    new AdvancedScrollAnimations();
    
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

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVisual = document.querySelector('.hero-visual');
    
    if (heroVisual) {
        const rate = scrolled * -0.5;
        heroVisual.style.transform = `translateY(${rate}px)`;
    }
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

// 앱 환경에서의 성능 최적화
const optimizePerformanceForApp = () => {
    if (isAppEnvironment()) {
        // 앱 환경에서의 애니메이션 최적화
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        if (prefersReducedMotion) {
            // 애니메이션 비활성화
            document.documentElement.style.setProperty('--animation-duration', '0s');
            document.documentElement.style.setProperty('--transition-duration', '0s');
        }
        
        // 앱 환경에서의 이미지 지연 로딩 최적화
        const images = document.querySelectorAll('img');
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        }, {
            rootMargin: '50px 0px',
            threshold: 0.01
        });
        
        images.forEach(img => {
            if (img.dataset.src) {
                imageObserver.observe(img);
            }
        });
        
        // 앱 환경에서의 메모리 최적화
        const cleanup = () => {
            // 사용하지 않는 이벤트 리스너 정리
            window.removeEventListener('scroll', updateScroll);
        };
        
        // 페이지 언로드 시 정리
        window.addEventListener('beforeunload', cleanup);
    }
};

// Initialize typing effect when page loads with 앱 환경 최적화
window.addEventListener('load', () => {
    // 앱 환경 최적화 초기화
    optimizeScrollForApp();
    optimizeTouchForApp();
    optimizePerformanceForApp();
    
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

// PWA Service Worker 등록
const registerServiceWorker = async () => {
  if ('serviceWorker' in navigator) {
    try {
      const registration = await navigator.serviceWorker.register('/sw.js');
      console.log('LIGHT PWA Service Worker registered:', registration);
      
      // 업데이트 확인
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // 새 버전 사용 가능 알림
            if (confirm('LIGHT의 새 버전이 사용 가능합니다. 지금 업데이트하시겠습니까?')) {
              newWorker.postMessage({ action: 'skipWaiting' });
              window.location.reload();
            }
          }
        });
      });
      
      // 푸시 알림 권한 요청
      if ('Notification' in window && 'PushManager' in window) {
        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
          console.log('LIGHT PWA Push notifications enabled');
        }
      }
      
    } catch (error) {
      console.error('LIGHT PWA Service Worker registration failed:', error);
    }
  }
};

// PWA 설치 프롬프트
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
  console.log('LIGHT PWA Install prompt triggered');
  e.preventDefault();
  deferredPrompt = e;
  
  // 설치 버튼 표시
  const installButton = document.createElement('button');
  installButton.textContent = '앱 설치';
  installButton.className = 'btn btn-primary';
  installButton.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
    padding: 12px 24px;
    background: linear-gradient(135deg, #00ff88, #00cc6a);
    color: #000000;
    border: none;
    border-radius: 24px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 255, 136, 0.3);
    transition: all 0.3s ease;
  `;
  
  installButton.addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('LIGHT PWA Install choice:', outcome);
      deferredPrompt = null;
      installButton.remove();
    }
  });
  
  document.body.appendChild(installButton);
  
  // 5초 후 자동 숨김
  setTimeout(() => {
    if (installButton.parentNode) {
      installButton.remove();
    }
  }, 5000);
});

// PWA 설치 완료
window.addEventListener('appinstalled', () => {
  console.log('LIGHT PWA installed successfully!');
  // 설치 완료 후 처리
  if (deferredPrompt) {
    deferredPrompt = null;
  }
});

// PWA 상태 감지
const checkPWAStatus = () => {
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  const isInApp = window.navigator.standalone === true;
  
  if (isStandalone || isInApp) {
    document.body.classList.add('pwa-installed');
    console.log('LIGHT PWA running in standalone mode');
  }
};

// 오프라인 상태 감지
const handleOnlineStatus = () => {
  const updateOnlineStatus = () => {
    if (navigator.onLine) {
      document.body.classList.remove('offline');
      console.log('LIGHT PWA back online');
    } else {
      document.body.classList.add('offline');
      console.log('LIGHT PWA offline');
    }
  };
  
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  updateOnlineStatus();
};

// PWA 초기화
const initializePWA = async () => {
  await registerServiceWorker();
  checkPWAStatus();
  handleOnlineStatus();
};

// PWA 초기화 실행
initializePWA();

console.log('LIGHT website loaded successfully! 🌱');
