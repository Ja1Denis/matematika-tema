// main.js

document.addEventListener('DOMContentLoaded', () => {
    // Inicijalizacija glavnih komponenti
    initNavigation();
    initRazredCards();
    initProgressTracking();
});

// Navigacija
function initNavigation() {
    const nav = document.querySelector('.main-nav');
    if (!nav) return; // Ako nav element ne postoji, izađi iz funkcije
    
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<span></span><span></span><span></span>';
    
    let lastScroll = 0;
    
    // Handling scroll za skrivanje/prikazivanje navigacije
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > lastScroll && currentScroll > 100) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // Mobile menu funkcionalnost
    mobileMenuBtn.addEventListener('click', () => {
        document.querySelector('.nav-links').classList.toggle('active');
    });
}

// Inicijalizacija kartica razreda
function initRazredCards() {
    const razredCards = document.querySelectorAll('.razred-card');
    
    razredCards.forEach(card => {
        card.addEventListener('click', (e) => {
            const razred = card.dataset.razred;
            handleRazredSelection(razred);
        });

        // Dodavanje hover efekata
        card.addEventListener('mouseenter', () => {
            animateCard(card);
        });
    });
}

// Animacije kartica
function animateCard(card) {
    const icon = card.querySelector('.razred-icon');
    icon.style.transform = 'scale(1.1) rotate(5deg)';
    
    setTimeout(() => {
        icon.style.transform = 'scale(1) rotate(0deg)';
    }, 300);
}

// Praćenje napretka
function initProgressTracking() {
    const user = getUserData();
    if (user) {
        updateProgressBars(user.progress);
        trackUserActivity();
    }
}

// Dohvaćanje podataka o korisniku
function getUserData() {
    const userData = localStorage.getItem('userData');
    return userData ? JSON.parse(userData) : null;
}

// Ažuriranje progress barova
function updateProgressBars(progress) {
    const progressBars = document.querySelectorAll('.progress-bar');
    
    progressBars.forEach(bar => {
        const razred = bar.dataset.razred;
        if (progress[razred]) {
            bar.style.width = `${progress[razred]}%`;
        }
    });
}

// Praćenje aktivnosti korisnika
function trackUserActivity() {
    let startTime = Date.now();
    let exercises = [];
    
    window.addEventListener('beforeunload', () => {
        const sessionDuration = Date.now() - startTime;
        saveUserActivity({
            duration: sessionDuration,
            exercises: exercises
        });
    });
}

// Spremanje aktivnosti korisnika
function saveUserActivity(activity) {
    const activities = JSON.parse(localStorage.getItem('userActivities') || '[]');
    activities.push({
        ...activity,
        timestamp: Date.now()
    });
    localStorage.setItem('userActivities', JSON.stringify(activities));
}

// Handler za odabir razreda
function handleRazredSelection(razred) {
    // Animacija prije prijelaza
    document.body.style.opacity = '0';
    
    setTimeout(() => {
        window.location.href = `/pages/razred${razred}.html`;
    }, 300);
}

// Notifikacije
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Loader
function showLoader() {
    const loader = document.createElement('div');
    loader.className = 'loading';
    document.body.appendChild(loader);
    return loader;
}

function hideLoader(loader) {
    loader.remove();
}

// Event listeneri za gumbe
document.querySelectorAll('.btn-primary').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const loader = showLoader();
        
        // Simulacija loadinga
        setTimeout(() => {
            hideLoader(loader);
            handleButtonClick(e.target);
        }, 800);
    });
});

// Handler za klikove na gumbe
function handleButtonClick(button) {
    const action = button.dataset.action;
    
    switch(action) {
        case 'start':
            showNotification('Započinjemo s vježbom!', 'success');
            break;
        case 'save':
            showNotification('Napredak je spremljen', 'success');
            break;
        default:
            console.log('Nepoznata akcija');
    }
}