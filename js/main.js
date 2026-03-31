/* ============================================================
   Hero BG — tenta local, aplica gradiente por cima via CSS
============================================================ */
(function() {
  var bg = document.getElementById('heroBg');
  var img = new Image();
  img.onload = function() { bg.style.backgroundImage = "url('assets/images/hero-bg.jpg.png')"; };
  img.onerror = function() { bg.style.background = 'linear-gradient(to bottom,#2a1408,#583219)'; };
  img.src = 'assets/images/hero-bg.jpg.png';
})();

/* ============================================================
   Mobile menu
============================================================ */
document.getElementById('hamburger').addEventListener('click', function() {
  document.getElementById('mobMenu').classList.add('open');
});
document.getElementById('mobClose').addEventListener('click', function() {
  document.getElementById('mobMenu').classList.remove('open');
});
document.querySelectorAll('.mob-menu a').forEach(function(a) {
  a.addEventListener('click', function() {
    document.getElementById('mobMenu').classList.remove('open');
  });
});

/* ============================================================
   Scroll reveal
============================================================ */
var revObs = new IntersectionObserver(function(entries) {
  entries.forEach(function(e) {
    if (e.isIntersecting) { e.target.classList.add('in'); revObs.unobserve(e.target); }
  });
}, { threshold: 0.10 });
document.querySelectorAll('.fu').forEach(function(el) { revObs.observe(el); });

/* ============================================================
   Gallery carousel
============================================================ */
(function() {
  var gallery  = document.getElementById('portGallery');
  var prevBtn  = document.getElementById('galPrev');
  var nextBtn  = document.getElementById('galNext');
  if (!gallery) return;

  var busy = false;

  function getStep() {
    var card = gallery.querySelector('.gal-card:not(.gal-clone)');
    if (!card) return 0;
    var gap = parseFloat(getComputedStyle(gallery).gap) || 12;
    return card.offsetWidth + gap;
  }

  function slideNext() {
    if (busy) return; busy = true;
    var s = step();
    var clone = gallery.firstElementChild.cloneNode(true);
    clone.classList.add('gal-clone', 'in');
    clone.setAttribute('aria-hidden', 'true');
    gallery.appendChild(clone);

    gallery.style.transition = 'transform .4s ease';
    gallery.style.transform   = 'translateX(-' + s + 'px)';

    setTimeout(function() {
      gallery.style.transition = 'none';
      gallery.style.transform  = '';
      gallery.removeChild(clone);
      gallery.appendChild(gallery.firstElementChild);
      busy = false;
    }, 420);
  }

  function slidePrev() {
    if (busy) return; busy = true;
    var s = step();
    var clone = gallery.lastElementChild.cloneNode(true);
    clone.classList.add('gal-clone', 'in');
    clone.setAttribute('aria-hidden', 'true');
    gallery.insertBefore(clone, gallery.firstChild);

    gallery.style.transition = 'none';
    gallery.style.transform  = 'translateX(-' + s + 'px)';
    void gallery.offsetWidth; // force reflow

    gallery.style.transition = 'transform .4s ease';
    gallery.style.transform  = 'translateX(0)';

    setTimeout(function() {
      gallery.removeChild(clone);
      gallery.insertBefore(gallery.lastElementChild, gallery.firstChild);
      busy = false;
    }, 420);
  }

  function step() { return getStep(); }

  if (nextBtn) nextBtn.addEventListener('click', slideNext);
  if (prevBtn) prevBtn.addEventListener('click', slidePrev);
})();

/* ============================================================
   Filter tabs
============================================================ */
document.querySelectorAll('.ftabs li button').forEach(function(btn) {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.ftabs li').forEach(function(li) { li.classList.remove('on'); });
    btn.parentElement.classList.add('on');
  });
});

/* ============================================================
   Active nav on scroll
============================================================ */
var navSecs = document.querySelectorAll('section[id], footer[id]');
var navAs   = document.querySelectorAll('.nav-links li a');
window.addEventListener('scroll', function() {
  var cur = '';
  navSecs.forEach(function(s) { if (pageYOffset >= s.offsetTop - 120) cur = s.id; });
  navAs.forEach(function(a) {
    a.parentElement.classList.remove('on');
    if (a.getAttribute('href') === '#' + cur) a.parentElement.classList.add('on');
  });
}, { passive: true });

/* ============================================================
   SCROLL STORY
   #scroll-story  height = 500vh
   .story-sticky  sticky 100vh — percurso rolável = 400vh
   Divide em N slots (1 por frase). Só 1 com .on de cada vez.
============================================================ */
(function() {
  var story = document.getElementById('scroll-story');
  var bar   = document.getElementById('sBar');
  var hint  = document.getElementById('sHint');
  var lines = Array.from(document.querySelectorAll('.s-line'));
  var N     = lines.length;

  function tick() {
    var scrollable = story.offsetHeight - window.innerHeight;
    var scrolled   = Math.max(0, Math.min(window.scrollY - story.offsetTop, scrollable));
    var p          = scrolled / scrollable;

    bar.style.width = (p * 100).toFixed(1) + '%';
    hint.classList.toggle('gone', p > 0.04);

    var slot = Math.min(Math.floor(p * N), N - 1);
    lines.forEach(function(el, i) { el.classList.toggle('on', i === slot); });
  }

  window.addEventListener('scroll', tick, { passive: true });
  tick();
})();
