// scripts.js

// 1️⃣ Load navbar, then wire up active-link behavior
function loadNavbar() {
  const placeholder = document.getElementById('navbar');
  if (!placeholder) return;

  fetch('navbar.html')
    .then(res => res.text())
    .then(html => {
      placeholder.innerHTML = html;
      highlightLinkByURL();
      setupSectionObserver();
      setupNavClickHighlight();
    })
    .catch(err => console.error('Navbar load error:', err));
}

// 2️⃣ Immediately highlight based on URL (page + hash)
function highlightLinkByURL() {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const currentHash = window.location.hash;               // e.g. "#concept-art"
  const full     = currentHash ? `${currentPage}${currentHash}` : currentPage;

  document.querySelectorAll('.sidenav a').forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === full);
  });
}

// 4️⃣ Observe sections and toggle the matching link when in view
function setupSectionObserver() {
  const sections = document.querySelectorAll('section[id]');
  const links    = Array.from(document.querySelectorAll('.sidenav a[href*="#"]'));
  if (!sections.length || !links.length) return;

  // Fire as soon as the section's middle crosses the viewport mid-line
  const observerOptions = {
    root: null,
    rootMargin: '-50% 0px -50% 0px', // shift root box up by 50% of viewport height
    threshold: 0                       // fire on any intersection
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

// 4️⃣ Lazy-load and initialize the animations grid
async function loadAnimations() {
  const grid = document.getElementById('animation-grid');
  if (!grid) return;

  try {
    const res = await fetch('portfolio-materials/Animation/animations.json');
    const list = await res.json();
    //list.sort();

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

// 5️⃣ Close the video overlay when clicking outside the video
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

// 6️⃣ Load a grid of images from a folder’s images.json
async function loadImages(sectionId, folderPath) {
  const grid = document.getElementById(sectionId);
  if (!grid) return;

  try {
    const res = await fetch(`${folderPath}/images.json`);
    const files = await res.json();
    //files.sort();

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

// 7️⃣ Insert your demo-reel video with AOS animation
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

// 9️⃣ Close the lightbox overlay when clicking *outside* the image
function setupLightboxClose() {
  const lbOverlay = document.getElementById('lightbox-overlay');
  if (!lbOverlay) return;

  lbOverlay.addEventListener('click', e => {
    // only fire if they clicked the backdrop itself
    if (e.target === lbOverlay) {
      lbOverlay.style.display = 'none';
    }
  });
}

// 8️⃣ Initialize everything once the DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  loadNavbar();
  loadDemoReel();
  loadAnimations();
  loadImages('concept-art-grid', 'portfolio-materials/Concept_Art');
  loadImages('digital-art-grid', 'portfolio-materials/Fine_Art/Digital_Artwork');
  loadImages('fundamentals-grid', 'portfolio-materials/Fine_Art/Fundamentals');
  setupOverlayClose();
  setupLightboxClose();
});
