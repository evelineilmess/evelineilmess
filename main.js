/* ============================================================
   Evelin B. Eilmess - interactions
   ============================================================ */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- scroll reveals ---------- */
  function initReveals(){
    var els = [].slice.call(document.querySelectorAll('.reveal'));
    if(reduce){
      els.forEach(function(e){e.classList.add('in');});
      return;
    }
    // manual viewport check - robust fallback that also covers initial paint
    var check = function(){
      var vh = window.innerHeight || document.documentElement.clientHeight;
      for(var i=els.length-1;i>=0;i--){
        var el = els[i];
        var r = el.getBoundingClientRect();
        if(r.top < vh*0.92 && r.bottom > 0){
          el.classList.add('in');
          els.splice(i,1);
        }
      }
    };
    if('IntersectionObserver' in window){
      var io = new IntersectionObserver(function(entries){
        entries.forEach(function(en){
          if(en.isIntersecting){
            en.target.classList.add('in');
            io.unobserve(en.target);
            var ix = els.indexOf(en.target);
            if(ix>-1) els.splice(ix,1);
          }
        });
      },{threshold:0.12, rootMargin:'0px 0px -8% 0px'});
      els.forEach(function(e){io.observe(e);});
    }
    // initial + scroll fallback (handles environments where IO is slow/quiet)
    window.addEventListener('scroll', check, {passive:true});
    window.addEventListener('resize', check, {passive:true});
    requestAnimationFrame(function(){ requestAnimationFrame(check); });
    setTimeout(check, 300);
  }

  /* ---------- nav scrolled state ---------- */
  function initNav(){
    var nav = document.querySelector('.nav');
    var onScroll = function(){
      if(window.scrollY > 40) nav.classList.add('scrolled');
      else nav.classList.remove('scrolled');
    };
    onScroll();
    window.addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---------- mobile menu ---------- */
  function initMenu(){
    var btn = document.querySelector('.menu-btn');
    var overlay = document.querySelector('.menu-overlay');
    if(!btn || !overlay) return;
    var toggle = function(force){
      var open = force !== undefined ? force : !overlay.classList.contains('open');
      overlay.classList.toggle('open', open);
      btn.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };
    btn.addEventListener('click', function(){toggle();});
    overlay.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){toggle(false);});
    });
    window.addEventListener('keydown', function(e){ if(e.key==='Escape') toggle(false); });
  }

  /* ---------- parallax on covers + blobs ---------- */
  function initParallax(){
    if(reduce) return;
    var items = [].slice.call(document.querySelectorAll('[data-parallax]'));
    if(!items.length) return;
    var ticking = false;
    var update = function(){
      var vh = window.innerHeight;
      items.forEach(function(el){
        var r = el.getBoundingClientRect();
        if(r.bottom < -200 || r.top > vh + 200) return;
        var speed = parseFloat(el.getAttribute('data-parallax')) || 0.12;
        var center = r.top + r.height/2 - vh/2;
        var y = -center * speed;
        el.style.transform = 'translate3d(0,'+ y.toFixed(2) +'px,0) scale(1.12)';
      });
      ticking = false;
    };
    window.addEventListener('scroll', function(){
      if(!ticking){ window.requestAnimationFrame(update); ticking = true; }
    }, {passive:true});
    update();
  }

  /* ---------- hero pointer-reactive glow ---------- */
  function initHeroGlow(){
    if(reduce) return;
    var hero = document.querySelector('.hero');
    var bg = document.querySelector('.hero-bg');
    if(!hero || !bg) return;
    var tx=0, ty=0, cx=0, cy=0, raf;
    hero.addEventListener('pointermove', function(e){
      var r = hero.getBoundingClientRect();
      tx = ((e.clientX - r.left)/r.width - 0.5) * 40;
      ty = ((e.clientY - r.top)/r.height - 0.5) * 40;
      if(!raf) loop();
    });
    function loop(){
      cx += (tx-cx)*0.06; cy += (ty-cy)*0.06;
      bg.style.transform = 'translate3d('+cx.toFixed(2)+'px,'+cy.toFixed(2)+'px,0)';
      if(Math.abs(tx-cx)>0.1 || Math.abs(ty-cy)>0.1){ raf = requestAnimationFrame(loop); }
      else raf = null;
    }
  }

  /* ---------- duplicate marquee content for seamless loop ---------- */
  function initMarquee(){
    var track = document.querySelector('.marquee-track');
    if(!track) return;
    track.innerHTML = track.innerHTML + track.innerHTML;
  }

  /* ---------- year ---------- */
  function initYear(){
    var y = document.querySelector('[data-year]');
    if(y) y.textContent = new Date().getFullYear();
  }

  /* ---------- work filters ---------- */
  function initFilters(){
    var bar = document.querySelector('.work-filters');
    if(!bar) return;
    var cards = [].slice.call(document.querySelectorAll('.work-card'));
    var empty = document.querySelector('.work-empty');
    var btns = [].slice.call(bar.querySelectorAll('.filter'));

    bar.addEventListener('click', function(e){
      var btn = e.target.closest('.filter');
      if(!btn) return;
      var f = btn.getAttribute('data-filter');

      btns.forEach(function(b){
        var on = b === btn;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
      });

      var shown = 0;
      cards.forEach(function(card){
        var cats = (card.getAttribute('data-cat') || '').split(' ');
        var match = (f === 'all') || cats.indexOf(f) > -1;
        if(match){
          card.classList.remove('is-hidden');
          shown++;
          if(!reduce){
            card.classList.add('is-enter');
            // force reflow then animate in
            void card.offsetWidth;
            requestAnimationFrame(function(){ card.classList.remove('is-enter'); });
          }
        }else{
          card.classList.add('is-hidden');
        }
      });
      if(empty) empty.classList.toggle('show', shown === 0);
    });
  }

  function init(){
    initMarquee();
    initReveals();
    initNav();
    initMenu();
    initParallax();
    initHeroGlow();
    initFilters();
    initYear();
  }
  if(document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
