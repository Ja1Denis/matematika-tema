class NavigationManager {
    constructor() {
        this.header = document.querySelector('.site-header');
        this.mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
        this.searchToggle = document.querySelector('.search-toggle');
        this.searchForm = document.querySelector('.search-form-container');
        this.lastScrollTop = 0;
        this.isSearchActive = false;
        this.isMobileMenuActive = false;

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupDropdownKeyboardNav();
        this.setupMobileMenuKeyboardNav();
    }

    setupEventListeners() {
        // Mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', () => this.toggleMobileMenu());
        }

        // Search toggle
        if (this.searchToggle) {
            this.searchToggle.addEventListener('click', () => this.toggleSearch());
        }

        // Close search on click outside
        document.addEventListener('click', (e) => {
            if (this.isSearchActive && !e.target.closest('.search-form-container') && !e.target.closest('.search-toggle')) {
                this.closeSearch();
            }
        });

        // Handle scroll
        window.addEventListener('scroll', () => this.handleScroll());

        // Close mobile menu on window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && this.isMobileMenuActive) {
                this.closeMobileMenu();
            }
        });
    }

    setupDropdownKeyboardNav() {
        const menuItems = document.querySelectorAll('.menu-item-has-children');
        
        menuItems.forEach(item => {
            const link = item.querySelector('a');
            const submenu = item.querySelector('.sub-menu');
            
            if (link && submenu) {
                link.addEventListener('keydown', (e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.toggleSubmenu(item);
                    }
                });
            }
        });
    }

    setupMobileMenuKeyboardNav() {
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.toggleMobileMenu();
                }
            });
        }
    }

    toggleMobileMenu() {
        this.isMobileMenuActive = !this.isMobileMenuActive;
        document.body.classList.toggle('mobile-menu-active', this.isMobileMenuActive);
        this.mobileMenuToggle.setAttribute('aria-expanded', this.isMobileMenuActive);
        
        if (this.isMobileMenuActive) {
            this.closeSearch();
        }
    }

    closeMobileMenu() {
        this.isMobileMenuActive = false;
        document.body.classList.remove('mobile-menu-active');
        this.mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }

    toggleSearch() {
        this.isSearchActive = !this.isSearchActive;
        this.searchForm.classList.toggle('active', this.isSearchActive);
        this.searchToggle.setAttribute('aria-expanded', this.isSearchActive);
        
        if (this.isSearchActive) {
            this.closeMobileMenu();
            this.searchForm.querySelector('.search-field').focus();
        }
    }

    closeSearch() {
        this.isSearchActive = false;
        this.searchForm.classList.remove('active');
        this.searchToggle.setAttribute('aria-expanded', 'false');
    }

    toggleSubmenu(item) {
        const submenu = item.querySelector('.sub-menu');
        const isExpanded = submenu.classList.contains('active');
        
        submenu.classList.toggle('active');
        item.querySelector('a').setAttribute('aria-expanded', !isExpanded);
    }

    handleScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Hide header on scroll down, show on scroll up
        if (scrollTop > this.lastScrollTop && scrollTop > 60) {
            this.header.style.transform = 'translateY(-100%)';
        } else {
            this.header.style.transform = 'translateY(0)';
        }
        
        this.lastScrollTop = scrollTop;
    }
}

// Initialize navigation when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new NavigationManager();
});