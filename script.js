// Mobile Navigation Toggle
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// Smooth scrolling for navigation links (only for same-page anchors)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Only handle same-page anchors, not links to other pages
        if (href.startsWith('#') && href.length > 1) {
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                if (navMenu && navMenu.classList.contains('active')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            }
        }
    });
});

// Navbar background change on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(255, 255, 255, 0.98)';
        navbar.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        navbar.style.background = 'rgba(255, 255, 255, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Intersection Observer for scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Observe elements for scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const animatedElements = document.querySelectorAll('.service-card, .pricing-card, .feature-item, .contact-item, .benefit-item');
    animatedElements.forEach(el => {
        el.classList.add('fade-in');
        observer.observe(el);
    });
});

// EmailJS Configuration
// Replace these with your EmailJS credentials from https://www.emailjs.com/
const EMAILJS_CONFIG = {
    PUBLIC_KEY: 'YOUR_PUBLIC_KEY', // Your EmailJS Public Key (User ID)
    SERVICE_ID: 'YOUR_SERVICE_ID', // Your EmailJS Service ID
    QUOTE_TEMPLATE_ID: 'YOUR_QUOTE_TEMPLATE_ID', // Template ID for quote form
    CAREERS_TEMPLATE_ID: 'YOUR_CAREERS_TEMPLATE_ID', // Template ID for careers form
    REVIEW_TEMPLATE_ID: 'YOUR_REVIEW_TEMPLATE_ID' // Template ID for review form (optional - can use quote template)
};

// Initialize EmailJS
if (typeof emailjs !== 'undefined' && EMAILJS_CONFIG.PUBLIC_KEY !== 'YOUR_PUBLIC_KEY') {
    emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY);
}

// Helper function to send email via EmailJS
async function sendEmail(templateId, templateParams) {
    try {
        if (EMAILJS_CONFIG.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
            // Fallback: Show notification and log to console if EmailJS not configured
            console.log('EmailJS not configured. Form data:', templateParams);
            return { success: true, message: 'EmailJS not configured. Please set up your credentials.' };
        }
        
        const response = await emailjs.send(
            EMAILJS_CONFIG.SERVICE_ID,
            templateId,
            templateParams
        );
        return { success: true, message: 'Email sent successfully!' };
    } catch (error) {
        console.error('EmailJS Error:', error);
        return { success: false, message: 'Failed to send email. Please try again or contact us directly.' };
    }
}

// Quote form handling
const quoteForm = document.getElementById('quote-form');
if (quoteForm) {
    quoteForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Get selected services
        const selectedServices = Array.from(document.querySelectorAll('input[name="services"]:checked'))
            .map(checkbox => checkbox.value);
        
        // Create quote summary
        const quoteData = {
            name: data.name,
            email: data.email,
            phone: data.phone,
            propertyType: data['property-type'],
            propertySize: data['property-size'],
            services: selectedServices.join(', '),
            message: data.message || 'No additional notes',
            timestamp: new Date().toLocaleString()
        };
        
        // Prepare email template parameters
        const emailParams = {
            to_email: 'ddesouza@novarecleaningservice.com', // Your company email
            from_name: quoteData.name,
            from_email: quoteData.email,
            phone: quoteData.phone,
            property_type: quoteData.propertyType,
            property_size: quoteData.propertySize,
            services: quoteData.services,
            message: quoteData.message,
            reply_to: quoteData.email,
            subject: `New Quote Request from ${quoteData.name}`
        };
        
        // Send email
        const result = await sendEmail(EMAILJS_CONFIG.QUOTE_TEMPLATE_ID, emailParams);
        
        if (result.success) {
            showNotification('Quote request submitted successfully! We\'ll contact you within 24 hours.', 'success');
            this.reset();
        } else {
            showNotification('There was an error submitting your request. Please try again or contact us directly.', 'error');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Careers form handling
const careersForm = document.getElementById('careers-form');
if (careersForm) {
    careersForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Get selected availability options
        const availability = Array.from(this.querySelectorAll('input[name="availability"]:checked'))
            .map(checkbox => checkbox.value);
        
        if (availability.length === 0) {
            showNotification('Please select at least one availability option.', 'error');
            submitButton.disabled = false;
            submitButton.textContent = originalText;
            return;
        }
        
        // Create application summary
        const applicationData = {
            name: data['applicant-name'],
            email: data['applicant-email'],
            phone: data['applicant-phone'],
            address: data['applicant-address'],
            experience: data.experience,
            availability: availability.join(', '),
            message: data['applicant-message'] || 'No additional message',
            timestamp: new Date().toLocaleString()
        };
        
        // Prepare email template parameters
        const emailParams = {
            to_email: 'ddesouza@novarecleaningservice.com', // Your company email
            from_name: applicationData.name,
            from_email: applicationData.email,
            phone: applicationData.phone,
            address: applicationData.address,
            experience: applicationData.experience,
            availability: applicationData.availability,
            message: applicationData.message,
            reply_to: applicationData.email,
            subject: `Job Application from ${applicationData.name}`
        };
        
        // Send email
        const result = await sendEmail(EMAILJS_CONFIG.CAREERS_TEMPLATE_ID, emailParams);
        
        if (result.success) {
            showNotification('Application submitted successfully! We\'ll review your application and get back to you soon.', 'success');
            this.reset();
        } else {
            showNotification('There was an error submitting your application. Please try again or contact us directly.', 'error');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Review form handling
const reviewForm = document.getElementById('review-form');
if (reviewForm) {
    reviewForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        submitButton.disabled = true;
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Submitting...';
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Create review summary
        const reviewData = {
            name: data['reviewer-name'],
            email: data['reviewer-email'],
            rating: data['review-rating'],
            message: data['review-message'],
            timestamp: new Date().toLocaleString()
        };
        
        // Prepare email template parameters
        const emailParams = {
            to_email: 'ddesouza@novarecleaningservice.com', // Your company email
            from_name: reviewData.name,
            from_email: reviewData.email,
            rating: `${reviewData.rating} Star${reviewData.rating > 1 ? 's' : ''}`,
            message: reviewData.message,
            reply_to: reviewData.email,
            subject: `New Review from ${reviewData.name} - ${reviewData.rating} Stars`
        };
        
        // Send email
        const result = await sendEmail(EMAILJS_CONFIG.REVIEW_TEMPLATE_ID || EMAILJS_CONFIG.QUOTE_TEMPLATE_ID, emailParams);
        
        if (result.success) {
            showNotification('Thank you for your review! We appreciate your feedback.', 'success');
            this.reset();
        } else {
            showNotification('There was an error submitting your review. Please try again later.', 'error');
        }
        
        submitButton.disabled = false;
        submitButton.textContent = originalText;
    });
}

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const data = Object.fromEntries(formData);
        
        // Show success message
        showNotification('Message sent successfully! We\'ll get back to you soon.', 'success');
        
        // Reset form
        this.reset();
        
        // In a real application, you would send this data to your server
        console.log('Contact Data:', data);
    });
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    let backgroundColor = '#3b82f6'; // default blue
    if (type === 'success') {
        backgroundColor = '#10b981'; // green
    } else if (type === 'error') {
        backgroundColor = '#ef4444'; // red
    }
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${backgroundColor};
        color: white;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });
}

// Add CSS for notifications
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 10px;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        padding: 0;
        margin-left: 10px;
    }
`;
document.head.appendChild(notificationStyles);

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero) {
        const rate = scrolled * -0.5;
        hero.style.transform = `translateY(${rate}px)`;
    }
});

// Counter animation for stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/[^\d]/g, ''));
        const duration = 2000;
        const increment = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                counter.textContent = counter.textContent.replace(/\d+/, Math.floor(current));
            }
        }, 16);
    });
}

// Trigger counter animation when stats section is visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    statsObserver.observe(heroStats);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.style.borderColor = '#ef4444';
            isValid = false;
        } else {
            input.style.borderColor = '#e2e8f0';
        }
    });
    
    return isValid;
}

// Add validation to forms
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', function(e) {
        if (!validateForm(this)) {
            e.preventDefault();
            showNotification('Please fill in all required fields.', 'error');
        }
    });
});

// Add input validation on blur
document.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('blur', function() {
        if (this.hasAttribute('required') && !this.value.trim()) {
            this.style.borderColor = '#ef4444';
        } else {
            this.style.borderColor = '#e2e8f0';
        }
    });
    
    input.addEventListener('input', function() {
        if (this.style.borderColor === 'rgb(239, 68, 68)') {
            this.style.borderColor = '#e2e8f0';
        }
    });
});

// Loading animation for buttons
function addLoadingState(button) {
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
    }, 2000);
}

// Add loading state to form submissions
document.querySelectorAll('form button[type="submit"]').forEach(button => {
    button.addEventListener('click', function() {
        if (this.form.checkValidity()) {
            addLoadingState(this);
        }
    });
});

// Smooth reveal animation for sections
const revealElements = document.querySelectorAll('.section-header, .service-card, .pricing-card, .about-content, .contact-content');
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

revealElements.forEach(element => {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    revealObserver.observe(element);
});

// Add hover effects for interactive elements
document.querySelectorAll('.btn, .service-card, .pricing-card').forEach(element => {
    element.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    element.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Hero Image Carousel
function initHeroCarousel() {
    const carousel = document.querySelector('.hero-carousel');
    if (!carousel) return;

    const images = carousel.querySelectorAll('.carousel-image');
    const dots = carousel.querySelectorAll('.carousel-dot');
    const prevBtn = carousel.querySelector('.carousel-prev');
    const nextBtn = carousel.querySelector('.carousel-next');
    
    let currentIndex = 0;
    const totalImages = images.length;

    // Only show carousel if there are images
    if (totalImages === 0) return;

    // Function to show specific slide
    function showSlide(index) {
        // Handle wrapping
        if (index >= totalImages) {
            currentIndex = 0;
        } else if (index < 0) {
            currentIndex = totalImages - 1;
        } else {
            currentIndex = index;
        }

        // Update images
        images.forEach((img, i) => {
            img.classList.remove('active');
            if (i === currentIndex) {
                img.classList.add('active');
            }
        });

        // Update dots
        dots.forEach((dot, i) => {
            dot.classList.remove('active');
            if (i === currentIndex) {
                dot.classList.add('active');
            }
        });
    }

    // Next slide function
    function nextSlide() {
        showSlide(currentIndex + 1);
    }

    // Previous slide function
    function prevSlide() {
        showSlide(currentIndex - 1);
    }

    // Event listeners
    if (nextBtn) {
        nextBtn.addEventListener('click', nextSlide);
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', prevSlide);
    }

    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showSlide(index);
        });
    });

    // Auto-rotate every 5 seconds
    let autoRotate = setInterval(nextSlide, 5000);

    // Pause on hover
    carousel.addEventListener('mouseenter', () => {
        clearInterval(autoRotate);
    });

    carousel.addEventListener('mouseleave', () => {
        autoRotate = setInterval(nextSlide, 5000);
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
        } else if (e.key === 'ArrowRight') {
            nextSlide();
        }
    });

    // Handle missing images - show placeholder if all images fail to load
    let loadedImages = 0;
    images.forEach((img, index) => {
        img.addEventListener('error', function() {
            loadedImages++;
            // If all images fail, show a placeholder
            if (loadedImages === totalImages) {
                carousel.innerHTML = `
                    <div class="image-placeholder" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                        <i class="fas fa-home" style="font-size: 4rem; color: white;"></i>
                    </div>
                `;
            } else {
                // Hide individual failed images
                this.style.display = 'none';
            }
        });
        img.addEventListener('load', function() {
            // Image loaded successfully
        });
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Novare Cleaning Services website loaded successfully!');
    
    // Initialize hero carousel
    initHeroCarousel();
    
    // Add any initialization code here
    const currentYear = new Date().getFullYear();
    const footerYear = document.querySelector('.footer-bottom p');
    if (footerYear) {
        footerYear.textContent = footerYear.textContent.replace('2024', currentYear);
    }
});
