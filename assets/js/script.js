// Mobile nav toggle
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');
if(navToggle){
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// Scroll reveal (single pass, respects reduced motion)
const revealEls = document.querySelectorAll('.reveal');
if('IntersectionObserver' in window){
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('in');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach(el => io.observe(el));
} else {
  revealEls.forEach(el => el.classList.add('in'));
}

// Click-to-play video cards (tap poster to play/pause, keeps others paused)
document.querySelectorAll('.phone-screen').forEach(screen => {
  const video = screen.querySelector('video');
  const badge = screen.querySelector('.play-badge');
  if(!video) return;

  const play = () => {
    document.querySelectorAll('.phone-screen video').forEach(v => {
      if(v !== video){ v.pause(); v.closest('.phone-screen').classList.remove('playing'); }
    });
    video.play();
    screen.classList.add('playing');
  };
  const pause = () => {
    video.pause();
    screen.classList.remove('playing');
  };

  badge.addEventListener('click', play);
  video.addEventListener('click', pause);
  video.addEventListener('ended', () => screen.classList.remove('playing'));
});

// Category tab filter (used on Video Editing page)
const tabButtons = document.querySelectorAll('.tabbar button');
if(tabButtons.length){
  const cards = document.querySelectorAll('[data-category]');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.dataset.filter;
      cards.forEach(card => {
        const show = cat === 'all' || card.dataset.category === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });
}
