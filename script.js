// Lenis smooth scrolling setup
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    mouseMultiplier: 1,
    smoothTouch: false,
    touchMultiplier: 2,
    infinite: false,
});

// Get scroll value
lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
    console.log({ scroll, limit, velocity, direction, progress });
});

function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}

requestAnimationFrame(raf);

// Existing code
const burger = document.querySelector('.burger');
const mobileMenu = document.querySelector('.mobile-menu');
const navLinks = document.querySelectorAll('.mobile-menu a');
const navbar = document.querySelector('nav');
const heroSection = document.querySelector('.hero');
const heroCarousel = document.querySelector('.hero-carousel');
const heroContent = document.querySelector('.hero-content');

// Toggle mobile menu function
function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    burger.classList.toggle('toggle');
}

// Close mobile menu when a link is clicked
function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    burger.classList.remove('toggle');
}

// Event listeners for mobile menu
burger.addEventListener('click', toggleMobileMenu);
navLinks.forEach(link => link.addEventListener('click', closeMobileMenu));

// Close mobile menu when clicking outside
document.addEventListener('click', (event) => {
    const isClickInsideMenu = mobileMenu.contains(event.target);
    const isClickOnBurger = burger.contains(event.target);
    
    if (!isClickInsideMenu && !isClickOnBurger && mobileMenu.classList.contains('active')) {
        closeMobileMenu();
    }
});

// Smooth scrolling for anchor links using Lenis
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        lenis.scrollTo(targetId);
    });
});

// Carousel functionality
const carouselImages = document.querySelectorAll('.hero-image');
let currentImageIndex = 0;

function changeImage() {
    carouselImages[currentImageIndex].classList.remove('active');
    currentImageIndex = (currentImageIndex + 1) % carouselImages.length;
    carouselImages[currentImageIndex].classList.add('active');
}

// Change image every 5 seconds
setInterval(changeImage, 5000);

// Start the carousel when the page loads
function startCarousel() {
    carouselImages[currentImageIndex].classList.add('active');
}

// Make navbar sticky and transparent on scroll, and apply parallax effect
lenis.on('scroll', ({ scroll }) => {
    // Navbar effects
    if (scroll > 50) {
        navbar.classList.add('sticky', 'transparent');
    } else {
        navbar.classList.remove('sticky', 'transparent');
    }

    // Parallax effect
    if (scroll <= heroSection.offsetHeight) {
        const parallaxValue = scroll * 0.5;
        heroCarousel.style.transform = `translateY(${parallaxValue}px)`;
        heroContent.style.transform = `translateY(${parallaxValue * 0.8}px)`;
    }
});

// Start the carousel when the page loads
startCarousel();

// GSAP ScrollTrigger setup
gsap.registerPlugin(ScrollTrigger);

// Update ScrollTrigger to work with Lenis
function update(time) {
    lenis.raf(time);
    ScrollTrigger.update();
}

gsap.ticker.add(update);

// Background and text color transition effect
gsap.to('.container', {
    backgroundColor: '#E0E0E0',
    color: 'black',
    duration: 2,
    ease: 'power1.inOut',
    scrollTrigger: {
        trigger: '.container',
        start: 'top 90%',
        end: 'top 10%',
        scrub: 1,
        markers: false,
        toggleActions: 'play none none reverse'
    }
});

// H2 color transition
gsap.to('.news-section h2', {
    color: '#333',
    duration: 2,
    ease: 'power1.inOut',
    scrollTrigger: {
        trigger: '.container',
        start: 'top 90%',
        end: 'top 10%',
        scrub: 1,
        markers: false,
        toggleActions: 'play none none reverse'
    }
});

// Interview slider functionality
document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('interviewSlider');
    const originalSlides = [...slider.children];
    const slideWidth = originalSlides[0].offsetWidth;
    const videoOverlay = document.getElementById('videoOverlay');
    const videoPlayer = document.getElementById('videoPlayer');
    const closeBtn = document.getElementById('closeBtn');
    const playPauseBtn = document.getElementById('playPauseBtn');
    const progress = document.getElementById('progress');

    // Clone slides for infinite effect
    originalSlides.forEach(slide => {
        const clone = slide.cloneNode(true);
        slider.appendChild(clone);
    });

    const totalWidth = slideWidth * originalSlides.length;
    gsap.set(slider, { width: totalWidth * 2 });

    // Implement smooth infinite scroll
    function smoothInfiniteScroll() {
        return gsap.to(slider, {
            x: `-=${totalWidth}`,
            duration: 30,
            ease: "none",
            repeat: -1,
            modifiers: {
                x: gsap.utils.unitize(x => parseFloat(x) % totalWidth)
            }
        });
    }

    // Start the smooth infinite scroll
    let scrollAnimation = smoothInfiniteScroll();

    // Video overlay functionality
    slider.addEventListener('click', (e) => {
        const slide = e.target.closest('.slide');
        if (slide) {
            const videoSrc = slide.querySelector('img').getAttribute('data-video');
            videoPlayer.src = videoSrc;
            videoOverlay.classList.add('active');
            videoPlayer.play();
            playPauseBtn.textContent = '❚❚';
        }
    });

    const closeVideo = () => {
        videoOverlay.classList.remove('active');
        videoPlayer.pause();
        videoPlayer.currentTime = 0;
        videoPlayer.src = '';
        playPauseBtn.textContent = '▶';
    };

    closeBtn.addEventListener('click', closeVideo);

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoOverlay.classList.contains('active')) {
            closeVideo();
        }
    });

    playPauseBtn.addEventListener('click', () => {
        if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.textContent = '❚❚';
        } else {
            videoPlayer.pause();
            playPauseBtn.textContent = '▶';
        }
    });

    videoPlayer.addEventListener('timeupdate', () => {
        const progressPercentage = (videoPlayer.currentTime / videoPlayer.duration) * 100;
        progress.style.width = `${progressPercentage}%`;
    });

    videoOverlay.addEventListener('click', (e) => {
        if (e.target === videoOverlay) {
            closeVideo();
        }
    });
});

// New Trending Section Script
const urbanTrendingNews = [
    { id: 1, title: "Global Climate Summit Reaches Unprecedented Agreement", category: "Environment", trend: 92, image: "./img/hero3.webp" },
    { id: 2, title: "Tech Giants Face New Antitrust Legislation", category: "Technology", trend: 88, image: "./img/gjhg.jpeg" },
    { id: 3, title: "Breakthrough in Renewable Energy Storage Announced", category: "Science", trend: 85, image: "./img/d1.jpeg" },
    { id: 4, title: "Major Shift in Foreign Policy Sparks International Debate", category: "Politics", trend: 79, image: "./img/elon.jpeg" },
    { id: 5, title: "Economic Recovery Plan Unveiled Amidst Market Uncertainty", category: "Economy", trend: 76, image: "./img/zero.jpeg" },
    { id: 6, title: "New Healthcare Initiative Aims to Revolutionize Patient Care", category: "Health", trend: 74, image: "./img/news5.jpeg" },
    { id: 7, title: "Innovative Education Program Shows Promising Results", category: "Education", trend: 71, image: "./img/worst.jpeg" },
];

const urbanCategories = ['All', 'Politics', 'Interviews', 'Economy'];
let urbanActiveCategory = 'All';

function renderUrbanTrendingFilters() {
    const filtersContainer = document.getElementById('urbanTrendingFilters');
    filtersContainer.innerHTML = '';
    urbanCategories.forEach(category => {
        const button = document.createElement('button');
        button.textContent = category;
        button.classList.add('urban-trending-btn');
        if (category === urbanActiveCategory) {
            button.classList.add('active');
        }
        button.addEventListener('click', () => {
            urbanActiveCategory = category;
            renderUrbanTrendingFilters();
            renderUrbanTrendingGrid();
        });
        filtersContainer.appendChild(button);
    });
}

function renderUrbanTrendingGrid() {
    const newsGrid = document.getElementById('urbanTrendingGrid');
    newsGrid.innerHTML = '';
    const filteredNews = urbanActiveCategory === 'All' 
        ? urbanTrendingNews 
        : urbanTrendingNews.filter(item => item.category === urbanActiveCategory);

    filteredNews.forEach((item, index) => {
        const newsCard = document.createElement('div');
        newsCard.classList.add('urban-trending-card');
        newsCard.innerHTML = `
            <img src="${item.image}" alt="${item.title}">
            <div class="urban-trending-content">
                <span class="urban-trending-category">${item.category}</span>
                <h3 class="urban-trending-titleh">${item.title}</h3>
                <span class="urban-trending-trend">Trending: ${item.trend}%</span>
            </div>
        `;
        newsGrid.appendChild(newsCard);
    });
}

// Initialize the trending section
document.addEventListener('DOMContentLoaded', () => {
    renderUrbanTrendingFilters();
    renderUrbanTrendingGrid();
});

// Upcoming Events Section
document.addEventListener('DOMContentLoaded', () => {
    const eventItems = document.querySelectorAll('.event-item');
    const eventImage = document.querySelector('.event-image');
    const imageContainer = document.querySelector('.event-image-container');
    const imageOverlay = document.querySelector('.event-image-overlay');
    const categoryTag = document.querySelector('.event-category-tag');

    if (!eventItems.length || !eventImage || !imageContainer || !imageOverlay || !categoryTag) {
        console.error('One or more elements for the Upcoming Events section are missing');
        return;
    }

    let currentEventItem = null;

    function updateImagePosition(e) {
        const x = e.clientX;
        const y = e.clientY;

        gsap.to(imageContainer, {
            left: x,
            top: y,
            duration: 0.2,
            ease: 'power2.out'
        });
    }

    function setupVerticalScroll(item) {
        const eventTextWrapper = item.querySelector('.event-text-wrapper');
        const wrapperHeight = eventTextWrapper.offsetHeight;
        
        return gsap.to(eventTextWrapper, {
            y: -wrapperHeight + 50,
            duration: 0.3,
            ease: 'none',
            paused: true,
        });
    }

    eventItems.forEach((item) => {
        const scrollAnimation = setupVerticalScroll(item);

        item.addEventListener('mouseenter', (e) => {
            currentEventItem = item;
            
            scrollAnimation.restart();

            gsap.to(item.querySelector('.event-text-container'), {
                backgroundColor: '#1a1a1a',
                duration: 0.3
            });

            gsap.to(imageContainer, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: 'back.out(1.7)'
            });

            eventImage.src = item.dataset.image;
            gsap.to(eventImage, {
                opacity: 0.8,
                scale: 1,
                duration: 0.5,
                ease: 'power2.out'
            });

            gsap.to(imageOverlay, {
                opacity: 1,
                duration: 0.5,
                ease: 'power2.inOut'
            });

            categoryTag.textContent = item.dataset.category;
            gsap.to(categoryTag, {
                opacity: 1,
                y: 0,
                duration: 0.5,
                delay: 0.2,
                ease: 'back.out(1.7)'
            });

            gsap.to(item, { x: 10, duration: 0.3, ease: 'power2.out' });

            document.addEventListener('mousemove', updateImagePosition);

            updateImagePosition(e);
        });

        item.addEventListener('mouseleave', (e) => {
            if (!e.relatedTarget || !e.relatedTarget.classList.contains('event-item')) {
                currentEventItem = null;

                scrollAnimation.pause();
                gsap.to(item.querySelector('.event-text-wrapper'), {
                    y: 0,
                    duration: 0.3
                });

                gsap.to(item.querySelector('.event-text-container'), {
                    backgroundColor: 'transparent',
                    duration: 0.3
                });

                gsap.to(imageContainer, {
                    opacity: 0,
                    scale: 0.5,
                    duration: 0.5,
                    ease: 'back.in(1.7)'
                });

                gsap.to(eventImage, {
                    opacity: 0,
                    scale: 1.05,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });

                gsap.to(imageOverlay, {
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.inOut'
                });

                gsap.to(categoryTag, {
                    opacity: 0,
                    y: 20,
                    duration: 0.3,
                    ease: 'power2.in'
                });

                gsap.to(item, { x: 0, duration: 0.3, ease: 'power2.out' });

                document.removeEventListener('mousemove', updateImagePosition);
            }
        });
    });

    gsap.set(eventImage, { opacity: 0, scale: 1.05 });
    gsap.set(imageOverlay, { opacity: 0 });
    gsap.set(categoryTag, { opacity: 0, y: 20 });
    gsap.set(imageContainer, { opacity: 0, scale: 0.5, left: '50%', top: '50%' });
});

// Existing initialization code
document.addEventListener('DOMContentLoaded', () => {
    startCarousel();
    renderUrbanTrendingFilters();
    renderUrbanTrendingGrid();
});

// Additional utility functions (if needed)
function debounce(func, wait = 20, immediate = true) {
    let timeout;
    return function() {
        const context = this, args = arguments;
        const later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        const callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

// Smooth scroll to top function
function scrollToTop() {
    lenis.scrollTo('top', { duration: 1.5 });
}

// Add scroll to top button functionality (if it exists in your HTML)
const scrollTopButton = document.querySelector('.scroll-top-button');
if (scrollTopButton) {
    scrollTopButton.addEventListener('click', scrollToTop);

    window.addEventListener('scroll', debounce(() => {
        if (window.pageYOffset > 500) {
            scrollTopButton.style.display = 'block';
        } else {
            scrollTopButton.style.display = 'none';
        }
    }));
}

// Add any additional event listeners or initializations here

// Example: Initialize custom dropdown menus
const customDropdowns = document.querySelectorAll('.custom-dropdown');
customDropdowns.forEach(dropdown => {
    const select = dropdown.querySelector('select');
    const customOptions = dropdown.querySelector('.custom-options');

    select.addEventListener('change', () => {
        const selectedOption = select.options[select.selectedIndex];
        customOptions.textContent = selectedOption.textContent;
    });
});

// Example: Add smooth scroll behavior to all internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            lenis.scrollTo(targetElement, {
                offset: -100, // Adjust this value based on your layout
                duration: 1.5,
            });
        }
    });
});

// Example: Lazy load images as they come into view
const lazyImages = document.querySelectorAll('img[data-src]');
const lazyImageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
            lazyImageObserver.unobserve(img);
        }
    });
});

lazyImages.forEach(img => {
    lazyImageObserver.observe(img);
});

// Example: Add a simple lightbox for images
const lightboxImages = document.querySelectorAll('.lightbox-image');
const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox ? lightbox.querySelector('img') : null;

if (lightbox && lightboxImg) {
    lightboxImages.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.style.display = 'flex';
        });
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.style.display = 'none';
        }
    });
}

// You can continue to add more functionality or custom scripts as needed for your website