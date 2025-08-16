document.addEventListener('DOMContentLoaded', function() {
    // Video autoplay handling
    const heroVideo = document.querySelector('.hero-background-video');
    
    if (heroVideo) {
        console.log('Video element found:', heroVideo);
        
        // Ensure video properties for autoplay
        heroVideo.muted = true;
        heroVideo.volume = 0;
        heroVideo.autoplay = true;
        heroVideo.playsInline = true;
        heroVideo.loop = false; // Explicitly disable looping
        
        // Force autoplay attempts
        let hasStartedPlaying = false;
        let videoHasEnded = false;
        
        const forcePlay = async () => {
            if (hasStartedPlaying || videoHasEnded) return; // Prevent multiple play attempts
            
            try {
                await heroVideo.play();
                hasStartedPlaying = true;
                console.log('Video is playing automatically');
            } catch (error) {
                console.log('Autoplay attempt failed:', error);
            }
        };
        
        // Event listeners
        heroVideo.addEventListener('loadeddata', function() {
            console.log('Video data loaded');
            if (!hasStartedPlaying) forcePlay();
        });
        
        heroVideo.addEventListener('canplay', function() {
            console.log('Video can play');
            if (!hasStartedPlaying) forcePlay();
        });
        
        // Freeze video at last frame when it ends
        heroVideo.addEventListener('ended', function() {
            console.log('Video ended, freezing at last frame');
            videoHasEnded = true;
            // Prevent any potential restart
            this.pause();
            // Keep the video at the last frame
            this.currentTime = this.duration;
            // Ensure it stays paused
            this.loop = false;
            // Remove autoplay to prevent browser from restarting
            this.autoplay = false;
        });
        
        // Additional safety: prevent video from restarting
        heroVideo.addEventListener('timeupdate', function() {
            // If video somehow reaches the end and tries to restart, stop it
            if (this.currentTime >= this.duration && this.duration > 0 && !videoHasEnded) {
                console.log('Video naturally ending, triggering end state');
                videoHasEnded = true;
                this.pause();
                this.currentTime = this.duration;
                this.loop = false;
                this.autoplay = false;
            }
        });
        
        // Block any attempt to restart the video after it's ended
        heroVideo.addEventListener('play', function() {
            if (videoHasEnded) {
                console.log('Blocking video restart attempt');
                this.pause();
                this.currentTime = this.duration;
                return false;
            }
            console.log('Video started playing');
        });
        
        heroVideo.addEventListener('error', function(e) {
            console.log('Video error:', e);
        });
        
        // Single autoplay attempt after setup
        setTimeout(() => {
            if (heroVideo.readyState >= 2) {
                forcePlay();
            }
        }, 100);
        
    } else {
        console.log('Video element not found');
    }
    
    const heroTitle = document.querySelector('.hero-title');
    
    // Create highlight background
    const highlightBg = document.createElement('div');
  highlightBg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: linear-gradient(90deg, #0080ff48 0%, #0041cc23 100%);
    opacity: 0.8;
    z-index: -;
    pointer-events: none;
    box-shadow: 0 0 15px rgba(0, 128, 255, 0.08),
                0 0 30px rgba(0, 128, 255, 0.3);
`;
    heroTitle.insertBefore(highlightBg, heroTitle.firstChild);
    
    // Create I-beam cursor
    const cursor = document.createElement('div');
    cursor.style.cssText = `
        position: absolute;
        top: 0;
        left: 0%;
        width: 3px;
        height: 100%;
        z-index: 1;
        opacity: 1;
        pointer-events: none;
    `;
    
 // Create the fancy I-beam shape using pseudo-elements via CSS
const style = document.createElement('style');
style.textContent = `
    .i-beam-cursor {
        position: relative;
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
        width: 3px !important;
        border-radius: 2px;
        box-shadow: 0 0 10px rgba(102, 126, 234, 0.5),
                    0 0 20px rgba(102, 126, 234, 0.3),
                    0 0 30px rgba(102, 126, 234, 0.1);
        animation: pulse 1.5s infinite alternate;
    }
    
    .i-beam-cursor::before,
    .i-beam-cursor::after {
        content: '';
        position: absolute;
        left: -6px;
        width: 15px;
        height: 3px;
        background: linear-gradient(90deg, #667eea 0%, #764ba2 100%);
        border-radius: 2px;
        box-shadow: 0 0 8px rgba(102, 126, 234, 0.4);
    }
    
    .i-beam-cursor::before {
        top: -1px;
        background: linear-gradient(90deg, #667eea 0%, #f06292 100%);
    }
    
    .i-beam-cursor::after {
        bottom: -1px;
        background: linear-gradient(90deg, #f06292 0%, #667eea 100%);
    }
    
    @keyframes pulse {
        0% {
            box-shadow: 0 0 10px rgba(102, 126, 234, 0.5),
                        0 0 20px rgba(102, 126, 234, 0.3),
                        0 0 30px rgba(102, 126, 234, 0.1);
            transform: scale(1);
        }
        100% {
            box-shadow: 0 0 15px rgba(102, 126, 234, 0.7),
                        0 0 25px rgba(102, 126, 234, 0.5),
                        0 0 35px rgba(102, 126, 234, 0.3);
            transform: scale(1.05);
        }
    }
`;
    document.head.appendChild(style);
    cursor.className = 'i-beam-cursor';
    
    heroTitle.appendChild(cursor);
    
    // Animation sequence
    setTimeout(() => {
        // 1. Fade in title
        heroTitle.style.transition = 'all 1s ease';
        heroTitle.style.opacity = '1';
        heroTitle.style.transform = 'translateY(0)';
        
        // 2. Start highlight and cursor animation
        setTimeout(() => {
            animateHighlightAndCursor();
        }, 500);
    }, 100);
    
    function animateHighlightAndCursor() {
        const duration = 2000;
        const startTime = Date.now();
        
        function animate() {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Smooth easing
            const easeOut = 1 - Math.pow(1 - progress, 3);
            
            // Calculate same position for both elements
            const position = easeOut * 100;
            
            // Update highlight width and cursor position with same value
            const maxWidth = 60; // Adjust this percentage to match your text width
   highlightBg.style.width = (easeOut * maxWidth) + '%';
cursor.style.left = (easeOut * maxWidth) + '%';
            
            // Fade cursor at end
            if (progress > 0.9) {
                const fadeProgress = (progress - 0.9) / 0.1;
                cursor.style.opacity = 1 - fadeProgress;
            }
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        }
        
        animate();
    }
    
    // Hover effects
    heroTitle.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02) translateY(0)';
    });
    
    heroTitle.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
    
    // Button animations
    const heroDescription = document.querySelector('.hero-description');
const heroButtons = document.querySelectorAll('.hero-button-mac, .hero-button-windows');    
    // Animate description and buttons after title
    setTimeout(() => {
        // Fade in description
        heroDescription.style.transition = 'all 0.8s ease';
        heroDescription.style.opacity = '1';
        heroDescription.style.transform = 'translateY(0)';
        
        // Fade in buttons with stagger
        setTimeout(() => {
            heroButtons.forEach((button, index) => {
                setTimeout(() => {
                    button.style.transition = 'all 0.6s ease';
                    button.style.opacity = '1';
                    button.style.transform = 'translateY(0)';
                }, index * 150);
            });
        }, 300);
    }, 1200);
    
   // ...existing code...

    // Button hover effects
    heroButtons.forEach(button => {
        // Create shine effect
        const shine = document.createElement('div');
        shine.style.cssText = `
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            pointer-events: none;
        `;
        button.appendChild(shine);
        
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
            this.style.transform = 'translateY(-2px)';
            this.style.boxShadow = '0 8px 25px rgba(217, 3, 75, 0.4)';
            
            // Shine animation
            shine.style.transition = 'left 0.5s ease';
            shine.style.left = '100%';
            
            // Mac button hover
            if (this.classList.contains('hero-button-mac')) {
                this.style.background = 'linear-gradient(135deg, #e91e63 0%, #f06292 100%)';
            } 
            // Windows button hover
            else if (this.classList.contains('hero-button-windows')) {
                this.style.background = 'linear-gradient(135deg, #f8bbd9 0%, #f4a6cd 100%)'; // Lighter pink gradient
                this.style.color = 'white';
            }
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            
            // Mac button leave
            if (this.classList.contains('hero-button-mac')) {
                this.style.background = 'linear-gradient(135deg, #d9034b 0%, #f06292 100%)';
                this.style.boxShadow = '0 4px 15px rgba(217, 3, 75, 0.3)';
            } 
            // Windows button leave
            else if (this.classList.contains('hero-button-windows')) {
                this.style.background = 'transparent';
                this.style.color = '#d9034b';
                this.style.boxShadow = 'none';
            }
            
            // Reset shine
            shine.style.transition = 'none';
            shine.style.left = '-100%';
        });
    });

});

