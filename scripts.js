function loadNavbar() {
  const placeholder = document.getElementById('navbar');
  if (!placeholder) return;

  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;
      highlightLinkByURL();
      setupSectionObserver();
      // Setup mobile scroll behavior after navbar is loaded
      setupMobileNavScroll();
    })
    .catch(err => console.error('Navbar load error:', err));
}

function highlightLinkByURL() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;
  const full = currentHash ? `${currentPage}${currentHash}` : currentPage;

  document.querySelectorAll('.sidenav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === full);
  });
}

// Highlight the section you are on
function setupSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const links = Array.from(document.querySelectorAll('.sidenav a[href*="#"]'));
  if (!sections.length || !links.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px',
    threshold: 0
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const id = entry.target.id;
      links.forEach(link => {
        const hash = link.getAttribute('href').split('#')[1];
        link.classList.toggle('active', hash === id);
      });
    });
  }, observerOptions);

  sections.forEach(sec => obs.observe(sec));
}

// Load Demo Reel
function loadDemoReel() {
  const container = document.getElementById('demo-reel-video');
  if (!container) return;

  const wrap = document.createElement('div');
  wrap.style.width = '100%';
  wrap.style.maxWidth = '1000px';
  wrap.style.margin = '0 auto';
  wrap.style.padding = '1em';

  const video = document.createElement('video');
  video.src = 'portfolio-materials/Demo_Reel/demo_reel.mp4';
  video.controls = true;
  video.style.width = '100%';
  video.style.height = 'auto';
  video.style.borderRadius = '10px';
  video.style.boxShadow = '0 4px 8px rgba(0,0,0,0.2)';
  video.setAttribute('data-aos', 'fade-up');

  wrap.appendChild(video);
  container.appendChild(wrap);
}

// Load 2D Animations (lazy load)
async function loadAnimations() {
  const grid = document.getElementById('animation-grid');
  if (!grid) return;

  try {
    const res = await fetch('portfolio-materials/Animation/animations.json');
    const list = await res.json();

    list.forEach(filename => {
      const video = document.createElement('video');
      video.dataset.src = `portfolio-materials/Animation/${filename}`;
      video.poster = `portfolio-materials/Animation/${filename.replace('.mp4', '.jpg')}`;
      video.muted = true;
      video.loop = true;
      video.controls = false;
      video.preload = 'none';
      video.style.width = '100%';
      video.style.height = 'auto';

      video.addEventListener('mouseenter', () => video.play());
      video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });

      video.addEventListener('click', () => {
        const overlay = document.getElementById('video-overlay');
        const overlayVideo = document.getElementById('overlay-video');
        overlayVideo.src = video.dataset.src;
        overlayVideo.load();
        overlay.classList.add('active');
        overlayVideo.play();
      });

      grid.appendChild(video);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const vid = entry.target;
          vid.src = vid.dataset.src;
          vid.addEventListener('canplay', () => vid.classList.add('ready'), { once: true });
          obs.unobserve(vid);
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('#animation-grid video').forEach(v => observer.observe(v));
  } catch (error) {
    console.error('Error loading animations:', error);
  }
}

// Load Storyboarding Videos
async function loadStoryboardingVideos() {
  const grid = document.getElementById('storyboarding-videos-grid');
  if (!grid) return;

  // Style the grid
  grid.style.display = 'grid';
  grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(300px, 1fr))';
  grid.style.gap = '2rem';
  grid.style.padding = '0';
  grid.style.maxWidth = '1400px';
  grid.style.margin = '0 auto';

  try {
    const res = await fetch('portfolio-materials/Storyboarding/videos.json');
    const list = await res.json();

    list.forEach(filename => {
      const video = document.createElement('video');
      video.dataset.src = `portfolio-materials/Storyboarding/${filename}`;
      video.poster = `portfolio-materials/Storyboarding/${filename.replace('.mp4', '.jpg')}`;
      video.muted = true;
      video.loop = true;
      video.controls = false;
      video.preload = 'none';
      video.style.width = '100%';
      video.style.height = 'auto';

      video.addEventListener('mouseenter', () => video.play());
      video.addEventListener('mouseleave', () => {
        video.pause();
        video.currentTime = 0;
      });

      video.addEventListener('click', () => {
        const overlay = document.getElementById('video-overlay');
        const overlayVideo = document.getElementById('overlay-video');
        overlayVideo.src = video.dataset.src;
        overlayVideo.load();
        overlay.classList.add('active');
        overlayVideo.play();
      });

      grid.appendChild(video);
    });

    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const vid = entry.target;
          vid.src = vid.dataset.src;
          vid.addEventListener('canplay', () => vid.classList.add('ready'), { once: true });
          obs.unobserve(vid);
        }
      });
    }, { threshold: 0.25 });

    document.querySelectorAll('#storyboarding-videos-grid video').forEach(v => observer.observe(v));
  } catch (error) {
    console.error('Error loading storyboarding videos:', error);
  }
}

// Load Artwork Section (images only)
async function loadArtwork() {
  const grid = document.getElementById('artwork-grid');
  if (!grid) return;

  try {
    const res = await fetch('portfolio-materials/Artwork/images.json');
    const files = await res.json();

    files.forEach(name => {
      const img = document.createElement('img');
      img.src = `portfolio-materials/Artwork/${name}`;
      img.alt = name;
      img.style.width = '100%';
      img.style.height = 'auto';

      img.addEventListener('click', () => {
        const lb = document.getElementById('lightbox-overlay');
        const li = document.getElementById('lightbox-image');
        lb.style.display = 'flex';
        li.src = img.src;
      });

      grid.appendChild(img);
    });
  } catch (error) {
    console.error('Error loading Artwork images:', error);
  }
}

// Load Images (generic function)
async function loadImages(sectionId, folderPath) {
  const grid = document.getElementById(sectionId);
  if (!grid) return;

  try {
    const res = await fetch(`${folderPath}/images.json`);
    const files = await res.json();

    files.forEach(name => {
      const img = document.createElement('img');
      img.src = `${folderPath}/${name}`;
      img.alt = name;
      img.style.width = '100%';
      img.style.height = 'auto';

      img.addEventListener('click', () => {
        const lb = document.getElementById('lightbox-overlay');
        const li = document.getElementById('lightbox-image');
        lb.style.display = 'flex';
        li.src = img.src;
      });

      grid.appendChild(img);
    });
  } catch (error) {
    console.error(`Error loading images for ${sectionId}:`, error);
  }
}

// Close video overlay
function setupOverlayClose() {
  const overlay = document.getElementById('video-overlay');
  const overlayVideo = document.getElementById('overlay-video');
  if (!overlay || !overlayVideo) return;

  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      overlay.classList.remove('active');
      overlayVideo.pause();
      overlayVideo.currentTime = 0;
    }
  });
}

// Close lightbox
function setupLightboxClose() {
  const lbOverlay = document.getElementById('lightbox-overlay');
  if (!lbOverlay) return;

  lbOverlay.addEventListener('click', e => {
    if (e.target === lbOverlay) {
      lbOverlay.style.display = 'none';
    }
  });
}

// Hide navbar on scroll down, show on scroll up (mobile only)
function setupMobileNavScroll() {
  // Only run on mobile
  if (window.innerWidth > 768) return;
  
  const navbar = document.querySelector('.sidenav');
  if (!navbar) {
    console.log('Navbar not found');
    return;
  }
  
  console.log('Mobile nav scroll setup running');
  
  let lastScrollTop = 0;
  let ticking = false;
  
  const handleScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Scrolling down - hide navbar
        if (scrollTop > lastScrollTop && scrollTop > 100) {
          navbar.classList.add('hidden');
        } 
        // Scrolling up - show navbar
        else if (scrollTop < lastScrollTop) {
          navbar.classList.remove('hidden');
        }
        
        // At the top - always show
        if (scrollTop === 0) {
          navbar.classList.remove('hidden');
        }
        
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
        ticking = false;
      });
      
      ticking = true;
    }
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  // Re-check on resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
      navbar.classList.remove('hidden');
    }
  });
}

// Add keyboard support for closing overlays
function setupKeyboardControls() {
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      // Close video overlay
      const videoOverlay = document.getElementById('video-overlay');
      const overlayVideo = document.getElementById('overlay-video');
      if (videoOverlay && videoOverlay.classList.contains('active')) {
        videoOverlay.classList.remove('active');
        if (overlayVideo) {
          overlayVideo.pause();
          overlayVideo.currentTime = 0;
        }
      }
      
      // Close image lightbox
      const lightboxOverlay = document.getElementById('lightbox-overlay');
      if (lightboxOverlay && lightboxOverlay.style.display === 'flex') {
        lightboxOverlay.style.display = 'none';
      }
    }
  });
}

// Initialize everything on page load
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadDemoReel();
  loadAnimations();
  loadStoryboardingVideos();
  loadArtwork();
  loadImages('storyboarding-images-grid', 'portfolio-materials/Storyboarding');
  setupOverlayClose();
  setupLightboxClose();
  setupKeyboardControls();
});