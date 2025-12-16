// Toutes les initialisations sont dans le bloc DOMContentLoaded ci-dessous

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
// INITIALIZATION - TOUT EN UN SEUL BLOC DOMContentLoaded
// ===================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initialisation du site...');
    
    // ===================================
    // MOBILE MENU TOGGLE
    // ===================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-menu a');

    if (menuToggle) {
        menuToggle.addEventListener('click', () => {
            const isActive = navMenu.classList.toggle('active');
            menuToggle.classList.toggle('active');
            menuToggle.setAttribute('aria-expanded', isActive);
            document.body.style.overflow = isActive ? 'hidden' : '';
        });
    }

    // Close menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
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
            
            showNotification('✅ Réservation confirmée ! Vous recevrez un email de confirmation sous peu.', 'success');
            bookingForm.reset();
        });
    }
    
    // ===================================
    // PREVENT FORM SPAM
    // ===================================
    let lastSubmitTime = 0;
    const SUBMIT_COOLDOWN = 3000;
    
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            const currentTime = Date.now();
            if (currentTime - lastSubmitTime < SUBMIT_COOLDOWN) {
                e.preventDefault();
                showNotification('Veuillez attendre quelques secondes avant de soumettre à nouveau.', 'info');
                return;
            }
            lastSubmitTime = currentTime;
        });
    }
    
    // ===================================
    // GALLERY LIGHTBOX
    // ===================================
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
    
    // ===================================
    // CALENDAR INITIALIZATION
    // ===================================
    console.log('📅 Initialisation du calendrier...');
    const calendarEl = document.getElementById('calendar');
    console.log('Élément calendrier trouvé:', calendarEl ? 'OUI' : 'NON');
    
    if (calendarEl) {
        console.log('FullCalendar disponible:', typeof FullCalendar !== 'undefined' ? 'OUI' : 'NON');
        
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
        
        console.log('Rendu du calendrier...');
        calendar.render();
        console.log('✅ Calendrier rendu avec succès');
    } else {
        console.error('❌ Élément #calendar non trouvé dans le DOM');
    }
    
    // ===================================
    // BOOKING BUTTONS
    // ===================================
    console.log('🎯 Recherche des boutons de réservation...');
    const bookingButtons = document.querySelectorAll('.btn-service-book');
    console.log('Nombre de boutons trouvés:', bookingButtons.length);
    
    bookingButtons.forEach((button, index) => {
        console.log('Bouton ' + index + ':', button.dataset.name);
        
        button.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const serviceId = this.dataset.service;
            const serviceName = this.dataset.name;
            const price = parseInt(this.dataset.price);
            const duration = parseInt(this.dataset.duration);
            
            console.log('🎫 Clic sur réservation:', serviceId, serviceName, price, duration);
            openBookingDetails(serviceId, serviceName, price, duration);
        });
    });
    
    console.log('✅ Initialisation terminée');
});

// ===================================
// SERVICE DETAILS DATA
// ===================================
const servicesData = {
    'intuitif-adulte': {
        name: 'Séance Intuitive Guidée - Adultes',
        icon: 'fa-user',
        price: 60,
        duration: 60,
        description: 'Séance complète pour harmoniser le corps, l\'esprit et les émotions.',
        details: [
            'Apaisement profond et nettoyage énergétique',
            'Libération émotionnelle et recentrage',
            'Amélioration de la circulation énergétique',
            'Utilisation intuitive d\'outils : magnétisme, tambour, plume, pierres, voix...'
        ],
        options: [
            { label: 'Présentiel', price: 60 },
            { label: 'Distanciel', price: 50 }
        ]
    },
    'intuitif-enfant': {
        name: 'Séance Intuitive Guidée - Enfants',
        icon: 'fa-child',
        price: 40,
        duration: 45,
        description: 'Séance adaptée aux enfants de moins de 12 ans.',
        details: [
            'Durée adaptée à la sensibilité de l\'enfant',
            'Approche douce et bienveillante',
            'Libération des tensions émotionnelles',
            'Rééquilibrage énergétique en douceur'
        ],
        options: [
            { label: 'Présentiel', price: 40 },
            { label: 'Distanciel', price: 30 }
        ]
    },
    'intuitif-animal': {
        name: 'Séance Intuitive Guidée - Animaux',
        icon: 'fa-paw',
        price: 40,
        duration: 45,
        description: 'Soin énergétique adapté à vos compagnons animaux.',
        details: [
            'Durée adaptée selon l\'animal',
            'Apaisement et détente',
            'Soulagement des blocages énergétiques',
            'Accompagnement dans les périodes difficiles'
        ],
        options: [
            { label: 'Présentiel', price: 40 },
            { label: 'Distanciel', price: 30 }
        ]
    },
    'reiki-lahochi': {
        name: 'Reiki ou Lahochi',
        icon: 'fa-spa',
        price: 60,
        duration: 60,
        description: 'Techniques de guérison énergétique japonaise et hawaïenne.',
        details: [
            'Profonde détente corporelle et mentale',
            'Rééquilibrage énergétique complet',
            'Libération émotionnelle en douceur',
            'Amélioration du sommeil et de la clarté mentale',
            'Reiki : 1h à 1h15',
            'Lahochi : environ 1h'
        ]
    },
    'forfait-reiki': {
        name: 'Forfait 4 Séances Reiki/Lahochi',
        icon: 'fa-gift',
        price: 210,
        duration: 240,
        description: 'Forfait avantageux pour un suivi régulier.',
        details: [
            '4 séances de Reiki ou Lahochi',
            'Économie de 30€ par rapport au tarif unitaire',
            'Paiement en 3 ou 4 fois possible',
            'Suivi personnalisé sur plusieurs semaines'
        ],
        isPackage: true
    },
    'sonore': {
        name: 'Séance Sonore Énergétique',
        icon: 'fa-music',
        price: 60,
        duration: 60,
        description: 'Travail vibratoire profond sur les 7 chakras.',
        details: [
            'Libération des tensions profondes',
            'Détente du système nerveux',
            'Apaisement du mental et des ruminations',
            'Régénération intérieure par les vibrations',
            'Idéal pour stress, dispersion, surcharge émotionnelle'
        ]
    },
    'magnetisme-cranien': {
        name: 'Magnétisme Crânien + Harmonisation Chakras',
        icon: 'fa-brain',
        price: 60,
        duration: 60,
        description: 'Libération de la tête et harmonisation énergétique.',
        details: [
            'Libère les pensées lourdes et tensions nerveuses',
            'Apaise le mental et détend profondément',
            'Détend le visage et le cuir chevelu',
            'Améliore la circulation énergétique',
            'Excellent pour migraines, anxiété, troubles du sommeil'
        ]
    },
    'micro-massage': {
        name: 'Micro-massage (tête • visage • ventre • dos)',
        icon: 'fa-hand-holding-heart',
        price: 60,
        duration: 60,
        description: 'Travail doux qui libère les mémoires émotionnelles du corps.',
        details: [
            'Ventre : libération de l\'émotionnel',
            'Dos : libération des charges',
            'Visage et tête : apaisement de l\'esprit',
            'Moment sonore possible en fin de séance',
            'Approche très douce et respectueuse du corps'
        ]
    },
    'accompagnement': {
        name: 'Accompagnement Holistique Profond',
        icon: 'fa-seedling',
        price: 60,
        duration: 60,
        description: 'Pour comprendre, libérer et transformer.',
        details: [
            'Blessures émotionnelles et traumatismes',
            'Anxiété et estime de soi',
            'Mémoires transgénérationnelles',
            'Deuil et séparation',
            'Accompagnement en profondeur avec écoute'
        ]
    },
    'forfait-accompagnement': {
        name: 'Forfait 3 Séances d\'Accompagnement',
        icon: 'fa-infinity',
        price: 160,
        duration: 180,
        description: 'Forfait pour un travail en profondeur.',
        details: [
            '3 séances d\'accompagnement holistique',
            'Économie de 20€ par rapport au tarif unitaire',
            'Suivi personnalisé et évolution progressive',
            'Temps d\'intégration entre les séances'
        ],
        isPackage: true
    },
    'verrue': {
        name: 'Soin Verrue',
        icon: 'fa-hand-sparkles',
        price: 60,
        duration: 60,
        description: 'Protocole énergétique en 3 phases.',
        details: [
            'Séance principale : 30 min (chakra racine, chakra sacré, magnétisme direct)',
            'Deux séances de renfort : 15 min chacune',
            'Travail énergétique ciblé',
            'Forfait complet incluant les 3 séances'
        ]
    },
    'operation': {
        name: 'Accompagnement Opération',
        icon: 'fa-hospital',
        price: 70,
        duration: 90,
        description: 'Soutien énergétique avant, pendant et après une intervention.',
        details: [
            '3 séances : avant • pendant • après l\'opération',
            'Durées : 45 min + 20 min + 25 min (total 1h30)',
            'Prépare le corps et apaise le mental',
            'Soutient la récupération post-opératoire',
            'Apporte ancrage, calme et régénération'
        ]
    }
};

// ===================================
// SERVICE DETAILS MODAL
// ===================================
function openServiceDetails(serviceId) {
    const service = servicesData[serviceId];
    if (!service) return;
    
    // Créer le modal
    const modalHTML = `
        <div id="serviceDetailsModal" class="modal active">
            <div class="modal-content modal-large">
                <span class="modal-close" onclick="closeServiceDetails()">&times;</span>
                <div class="modal-header">
                    <i class="fas ${service.icon}"></i>
                    <h2>${service.name}</h2>
                </div>
                
                <div class="service-details-content">
                    <p class="service-description">${service.description}</p>
                    
                    <div class="service-info-grid">
                        <div class="info-box">
                            <i class="fas fa-euro-sign"></i>
                            <div>
                                <strong>Tarif</strong>
                                <p>${service.price}€</p>
                            </div>
                        </div>
                        <div class="info-box">
                            <i class="fas fa-clock"></i>
                            <div>
                                <strong>Durée</strong>
                                <p>${service.duration} min</p>
                            </div>
                        </div>
                    </div>
                    
                    <div class="service-benefits">
                        <h3><i class="fas fa-check-circle"></i> Ce que vous apporte cette séance :</h3>
                        <ul>
                            ${service.details.map(detail => `<li>${detail}</li>`).join('')}
                        </ul>
                    </div>
                    
                    ${service.options ? `
                        <div class="service-options">
                            <h3><i class="fas fa-list"></i> Options disponibles :</h3>
                            <div class="options-grid">
                                ${service.options.map(opt => `
                                    <div class="option-card">
                                        <strong>${opt.label}</strong>
                                        <span class="option-price">${opt.price}€</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                    
                    <div class="modal-actions">
                        <button type="button" class="btn btn-primary btn-large" onclick="openBookingFromService('${serviceId}', '${service.name}', ${service.price}, ${service.duration})">
                            <i class="fas fa-calendar-check"></i> Réserver cette séance
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Ajouter le modal au body
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    document.body.style.overflow = 'hidden';
}

function closeServiceDetails() {
    const modal = document.getElementById('serviceDetailsModal');
    if (modal) {
        modal.remove();
        document.body.style.overflow = '';
    }
}

function openBookingFromService(serviceId, serviceName, price, duration) {
    closeServiceDetails();
    openBookingDetails(serviceId, serviceName, price, duration);
}

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

// Event listeners pour les boutons de service - voir bloc DOMContentLoaded unifié plus haut

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
document.getElementById('detailedBookingForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Récupérer les données du formulaire
    const bookingData = {
        serviceId: currentBooking.serviceId,
        serviceName: currentBooking.serviceName,
        participants: currentBooking.participants,
        price: currentBooking.price,
        discount: currentBooking.discount,
        promoDiscount: currentBooking.promoDiscount,
        total: currentBooking.total,
        duration: currentBooking.duration,
        firstname: document.getElementById('detail-firstname').value,
        lastname: document.getElementById('detail-lastname').value,
        name: document.getElementById('detail-firstname').value + ' ' + document.getElementById('detail-lastname').value,
        email: document.getElementById('detail-email').value,
        phone: document.getElementById('detail-phone').value,
        date: document.getElementById('detail-date').value,
        time: document.getElementById('detail-time').value,
        message: document.getElementById('detail-message').value
    };
    
    console.log('📝 Réservation en cours...', bookingData);
    
    // Utiliser le workflow complet
    if (window.workflowManager) {
        const result = await window.workflowManager.createFullBooking(bookingData);
        
        if (result.success) {
            console.log('✅ Réservation complète créée:', result);
            
            // Créer l'email de confirmation avec tous les détails
            const subject = `Réservation ${result.bookingNumber} - ${bookingData.serviceName}`;
            const body = `
🎉 Nouvelle réservation créée avec succès !

📋 RÉSERVATION: ${result.bookingNumber}
📄 DEVIS: ${result.quoteNumber}
${result.isNewClient ? '🆕 NOUVEAU CLIENT' : '👤 CLIENT FIDÈLE'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📅 DÉTAILS DE LA SÉANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━

Service: ${bookingData.serviceName}
Date: ${bookingData.date} à ${bookingData.time}
Durée: ${bookingData.duration} minutes
Participants: ${bookingData.participants}

━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 INFORMATIONS CLIENT
━━━━━━━━━━━━━━━━━━━━━━━━━━

Nom: ${bookingData.name}
Email: ${bookingData.email}
Téléphone: ${bookingData.phone}

━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 TARIFICATION
━━━━━━━━━━━━━━━━━━━━━━━━━━

Prix unitaire: ${bookingData.price}€
Participants: ${bookingData.participants}
Sous-total: ${(bookingData.price * bookingData.participants).toFixed(2)}€

Remise groupe: -${bookingData.discount.toFixed(2)}€
Remise promo: -${bookingData.promoDiscount.toFixed(2)}€

═══════════════════════════
TOTAL: ${bookingData.total.toFixed(2)}€
═══════════════════════════

💬 Message du client:
${bookingData.message || 'Aucun message'}

━━━━━━━━━━━━━━━━━━━━━━━━━━
📄 DOCUMENTS GÉNÉRÉS
━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Fiche de réservation
✓ Devis (${result.quoteNumber})
✓ Profil client mis à jour

🔗 LIENS RAPIDES
━━━━━━━━━━━━━━━━━━━━━━━━━━

Admin: admin.html
Profil client: profile.html?email=${encodeURIComponent(bookingData.email)}

━━━━━━━━━━━━━━━━━━━━━━━━━━

Cette réservation a été enregistrée dans le système avec succès.
Un email de confirmation a été envoyé au client.
            `;
            
            // Ouvrir le client email
            window.location.href = `mailto:sabrine.sjk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
            
            showNotification('✅ Réservation enregistrée avec succès ! Un email de confirmation va être envoyé.', 'success');
            
            // Fermer le modal après 2 secondes
            setTimeout(() => {
                closeBookingDetails();
            }, 2000);
        } else {
            console.error('❌ Erreur Firebase:', result.error);
            showNotification('⚠️ Erreur lors de l\'enregistrement. Veuillez réessayer.', 'error');
        }
    } else {
        // Fallback si Firebase n'est pas chargé
        console.warn('⚠️ Firebase non disponible, utilisation du fallback email');
        const subject = `Réservation - ${bookingData.serviceName}`;
        const body = `
Service: ${bookingData.serviceName}
Date: ${bookingData.date} à ${bookingData.time}
Client: ${bookingData.name}
Email: ${bookingData.email}
Téléphone: ${bookingData.phone}
Total: ${bookingData.total.toFixed(2)}€
        `;
        window.location.href = `mailto:sabrine.sjk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        showNotification('✅ Réservation envoyée par email.', 'success');
        setTimeout(() => closeBookingDetails(), 2000);
    }
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
    'font-size: 20px; color: #8B7355; font-weight: bold;');
console.log('%cSite développé avec soin pour accompagner votre bien-être', 
    'font-size: 12px; color: #4A4A4A;');

// ===================================
// MEMBER DASHBOARD FUNCTIONS
// ===================================

// Simulation de données utilisateur (à remplacer par une vraie base de données)
let isLoggedIn = false;
const currentUser = {
    firstname: 'Marie',
    lastname: 'Dupont',
    email: 'marie.dupont@email.com',
    phone: '06 12 34 56 78',
    memberSince: 'janvier 2025'
};

// Gestion de la connexion
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Simulation de connexion (remplacer par vraie authentification)
    if (email && password) {
        isLoggedIn = true;
        showDashboard();
    } else {
        alert('Veuillez remplir tous les champs');
    }
}

// Gestion de l'inscription
function handleRegister(event) {
    event.preventDefault();
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;
    
    if (password !== confirm) {
        alert('Les mots de passe ne correspondent pas');
        return;
    }
    
    // Simulation d'inscription (remplacer par vraie API)
    alert('Inscription réussie ! Vous allez être connecté.');
    isLoggedIn = true;
    showDashboard();
}

// Afficher le dashboard
function showDashboard() {
    document.getElementById('authScreen').style.display = 'none';
    document.getElementById('memberDashboard').style.display = 'block';
    document.getElementById('userName').textContent = currentUser.firstname;
    document.getElementById('memberSince').textContent = currentUser.memberSince;
}

// Déconnexion
function logout() {
    isLoggedIn = false;
    document.getElementById('authScreen').style.display = 'block';
    document.getElementById('memberDashboard').style.display = 'none';
    document.getElementById('loginForm').reset();
}

// Navigation entre les sections du dashboard
function showDashSection(sectionName) {
    // Cacher toutes les sections
    const sections = document.querySelectorAll('.dash-section');
    sections.forEach(section => section.classList.remove('active'));
    
    // Retirer l'état actif de tous les boutons
    const buttons = document.querySelectorAll('.dash-tab-btn');
    buttons.forEach(btn => btn.classList.remove('active'));
    
    // Afficher la section sélectionnée
    document.getElementById(sectionName + '-section').classList.add('active');
    
    // Activer le bouton correspondant
    event.target.classList.add('active');
}

// Gestion des rendez-vous
function rescheduleAppointment(id) {
    alert('Fonction de modification du rendez-vous ' + id + ' - À implémenter avec le backend');
    // Ici, ouvrir un modal de modification ou rediriger vers le formulaire de réservation
}

function cancelAppointment(id) {
    if (confirm('Êtes-vous sûr de vouloir annuler ce rendez-vous ?')) {
        alert('Rendez-vous ' + id + ' annulé - À implémenter avec le backend');
        // Ici, faire un appel API pour annuler le rendez-vous
    }
}

function bookAgain(serviceType) {
    closeMemberSpace();
    // Scroller vers la section réservation
    document.querySelector('#reservation').scrollIntoView({ behavior: 'smooth' });
    // Pré-sélectionner le service si possible
}

function newAppointment() {
    closeMemberSpace();
    document.querySelector('#reservation').scrollIntoView({ behavior: 'smooth' });
}

// Gestion du profil
function updateProfile(event) {
    event.preventDefault();
    alert('Profil mis à jour avec succès !');
    // Ici, faire un appel API pour sauvegarder les modifications
}

// Gestion des paiements
function payNow(invoiceId) {
    alert('Redirection vers le système de paiement pour la facture ' + invoiceId);
    // Intégrer Stripe, PayPal ou autre système de paiement
}

function downloadInvoice(invoiceId) {
    alert('Téléchargement de la facture ' + invoiceId);
    // Générer et télécharger le PDF de la facture
}

// Journal d'évolution
function addJournalEntry() {
    const entry = prompt('Notez vos ressentis après votre dernière séance :');
    if (entry) {
        alert('Entrée ajoutée avec succès !');
        // Sauvegarder l'entrée dans la base de données
    }
}

// ===================================
// QUICK BOOKING FORM
// ===================================
function handleQuickBooking(event) {
    event.preventDefault();
    
    const formData = {
        name: document.getElementById('booking-name').value,
        phone: document.getElementById('booking-phone').value,
        email: document.getElementById('booking-email').value,
        date: document.getElementById('booking-date').value,
        time: document.getElementById('booking-time').value,
        service: document.getElementById('booking-service').options[document.getElementById('booking-service').selectedIndex].text,
        location: document.getElementById('booking-location').options[document.getElementById('booking-location').selectedIndex].text,
        message: document.getElementById('booking-message').value
    };
    
    // Créer le contenu de l'email
    const subject = `Demande de rendez-vous - ${formData.name}`;
    const body = `
Nouvelle demande de rendez-vous

Nom : ${formData.name}
Téléphone : ${formData.phone}
Email : ${formData.email}

Date souhaitée : ${formData.date}
Heure : ${formData.time}
Type de soin : ${formData.service}
Lieu : ${formData.location}

Message : ${formData.message || 'Aucun message'}

---
Cette demande a été envoyée depuis le site web.
    `;
    
    // Ouvrir le client email
    window.location.href = `mailto:sabrine.sjk@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Afficher une confirmation
    alert('Votre demande de réservation va être envoyée par email. Sabrine vous contactera rapidement pour confirmer votre rendez-vous.');
    
    // Réinitialiser le formulaire
    document.getElementById('bookingForm').reset();
}