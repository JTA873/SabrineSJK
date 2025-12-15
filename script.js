// ===================================
// MOBILE MENU TOGGLE - Enhanced
// ===================================
const menuToggle = document.querySelector('.menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-menu a');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        const isActive = navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
        menuToggle.setAttribute('aria-expanded', isActive);
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isActive ? 'hidden' : '';
    });
}

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        // Don't close for member space link (it opens modal)
        if (!link.classList.contains('btn-membre')) {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            document.body.style.overflow = '';
        }
    });
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('active') && 
        !navMenu.contains(e.target) && 
        !menuToggle.contains(e.target)) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }
});

// ===================================
// STICKY HEADER ON SCROLL
// ===================================
const header = document.querySelector('.header');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 100) {
        header.style.padding = '0.5rem 0';
        header.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.padding = '1rem 0';
        header.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.08)';
    }
    
    lastScroll = currentScroll;
});

// ===================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 80;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ===================================
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

// Observe service cards, testimonials, etc.
const animatedElements = document.querySelectorAll('.service-card, .testimonial-card, .about-content, .about-image');
animatedElements.forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===================================
// BOOKING FORM HANDLING
// ===================================
const bookingForm = document.getElementById('bookingForm');

if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = {
            name: document.getElementById('booking-name').value,
            phone: document.getElementById('booking-phone').value,
            email: document.getElementById('booking-email').value,
            date: document.getElementById('booking-date').value,
            time: document.getElementById('booking-time').value,
            service: document.getElementById('booking-service').value,
            promo: document.getElementById('booking-promo').value,
            message: document.getElementById('booking-message').value
        };
        
        // Here you would typically send the data to a server
        // For now, we'll just show a success message
        showNotification('✅ Réservation confirmée ! Vous recevrez un email de confirmation sous peu.', 'success');
        
        // Reset form
        bookingForm.reset();
    });
}

// ===================================
// NOTIFICATION SYSTEM
// ===================================
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Colors based on type
    const colors = {
        success: '#00b894',
        error: '#d63031',
        info: '#0984e3'
    };
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        backgroundColor: colors[type] || colors.info,
        color: 'white',
        borderRadius: '10px',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        fontWeight: '500'
    });
    
    document.body.appendChild(notification);
    
    // Remove notification after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===================================
// SCROLL PROGRESS INDICATOR
// ===================================
const createScrollIndicator = () => {
    const indicator = document.createElement('div');
    indicator.className = 'scroll-indicator-bar';
    
    Object.assign(indicator.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        height: '3px',
        background: 'linear-gradient(90deg, #8B7355, #C4A57B)',
        zIndex: '10001',
        transition: 'width 0.1s ease'
    });
    
    document.body.appendChild(indicator);
    
    window.addEventListener('scroll', () => {
        const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (window.pageYOffset / windowHeight) * 100;
        indicator.style.width = scrolled + '%';
    });
};

createScrollIndicator();

// ===================================
// ACTIVE SECTION HIGHLIGHTING IN NAV
// ===================================
const sections = document.querySelectorAll('section[id]');

const highlightNav = () => {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        const navLink = document.querySelector(`.nav-menu a[href="#${sectionId}"]`);
        
        if (navLink) {
            if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                navLink.style.color = '#8B7355';
            } else {
                navLink.style.color = '#2C2C2C';
            }
        }
    });
};

window.addEventListener('scroll', highlightNav);

// ===================================
// LAZY LOADING FOR IMAGES (if added later)
// ===================================
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    const lazyImages = document.querySelectorAll('img.lazy');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// ===================================
// PREVENT FORM SPAM
// ===================================
let lastSubmitTime = 0;
const SUBMIT_COOLDOWN = 3000; // 3 seconds

contactForm.addEventListener('submit', (e) => {
    const currentTime = Date.now();
    if (currentTime - lastSubmitTime < SUBMIT_COOLDOWN) {
        e.preventDefault();
        showNotification('Veuillez attendre quelques secondes avant de soumettre à nouveau.', 'info');
        return;
    }
    lastSubmitTime = currentTime;
});

// ===================================
// GALLERY LIGHTBOX
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    // Effet lightbox simple pour les images de galerie
    document.querySelectorAll('.gallery-item').forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Fermer lightbox
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox || e.target.className === 'lightbox-close') {
                    lightbox.remove();
                    document.body.style.overflow = '';
                }
            });
        });
    });
});

// ===================================
// CALENDAR INITIALIZATION
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    const calendarEl = document.getElementById('calendar');
    
    if (calendarEl) {
        const calendar = new FullCalendar.Calendar(calendarEl, {
            initialView: 'dayGridMonth',
            locale: 'fr',
            headerToolbar: {
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek'
            },
            buttonText: {
                today: "Aujourd'hui",
                month: 'Mois',
                week: 'Semaine'
            },
            events: [
                // Example available slots - you would fetch these from your backend
                {
                    title: 'Disponible',
                    start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T09:00:00',
                    end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T10:00:00',
                    backgroundColor: '#00b894',
                    borderColor: '#00b894'
                },
                {
                    title: 'Disponible',
                    start: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T14:00:00',
                    end: new Date(Date.now() + 86400000).toISOString().split('T')[0] + 'T15:00:00',
                    backgroundColor: '#00b894',
                    borderColor: '#00b894'
                },
                {
                    title: 'Réservé',
                    start: new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T10:00:00',
                    end: new Date(Date.now() + 172800000).toISOString().split('T')[0] + 'T11:00:00',
                    backgroundColor: '#d63031',
                    borderColor: '#d63031'
                }
            ],
            dateClick: function(info) {
                document.getElementById('booking-date').value = info.dateStr;
                document.getElementById('bookingForm').scrollIntoView({ behavior: 'smooth' });
            }
        });
        
        calendar.render();
    }
});

// ===================================
// MEMBER SPACE MODAL
// ===================================
function openMemberSpace(event) {
    event.preventDefault();
    document.getElementById('memberModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMemberSpace() {
    document.getElementById('memberModal').classList.remove('active');
    document.body.style.overflow = '';
}

function showTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(tabName + 'Tab').classList.add('active');
    event.target.classList.add('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    const modal = document.getElementById('memberModal');
    if (event.target === modal) {
        closeMemberSpace();
    }
}

// Login form handler
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    showNotification('Connexion en cours...', 'info');
    // Here you would handle actual login
    setTimeout(() => {
        showNotification('✅ Connexion réussie ! Bienvenue.', 'success');
        closeMemberSpace();
    }, 1000);
});

// Register form handler
document.getElementById('registerForm').addEventListener('submit', (e) => {
    e.preventDefault();
    
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if (password !== confirm) {
        showNotification('❌ Les mots de passe ne correspondent pas.', 'error');
        return;
    }
    
    showNotification('Création du compte...', 'info');
    // Here you would handle actual registration
    setTimeout(() => {
        showNotification('✅ Compte créé avec succès ! Vous pouvez maintenant vous connecter.', 'success');
        showTab('login');
    }, 1000);
});

// ===================================
// PROMO CODE VALIDATION
// ===================================
document.getElementById('booking-promo')?.addEventListener('blur', function() {
    const promoCode = this.value.toUpperCase();
    if (promoCode === 'DECOUVERTE20') {
        showNotification('✅ Code promo valide ! -20% appliqué', 'success');
    } else if (promoCode && promoCode !== '') {
        showNotification('❌ Code promo invalide', 'error');
    }
});

// ===================================
// NEWSLETTER FORM
// ===================================
document.getElementById('newsletterForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    if (email) {
        showNotification('✅ Merci ! Vous êtes inscrit à notre newsletter.', 'success');
        e.target.reset();
    }
});

// ===================================
// PLATFORM DETECTION & OPTIMIZATION
// ===================================
function detectPlatform() {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // iOS detection
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        document.body.classList.add('platform-ios');
    }
    
    // Android detection
    if (/android/i.test(userAgent)) {
        document.body.classList.add('platform-android');
    }
    
    // Touch device detection
    if ('ontouchstart' in window || navigator.maxTouchPoints > 0) {
        document.body.classList.add('touch-device');
    }
    
    // Desktop detection
    if (!/Mobi|Android/i.test(userAgent)) {
        document.body.classList.add('platform-desktop');
    }
}

detectPlatform();

// ===================================
// SMOOTH SCROLL WITH OFFSET
// ===================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        
        // Don't prevent default for empty hash or modal triggers
        if (href === '#' || this.classList.contains('btn-membre')) {
            return;
        }
        
        e.preventDefault();
        const target = document.querySelector(href);
        
        if (target) {
            const headerOffset = window.innerWidth <= 968 ? 125 : 130;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ===================================
// CALL TO ACTION TRACKING
// ===================================
function trackCTA(action, label) {
    console.log(`CTA: ${action} - ${label}`);
    // Here you can integrate Google Analytics or other tracking
    // Example: gtag('event', action, { 'event_label': label });
}

// Track phone calls
document.querySelectorAll('a[href^="tel:"]').forEach(link => {
    link.addEventListener('click', () => {
        trackCTA('call', 'phone_click');
    });
});

// Track WhatsApp clicks
document.querySelectorAll('a[href^="https://wa.me"]').forEach(link => {
    link.addEventListener('click', () => {
        trackCTA('whatsapp', 'whatsapp_click');
    });
});

// Track Facebook clicks
document.querySelectorAll('a[href*="facebook.com"]').forEach(link => {
    link.addEventListener('click', () => {
        trackCTA('social', 'facebook_click');
    });
});

// ===================================
// BOOKING DETAILS MODAL SYSTEM
// ===================================
let currentBooking = {
    serviceId: '',
    serviceName: '',
    price: 0,
    duration: 0,
    participants: 1,
    discount: 0,
    promoDiscount: 0,
    total: 0
};

function openBookingDetails(serviceId, serviceName, price, duration) {
    currentBooking = {
        serviceId: serviceId,
        serviceName: serviceName,
        price: price,
        duration: duration,
        participants: 1,
        discount: 0,
        promoDiscount: 0,
        total: price
    };
    
    // Remplir les informations du service
    document.getElementById('selectedServiceName').textContent = serviceName;
    document.getElementById('selectedServicePrice').textContent = price + '€';
    document.getElementById('selectedServiceDuration').textContent = duration + ' min';
    
    // Ouvrir le modal
    document.getElementById('bookingDetailsModal').classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Reset à l'étape 1
    nextStep(1);
    updatePriceCalculator();
}

// Event listeners pour les boutons de service avec data attributes
document.addEventListener('DOMContentLoaded', function() {
    // Attacher les événements aux boutons de réservation
    document.querySelectorAll('.btn-service-book').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const serviceId = this.dataset.service;
            const serviceName = this.dataset.name;
            const price = parseInt(this.dataset.price);
            const duration = parseInt(this.dataset.duration);
            
            console.log('Ouverture réservation:', serviceId, serviceName, price, duration);
            openBookingDetails(serviceId, serviceName, price, duration);
        });
    });
});

function closeBookingDetails() {
    document.getElementById('bookingDetailsModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // Reset form
    document.getElementById('detailedBookingForm').reset();
    currentBooking.participants = 1;
    updatePriceCalculator();
}

function nextStep(stepNumber) {
    // Cacher toutes les étapes
    document.querySelectorAll('.form-step').forEach(step => {
        step.classList.remove('active');
    });
    
    // Afficher l'étape demandée
    document.querySelector(`.form-step[data-step="${stepNumber}"]`).classList.add('active');
    
    // Mettre à jour les indicateurs
    document.querySelectorAll('.step').forEach(step => {
        const num = parseInt(step.dataset.step);
        step.classList.remove('active', 'completed');
        
        if (num === stepNumber) {
            step.classList.add('active');
        } else if (num < stepNumber) {
            step.classList.add('completed');
        }
    });
    
    // Si étape 4, générer le récapitulatif
    if (stepNumber === 4) {
        generateSummary();
    }
}

function changeQuantity(change) {
    const input = document.getElementById('participants');
    let value = parseInt(input.value) + change;
    
    if (value < 1) value = 1;
    if (value > 10) value = 10;
    
    input.value = value;
    currentBooking.participants = value;
    updatePriceCalculator();
}

function updatePriceCalculator() {
    const qty = currentBooking.participants;
    const unitPrice = currentBooking.price;
    let subtotal = unitPrice * qty;
    
    // Remise groupe (10% si > 3 personnes)
    let discount = 0;
    if (qty > 3) {
        discount = subtotal * 0.10;
        currentBooking.discount = discount;
    } else {
        currentBooking.discount = 0;
    }
    
    // Calculer le total
    let total = subtotal - discount - currentBooking.promoDiscount;
    currentBooking.total = total;
    
    // Mettre à jour l'affichage
    document.getElementById('unitPrice').textContent = unitPrice + '€';
    document.getElementById('quantity').textContent = qty;
    document.getElementById('discount').textContent = discount > 0 ? '-' + discount.toFixed(2) + '€' : '0€';
    document.getElementById('totalPrice').textContent = total.toFixed(2) + '€';
}

function applyPromoCode() {
    const promoInput = document.getElementById('detail-promo');
    const code = promoInput.value.toUpperCase();
    
    if (code === 'DECOUVERTE20') {
        const promoDiscount = (currentBooking.price * currentBooking.participants - currentBooking.discount) * 0.20;
        currentBooking.promoDiscount = promoDiscount;
        updatePriceCalculator();
        showNotification('✅ Code promo -20% appliqué !', 'success');
    } else if (code === '') {
        currentBooking.promoDiscount = 0;
        updatePriceCalculator();
    } else {
        currentBooking.promoDiscount = 0;
        updatePriceCalculator();
    }
}

function generateSummary() {
    // Service
    document.getElementById('summary-service').textContent = 
        `${currentBooking.serviceName} (${currentBooking.duration} min)`;
    
    // Participants
    document.getElementById('summary-participants').textContent = 
        `${currentBooking.participants} personne(s)`;
    
    // Coordonnées
    const firstname = document.getElementById('detail-firstname').value;
    const lastname = document.getElementById('detail-lastname').value;
    const email = document.getElementById('detail-email').value;
    const phone = document.getElementById('detail-phone').value;
    document.getElementById('summary-contact').innerHTML = 
        `${firstname} ${lastname}<br>${email}<br>${phone}`;
    
    // Date et heure
    const date = document.getElementById('detail-date').value;
    const time = document.getElementById('detail-time').value;
    const formattedDate = new Date(date).toLocaleDateString('fr-FR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    document.getElementById('summary-datetime').innerHTML = 
        `${formattedDate}<br>à ${time}`;
    
    // Devis
    document.getElementById('devis-service').textContent = 
        `${currentBooking.serviceName} × ${currentBooking.participants}`;
    document.getElementById('devis-qty').textContent = 
        `${currentBooking.price}€ × ${currentBooking.participants} = ${(currentBooking.price * currentBooking.participants).toFixed(2)}€`;
    
    // Remise groupe
    if (currentBooking.discount > 0) {
        document.getElementById('devis-discount-row').style.display = 'flex';
        document.getElementById('devis-discount').textContent = 
            `-${currentBooking.discount.toFixed(2)}€`;
    } else {
        document.getElementById('devis-discount-row').style.display = 'none';
    }
    
    // Code promo
    if (currentBooking.promoDiscount > 0) {
        document.getElementById('devis-promo-row').style.display = 'flex';
        document.getElementById('devis-promo').textContent = 
            `-${currentBooking.promoDiscount.toFixed(2)}€`;
    } else {
        document.getElementById('devis-promo-row').style.display = 'none';
    }
    
    // Total
    document.getElementById('devis-total').textContent = 
        `${currentBooking.total.toFixed(2)}€`;
}

// Gestion de la soumission du formulaire détaillé
document.getElementById('detailedBookingForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Générer l'email de devis
    const emailData = {
        service: currentBooking.serviceName,
        participants: currentBooking.participants,
        price: currentBooking.price,
        discount: currentBooking.discount,
        promoDiscount: currentBooking.promoDiscount,
        total: currentBooking.total,
        firstname: document.getElementById('detail-firstname').value,
        lastname: document.getElementById('detail-lastname').value,
        email: document.getElementById('detail-email').value,
        phone: document.getElementById('detail-phone').value,
        date: document.getElementById('detail-date').value,
        time: document.getElementById('detail-time').value,
        message: document.getElementById('detail-message').value
    };
    
    // Ici vous enverriez les données à votre serveur
    console.log('Réservation confirmée:', emailData);
    
    // Créer un email avec les informations
    const subject = `Réservation - ${emailData.service}`;
    const body = `
Nouvelle réservation:
    
Service: ${emailData.service}
Nombre de personnes: ${emailData.participants}
Date: ${emailData.date} à ${emailData.time}

Client:
${emailData.firstname} ${emailData.lastname}
Email: ${emailData.email}
Téléphone: ${emailData.phone}

Devis:
Prix unitaire: ${emailData.price}€
Participants: ${emailData.participants}
Remise groupe: -${emailData.discount.toFixed(2)}€
Remise promo: -${emailData.promoDiscount.toFixed(2)}€
TOTAL: ${emailData.total.toFixed(2)}€

Message: ${emailData.message}
    `;
    
    // Ouvrir le client email
    window.location.href = `mailto:sabrine.sjk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    showNotification('✅ Réservation confirmée ! Un email de devis vous a été envoyé.', 'success');
    
    // Fermer le modal après 2 secondes
    setTimeout(() => {
        closeBookingDetails();
    }, 2000);
});

// Close modal when clicking outside
window.onclick = function(event) {
    const memberModal = document.getElementById('memberModal');
    const bookingModal = document.getElementById('bookingDetailsModal');
    
    if (event.target === memberModal) {
        closeMemberSpace();
    }
    
    if (event.target === bookingModal) {
        closeBookingDetails();
    }
}

// ===================================
// LOG PAGE LOAD
// ===================================
console.log('%c✨ Site web de Sabrine SJK - Thérapeute Énergétique ✨', 
    'font-size: 16px; color: #8B7355; font-weight: bold;');
console.log('%cSite développé avec soin pour accompagner votre bien-être', 
    'font-size: 12px; color: #4A4A4A;');