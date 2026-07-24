/*!
 * GROM LP LIBRARY - shared motion layer (motion.js)
 * Vanilla JS, no dependencies. Pairs 1:1 with motion.css.
 * Full hook contract: reference/lp-library/motion/README.md
 *
 * PROGRESSIVE ENHANCEMENT
 * ------------------------------------------------------------------------
 * All hidden-initial states in motion.css are scoped under `html.js-motion`.
 * This file adds that class as its very first act, so it is the single
 * switch that turns "always visible" markup into "JS-choreographed"
 * markup. If this script never runs (blocked, 404s, thrown before the
 * class is added), every section on the page stays fully visible, because
 * nothing in motion.css applies without `html.js-motion` present.
 *
 * REDUCED MOTION
 * ------------------------------------------------------------------------
 * `prefers-reduced-motion: reduce` is honored twice, independently:
 *   1. Here in JS - animated code paths (count-up easing, marquee clone
 *      looping, parallax, magnetic hover, accordion WAAPI) are skipped
 *      outright; values/states are set immediately instead.
 *   2. In motion.css's `@media (prefers-reduced-motion: reduce)` block -
 *      which force-overrides visibility with `!important` regardless of
 *      what JS did or didn't manage to do. That is the real safety net.
 *
 * FAILSAFE
 * ------------------------------------------------------------------------
 * `.reveal` / `.reveal-stagger` elements are force-revealed ~2600ms after
 * this script runs, no matter what (stuck IntersectionObserver, a element
 * that never scrolls into view, etc). Nothing should ever stay hidden.
 * ------------------------------------------------------------------------ */
(function(){
  'use strict';

  var FAILSAFE_MS = 2600;

  var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  var canHover = !!(window.matchMedia && window.matchMedia('(hover:hover) and (pointer:fine)').matches);

  var root = document.documentElement;
  root.classList.add('js-motion');

  function ready(fn){
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', fn);
    } else {
      fn();
    }
  }

  /* ------------------------------------------------------------------
     1. Scroll reveal + stagger - `.reveal`, `.reveal-stagger`
     ------------------------------------------------------------------ */
  function initReveal(){
    var els = document.querySelectorAll('.reveal, .reveal-stagger');
    if(!els.length) return;

    function revealAll(){
      els.forEach(function(el){ el.classList.add('is-visible'); });
    }

    if(reduced || !('IntersectionObserver' in window)){
      revealAll();
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -8% 0px' });

    els.forEach(function(el){ io.observe(el); });

    // failsafe: never leave anything stuck invisible
    window.setTimeout(revealAll, FAILSAFE_MS);
  }

  /* ------------------------------------------------------------------
     2. Count-up - `[data-count-to]`
     Supports data-count-prefix / data-count-suffix / data-count-decimals
     (falls back to the shorter data-prefix/-suffix/-decimals names too).
     Preserves any trailing element node (eg a unit <span>) instead of
     wiping it with textContent.
     ------------------------------------------------------------------ */
  function attr(el, longName, shortName){
    var v = el.getAttribute(longName);
    if(v !== null) return v;
    return el.getAttribute(shortName);
  }

  function countUp(el){
    var raw = el.getAttribute('data-count-to');
    var target = parseFloat(raw);
    if(isNaN(target)) return;

    // Decimals: explicit data-count-decimals wins; otherwise infer from the
    // target value itself, so data-count-to="4.9" counts to 4.9 (not 5) with
    // no extra attribute needed.
    var decAttr = attr(el, 'data-count-decimals', 'data-decimals');
    var decimals;
    if(decAttr !== null && decAttr !== '') decimals = parseInt(decAttr, 10);
    else { var dp = String(raw).split('.')[1]; decimals = dp ? dp.length : 0; }
    if(isNaN(decimals) || decimals < 0) decimals = 0;
    var prefix = attr(el, 'data-count-prefix', 'data-prefix') || '';
    var suffix = attr(el, 'data-count-suffix', 'data-suffix') || '';

    // Preserve any existing element children (eg a trailing unit span like
    // <span class="unit">+</span>) - never let them get wiped by
    // textContent. Detach, clear, insert our own text node, reattach.
    var trailing = Array.prototype.slice.call(el.children);
    trailing.forEach(function(node){ el.removeChild(node); });
    var textNode = document.createTextNode('');
    el.textContent = '';
    el.appendChild(textNode);
    trailing.forEach(function(node){ el.appendChild(node); });

    function fmt(v){
      var n = v.toLocaleString('en-US', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals
      });
      return prefix + n + suffix;
    }

    if(reduced){
      textNode.data = fmt(target);
      return;
    }

    var startFrom = decimals > 0
      ? Math.max(0, target - 1.2)
      : Math.max(0, target - Math.min(target, target > 500 ? 900 : 55));
    var t0 = null, dur = 1000;

    function step(ts){
      if(t0 === null) t0 = ts;
      var p = Math.min(1, (ts - t0) / dur);
      var eased = 1 - Math.pow(1 - p, 3);
      textNode.data = fmt(startFrom + (target - startFrom) * eased);
      if(p < 1){
        requestAnimationFrame(step);
      } else {
        textNode.data = fmt(target);
      }
    }
    requestAnimationFrame(step);
  }

  function initCountUp(){
    var els = document.querySelectorAll('[data-count-to]');
    if(!els.length) return;

    if(!('IntersectionObserver' in window)){
      els.forEach(countUp);
      return;
    }

    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if(entry.isIntersecting){
          countUp(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    els.forEach(function(el){ io.observe(el); });
  }

  /* ------------------------------------------------------------------
     3. Marquee - `.marquee` + `.marquee-track`
     Duplicates the track once so the CSS keyframe loop (translateX 0 to
     -100%) is seamless. Pause-on-hover/focus is handled purely in CSS.
     ------------------------------------------------------------------ */
  function initMarquee(){
    var marquees = document.querySelectorAll('.marquee');
    marquees.forEach(function(marquee){
      var tracks = marquee.querySelectorAll(':scope > .marquee-track');
      if(tracks.length === 1){
        var clone = tracks[0].cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        marquee.appendChild(clone);
      }
    });
  }

  /* ------------------------------------------------------------------
     4. Parallax - `[data-parallax]`
     Optional numeric strength via the attribute value, eg
     data-parallax="0.15". Skipped entirely under reduced motion (the
     element simply stays static, never hidden).
     ------------------------------------------------------------------ */
  function initParallax(){
    if(reduced) return;
    var els = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if(!els.length) return;

    var ticking = false;
    function update(){
      var vh = window.innerHeight;
      els.forEach(function(el){
        var raw = parseFloat(el.getAttribute('data-parallax'));
        var factor = isNaN(raw) ? 0.12 : raw;
        var rect = el.getBoundingClientRect();
        if(rect.bottom > 0 && rect.top < vh){
          var center = (rect.top + rect.height / 2) - vh / 2;
          el.style.transform = 'translateY(' + (-(center * factor)).toFixed(2) + 'px)';
        }
      });
      ticking = false;
    }
    function onScroll(){
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     5. Magnetic hover - `[data-cta]`
     Fine-pointer + hover-capable devices only.
     ------------------------------------------------------------------ */
  function initMagnetic(){
    if(!canHover || reduced) return;
    var els = document.querySelectorAll('[data-cta]');
    els.forEach(function(el){
      el.addEventListener('pointermove', function(e){
        var r = el.getBoundingClientRect();
        var mx = e.clientX - (r.left + r.width / 2);
        var my = e.clientY - (r.top + r.height / 2);
        el.style.transform = 'translate(' + (mx * 0.09).toFixed(2) + 'px,' + (my * 0.22 - 1).toFixed(2) + 'px)';
      });
      el.addEventListener('pointerleave', function(){ el.style.transform = ''; });
    });
  }

  /* ------------------------------------------------------------------
     6. FAQ accordion smoothness - <details class="faq-item">
     Native <details>/<summary> already shows/hides content with zero
     JS or CSS. This only smooths the open/close height transition via
     the Web Animations API. If WAAPI is unsupported or motion is
     reduced, native (instant) behavior is left completely untouched.
     ------------------------------------------------------------------ */
  function initAccordion(){
    var supportsAnimate = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';
    if(reduced || !supportsAnimate || typeof HTMLDetailsElement === 'undefined') return;

    var items = document.querySelectorAll('details.faq-item, .faq-item');
    items.forEach(function(details){
      if(!(details instanceof HTMLDetailsElement)) return;
      var summary = details.querySelector(':scope > summary');
      var panel = details.querySelector(':scope > summary ~ *');
      if(!summary || !panel) return;

      var anim = null, closing = false, expanding = false;

      summary.addEventListener('click', function(e){
        e.preventDefault();
        details.style.overflow = 'hidden';
        if(closing || !details.open){
          openPanel();
        } else if(expanding || details.open){
          closePanel();
        }
      });

      function closePanel(){
        closing = true;
        var startH = details.offsetHeight + 'px';
        var endH = summary.offsetHeight + 'px';
        runAnim(startH, endH, false);
      }

      function openPanel(){
        details.style.height = details.offsetHeight + 'px';
        details.open = true;
        requestAnimationFrame(function(){
          expanding = true;
          var startH = details.offsetHeight + 'px';
          var endH = (summary.offsetHeight + panel.offsetHeight) + 'px';
          runAnim(startH, endH, true);
        });
      }

      function runAnim(startH, endH, willOpen){
        if(anim) anim.cancel();
        anim = details.animate(
          { height: [startH, endH] },
          { duration: 260, easing: 'cubic-bezier(.22,.68,0,1)' }
        );
        anim.onfinish = function(){ onFinish(willOpen); };
        anim.oncancel = function(){ closing = false; expanding = false; };
      }

      function onFinish(willOpen){
        details.open = willOpen;
        anim = null;
        closing = false;
        expanding = false;
        details.style.height = '';
        details.style.overflow = '';
      }
    });
  }

  /* ------------------------------------------------------------------
     7. Sticky CTA - `#sticky`
     Shown once the page has scrolled past `#hero`. Falls back to a
     one-viewport-height scroll heuristic if there is no `#hero`.
     ------------------------------------------------------------------ */
  function initStickyCta(){
    var sticky = document.getElementById('sticky');
    if(!sticky) return;

    var hero = document.getElementById('hero');

    if(hero && 'IntersectionObserver' in window){
      new IntersectionObserver(function(entries){
        entries.forEach(function(entry){
          sticky.classList.toggle('is-visible', !entry.isIntersecting);
        });
      }, { threshold: 0 }).observe(hero);
      return;
    }

    var shown = false;
    function check(){
      var should = window.scrollY > window.innerHeight * 0.6;
      if(should !== shown){
        shown = should;
        sticky.classList.toggle('is-visible', shown);
      }
    }
    window.addEventListener('scroll', function(){ requestAnimationFrame(check); }, { passive: true });
    check();
  }

  /* ------------------------------------------------------------------
     8. Scroll progress bar
     Self-injecting: no markup required from the archetype author.
     Opt out per-page with `<body data-no-progress>`.
     ------------------------------------------------------------------ */
  function initScrollProgress(){
    if(document.body.hasAttribute('data-no-progress')) return;

    var bar = document.getElementById('lp-progress');
    if(!bar){
      bar = document.createElement('div');
      bar.id = 'lp-progress';
      bar.className = 'lp-progress-bar';
      bar.setAttribute('aria-hidden', 'true');
      document.body.insertBefore(bar, document.body.firstChild);
    }

    var ticking = false;
    function update(){
      var h = document.documentElement;
      var scrollable = h.scrollHeight - h.clientHeight;
      var pct = scrollable > 0 ? (h.scrollTop / scrollable) * 100 : 0;
      bar.style.width = pct + '%';
      ticking = false;
    }
    function onScroll(){
      if(!ticking){ requestAnimationFrame(update); ticking = true; }
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  }

  /* ------------------------------------------------------------------
     9. Booking day/time selector - `#lp-booking-widget` + `.time-chip`
     Event delegation on the mount so it works even when the booking
     embed injects `.time-chip` elements asynchronously. Single-select
     scoped to the clicked chip's immediate parent (one "day" group at
     a time); `.muted` chips are inert.
     ------------------------------------------------------------------ */
  function initBooking(){
    var mount = document.getElementById('lp-booking-widget');
    if(!mount) return;

    mount.addEventListener('click', function(e){
      var chip = e.target.closest('.time-chip');
      if(!chip || chip.classList.contains('muted') || !mount.contains(chip)) return;
      var group = chip.parentElement || mount;
      group.querySelectorAll('.time-chip.sel').forEach(function(c){
        if(c !== chip) c.classList.remove('sel');
      });
      chip.classList.toggle('sel');
    });
  }

  /* ------------------------------------------------------------------
     10. Reviews mobile carousel dots - `.lp-reviews-cards .grid` + `.rv-dots`
     On the horizontal snap-scroller (mobile), the card nearest the
     viewport centre gets `.is-active` and its matching dot lights up.
     No-op when the markup is absent or when the grid is a static desktop
     grid (no horizontal scroll). Opt-in by markup presence only.
     ------------------------------------------------------------------ */
  function initReviewCarousel(){
    var sections = document.querySelectorAll('.lp-reviews-cards');
    sections.forEach(function(section){
      var scroll = section.querySelector('.grid');
      var dotsWrap = section.querySelector('.rv-dots');
      if(!scroll || !dotsWrap) return;
      var cards = Array.prototype.slice.call(scroll.querySelectorAll('.card'));
      var dots = Array.prototype.slice.call(dotsWrap.querySelectorAll('.dot'));
      if(!cards.length) return;
      var ticking = false;
      function update(){
        var centre = scroll.scrollLeft + scroll.clientWidth / 2;
        var best = 0, bestDist = Infinity;
        cards.forEach(function(card, i){
          var mid = card.offsetLeft + card.offsetWidth / 2;
          var d = Math.abs(mid - centre);
          if(d < bestDist){ bestDist = d; best = i; }
        });
        cards.forEach(function(card, i){ card.classList.toggle('is-active', i === best); });
        dots.forEach(function(dot, i){ dot.classList.toggle('active', i === best); });
        ticking = false;
      }
      scroll.addEventListener('scroll', function(){
        if(!ticking){ requestAnimationFrame(update); ticking = true; }
      }, { passive: true });
    });
  }

  ready(function(){
    initReveal();
    initCountUp();
    initMarquee();
    initParallax();
    initMagnetic();
    initAccordion();
    initStickyCta();
    initScrollProgress();
    initBooking();
    initReviewCarousel();
  });
})();
