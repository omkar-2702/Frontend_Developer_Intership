// Image array - Replace these with your own image URLs (at least 5 images)
const images = [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=400&fit=crop',
    'https://images.unsplash.com/photo-1469362104461-b3d5564b2f96?w=800&h=400&fit=crop'
];

let currentSlide = 0;
let autoPlayInterval;
let isAutoPlaying = false;
const totalSlides = images.length;

// Initialize slider when page loads
window.onload = function() {
    initSlider();
    document.getElementById('loading').style.display = 'none';
};

/**
 * Initialize the slider - create slides and dots
 */
function initSlider() {
    const wrapper = document.getElementById('sliderWrapper');
    const dotsContainer = document.getElementById('dotsContainer');

    // Create image slides
    images.forEach((imageSrc, index) => {
        const slide = document.createElement('div');
        slide.className = 'slide';
        slide.innerHTML = `<img src="${imageSrc}" alt="Slide ${index + 1}">`;
        wrapper.appendChild(slide);
    });

    // Create dots
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.onclick = () => goToSlide(i);
        dotsContainer.appendChild(dot);
    }

    // Add event listeners for buttons
    document.getElementById('prevBtn').onclick = () => changeSlide(-1);
    document.getElementById('nextBtn').onclick = () => changeSlide(1);
    document.getElementById('playPause').onclick = toggleAutoPlay;

    // Show first slide
    showSlide(0);
}

/**
 * Show specific slide
 */
function showSlide(index) {
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.dot');

    // Hide all slides and dots
    slides.forEach(slide => slide.classList.remove('active'));
    dots.forEach(dot => dot.classList.remove('active'));

    // Show current slide and activate dot
    if (slides[index]) {
        slides[index].classList.add('active');
    }
    dots[index].classList.add('active');

    currentSlide = index;
}

/**
 * Change slide (next/prev)
 */
function changeSlide(direction) {
    let newIndex = currentSlide + direction;
    if (newIndex >= totalSlides) newIndex = 0;
    if (newIndex < 0) newIndex = totalSlides - 1;
    showSlide(newIndex);
}

/**
 * Go to specific slide via dots
 */
function goToSlide(index) {
    showSlide(index);
}

/**
 * Toggle auto-play functionality
 */
function toggleAutoPlay() {
    const btn = document.getElementById('playPause');
    if (isAutoPlaying) {
        clearInterval(autoPlayInterval);
        btn.textContent = '▶️ Auto-play';
        isAutoPlaying = false;
    } else {
        autoPlayInterval = setInterval(() => changeSlide(1), 3000);
        btn.textContent = '⏸️ Auto-play';
        isAutoPlaying = true;
    }
}

// Keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'ArrowLeft') changeSlide(-1);
    if (e.key === 'ArrowRight') changeSlide(1);
});

// Pause auto-play on hover
document.querySelector('.slider-container').addEventListener('mouseenter', () => {
    if (isAutoPlaying) clearInterval(autoPlayInterval);
});

document.querySelector('.slider-container').addEventListener('mouseleave', () => {
    if (isAutoPlaying) {
        autoPlayInterval = setInterval(() => changeSlide(1), 3000);
    }
});

