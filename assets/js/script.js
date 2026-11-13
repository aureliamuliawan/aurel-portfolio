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

// IG-style carousel (swipe, drag, arrows, dots, counter)
document.querySelectorAll('.carousel').forEach(car => {
  const track = car.querySelector('.carousel-track');
  const slides = track.querySelectorAll('img');
  const dots = car.parentElement.querySelectorAll('.carousel-dots span');
  const count = car.querySelector('.carousel-count');
  const prev = car.querySelector('.prev');
  const next = car.querySelector('.next');
  const n = slides.length;
  let idx = 0;

  const update = () => {
    idx = Math.round(track.scrollLeft / track.clientWidth);
    idx = Math.max(0, Math.min(n - 1, idx));
    dots.forEach((d, i) => d.classList.toggle('on', i === idx));
    if(count) count.textContent = (idx + 1) + '/' + n;
    if(prev) prev.disabled = idx === 0;
    if(next) next.disabled = idx === n - 1;
  };
  const go = i => track.scrollTo({ left: i * track.clientWidth, behavior: 'smooth' });

  track.addEventListener('scroll', () => requestAnimationFrame(update), { passive: true });
  if(prev) prev.addEventListener('click', () => go(idx - 1));
  if(next) next.addEventListener('click', () => go(idx + 1));
  window.addEventListener('resize', update);

  // mouse drag for desktop
  let down = false, startX = 0, startLeft = 0, moved = false;
  track.addEventListener('mousedown', e => { down = true; moved = false; startX = e.pageX; startLeft = track.scrollLeft; track.classList.add('dragging'); });
  window.addEventListener('mousemove', e => { if(!down) return; const dx = e.pageX - startX; if(Math.abs(dx) > 3) moved = true; track.scrollLeft = startLeft - dx; });
  window.addEventListener('mouseup', () => { if(!down) return; down = false; track.classList.remove('dragging'); go(Math.round(track.scrollLeft / track.clientWidth)); });
  update();
});
