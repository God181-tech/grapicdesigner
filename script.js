// ==================== NAVIGATION ==================== 
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.style.opacity = navMenu.classList.contains('active') ? '0.7' : '1';
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.style.opacity = '1';
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (!e.target.closest('.navbar')) {
        navMenu.classList.remove('active');
        hamburger.style.opacity = '1';
    }
});

// ==================== SCROLL ANIMATIONS ==================== 
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

document.querySelectorAll('.profession-content').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'all 0.6s ease-out';
    observer.observe(el);
});

// ==================== CATEGORY NAVIGATION ==================== 
const categoryCards = document.querySelectorAll('.category-card');

categoryCards.forEach(card => {
    card.addEventListener('click', (e) => {
        e.preventDefault();
        const target = card.getAttribute('data-target');
        const element = document.getElementById(target);
        
        if (element) {
            // Scroll to element with offset for navbar
            const offsetTop = element.offsetTop - 100;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });

            // Highlight the section
            element.style.animation = 'highlightSection 0.6s ease-out';
            setTimeout(() => {
                element.style.animation = 'none';
            }, 600);
        }
    });
});

// Highlight animation
const style = document.createElement('style');
style.textContent = `
    @keyframes highlightSection {
        0% {
            background-color: transparent;
        }
        50% {
            background-color: rgba(217, 119, 6, 0.2);
        }
        100% {
            background-color: transparent;
        }
    }
`;
document.head.appendChild(style);

// ==================== PODCAST PLAYER ==================== 
let currentlyPlayingPodcast = null;

function togglePlayPodcast(podcastId, button) {
    const audio = document.getElementById(podcastId);
    const playBtn = button.closest('.podcast-card') ? button.closest('.podcast-card').querySelector('.play-btn') : button;
    
    // Stop other podcasts
    if (currentlyPlayingPodcast && currentlyPlayingPodcast !== podcastId) {
        const otherAudio = document.getElementById(currentlyPlayingPodcast);
        const otherBtn = document.getElementById(currentlyPlayingPodcast).closest('.podcast-card') ? 
            document.getElementById(currentlyPlayingPodcast).closest('.podcast-card').querySelector('.play-btn') : 
            document.querySelector(`[onclick*="${currentlyPlayingPodcast}"]`);
        
        otherAudio.pause();
        if (otherBtn) {
            otherBtn.innerHTML = '<i class="fas fa-play"></i>';
        }
    }

    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        currentlyPlayingPodcast = podcastId;

        // Update progress bar
        audio.addEventListener('timeupdate', updateProgressBar);
        audio.addEventListener('loadedmetadata', updateProgressBar);
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
}

function updateProgressBar(event) {
    const audio = event.target;
    const card = audio.closest('.podcast-card');
    const slider = card.querySelector('.progress-slider');
    const timeDisplay = card.querySelector('.time-display');
    
    const currentTime = audio.currentTime;
    const duration = audio.duration;
    
    if (!isNaN(duration)) {
        const percentage = (currentTime / duration) * 100;
        slider.value = percentage;
        
        // Update time display
        const minutes = Math.floor(currentTime / 60);
        const seconds = Math.floor(currentTime % 60);
        timeDisplay.textContent = `${minutes}:${seconds.toString().padStart(2, '0')}`;
    }
}

function seekPodcast(podcastId, slider) {
    const audio = document.getElementById(podcastId);
    const time = (slider.value / 100) * audio.duration;
    audio.currentTime = time;
}

// Update slider when audio ends
document.querySelectorAll('audio').forEach(audio => {
    audio.addEventListener('ended', () => {
        const card = audio.closest('.podcast-card');
        const playBtn = card.querySelector('.play-btn');
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        
        // Reset slider
        const slider = card.querySelector('.progress-slider');
        const timeDisplay = card.querySelector('.time-display');
        slider.value = 0;
        timeDisplay.textContent = '0:00';
    });

    // Preload metadata to get duration
    audio.addEventListener('loadedmetadata', () => {
        const card = audio.closest('.podcast-card');
        const slider = card.querySelector('.progress-slider');
        const timeDisplay = card.querySelector('.time-display');
        
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);
        
        // Update max value of slider
        slider.max = 100;
    });
});

// ==================== SMOOTH SCROLL FOR NAVIGATION LINKS ==================== 
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href !== '#podcasts' && !this.closest('.category-card')) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ==================== ADD TO CART ANIMATION FOR CTA ==================== 
const ctaButtons = document.querySelectorAll('.cta-button, .listen-btn, .submit-btn');

ctaButtons.forEach(button => {
    button.addEventListener('click', function (e) {
        if (this.closest('form')) return; // Skip form submission
        
        const rect = this.getBoundingClientRect();
        const ripple = document.createElement('span');
        ripple.style.position = 'absolute';
        ripple.style.width = '20px';
        ripple.style.height = '20px';
        ripple.style.background = 'rgba(255, 255, 255, 0.7)';
        ripple.style.borderRadius = '50%';
        ripple.style.left = (e.clientX - rect.left) + 'px';
        ripple.style.top = (e.clientY - rect.top) + 'px';
        ripple.style.pointerEvents = 'none';
        ripple.style.animation = 'ripple 0.6s ease-out';
        
        this.style.position = 'relative';
        this.style.overflow = 'hidden';
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Ripple animation
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==================== LAZY LOADING FOR IMAGES ==================== 
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src || img.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => imageObserver.observe(img));
}

// ==================== FORM SUBMISSION ==================== 
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form values
        const name = contactForm.querySelector('input[placeholder="Tên của bạn"]').value;
        const email = contactForm.querySelector('input[placeholder="Email của bạn"]').value;
        const message = contactForm.querySelector('textarea').value;
        
        // Validate
        if (name && email && message) {
            // Show success message
            const button = contactForm.querySelector('.submit-btn');
            const originalText = button.textContent;
            button.textContent = '✓ Tin nhắn đã được gửi!';
            button.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            
            // Reset form
            contactForm.reset();
            
            // Reset button after 3 seconds
            setTimeout(() => {
                button.textContent = originalText;
                button.style.background = '';
            }, 3000);
        } else {
            alert('Vui lòng điền tất cả các trường');
        }
    });
}

// ==================== KEYBOARD SHORTCUTS ==================== 
document.addEventListener('keydown', (e) => {
    // Alt + P to toggle play for first podcast
    if (e.altKey && e.key === 'p') {
        const firstPlayBtn = document.querySelector('.play-btn');
        if (firstPlayBtn) firstPlayBtn.click();
    }
    
    // Alt + C to scroll to contact
    if (e.altKey && e.key === 'c') {
        document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
    }
});

// ==================== SCROLL INDICATOR ==================== 
window.addEventListener('scroll', () => {
    const scrollPercentage = (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    
    // Optional: Add a scroll indicator if needed
    // You can create a progress bar element in HTML and update it here
});

// ==================== MINDMAP INTERACTION ==================== 
const mindmapNodes = document.querySelectorAll('.mindmap-node');

mindmapNodes.forEach(node => {
    node.addEventListener('mouseenter', () => {
        // Add glow effect
        node.style.filter = 'drop-shadow(0 0 20px rgba(217, 119, 6, 0.6))';
    });

    node.addEventListener('mouseleave', () => {
        node.style.filter = 'none';
    });

    node.addEventListener('click', () => {
        // Animate click
        node.style.animation = 'pulse 0.6s ease-out';
        setTimeout(() => {
            node.style.animation = 'none';
        }, 600);
    });
});

// ==================== LOADING ANIMATION ==================== 
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

body.style.opacity = '0';
body.style.transition = 'opacity 0.5s ease-out';

// ==================== ACCESSIBILITY ==================== 
// Add focus visible for keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
        document.body.style.outline = 'none';
    }
});

// ==================== PERFORMANCE OPTIMIZATION ==================== 
// Debounce function for scroll events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// ==================== DARK MODE (OPTIONAL) ==================== 
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function toggleDarkMode(isDark) {
    if (isDark) {
        document.body.classList.add('dark-mode');
    } else {
        document.body.classList.remove('dark-mode');
    }
}

// toggleDarkMode(prefersDark.matches);
// prefersDark.addEventListener('change', e => toggleDarkMode(e.matches));

// ==================== PRINT FRIENDLY ==================== 
window.addEventListener('beforeprint', () => {
    document.querySelectorAll('.podcast-player').forEach(player => {
        player.style.display = 'none';
    });
});

window.addEventListener('afterprint', () => {
    document.querySelectorAll('.podcast-player').forEach(player => {
        player.style.display = 'block';
    });
});

// ==================== PAGE VISIBILITY API ==================== 
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause all audio when page is hidden
        document.querySelectorAll('audio').forEach(audio => {
            audio.pause();
        });
    }
});

// ==================== INITIAL SETUP ==================== 
console.log('%c🎨 Graphic Designer Website Loaded', 'color: #d97706; font-size: 16px; font-weight: bold;');
console.log('%cExplore the world of Graphic Design', 'color: #f59e0b; font-size: 12px;');

// Enable smooth transitions
document.querySelectorAll('*').forEach(el => {
    el.style.transition = el.style.transition ? el.style.transition + ', all 0.3s ease' : 'all 0.3s ease';
});
